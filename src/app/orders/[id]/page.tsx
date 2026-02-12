import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: order } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
        `)
        .eq('id', id)
        .single();

    if (!order) {
        notFound();
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'paid':
                return { color: 'bg-green-500', icon: CheckCircle2, label: 'Paid' };
            case 'shipped':
                return { color: 'bg-blue-500', icon: Truck, label: 'Shipped' };
            case 'cancelled':
                return { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' };
            default:
                return { color: 'bg-yellow-500', icon: Clock, label: 'Pending Payment' };
        }
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                    <StatusIcon className={`w-8 h-8 ${statusInfo.color.replace('bg-', 'text-')}`} />
                </div>
                <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
                <p className="text-muted-foreground">Thank you for your order!</p>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                <div className="p-6 border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Order Date</p>
                            <p className="font-medium">
                                {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge
                                variant={order.status === 'paid' ? 'default' : 'secondary'}
                                className={`capitalize ${order.status === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                {order.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Shipping Info */}
                    <div>
                        <h3 className="font-semibold mb-2">Shipping To</h3>
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{order.shipping_details?.name}</p>
                            <p>{order.shipping_details?.address}</p>
                            <p>{order.shipping_details?.city}, {order.shipping_details?.postal_code}</p>
                            <p>{order.shipping_details?.phone}</p>
                        </div>
                    </div>

                    <hr />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-3">Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground">{item.quantity}x</span>
                                        <span>{item.product?.name || 'Unknown Product'}</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr />

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span>{formatCurrency(order.total_amount)}</span>
                    </div>

                    {/* Payment Button if Pending */}
                    {order.status === 'pending' && order.snap_token && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex items-center justify-between">
                            <span>Payment is pending.</span>
                            {/* Client Component Button to trigger Snap? 
                                Ideally yes. But for now text is enough. 
                                Or redirect to checkout? No, checkout is for new orders.
                                We need a "Pay Now" button if they closed the popup.
                             */}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/products">
                    <Button variant="outline">Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
}
