'use client';

import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { useProductRealtime } from '@/hooks/use-product-realtime';

export function ProductDetailClient({ product: initialProduct }: { product: Product }) {
    const product = useProductRealtime(initialProduct);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-destructive">Product Not Found</h2>
                <p className="text-muted-foreground mt-2">This product has been removed.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted/30">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                        {/* Stock Badge Overlay */}
                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md border ${product.stock > 0
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : 'bg-destructive/10 border-destructive/20 text-destructive'
                            }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col space-y-6">
                    <div>
                        {product.category && (
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                                {product.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            {product.name}
                        </h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-3xl font-bold font-mono text-primary">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p className="whitespace-pre-line leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        {product.stock > 0 ? (
                            <div className="flex items-center gap-2 text-green-500">
                                <Check className="h-4 w-4" />
                                <span>Ready to ship</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>Currently unavailable</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-border">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
