import { useRealtimeStore } from '@/store/use-realtime-store';
import { Product } from '@/types/product';
import { useMemo } from 'react';

export function useRealtimeProductList(initialProducts: Product[]) {
    const inserts = useRealtimeStore((state) => state.inserts);

    const products = useMemo(() => {
        // Prioritize server data (initialProducts) because it contains relations (Category, etc.)
        // Only show inserts that are NOT yet in the server list.
        const validInserts = inserts.filter(ins => !initialProducts.some(p => p.id === ins.id));

        return [...validInserts, ...initialProducts];
    }, [initialProducts, inserts]);

    return products;
}
