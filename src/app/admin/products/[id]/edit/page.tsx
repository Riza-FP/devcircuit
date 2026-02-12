import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
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

    const [categoriesResult, productResult] = await Promise.all([
        supabase.from('categories').select('id, name'),
        supabase.from('products').select('*').eq('id', resolvedParams.id).single()
    ]);

    if (productResult.error || !productResult.data) {
        notFound();
    }

    const categories = categoriesResult.data || [];
    const product = productResult.data;

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Edit Product</h1>
            <ProductForm categories={categories} initialData={product} />
        </div>
    );
}
