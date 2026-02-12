import { create } from 'zustand';
import { Product } from '@/types/product';

type RealtimeState = {
    updates: Record<string, Product | (Partial<Product> & { id: string; is_deleted: true })>;
    inserts: Product[];
    addUpdate: (product: Product | (Partial<Product> & { id: string; is_deleted: true })) => void;
    addInsert: (product: Product) => void;
};

export const useRealtimeStore = create<RealtimeState>((set) => ({
    updates: {},
    inserts: [],
    addUpdate: (newProduct) =>
        set((state) => ({
            updates: { ...state.updates, [newProduct.id]: newProduct },
        })),
    addInsert: (newProduct) =>
        set((state) => ({
            inserts: [newProduct, ...state.inserts],
        })),
}));
