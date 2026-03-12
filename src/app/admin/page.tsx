import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch Total Orders & Revenue
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .order('created_at', { ascending: false });

    // Fetch Products & Low Stock
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, stock');

    if (ordersError || productsError) {
        return <div className="p-4 text-destructive">Error loading dashboard statistics.</div>;
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders
        ?.filter(o => o.status !== 'cancelled')
        .reduce((sum, current) => sum + current.total_amount, 0) || 0;

    const totalProducts = products?.length || 0;
    const lowStockCount = products?.filter(p => p.stock < 5).length || 0;

    // Process Chart Data (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Filter valid orders in the last 30 days
    const recentValidOrders = orders?.filter(o => 
        o.status !== 'cancelled' && new Date(o.created_at) >= thirtyDaysAgo
    ) || [];

    // Group by date
    const chartDataMap: Record<string, { revenue: number, orders: number }> = {};
    
    // Initialize last 30 days with 0 so the chart looks complete
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        chartDataMap[dateStr] = { revenue: 0, orders: 0 };
    }

    recentValidOrders.forEach(order => {
        const dateStr = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (chartDataMap[dateStr]) {
            chartDataMap[dateStr].revenue += order.total_amount;
            chartDataMap[dateStr].orders += 1;
        }
    });

    const chartData = Object.keys(chartDataMap).map(date => ({
        date,
        revenue: chartDataMap[date].revenue,
        orders: chartDataMap[date].orders
    }));

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">Store performance and statistics at a glance.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Excludes cancelled orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items in catalog</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertTriangle className={lowStockCount > 0 ? "h-4 w-4 text-destructive" : "h-4 w-4 text-muted-foreground"} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Products with &lt; 5 stock</p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Graph Section */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                        <CardDescription>Revenue and orders over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DashboardCharts data={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
