'use client';

import { useCartStore } from '@/store/use-cart-store';
import { createOrder } from './actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

declare global {
    interface Window {
        snap: any;
    }
}

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (items.length === 0 && !isSuccess) {
            router.push('/products');
        }
    }, [items, router, isSuccess]);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            // Validate basic inputs client-side? Server action does it too.

            // Prepare cart data (minimal)
            const cartInput = items.map(item => ({ id: item.id, quantity: item.quantity }));

            // Call Server Action
            const result = await createOrder(cartInput, formData);

            if (result.snapToken) {
                // Open Snap Popup
                window.snap.pay(result.snapToken, {
                    onSuccess: function (_: any) {
                        setIsSuccess(true);
                        toast.success('Payment success!');
                        clearCart();
                        // Use result.orderId from the action
                        router.push(`/orders/${result.orderId}`);
                    },
                    onPending: function (_: any) {
                        setIsSuccess(true);
                        toast.warning('Payment pending...');
                        clearCart();
                        router.push(`/orders/${result.orderId}`);
                    },
                    onError: function (_: any) {
                        toast.error('Payment failed!');
                    },
                    onClose: function () {
                        toast('You closed the popup without finishing the payment');
                    }
                });
            } else {
                toast.error("Failed to get payment token");
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="container mx-auto py-10 px-4">
            <Script
                src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                    ? "https://app.midtrans.com/snap/snap.js"
                    : "https://app.sandbox.midtrans.com/snap/snap.js"}
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Shipping Form */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Shipping Details</h2>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" required placeholder="08123456789" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" required placeholder="Street name, House number" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" required placeholder="Jakarta" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input id="postal_code" name="postal_code" required placeholder="12345" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={isLoading} size="lg">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${formatCurrency(total)}`
                            )}
                        </Button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="relative h-16 w-16 rounded overflow-hidden bg-background shrink-0 border">
                                    {item.image_url && (
                                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium line-clamp-1">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <div className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-6 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
