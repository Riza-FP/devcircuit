import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminOrderList from '@/components/admin/AdminOrderList';
import { AdminToolbar } from '@/components/admin/AdminToolbar';

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
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

    let query = supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
        `);

    // --- Search Filter (Name, Email) ---
    if (params.search) {
        // Search by Customer Name or Email within shipping_details JSONB
        const searchTerm = params.search;
        query = query.or(`shipping_details->>name.ilike.%${searchTerm}%,shipping_details->>email.ilike.%${searchTerm}%`);
    }

    // --- Status Filter ---
    if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status);
    }

    // --- Sort ---
    const isAscending = params.sort === 'oldest';
    query = query.order('created_at', { ascending: isAscending });


    const { data: orders } = await query;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Management</h2>
            </div>

            <AdminToolbar
                searchPlaceholder="Search Name or Email..."
                filterOptions={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Cancelled', value: 'cancelled' },
                ]}
                sortOptions={[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Oldest First', value: 'oldest' },
                ]}
                filterKey="status"
            />

            <AdminOrderList initialOrders={orders || []} />
        </div>
    );
}
