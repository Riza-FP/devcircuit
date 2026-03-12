import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-48 mb-8" />

      {/* Filters & Grid Container */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar Skeleton */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <Skeleton className="h-6 w-24 mb-4" /> {/* Filter Title */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          <div>
             <Skeleton className="h-6 w-24 mb-4" /> {/* Sort Title */}
             <Skeleton className="h-10 w-full" /> {/* Select Input */}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col group block border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                {/* Image Area */}
                <Skeleton className="aspect-square w-full rounded-none" />
                {/* Content Area */}
                <div className="p-4 space-y-3 flex flex-col flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
