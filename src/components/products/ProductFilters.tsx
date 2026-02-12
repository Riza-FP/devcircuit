'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Category {
    id: string;
    name: string;
}

interface ProductFiltersProps {
    categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for immediate feedback
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    // Create Query String Helper
    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    }, [searchParams]);

    // Manual debounce via useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }

            const currentQ = searchParams.get('q') || '';
            if (currentQ !== searchTerm) {
                router.push(`/products?${params.toString()}`);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, router, searchParams]);

    return (
        <div className="bg-card border border-border rounded-lg p-4 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input/50"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                {/* Category Filter */}
                <div className="w-full md:w-[200px]">
                    <Select
                        value={searchParams.get('category') || 'all'}
                        onValueChange={(value) => {
                            router.push(`/products?${createQueryString('category', value)}`);
                        }}
                    >
                        <SelectTrigger className="w-full bg-input/50">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Category" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort */}
                <div className="w-full md:w-[200px]">
                    <Select
                        value={searchParams.get('sort') || 'newest'}
                        onValueChange={(value) => {
                            router.push(`/products?${createQueryString('sort', value)}`);
                        }}
                    >
                        <SelectTrigger className="w-full bg-input/50">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest Arrivals</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="name_asc">Name: A to Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
