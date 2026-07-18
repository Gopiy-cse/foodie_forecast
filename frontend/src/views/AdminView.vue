<template>
  <div class="min-h-screen bg-background">
    <!-- Page Header -->
    <div class="border-b bg-card">
      <div class="container mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <UtensilsCrossed class="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 class="text-xl font-bold leading-none text-foreground">Admin Panel</h1>
            <p class="text-xs text-muted-foreground mt-0.5">Foodie Forecast Management</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="triggerMigrate" 
            class="px-3.5 py-1.5 border border-border hover:bg-secondary rounded-md text-xs font-bold text-foreground cursor-pointer transition-colors"
          >
            Migrate/Seed Data
          </button>
          <router-link to="/">
            <button class="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Home class="h-3.5 w-3.5" />
              Back to Home
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Tabs Container -->
    <div class="container mx-auto max-w-7xl px-4 md:px-8 py-6">
      <div class="flex gap-4 border-b border-border mb-6">
        <button 
          @click="activeTab = 'menu'"
          :class="[
            'pb-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2',
            activeTab === 'menu' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          <UtensilsCrossed class="h-4 w-4" />
          Menu Items
        </button>
        <button 
          @click="clickOrdersTab"
          :class="[
            'pb-2 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2',
            activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          <ShoppingBag class="h-4 w-4" />
          Orders & Revenue
        </button>
      </div>

      <!-- Tab 1: Menu Items Panel -->
      <div v-if="activeTab === 'menu'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-foreground">Menu Items</h2>
            <p class="text-sm text-muted-foreground">
              {{ menuItems ? `${menuItems.length} items` : 'Loading…' }}
            </p>
          </div>
          <button 
            @click="openAddModal"
            class="bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle class="h-4 w-4" />
            Add Item
          </button>
        </div>

        <!-- Menu Table -->
        <div class="rounded-lg border border-border bg-card overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
                <th class="p-3">Name</th>
                <th class="p-3">Cuisine</th>
                <th class="p-3">Category</th>
                <th class="p-3">Rating</th>
                <th class="p-3 text-right">Price</th>
                <th class="p-3 text-center w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60 text-sm text-foreground">
              <tr v-if="!menuItems">
                <td colspan="6" class="p-8 text-center text-muted-foreground font-medium">
                  Loading menu items…
                </td>
              </tr>
              <tr v-else-if="menuItems.length === 0">
                <td colspan="6" class="p-8 text-center text-muted-foreground font-medium">
                  No menu items yet. Add your first item!
                </td>
              </tr>
              <tr 
                v-else 
                v-for="item in menuItems" 
                :key="item.id" 
                class="hover:bg-muted/20 transition-colors"
              >
                <td class="p-3 font-semibold text-foreground">{{ item.name }}</td>
                <td class="p-3 text-muted-foreground font-medium">{{ item.cuisine }}</td>
                <td class="p-3">
                  <span class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground/80 border border-border/20">
                    {{ item.category }}
                  </span>
                </td>
                <td class="p-3 text-muted-foreground font-medium">⭐ {{ item.rating }}</td>
                <td class="p-3 text-right font-bold">${{ item.price.toFixed(2) }}</td>
                <td class="p-3">
                  <div class="flex justify-center gap-1.5">
                    <button 
                      @click="openEditModal(item)"
                      class="p-1 hover:bg-secondary text-foreground rounded transition-colors cursor-pointer"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button 
                      @click="handleDelete(item.id)"
                      class="p-1 hover:bg-red-50 text-destructive rounded transition-colors cursor-pointer"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Orders & Revenue Panel -->
      <div v-else class="space-y-6">
        <!-- Stats Grid Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted-foreground">Total Revenue</span>
              <DollarSign class="h-4 w-4 text-primary shrink-0" />
            </div>
            <p class="text-2xl font-bold text-foreground">${{ totalRevenue.toFixed(2) }}</p>
          </div>

          <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted-foreground">Total Orders</span>
              <ShoppingBag class="h-4 w-4 text-primary shrink-0" />
            </div>
            <p class="text-2xl font-bold text-foreground">{{ orders.length }}</p>
          </div>

          <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted-foreground">Delivered</span>
              <TrendingUp class="h-4 w-4 text-green-500 shrink-0" />
            </div>
            <p class="text-2xl font-bold text-green-600">{{ deliveredCount }}</p>
          </div>

          <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-muted-foreground">Pending</span>
              <Clock class="h-4 w-4 text-yellow-500 shrink-0" />
            </div>
            <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
          </div>
        </div>

        <!-- Orders Table Controls -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-foreground">Orders</h2>
            <p class="text-sm text-muted-foreground">{{ orders.length }} orders placed</p>
          </div>
          <button 
            @click="fetchOrders"
            :disabled="ordersLoading"
            class="px-3.5 py-1.5 border border-border rounded-md hover:bg-secondary text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="ordersLoading" class="h-3.5 w-3.5 animate-spin" />
            <span>Refresh</span>
          </button>
        </div>

        <!-- Orders Table -->
        <div class="rounded-lg border border-border bg-card overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
                <th class="p-3">Order ID</th>
                <th class="p-3">Customer</th>
                <th class="p-3">Date</th>
                <th class="p-3">Items</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60 text-sm text-foreground">
              <tr v-if="ordersLoading">
                <td colspan="6" class="p-8 text-center text-muted-foreground font-medium">
                  Loading orders…
                </td>
              </tr>
              <tr v-else-if="orders.length === 0">
                <td colspan="6" class="p-8 text-center text-muted-foreground font-medium">
                  No orders placed yet.
                </td>
              </tr>
              <tr 
                v-else 
                v-for="order in orders" 
                :key="order.id" 
                class="hover:bg-muted/20 transition-colors"
              >
                <td class="p-3 font-mono text-xs text-muted-foreground">
                  #{{ order.id.slice(0, 8).toUpperCase() }}
                </td>
                <td class="p-3">
                  <div>
                    <p class="font-semibold text-sm">{{ order.profiles?.full_name || 'Guest' }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ order.profiles?.email || '—' }}</p>
                  </div>
                </td>
                <td class="p-3">
                  <div>
                    <p class="text-sm font-medium">{{ formatDate(order.created_at) }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ formatTime(order.created_at) }}</p>
                  </div>
                </td>
                <td class="p-3 text-muted-foreground font-medium">
                  {{ order.items ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : '—' }}
                </td>
                <td class="p-3">
                  <span 
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      getStatusStyles(order.status)
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="p-3 text-right font-bold">${{ order.total_amount.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Form Dialog modal overlay -->
    <div v-if="isFormOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="closeFormModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-md rounded-xl bg-background p-6 shadow-2xl z-50 border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <h3 class="text-lg font-bold text-foreground mb-4">
          {{ editingItem ? 'Edit Food Item' : 'Add New Food Item' }}
        </h3>
        <FoodItemForm 
          :key="editingItem ? editingItem.id : 'new'"
          :itemToEdit="editingItem" 
          @submit="handleFormSubmit" 
        />
        <button 
          @click="closeFormModal"
          class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import FoodItemForm from '../components/FoodItemForm.vue';
import { 
  UtensilsCrossed, Home, PlusCircle, Edit, Trash2, 
  DollarSign, ShoppingBag, TrendingUp, Clock, X, Loader2 
} from 'lucide-vue-next';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  cuisine: string;
  category: string;
}

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

const authStore = useAuthStore();

const activeTab = ref<'menu' | 'orders'>('menu');
const menuItems = ref<MenuItem[] | null>(null);
const orders = ref<Order[]>([]);
const ordersLoading = ref(false);

const isFormOpen = ref(false);
const editingItem = ref<MenuItem | null>(null);

// Fetch admin menu items listing
const fetchMenuItems = async () => {
  try {
    const headers = await authStore.getAuthHeader();
    const response = await fetch('http://localhost:5000/api/admin/menu-items', { headers });
    const data = await response.json();
    menuItems.value = data || [];
  } catch (err) {
    console.error('Failed to load menu items:', err);
  }
};

// Fetch order logs
const fetchOrders = async () => {
  ordersLoading.value = true;
  try {
    const headers = await authStore.getAuthHeader();
    const response = await fetch('http://localhost:5000/api/admin/orders', { headers });
    const data = await response.json();
    orders.value = data || [];
  } catch (err) {
    console.error('Failed to load orders:', err);
  } finally {
    ordersLoading.value = false;
  }
};

// Actions triggers
const clickOrdersTab = () => {
  activeTab.value = 'orders';
  if (orders.value.length === 0) {
    fetchOrders();
  }
};

const openAddModal = () => {
  editingItem.value = null;
  isFormOpen.value = true;
};

const openEditModal = (item: MenuItem) => {
  editingItem.value = item;
  isFormOpen.value = true;
};

const closeFormModal = () => {
  isFormOpen.value = false;
  editingItem.value = null;
};

const handleFormSubmit = async (item: MenuItem) => {
  try {
    const headers = await authStore.getAuthHeader();
    const method = editingItem.value ? 'PUT' : 'POST';
    
    const response = await fetch('http://localhost:5000/api/admin/menu-items', {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errRes = await response.json();
      throw new Error(errRes.error || 'Failed to submit form.');
    }

    alert(editingItem.value ? 'Menu item updated!' : 'Menu item added!');
    closeFormModal();
    fetchMenuItems();
  } catch (err: any) {
    alert(err.message || 'Operation failed.');
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    const headers = await authStore.getAuthHeader();
    const response = await fetch(`http://localhost:5000/api/admin/menu-items/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errRes = await response.json();
      throw new Error(errRes.error || 'Failed to delete.');
    }

    alert('Item deleted.');
    fetchMenuItems();
  } catch (err: any) {
    alert(err.message || 'Deletion failed.');
  }
};

const triggerMigrate = async () => {
  if (!confirm('This will seed the database with initial restaurant and menu data. Proceed?')) return;
  try {
    const headers = await authStore.getAuthHeader();
    const response = await fetch('http://localhost:5000/api/admin/migrate', {
      method: 'POST',
      headers
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    
    alert(result.message || 'Migration successfully completed!');
    fetchMenuItems();
    if (activeTab.value === 'orders') fetchOrders();
  } catch (err: any) {
    alert(err.message || 'Data migration failed.');
  }
};

// Derived revenue states
const totalRevenue = computed(() => {
  return orders.value.reduce((sum, o) => sum + (o.total_amount || 0), 0);
});

const deliveredCount = computed(() => {
  return orders.value.filter((o) => o.status === 'delivered').length;
});

const pendingCount = computed(() => {
  return orders.value.filter((o) => o.status === 'pending').length;
});

// Formatters
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

onMounted(() => {
  fetchMenuItems();
});
</script>
