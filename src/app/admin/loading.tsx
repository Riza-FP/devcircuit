import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <Skeleton className="h-9 w-[150px] mb-2" />
                <Skeleton className="h-5 w-[300px]" />
            </div>

            {/* Metrics Cards Skeletons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-2" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Performance Graph Skeleton */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px] mb-2" />
                        <Skeleton className="h-4 w-[300px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-[80px]" />
                                <Skeleton className="h-9 w-[80px]" />
                            </div>
                            <Skeleton className="h-[350px] w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
