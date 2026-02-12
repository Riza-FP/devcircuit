'use client';

import { useEffect, useRef } from 'react';
import { useRealtimeStore } from '@/store/use-realtime-store';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export function useProductRealtime(initialProduct: Product): Product | null {
    const update = useRealtimeStore((state) => state.updates[initialProduct.id]);

    // Calculate live product based on update (if any)
    const liveProduct = update ? { ...initialProduct, ...(update as Partial<Product>) } : initialProduct;

    // Always call hooks unconditionally
    const prevStock = useRef(initialProduct.stock);

    useEffect(() => {
        // Correct dependency comparison logic
        // If deleted, do nothing
        if (update?.is_deleted) return;

        if (prevStock.current > 0 && liveProduct.stock === 0) {
            toast.error(`${liveProduct.name} is out of stock!`);
        }
        prevStock.current = liveProduct.stock;
    }, [liveProduct.stock, liveProduct.name, update?.is_deleted]);

    // Check for deletion AFTER hooks
    if (update?.is_deleted) return null;

    return liveProduct;
}
