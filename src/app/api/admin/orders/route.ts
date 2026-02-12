import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Check Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch Orders
    let query = supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
        `)
        .order('created_at', { ascending: false });

    if (id) {
        query = query.eq('id', id);
        // If single order, return array or single?
        // Let's return array for consistency unless requested otherwise.
    }

    const { data: orders, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (id && (!orders || orders.length === 0)) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(id ? orders[0] : orders);
}
