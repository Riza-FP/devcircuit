import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product) => {
                const { items } = get();
                const existingItem = items.find((item) => item.id === product.id);

                // Initial Stock Check
                if (product.stock === 0) {
                    toast.error('Product is out of stock');
                    return;
                }

                if (existingItem) {
                    // Check if adding one more exceeds stock
                    if (existingItem.quantity + 1 > product.stock) {
                        toast.error(`Only ${product.stock} items available in stock`);
                        return;
                    }

                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }], isOpen: true });
                }
                toast.success('Added to cart');
            },

            removeItem: (id) =>
                set({ items: get().items.filter((item) => item.id !== id) }),

            updateQuantity: (id, quantity) => {
                const { items } = get();
                const item = items.find((i) => i.id === id);
                if (!item) return;

                if (quantity > item.stock) {
                    toast.error(`Only ${item.stock} available`);
                    return;
                }

                if (quantity <= 0) {
                    // Start removal logic or just keep at 1? 
                    // Usually 0 removes it.
                    set({ items: items.filter((i) => i.id !== id) });
                    return;
                }

                set({
                    items: items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            setOpen: (open) => set({ isOpen: open }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
