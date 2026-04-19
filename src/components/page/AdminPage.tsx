"use client";
import React, { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  PlusCircle,
  Edit,
  Trash2,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { MenuItem } from '@/hooks/use-cart';
import FoodItemForm from '@/components/admin/FoodItemForm';
import { useToast } from '@/hooks/use-toast';
import { addMenuItems, deleteMenuItem, getmenuItems, getOrders, updateMenuItems } from '@/actions/admin';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: any[];
  profiles?: {
    full_name: string;
    email: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: { label: 'Pending', icon: <Clock className="h-3 w-3" />, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle2 className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800 border-blue-200' },
  delivered: { label: 'Delivered', icon: <CheckCircle2 className="h-3 w-3" />, className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="h-3 w-3" />, className: 'bg-red-100 text-red-800 border-red-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, icon: null, className: 'bg-gray-100 text-gray-800 border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  // Menu Items state
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ── Menu Items ──────────────────────────────────────────────────────────────
  const fetchMenuItems = async () => {
    const items = await getmenuItems();
    setMenuItems(items);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const error = await deleteMenuItem(id);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return;
    }
    setMenuItems((prev) => prev?.filter((item) => item.id !== id) ?? null);
    toast({ title: 'Deleted', description: 'Menu item removed.' });
  };

  const handleFormSubmit = async (item: MenuItem) => {
    if (editingItem) {
      const error = await updateMenuItems([item]);
      if (error) { toast({ title: 'Error', description: error, variant: 'destructive' }); return; }
      toast({ title: 'Updated', description: 'Menu item updated successfully.' });
    } else {
      const error = await addMenuItems([item]);
      if (error) { toast({ title: 'Error', description: error, variant: 'destructive' }); return; }
      toast({ title: 'Added', description: 'New menu item added.' });
    }
    setEditingItem(null);
    setIsDialogOpen(false);
    await fetchMenuItems();
  };

  // ── Orders ──────────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    const data = await getOrders();
    setOrders(data as Order[]);
    setOrdersLoading(false);
  };

  // Revenue stats derived values
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const pending = orders.filter((o) => o.status === 'pending').length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Foodie Forecast Management</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 md:px-8 py-6">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="h-10">
            <TabsTrigger value="menu" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu Items
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2"
              onClick={() => { if (orders.length === 0) fetchOrders(); }}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders & Revenue
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Menu Items ─────────────────────────────────────────── */}
          <TabsContent value="menu" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Menu Items</h2>
                <p className="text-sm text-muted-foreground">
                  {menuItems ? `${menuItems.length} items` : 'Loading…'}
                </p>
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditingItem(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
                    </DialogTitle>
                  </DialogHeader>
                  <FoodItemForm onSubmit={handleFormSubmit} itemToEdit={editingItem} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[100px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!menuItems ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Loading menu items…
                      </TableCell>
                    </TableRow>
                  ) : menuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No menu items yet. Add your first item!
                      </TableCell>
                    </TableRow>
                  ) : (
                    menuItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.cuisine}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">⭐ {item.rating}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Tab 2: Orders & Revenue ───────────────────────────────────── */}
          <TabsContent value="orders" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{delivered}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <Package className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Orders</h2>
                <p className="text-sm text-muted-foreground">
                  {ordersLoading ? 'Loading…' : `${totalOrders} orders placed`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchOrders} disabled={ordersLoading}>
                Refresh
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Loading orders…
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No orders placed yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {order.profiles?.full_name ?? 'Guest'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.profiles?.email ?? '—'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <br />
                          <span className="text-xs">
                            {new Date(order.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {Array.isArray(order.items)
                            ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status ?? 'pending'} />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${(order.total_amount ?? 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
