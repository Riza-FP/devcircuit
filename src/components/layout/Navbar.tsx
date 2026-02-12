'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, User, LogOut } from 'lucide-react';
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
        { name: 'About', href: '/#about' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                D
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Dev<span className="text-primary">Circuit</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
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

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
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
                                    <DropdownMenuSeparator />
                                    <form action="/api/auth/logout" method="post">
                                        <DropdownMenuItem asChild>
                                            <button type="submit" className="w-full cursor-pointer text-red-500 focus:text-red-500 flex items-center gap-2">
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

                    {/* Mobile Menu (Sheet) */}
                    <div className="md:hidden">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                <div className="flex flex-col gap-6 py-6">
                                    {/* Logo in Sheet */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 w-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                            D
                                        </div>
                                        <span className="text-xl font-bold tracking-tight text-foreground">
                                            Dev<span className="text-primary">Circuit</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                                                onClick={() => setIsSheetOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="border-t border-border pt-6">
                                        {user ? (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                                        <AvatarFallback className="bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-bold">
                                                            {user.email?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{user.user_metadata?.full_name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>

                                                {isAdmin && (
                                                    <Button asChild variant="outline" className="w-full justify-start" onClick={() => setIsSheetOpen(false)}>
                                                        <Link href="/admin">Admin Dashboard</Link>
                                                    </Button>
                                                )}

                                                <form action="/api/auth/logout" method="post" className="w-full">
                                                    <Button variant="ghost" type="submit" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 gap-2">
                                                        <LogOut size={16} />
                                                        Sign Out
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : (
                                            <Button asChild className="w-full gap-2" onClick={() => setIsSheetOpen(false)}>
                                                <Link href="/login">
                                                    <User size={16} />
                                                    Sign In
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Global Cart Sheet */}
            <CartSheet />
        </nav>
    );
}