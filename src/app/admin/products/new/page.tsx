import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
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

    const { data: categories, error } = await supabase.from('categories').select('id, name');

    if (error) {
        console.error('Error fetching categories:', error);
        return <div className="p-8 text-destructive">Error loading categories.</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Add New Product</h1>
            <ProductForm categories={categories || []} />
        </div>
    );
}