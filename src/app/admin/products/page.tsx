import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { AdminProductTable } from '@/components/admin/AdminProductTable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminToolbar } from '@/components/admin/AdminToolbar';

export default async function AdminProductsPage({
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

    // Fetch categories for filter dropdown
    const { data: categories } = await supabase.from('categories').select('id, name');

    let query = supabase
        .from('products')
        .select('*, category:categories(name, slug)');

    // --- Search Filter (Product Name) ---
    if (params.search) {
        query = query.ilike('name', `%${params.search}%`);
    }

    // --- Category Filter ---
    if (params.category && params.category !== 'all') {
        query = query.eq('category_id', params.category);
    }

    // --- Sort ---
    const sort = params.sort?.toString() || 'newest';
    if (sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
    } else if (sort === 'price_low') {
        query = query.order('price', { ascending: true });
    } else if (sort === 'price_high') {
        query = query.order('price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: products } = await query;

    const filterOptions = categories?.map(c => ({ label: c.name, value: c.id })) || [];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Management</h2>
                <Link href="/admin/products/new">
                    <Button size="sm" className="gap-2">
                        <Plus size={16} /> Add Product
                    </Button>
                </Link>
            </div>

            <AdminToolbar
                searchPlaceholder="Search products..."
                filterOptions={filterOptions}
                filterKey="category"
                sortOptions={[
                    { label: 'Newest', value: 'newest' },
                    { label: 'Oldest', value: 'oldest' },
                    { label: 'Price: Low to High', value: 'price_low' },
                    { label: 'Price: High to Low', value: 'price_high' },
                ]}
            />

            <div className="rounded-md border overflow-x-auto">
                <AdminProductTable products={products || []} />
            </div>
        </div>
    );
}
