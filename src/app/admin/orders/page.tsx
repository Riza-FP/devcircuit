import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminOrderList from '@/components/admin/AdminOrderList';

export default async function AdminOrdersPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        // ...
                    } catch {
                        // ...
                    }
                },
            },
        }
    );

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Management</h2>
            </div>
            <AdminOrderList initialOrders={orders || []} />
        </div>
    );
}
