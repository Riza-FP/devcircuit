import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductDetailClient } from './ProductDetailClient';

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    // Fetch Product with Category
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories (
                id,
                name,
                slug
            )
        `)
        .eq('slug', slug)
        .single();

    if (error || !product) {
        console.error('Produc fetch error:', error);
        notFound();
    }

    const p = product as Product;

    return <ProductDetailClient product={p} />;
}
