import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { addToCart, removeFromCart, updateCartItem, syncCart, getCart } from '@/actions/cart';
import { useAuthStore } from './use-auth-store';

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
    syncWithUser: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: async (product) => {
                const { items } = get();
                const existingItem = items.find((item) => item.id === product.id);
                const user = useAuthStore.getState().user;

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

                    // Server Sync
                    if (user) {
                        try {
                            await addToCart(product.id, 1);
                        } catch (error) {
                            toast.error('Failed to sync with server');
                            return;
                        }
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
                    // Server Sync
                    if (user) {
                        try {
                            await addToCart(product.id, 1);
                        } catch (error) {
                            toast.error('Failed to sync with server');
                            return;
                        }
                    }

                    set({ items: [...items, { ...product, quantity: 1 }], isOpen: true });
                }
                toast.success('Added to cart');
            },

            removeItem: async (id) => {
                const user = useAuthStore.getState().user;
                if (user) {
                    await removeFromCart(id);
                }
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            updateQuantity: async (id, quantity) => {
                const { items } = get();
                const item = items.find((i) => i.id === id);
                if (!item) return;

                if (quantity > item.stock) {
                    toast.error(`Only ${item.stock} available`);
                    return;
                }

                const user = useAuthStore.getState().user;

                if (quantity <= 0) {
                    if (user) await removeFromCart(id);
                    set({ items: items.filter((i) => i.id !== id) });
                    return;
                }

                if (user) await updateCartItem(id, quantity);

                set({
                    items: items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            setOpen: (open) => set({ isOpen: open }),

            syncWithUser: async () => {
                const { items } = get();
                const user = useAuthStore.getState().user;

                if (!user) return;

                try {
                    // 1. Sync local items to DB
                    await syncCart(items);

                    // 2. Fetch merged cart from DB
                    const mergedItems = await getCart();

                    // 3. Update local state
                    set({ items: mergedItems as CartItem[] });
                } catch (error) {
                    console.error('Failed to sync cart:', error);
                    toast.error('Failed to sync cart history');
                }
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
