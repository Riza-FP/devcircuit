'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminNavProps {
    userEmail?: string;
}

export function AdminNav({ userEmail }: AdminNavProps) {
    const pathname = usePathname();
    const segment = pathname?.split('/').pop() || 'orders';

    // Map segment to tab value
    // /admin/orders -> orders
    // /admin/products -> products
    // /admin -> orders (redirects)

    // If we are in sub-routes like /admin/products/new, active tab should be products?
    const activeTab = pathname?.includes('/products') ? 'products' : 'orders';

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 py-4 mx-auto space-y-4">
                {/* Top Row: Title + User */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="font-bold text-2xl tracking-tight hover:text-primary transition-colors">
                            Admin Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {userEmail}
                        </span>
                        {/* Maybe Add Logout Button or Avatar here later */}
                    </div>
                </div>

                {/* Bottom Row: Tabs */}
                <Tabs value={activeTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="orders" asChild>
                            <Link href="/admin/orders">Orders</Link>
                        </TabsTrigger>
                        <TabsTrigger value="products" asChild>
                            <Link href="/admin/products">Products</Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}
