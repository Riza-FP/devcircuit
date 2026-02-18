'use client';

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface FilterOption {
    label: string;
    value: string;
}

interface SortOption {
    label: string;
    value: string;
}

interface AdminToolbarProps {
    searchPlaceholder?: string;
    filterOptions?: FilterOption[];
    sortOptions?: SortOption[];
    filterKey?: string; // e.g. 'status' or 'category'
    searchKey?: string; // e.g. 'search'
}

export function AdminToolbar({
    searchPlaceholder = "Search...",
    filterOptions = [],
    sortOptions = [],
    filterKey = "status",
    searchKey = "search",
}: AdminToolbarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(searchKey, term);
        } else {
            params.delete(searchKey);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleFilter = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set(filterKey, value);
        } else {
            params.delete(filterKey);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        if (sort) {
            params.set('sort', sort);
        } else {
            params.delete('sort');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/20 rounded-lg border">
            <div className="flex-1">
                <Input
                    placeholder={searchPlaceholder}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get(searchKey)?.toString()}
                    className="max-w-sm"
                />
            </div>
            <div className="flex gap-2">
                {filterOptions.length > 0 && (
                    <Select
                        onValueChange={handleFilter}
                        defaultValue={searchParams.get(filterKey)?.toString() || 'all'}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {filterOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {sortOptions.length > 0 && (
                    <Select
                        onValueChange={handleSort}
                        defaultValue={searchParams.get('sort')?.toString() || sortOptions[0]?.value}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}
