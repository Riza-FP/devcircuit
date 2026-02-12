'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { useRealtimeProductList } from '@/hooks/use-realtime-product-list';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products: initialProducts }: ProductGridProps) {
    const products = useRealtimeProductList(initialProducts);

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-foreground">No products found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
