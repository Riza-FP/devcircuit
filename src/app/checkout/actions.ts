'use server';

import { createClient } from '@/lib/supabase/server';
import { createTransaction } from '@/lib/midtrans';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const shippingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(5, 'Address is too short'),
    city: z.string().min(1, 'City is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
});

type CartItemInput = {
    id: string;
    quantity: number;
};

export async function createOrder(cartItems: CartItemInput[], formData: FormData) {
    const supabase = await createClient();

    // 1. Validate Session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    // 2. Validate Shipping Data
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postal_code: formData.get('postal_code'),
    };

    const shippingResult = shippingSchema.safeParse(rawData);
    if (!shippingResult.success) {
        throw new Error('Invalid shipping details');
    }
    const shippingDetails = shippingResult.data;

    if (cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    // 3. Fetch Products & Calculate Total (Server-side validation)
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', cartItems.map(item => item.id));

    if (productsError || !products) {
        throw new Error('Failed to fetch products');
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
        const product = products.find(p => p.id === item.id);
        if (!product) {
            throw new Error(`Product not found: ${item.id}`);
        }

        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        totalAmount += product.price * item.quantity;
        orderItemsData.push({
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
        });
    }

    // 4. Create Order in DB
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_amount: totalAmount,
            status: 'pending',
            shipping_details: shippingDetails,
        })
        .select()
        .single();

    if (orderError || !order) {
        throw new Error(`Failed to create order: ${orderError?.message || 'Unknown error'}`);
    }

    // 5. Create Order Items
    const itemsToInsert = orderItemsData.map(item => ({
        order_id: order.id,
        ...item
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        // Rollback? Supabase doesn't support simple rollback without RPC.
        // We might end up with an empty order.
        // Ideally we use RPC for atomic transaction.
        // For now, improved by checking stock BEFORE insert.
        throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // 5.5 Decrement Stock (Reservation)
    // 5.5 Decrement Stock (Reservation)
    for (const item of orderItemsData) {
        const { error: stockError } = await supabase.rpc('decrement_stock', {
            row_id: item.product_id,
            amount: item.quantity
        });

        if (stockError) {
            // Fallback to manual update if RPC not exists or fails
            const currentProduct = products.find(p => p.id === item.product_id);
            if (currentProduct) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ stock: currentProduct.stock - item.quantity })
                    .eq('id', item.product_id);

                if (updateError) {
                    console.error(`Failed to decrement stock for product ${item.product_id}:`, updateError);
                }
            }
        }
    }

    // 6. Generate Midtrans Token
    let snapToken = null;
    try {
        const transactionDetails = {
            transaction_details: {
                order_id: order.id, // Use our DB Order ID
                gross_amount: totalAmount,
            },
            customer_details: {
                first_name: shippingDetails.name,
                email: shippingDetails.email,
                phone: shippingDetails.phone,
                shipping_address: {
                    address: shippingDetails.address,
                    city: shippingDetails.city,
                    postal_code: shippingDetails.postal_code,
                    country_code: 'IDN'
                }
            },
            item_details: orderItemsData.map(item => {
                const product = products.find(p => p.id === item.product_id);
                return {
                    id: item.product_id,
                    price: item.unit_price,
                    quantity: item.quantity,
                    name: product?.name.substring(0, 50), // Midtrans name limit
                }
            })
        };

        const transaction = await createTransaction(transactionDetails);
        snapToken = transaction.token;

        // 7. Update Order with Snap Token
        await supabase
            .from('orders')
            .update({ snap_token: snapToken })
            .eq('id', order.id);

    } catch (midtransError) {
        console.error('Midtrans Error:', midtransError);
        // Order exists but no token. User can try to pay later?
        // Or we should fail?
        // Let's return error so frontend knows.
        throw new Error('Payment gateway error');
    }

    return { success: true, orderId: order.id, snapToken };
}
