'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { requestCancellation } from '@/actions/orders';

type OrderItem = {
    id: string;
    quantity: number;
    product: {
        name: string;
        image_url: string | null;
    } | null;
};

type Order = {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    user_id: string;
    items: OrderItem[];
};

function CancellationForm({ orderId }: { orderId: string }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const reason = formData.get('reason') as string;

        if (!reason) {
            toast.error('Please provide a reason');
            setLoading(false);
            return;
        }

        try {
            await requestCancellation(orderId, reason);
            toast.success('Cancellation requested');
            // Close dialog logic is implicit or handled by parent re-render/toast? 
            // The parent component doesn't necessarily close the dialog automatically unless we control it.
            // But usually the form submission success is enough for now.
        } catch (error) {
            toast.error('Failed to request cancellation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <label htmlFor="reason" className="text-sm font-medium">Reason for Cancellation</label>
                    <Textarea id="reason" name="reason" placeholder="Changed my mind, found a better price, etc." required disabled={loading} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="destructive" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

interface CustomerOrderListProps {
    initialOrders: Order[];
    userId: string;
}

export function CustomerOrderList({ initialOrders, userId }: CustomerOrderListProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    useEffect(() => {
        console.log('Setting up subscription for user:', userId);
        const channel = supabase
            .channel('customer-orders')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime Event Received:', payload);
                    const updatedOrder = payload.new as Order;

                    // Update the list
                    setOrders((prev) =>
                        prev.map((order) =>
                            order.id === updatedOrder.id
                                ? { ...order, status: updatedOrder.status } // Only update status to avoid losing joined data (items)
                                : order
                        )
                    );

                    // Show notification
                    toast.info(`Order #${updatedOrder.id.slice(0, 8)} status updated to ${updatedOrder.status.toUpperCase()}`);
                }
            )
            .subscribe((status, err) => {
                console.log('Subscription Status:', status, err);
            });

        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-600 hover:bg-green-700';
            case 'shipped': return 'bg-blue-600 hover:bg-blue-700';
            case 'cancelled': return 'bg-red-600 hover:bg-red-700';
            default: return 'bg-yellow-600 hover:bg-yellow-700';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-6 bg-muted rounded-full">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
                <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
                <Link href="/products">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl px-4">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Your Orders
            </h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between space-y-0">
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-muted-foreground">Order Placed</div>
                                <div className="font-medium">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <div className="text-sm text-muted-foreground">Total Amount</div>
                                <div className="font-bold">{formatCurrency(order.total_amount)}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                                            {order.status === 'cancellation_requested' ? 'Cancellation Requested' : order.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            #{order.id.slice(0, 8)}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {order.items?.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 text-sm">
                                                <div className="h-10 w-10 bg-muted rounded overflow-hidden flex-shrink-0 relative">
                                                    {item.product?.image_url && (
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium line-clamp-1">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length > 2 && (
                                            <p className="text-xs text-muted-foreground pl-14">
                                                + {order.items.length - 2} more items
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 items-end justify-between">
                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="outline" size="sm">View Details</Button>
                                    </Link>

                                    {['pending', 'paid'].includes(order.status) && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" size="sm">Cancel Order</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Request Cancellation</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to cancel this order? This action cannot be undone immediately and requires admin approval.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form action={async (formData) => {
                                                    const reason = formData.get('reason') as string;
                                                    if (!reason) {
                                                        toast.error('Please provide a reason');
                                                        return;
                                                    }

                                                    try {
                                                        await requestCancellation(order.id, reason);
                                                        toast.success('Cancellation requested');
                                                    } catch (error) {
                                                        toast.error('Failed to request cancellation');
                                                    }
                                                }}>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <label htmlFor="reason" className="text-sm font-medium">Reason for Cancellation</label>
                                                            <Textarea id="reason" name="reason" placeholder="Changed my mind, found a better price, etc." required />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" variant="destructive">Submit Request</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
