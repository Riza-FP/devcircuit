'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { Product } from "@/types/product";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
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

    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please log in to add items to cart");
            router.push('/login');
            return;
        }

        setIsLoading(true);
        // Simulate a brief delay for visual feedback or actual async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        addItem(liveProduct);
        setIsLoading(false);
        toast.success("Added to cart");
    };

    return (
        <Button
            className="w-full md:w-auto min-w-[200px] text-lg font-bold gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
            size="lg"
            disabled={liveProduct.stock === 0 || isLoading}
            onClick={handleAddToCart}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <ShoppingCart className="h-5 w-5" />
            )}
            {liveProduct.stock > 0 ? (isLoading ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
        </Button>
    );
}
