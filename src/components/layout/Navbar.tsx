'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, User, LogOut, Home, ShoppingBag, Info, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { useCartStore } from '@/store/use-cart-store';
import { CartSheet } from '@/components/cart/CartSheet';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from 'react';
import { ModeToggle } from "@/components/layout/mode-toggle";

export function Navbar() {
    const { user, isAdmin } = useAuthStore();
    const { items, toggleCart } = useCartStore();
    const pathname = usePathname();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Server-side hydration mismatch fix for persisted store
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    // Hide Navbar on auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return null;
    }

    const navigationItems = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About', href: '/about' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        {/* Logo (Left) */}
                        <div className="flex-1 flex justify-start items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                    D
                                </div>
                                <span className="text-xl font-bold tracking-tight text-foreground">
                                    Dev<span className="text-primary">Circuit</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation (Center) */}
                        <div className="hidden md:flex items-center gap-8 justify-center">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Actions (Right) */}
                        <div className="flex-1 flex justify-end items-center gap-4">
                            <div className="hidden md:flex items-center gap-4">
                                <ModeToggle />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-muted-foreground hover:text-foreground"
                                    onClick={toggleCart}
                                >
                                    <ShoppingCart size={20} />
                                    {mounted && cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>

                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                                                    <AvatarFallback className="bg-gradient-to-tr from-cyan-400 to-blue-500 text-white text-xs font-bold">
                                                        {user.email?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {isAdmin && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="cursor-pointer">Admin Dashboard</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href="/orders" className="cursor-pointer">My Orders</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <form action="/api/auth/logout" method="post">
                                                <DropdownMenuItem asChild>
                                                    <button
                                                        type="submit"
                                                        className="w-full cursor-pointer text-red-500 focus:text-red-500 flex items-center gap-2"
                                                        onClick={() => useCartStore.getState().clearCart()}
                                                    >
                                                        <LogOut size={14} />
                                                        Log out
                                                    </button>
                                                </DropdownMenuItem>
                                            </form>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button asChild variant="outline" size="sm" className="rounded-full gap-2">
                                        <Link href="/login">
                                            <User size={16} />
                                            <span>Sign In</span>
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Mobile Menu Trigger (Replaced by Bottom Nav) */}
                            {/* Kept hidden to preserve layout if needed, or removed entirely */}
                        </div>
                    </div>
                </div>

                {/* Global Cart Sheet */}
                <CartSheet />

                {/* Mobile Profile Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="bottom" className="rounded-t-xl px-6 pb-8">
                        <SheetTitle className="hidden">Profile Menu</SheetTitle> {/* Accessibility */}

                        {user && (
                            <div className="flex flex-col gap-6 py-6">
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-lg">{user.user_metadata?.full_name || 'User'}</span>
                                        <span className="text-sm text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <Package size={20} className="text-primary" />
                                            <span className="font-medium">Admin Dashboard</span>
                                        </Link>
                                    )}
                                    <Link href="/orders" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <ShoppingBag size={20} className="text-primary" />
                                        <span className="font-medium">My Orders</span>
                                    </Link>
                                    <Link href="/about" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <Info size={20} className="text-primary" />
                                        <span className="font-medium">About DevCircuit</span>
                                    </Link>
                                </div>

                                <div className="border-t border-border mt-2 pt-4">
                                    <form action="/api/auth/logout" method="post">
                                        <button type="submit" onClick={() => { setIsSheetOpen(false); useCartStore.getState().clearCart(); }} className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 w-full transition-colors">
                                            <LogOut size={20} />
                                            <span className="font-medium">Log Out</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex h-16 items-center justify-around px-4 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] safe-area-bottom">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Home size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link
                    href="/products"
                    className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full ${pathname === '/products' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <ShoppingBag size={24} />
                    <span className="text-[10px] font-medium">Store</span>
                </Link>
                <button
                    onClick={toggleCart}
                    className="flex flex-col items-center justify-center gap-1 min-w-[64px] h-full text-muted-foreground hover:text-foreground relative"
                >
                    <div className="relative">
                        <ShoppingCart size={24} />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </button>

                {user ? (
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full ${isSheetOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <User size={24} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full ${pathname === '/login' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <User size={24} />
                        <span className="text-[10px] font-medium">Login</span>
                    </Link>
                )}
            </div>
        </>
    );
}