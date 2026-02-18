'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string, quantity: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return; // Silent fail for guest, managed by local store

    // Check if item exists
    const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

    if (existingItem) {
        // Update quantity
        await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
    } else {
        // Insert new
        await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                quantity: quantity
            });
    }

    revalidatePath('/cart'); // Optional if we have a cart page
}

export async function removeFromCart(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

    revalidatePath('/cart');
}

export async function updateCartItem(productId: string, quantity: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    if (quantity <= 0) {
        await removeFromCart(productId);
        return;
    }

    await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

    revalidatePath('/cart');
}

export async function getCart() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: cartItems } = await supabase
        .from('cart_items')
        .select(`
            quantity,
            product:products(*)
        `)
        .eq('user_id', user.id);

    // Transform to match CartItem interface: product properties at top level + quantity
    return cartItems?.map((item: any) => ({
        ...item.product,
        quantity: item.quantity
    })) || [];
}

export async function syncCart(localItems: any[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Fetch existing DB items to merge properly
    const { data: dbItems } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', user.id);

    const dbItemMap = new Map(dbItems?.map(i => [i.product_id, i.quantity]) || []);

    // Prepare upserts
    for (const item of localItems) {
        const dbQty = dbItemMap.get(item.id) || 0;
        // Merge strategy: DB wins? Local wins? Sum?
        // Usually, if I just logged in, I want my local items added to DB.
        // If DB already has it, we can sum it or take max. Let's SUM for now.

        // Actually, safer to just Upsert one by one logic:
        if (dbItemMap.has(item.id)) {
            // Update quantity
            await supabase
                .from('cart_items')
                .update({ quantity: dbQty + item.quantity })
                .eq('user_id', user.id)
                .eq('product_id', item.id);
        } else {
            // Insert
            await supabase
                .from('cart_items')
                .insert({
                    user_id: user.id,
                    product_id: item.id,
                    quantity: item.quantity
                });
        }
    }

    revalidatePath('/cart');
}

export async function clearDbCart() {
    // Only used if we want to clear server side? Not usually needed.
    // Maybe verify cart emptiness.
}
