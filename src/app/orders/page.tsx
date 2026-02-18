import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CustomerOrderList } from '@/components/orders/CustomerOrderList';


export default async function OrdersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login?next=/orders');
    }

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <CustomerOrderList initialOrders={orders || []} userId={user.id} />
    );
}
