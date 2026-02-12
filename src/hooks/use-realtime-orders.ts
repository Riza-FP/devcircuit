import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Order } from '@/types/order';
import { useSupabase } from '@/components/providers/supabase-provider';

export function useRealtimeOrders(initialOrders: Order[] = []) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [loading, setLoading] = useState(initialOrders.length === 0);
    const { supabase } = useSupabase();

    useEffect(() => {
        const fetchOrders = async () => {
            // We use initialOrders for immediate display, but we MUST fetch fresh data
            // on mount to ensure we didn't miss anything while tabs were switched.
            // (initialOrders is only fresh from the server render time).

            console.log('useRealtimeOrders: Fetching orders from API...');
            try {
                // Use API route to avoid client-side Supabase hanging issues
                const response = await fetch('/api/admin/orders');

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('useRealtimeOrders: Fetched', data?.length, 'orders');
                setOrders(data as Order[] || []);
            } catch (err) {
                console.error('useRealtimeOrders: Unexpected error', err);
                // If API fails, maybe try to use initialOrders if available?
                if (initialOrders.length > 0) {
                    setOrders(initialOrders);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        const channel = supabase
            .channel('realtime-orders')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                async (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        // For new orders, fetch full object with items via API to avoid client hanging
                        try {
                            const response = await fetch(`/api/admin/orders?id=${payload.new.id}`);
                            if (response.ok) {
                                const newOrder = await response.json();
                                // New order via API is single object (since we requested ID) or array?
                                // API returns object if ID is present.
                                if (newOrder && !newOrder.error) {
                                    setOrders((prev) => [newOrder as Order, ...prev]);
                                    toast.success(`New Order Received! #${newOrder.id.slice(0, 8)}`);
                                }
                            }
                        } catch (err) {
                            console.error('Failed to fetch new order details:', err);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((prev) => prev.map(order =>
                            order.id === payload.new.id ? { ...order, ...payload.new } : order
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setOrders((prev) => prev.filter(order => order.id !== payload.old.id));
                    }
                }
            )
            .subscribe((status) => {
                console.log(`Realtime Connection Status (Orders): ${status}`);
                if (status === 'SUBSCRIBED') {
                    // Maybe re-fetch to ensure sync?
                }
                if (status === 'CLOSED') {
                    // Try to reconnect? Supabase usually handles this.
                }
                if (status === 'CHANNEL_ERROR') {
                    toast.error('Realtime Connection Error. Refreshing...');
                    // fetchOrders();
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return { orders, loading };
}
