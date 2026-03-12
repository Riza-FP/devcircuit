import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="h-9 w-48 mb-8" /> {/* Title: My Orders */}

      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-slate-800 rounded-xl p-6 bg-slate-900/50 space-y-4">
            
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-3">
                 <Skeleton className="h-5 w-32" /> {/* Order ID */}
                 <Skeleton className="h-4 w-40" /> {/* Date */}
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                 <Skeleton className="h-5 w-24" /> {/* Total Price */}
                 <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge */}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
               {[...Array(2)].map((_, j) => (
                 <div key={j} className="flex gap-4">
                   {/* Product Image */}
                   <Skeleton className="h-16 w-16 rounded flex-shrink-0" />
                   
                   {/* Product Details */}
                   <div className="flex-1 space-y-2">
                     <Skeleton className="h-4 w-3/4 max-w-[200px]" />
                     <Skeleton className="h-4 w-20" />
                   </div>
                 </div>
               ))}
            </div>

            {/* Order Footer Button */}
            <div className="flex justify-end pt-2 border-t border-slate-800 mt-4">
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
