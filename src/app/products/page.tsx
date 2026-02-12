import { createClient } from '@/lib/supabase/server';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
    const supabase = await createClient();

    // Parse params (awaiting searchParams is required in Next.js 15)
    // But this is Next 14 or latest canary, usually await is safe.
    const params = await searchParams;
    const q = params.q || '';
    const category = params.category || '';
    const sort = params.sort || 'newest';

    // 1. Fetch Categories for Filter
    const { data: categories } = await supabase.from('categories').select('id, name').order('name');

    // 2. Fetch Products
    let query = supabase.from('products').select('*');

    if (q) {
        query = query.ilike('name', `%${q}%`);
    }

    if (category) {
        query = query.eq('category_id', category);
    }

    // Sort Logic
    switch (sort) {
        case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
        case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false });
            break;
    }

    const { data: products, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return <div>Error loading products.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>

            <ProductFilters categories={categories || []} />

            <ProductGrid products={products || []} />
        </div>
    );
}
