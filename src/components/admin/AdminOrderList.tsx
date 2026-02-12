'use client';

import { updateOrderStatus } from '@/app/admin/orders/actions';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminOrderList({ initialOrders = [] }: { initialOrders?: any[] }) {
    const [orders, setOrders] = useState<any[]>(initialOrders);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const router = useRouter();

    // Remove useRealtimeOrders hook
    // const { orders: activeOrders, loading: activeLoading } = useRealtimeOrders(initialOrders);
    // Use manual refresh instead
    const handleRefresh = () => {
        setLoading(true);
        router.refresh(); // Fetches new data from server component
        // Since router.refresh() is async but doesn't return promise, we can timeout or utilize startTransition if in future.
        setTimeout(() => setLoading(false), 1000); // Fake loading for UX
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(`Failed to update status: ${error.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-600 hover:bg-green-700';
            case 'shipped': return 'bg-blue-600 hover:bg-blue-700';
            case 'cancelled': return 'bg-red-600 hover:bg-red-700';
            default: return 'bg-yellow-600 hover:bg-yellow-700';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No orders found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-lg">Order History</h3>
                    <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="gap-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4 rotate-90" />}
                    {/* Using MoreHorizontal rotated as a placeholder for Refresh if RefreshCw not imported, or just import RefreshCw */}
                    Refresh
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.shipping_details?.name || 'Unknown'}</span>
                                        <span className="text-xs text-muted-foreground">{order.shipping_details?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.items?.length} items
                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                        {order.items?.map((i: any) => i.product?.name).join(', ')}
                                    </div>
                                </TableCell>
                                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                                <TableCell>
                                    <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={updatingId === order.id}>
                                                <span className="sr-only">Open menu</span>
                                                {updatingId === order.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <MoreHorizontal className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'pending')}>
                                                Mark as Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'paid')}>
                                                Mark as Paid
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                                                Mark as Shipped
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-red-600">
                                                Mark as Cancelled
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
