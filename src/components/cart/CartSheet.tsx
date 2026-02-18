'use client';

import { useRouter } from "next/navigation";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/use-cart-store";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";

export function CartSheet() {
    const { items, removeItem, updateQuantity, isOpen, setOpen } = useCartStore();
    const router = useRouter();
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <ShoppingBag size={48} className="opacity-20" />
                        <p>Your cart is empty</p>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                                        {item.image_url && (
                                            <Image
                                                src={item.image_url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                            <p className="text-sm font-mono text-primary">
                                                {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus size={12} />
                                                </Button>
                                                <span className="text-sm w-6 text-center tabular-nums">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Plus size={12} />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-4">
                            <div className="flex items-center justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <Button className="w-full" size="lg" disabled={isLoading} onClick={() => {
                                setIsLoading(true);
                                setOpen(false);
                                router.push('/checkout');
                            }}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Checkout'
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
