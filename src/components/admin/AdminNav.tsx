'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingBag } from 'lucide-react';

interface AdminNavProps {
    userEmail?: string;
}

export function AdminNav({ userEmail }: AdminNavProps) {
    const pathname = usePathname();
    
    // Determine active tab
    let activeTab = 'overview';
    if (pathname?.includes('/admin/products')) activeTab = 'products';
    else if (pathname?.includes('/admin/orders')) activeTab = 'orders';

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 py-4 mx-auto space-y-4 flex flex-col items-center">
                {/* Top Row: Title + User */}
                <div className="flex items-center justify-center w-full relative">
                    <Link href="/admin" className="font-bold text-2xl tracking-tight hover:text-primary transition-colors text-center">
                        Admin Dashboard
                    </Link>
                    <div className="absolute right-0 flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {userEmail}
                        </span>
                        {/* Maybe Add Logout Button or Avatar here later */}
                    </div>
                </div>

                {/* Bottom Row: Tabs */}
                <Tabs value={activeTab} className="w-full flex items-center">
                    <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                        <TabsTrigger value="overview" asChild>
                            <Link href="/admin">Overview</Link>
                        </TabsTrigger>
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
