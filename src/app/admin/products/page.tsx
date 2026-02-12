import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { AdminProductTable } from '@/components/admin/AdminProductTable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminProductsPage() {
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

    const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .order('created_at', { ascending: false });

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
            <div className="rounded-md border">
                <AdminProductTable products={products || []} />
            </div>
        </div>
    );
}
