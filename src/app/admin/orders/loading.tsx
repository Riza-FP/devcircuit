import { Skeleton } from "@/components/ui/skeleton"

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-48" /> {/* Title: Order Management */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded border border-slate-800">
         <Skeleton className="h-10 w-full sm:w-[300px]" /> {/* Search */}
         <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" /> {/* Status Filter */}
            <Skeleton className="h-10 w-[120px]" /> {/* Sort Filter */}
         </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-800 bg-slate-900/80">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16 place-self-end" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-slate-800">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge */}
              <div className="flex gap-2 place-self-end">
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Action Button */}
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
