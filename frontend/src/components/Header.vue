<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <router-link to="/" class="flex items-center gap-2">
        <UtensilsCrossed class="h-7 w-7 text-primary" />
        <h1 class="text-2xl font-bold text-foreground tracking-tight">
          Foodie Forecast
        </h1>
      </router-link>

      <div class="flex items-center gap-4">
        <!-- User Profile Dropdown -->
        <div v-if="authStore.user" class="relative">
          <button 
            @click="isDropdownOpen = !isDropdownOpen"
            class="relative h-8 w-8 rounded-full overflow-hidden border border-border flex items-center justify-center bg-muted focus:outline-none"
            aria-label="User menu"
          >
            <img 
              v-if="authStore.user.user_metadata?.avatar_url"
              :src="authStore.user.user_metadata.avatar_url" 
              alt="Avatar"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-sm font-semibold uppercase text-muted-foreground">
              {{ authStore.user.email?.charAt(0) }}
            </span>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isDropdownOpen" 
            class="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-lg z-50"
          >
            <div class="px-2 py-1.5 text-sm font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">{{ authStore.user.user_metadata?.full_name || 'User' }}</p>
                <p class="text-xs leading-none text-muted-foreground truncate">{{ authStore.user.email }}</p>
              </div>
            </div>
            <div class="h-px bg-border my-1"></div>
            
            <router-link 
              v-if="authStore.isAdmin"
              to="/admin" 
              class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-secondary cursor-pointer"
              @click="isDropdownOpen = false"
            >
              <Settings class="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </router-link>
            
            <div v-if="authStore.isAdmin" class="h-px bg-border my-1"></div>
            
            <button 
              @click="handleSignOut"
              class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-red-50 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>

        <router-link v-else to="/login">
          <button class="bg-primary text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-primary/95 transition-colors">
            Login
          </button>
        </router-link>

        <!-- Cart Action Icon -->
        <div class="relative">
          <button 
            @click="$emit('cart-click')" 
            class="p-2 text-foreground hover:bg-secondary rounded-full transition-colors relative"
            aria-label="Open shopping cart"
          >
            <ShoppingCart class="h-6 w-6" />
            <span 
              v-if="cartStore.isCartHydrated && cartStore.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white p-0 text-xs font-bold pointer-events-none animate-bounce"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ShoppingCart, UtensilsCrossed, Settings } from '@lucide/vue';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';

defineEmits(['cart-click']);

const cartStore = useCartStore();
const authStore = useAuthStore();
const isDropdownOpen = ref(false);

const handleSignOut = async () => {
  isDropdownOpen.value = false;
  await authStore.logout();
};

// Close dropdown on click outside
const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>
