<template>
  <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
    <!-- Backdrop overlay -->
    <div 
      @click="$emit('update:open', false)" 
      class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
    ></div>

    <!-- Drawer container -->
    <div class="relative flex w-full max-w-lg flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ease-out transform translate-x-0 h-full border-l border-border">
      <!-- Close Button -->
      <button 
        @click="$emit('update:open', false)" 
        class="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground"
        aria-label="Close cart"
      >
        <X class="h-5 w-5" />
      </button>

      <!-- Header -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-foreground">
          Your Cart ({{ cartStore.isCartHydrated ? cartStore.totalItems : 0 }})
        </h2>
        <p class="text-sm text-muted-foreground mt-1">Review your items before checkout.</p>
      </div>
      <div class="h-px bg-border my-2"></div>

      <!-- Cart Items List -->
      <div v-if="cartStore.isCartHydrated && cartStore.cart.length > 0" class="flex-1 overflow-y-auto pr-2 space-y-4">
        <div 
          v-for="item in cartStore.cart" 
          :key="item.id" 
          class="flex items-center gap-4 py-2 border-b border-border/50"
        >
          <!-- Thumbnail -->
          <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
            <img 
              :src="item.image_url" 
              :alt="item.name" 
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Description and actions -->
          <div class="flex-1">
            <h4 class="font-semibold text-foreground text-sm line-clamp-1">{{ item.name }}</h4>
            <p class="text-xs text-muted-foreground font-medium mt-0.5">${{ item.price.toFixed(2) }}</p>
            
            <div class="mt-2 flex items-center gap-2">
              <div class="flex items-center border border-border rounded-md bg-card overflow-hidden">
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                  class="p-1 px-2.5 hover:bg-secondary disabled:opacity-50 text-muted-foreground transition-colors"
                >
                  <Minus class="h-3 w-3" />
                </button>
                <span class="w-8 text-center text-xs font-semibold select-none">
                  {{ item.quantity }}
                </span>
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="p-1 px-2.5 hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <Plus class="h-3 w-3" />
                </button>
              </div>

              <button 
                @click="cartStore.removeFromCart(item.id)"
                class="p-1.5 hover:bg-red-50 text-destructive rounded-md transition-colors"
                aria-label="Remove item"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Total price for item -->
          <div class="text-right">
            <span class="font-bold text-foreground text-sm">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag class="h-16 w-16 text-muted-foreground/60" />
        <h3 class="text-xl font-semibold text-foreground">Your cart is empty</h3>
        <p class="text-muted-foreground text-sm max-w-[280px]">
          Add some delicious food to get started!
        </p>
      </div>

      <!-- Footer action details -->
      <div v-if="cartStore.cart.length > 0" class="mt-auto">
        <div class="h-px bg-border my-4"></div>
        <div class="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span class="text-primary">${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <button 
          @click="onCheckout" 
          class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/95 transition-colors text-center cursor-pointer shadow-md"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../store/cart';
import { X, Trash2, Plus, Minus, ShoppingBag } from '@lucide/vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['update:open', 'checkout']);

const cartStore = useCartStore();

function onCheckout() {
  emit('update:open', false);
  emit('checkout');
}
</script>
