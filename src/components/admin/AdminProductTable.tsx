'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Product } from '@/types/product';
import { useProductRealtime } from '@/hooks/use-product-realtime';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProduct } from '@/app/admin/products/actions';
import { useState } from 'react';
import { useRealtimeProductList } from '@/hooks/use-realtime-product-list';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ProductRow({ product }: { product: Product }) {
    const live = useProductRealtime(product);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    if (!live) return null; // deleted from list

    return (
        <TableRow>
            <TableCell>
                <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                    {live.image_url && <Image src={live.image_url} alt={live.name} fill className="object-cover" sizes="48px" />}
                </div>
            </TableCell>
            <TableCell className="font-medium">{live.name}</TableCell>
            <TableCell>{live.category?.name || '-'}</TableCell>
            <TableCell>{formatCurrency(live.price)}</TableCell>
            <TableCell>
                <span className={live.stock === 0 ? 'text-destructive font-bold' : ''}>
                    {live.stock}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${live.id}/edit`}>
                        <Button size="icon" variant="ghost">
                            <Edit size={16} />
                        </Button>
                    </Link>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 size={16} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    <span className="font-bold text-foreground"> {live.name} </span>
                                    and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        setIsDeleting(true);
                                        try {
                                            await deleteProduct(live.id);
                                            toast.success('Product deleted');
                                            setIsDeleteDialogOpen(false);
                                        } catch (error) {
                                            toast.error('Failed to delete');
                                        } finally {
                                            setIsDeleting(false);
                                        }
                                    }}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );
}

export function AdminProductTable({ products: initialProducts }: { products: Product[] }) {
    const products = useRealtimeProductList(initialProducts);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            No products found. Add one above!
                        </TableCell>
                    </TableRow>
                ) : (
                    products.map((product) => (
                        <ProductRow key={product.id} product={product} />
                    ))
                )}
            </TableBody>
        </Table>
    );
}
