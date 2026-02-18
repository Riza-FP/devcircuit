'use client';

import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

import { useProductRealtime } from '@/hooks/use-product-realtime';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const liveProduct = useProductRealtime(product);
    const { addItem, items } = useCartStore();
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isInCart = items.some(item => item.id === liveProduct?.id);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please log in to add items to cart");
            router.push('/login');
            return;
        }

        if (!liveProduct) return;

        setIsLoading(true);
        // Simulate a brief delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        await addItem(liveProduct);
        setIsLoading(false);
    };

    if (!liveProduct) return null; // Product deleted

    return (
        <Card className="group relative overflow-hidden transition-all hover:border-primary hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col h-full">
            <Link href={`/products/${liveProduct.slug}`} className="flex-1">
                <CardContent className="p-4 pb-2">
                    {/* Image Container with Glow Effect */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted/50 mb-4">
                        {liveProduct.image_url ? (
                            <Image
                                src={liveProduct.image_url}
                                alt={liveProduct.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                No Image
                            </div>
                        )}

                        {/* Stock Badge */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold backdrop-blur-md border ${liveProduct.stock > 0
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : 'bg-destructive/10 border-destructive/20 text-destructive'
                            }`}>
                            {liveProduct.stock > 0 ? `${liveProduct.stock} in stock` : 'Out of Stock'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {liveProduct.name}
                            </h3>
                        </div>

                        <p className="text-sm text-cyan-500/80 font-medium">
                            {liveProduct.category?.name || 'New Arrival'}
                        </p>

                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                            {liveProduct.description}
                        </p>
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-xl font-bold font-mono text-primary">
                        {formatCurrency(liveProduct.price)}
                    </span>
                </div>

                <Button
                    disabled={liveProduct.stock === 0 || isLoading}
                    onClick={handleAddToCart}
                    size="sm"
                    variant={isInCart ? "secondary" : "default"}
                    className={`gap-2 transition-transform hover:scale-105 ${isInCart ? 'border-primary/50 border' : ''}`}
                >
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : isInCart ? (
                        <Check size={16} className="text-primary" />
                    ) : (
                        <ShoppingCart size={16} />
                    )}
                    {isLoading ? 'Adding...' : isInCart ? 'In Cart' : 'Add'}
                </Button>
            </CardFooter>
        </Card>
    );
}
