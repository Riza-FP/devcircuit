
import { NextRequest, NextResponse } from 'next/server';

// Initialize Core API for signature verification if needed, 
// but Snap API client usually handles it or we use raw signature check.
// midtrans-client has `status` or `notification` handling.
// Let's use `midtrans-client` to verify notification.

// @ts-ignore
import midtransClient from 'midtrans-client';

export async function POST(req: NextRequest) {
    try {
        const notificationJson = await req.json();

        const snap = new midtransClient.Snap({
            isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
        });

        // Verify notification signature securely
        const statusResponse = await snap.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const transactionId = statusResponse.transaction_id; // Added transaction ID

        console.log(`Transaction notification received. Order: ${orderId}. Transaction: ${transactionStatus}. Fraud: ${fraudStatus}`);

        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');

        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let orderStatus = 'pending';

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                orderStatus = 'pending';
            } else if (fraudStatus == 'accept') {
                orderStatus = 'paid';
            }
        } else if (transactionStatus == 'settlement') {
            orderStatus = 'paid';
        } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire') {
            orderStatus = 'cancelled';

        } else if (transactionStatus == 'pending') {
            orderStatus = 'pending';
        }

        if (orderStatus !== 'pending') {
            // Prepare update data
            const updateData: any = { status: orderStatus };
            // If we have transaction ID and it's valid, update it too
            if (transactionId) {
                updateData.payment_id = transactionId;
            }

            const { error } = await supabaseAdmin
                .from('orders')
                .update(updateData)
                .eq('id', orderId)
                .select('*, order_items(*, product:products(*))') // Fetch updated order with items
                .single();

            if (error) {
                console.error('Error updating order status:', error);
                return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
            }

            // Decrement Stock IF PAID
            if (orderStatus === 'paid') {
                try {
                    // Need fetch order items if not already available, but we assume we updated successfully
                    // We can fetch from DB to be safe or use the ones linked?
                    // Let's fetch explicitly just items.
                    const { data: orderItems } = await supabaseAdmin
                        .from('order_items')
                        .select('product_id, quantity')
                        .eq('order_id', orderId);

                    if (orderItems) {
                        for (const item of orderItems) {
                            await supabaseAdmin.rpc('decrement_stock', {
                                row_id: item.product_id,
                                amount: item.quantity
                            });
                        }
                    }
                } catch (stockError) {
                    console.error('Failed to decrement stock on paid:', stockError);
                }

                // Send Email
                try {
                    // ... (Email logic) ...
                    // Fetch the fresh order data
                    const { data: orderData, error: fetchError } = await supabaseAdmin
                        .from('orders')
                        .select('*, order_items(*, product:products(*))')
                        .eq('id', orderId)
                        .single();

                    if (orderData && orderData.shipping_details?.email) {
                        const { resend } = await import('@/lib/resend');
                        const { OrderConfirmationEmail } = await import('@/emails/OrderConfirmation');

                        await resend.emails.send({
                            from: 'QuickShop <onboarding@resend.dev>', // Use this for testing
                            to: orderData.shipping_details.email, // Use email from shipping details
                            subject: `Order Confirmation #${orderId.slice(0, 8)}`,
                            react: OrderConfirmationEmail({
                                orderId: orderData.id,
                                orderDate: orderData.created_at,
                                items: orderData.order_items.map((item: any) => ({
                                    id: item.id,
                                    quantity: item.quantity,
                                    unit_price: item.unit_price,
                                    product: {
                                        name: item.product?.name || 'Unknown Product',
                                        image_url: item.product?.image_url
                                    }
                                })),
                                total: orderData.total_amount,
                                shippingDetails: orderData.shipping_details
                            }),
                        });
                        console.log('Email sent to:', orderData.shipping_details.email);
                    }
                } catch (emailError) {
                    console.error('Failed to send email:', emailError);
                    // Don't fail the webhook response, just log it.
                }
            }
        }

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        console.error('Midtrans Notification Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
