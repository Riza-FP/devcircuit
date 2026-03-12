import { Skeleton } from "@/components/ui/skeleton"

export default function AdminProductsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-48" /> {/* Title: Product Management */}
        <Skeleton className="h-9 w-32 rounded-md" /> {/* Add Product Button */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded border border-slate-800">
         <Skeleton className="h-10 w-full sm:w-[300px]" /> {/* Search */}
         <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" /> {/* Category Filter */}
            <Skeleton className="h-10 w-[120px]" /> {/* Sort Filter */}
         </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-x-auto">
        <div className="min-w-[800px]">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-[80px_1fr_1fr_100px_100px_100px] gap-4 p-4 border-b border-slate-800 bg-slate-900/80">
              <Skeleton className="h-5 w-12" /> {/* Img */}
              <Skeleton className="h-5 w-24" /> {/* Name */}
              <Skeleton className="h-5 w-20" /> {/* Category */}
              <Skeleton className="h-5 w-16" /> {/* Price */}
              <Skeleton className="h-5 w-16" /> {/* Stock */}
              <Skeleton className="h-5 w-16 place-self-end" /> {/* Actions */}
            </div>

            {/* Table Rows Skeleton */}
            <div className="divide-y divide-slate-800">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_1fr_100px_100px_100px] gap-4 p-4 items-center">
                  <Skeleton className="h-16 w-16 rounded" /> {/* Img */}
                  <Skeleton className="h-4 w-3/4 max-w-[200px]" /> {/* Name */}
                  <Skeleton className="h-6 w-24 rounded-full" /> {/* Category Badge */}
                  <Skeleton className="h-4 w-20" /> {/* Price */}
                  <Skeleton className="h-4 w-12" /> {/* Stock */}
                  <div className="flex gap-2 place-self-end">
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit Action Button */}
                    <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete Action Button */}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
