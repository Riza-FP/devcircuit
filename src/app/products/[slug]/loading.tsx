import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Image Gallery Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="relative aspect-square w-full rounded-xl" />
                </div>

                {/* Right: Product Details Skeleton */}
                <div className="flex flex-col space-y-6">
                    <div>
                        {/* Category Badge */}
                        <Skeleton className="h-6 w-24 rounded-full mb-3" />
                        {/* Title */}
                        <Skeleton className="h-10 w-3/4 md:w-full" />
                        <Skeleton className="h-10 w-1/2 mt-2" />
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                        <Skeleton className="h-8 w-32" />
                    </div>

                    {/* Description Paragraphs */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>

                    {/* Stock Indicator */}
                    <Skeleton className="h-5 w-32" />

                    {/* Actions (Add to Cart) */}
                    <div className="pt-6 border-t border-border mt-auto">
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
