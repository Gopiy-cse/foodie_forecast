"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PlusCircle,
  Edit,
  Trash2,
  Home,
} from 'lucide-react';
import { menuItems as initialMenuItems } from '@/lib/data';
import type { MenuItem } from '@/hooks/use-cart';
import FoodItemForm from '@/components/admin/FoodItemForm';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Success',
        description: 'Menu item deleted.',
      });
    }
  };

  const handleFormSubmit = (item: MenuItem) => {
    if (editingItem) {
      // Update item
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? item : i))
      );
      toast({
        title: 'Success',
        description: 'Menu item updated.',
      });
    } else {
      // Add new item
      setMenuItems((prev) => [...prev, { ...item, id: Date.now().toString() }]);
      toast({
        title: 'Success',
        description: 'New menu item added.',
      });
    }
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Menu</h1>
            <Link href="/">
                <Button variant="outline">
                    <Home className="mr-2" />
                    Back to Home
                </Button>
            </Link>
        </header>

      <div className="flex justify-end mb-4">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingItem(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </DialogTitle>
            </DialogHeader>
            <FoodItemForm
              onSubmit={handleFormSubmit}
              itemToEdit={editingItem}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Cuisine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.cuisine}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
