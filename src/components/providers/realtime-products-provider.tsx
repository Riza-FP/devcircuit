'use client';

import { useEffect } from 'react';
import { Product } from '@/types/product';
import { useSupabase } from '@/components/providers/supabase-provider';
import { useRealtimeStore } from '@/store/use-realtime-store';
import { toast } from 'sonner';

import { usePathname } from 'next/navigation';

export function RealtimeProductsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { supabase } = useSupabase();
    const addUpdate = useRealtimeStore((state) => state.addUpdate);
    const addInsert = useRealtimeStore((state) => state.addInsert);

    useEffect(() => {
        const channel = supabase
            .channel('global-products-tracker')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'products',
                },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        addUpdate({ id: payload.old.id, is_deleted: true });
                    } else if (payload.eventType === 'UPDATE') {
                        addUpdate(payload.new as Product);
                    } else if (payload.eventType === 'INSERT') {
                        const newProduct = payload.new as Product;
                        // Only show toast for customers (not on admin pages)
                        if (!pathname?.startsWith('/admin')) {
                            toast.success(`New Arrival: ${newProduct.name}`);
                        }
                        addInsert(newProduct);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, addUpdate]);

    return <>{children}</>;
}
