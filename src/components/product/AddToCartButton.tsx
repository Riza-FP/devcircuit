'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProductRealtime } from "@/hooks/use-product-realtime";

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const liveProduct = useProductRealtime(product);
    const addItem = useCartStore((state) => state.addItem);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    if (!liveProduct) {
        return (
            <Button disabled variant="destructive">
                Item Deleted
            </Button>
        );
    }

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to cart");
            router.push('/login');
            return;
        }
        addItem(liveProduct);
    };

    return (
        <Button
            className="w-full md:w-auto min-w-[200px] text-lg font-bold gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
            size="lg"
            disabled={liveProduct.stock === 0}
            onClick={handleAddToCart}
        >
            <ShoppingCart className="h-5 w-5" />
            {liveProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
    );
}
