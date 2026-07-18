<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop overlay -->
    <div @click="handleClose" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Dialog box container -->
    <div class="relative w-full max-w-md rounded-xl bg-background p-6 shadow-2xl z-50 border border-border/50 animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="text-xl font-bold text-foreground">
          {{ isSuccess ? 'Payment Successful!' : 'Complete Your Order' }}
        </h2>
        <p class="text-sm text-muted-foreground mt-1">
          {{ isSuccess ? 'Your order has been confirmed and recorded.' : 'Review your order details and proceed to payment.' }}
        </p>
      </div>

      <!-- Success Content -->
      <div v-if="isSuccess" class="flex flex-col items-center justify-center space-y-4 my-8">
        <CheckCircle2 class="h-24 w-24 text-green-500 animate-bounce" />
        <p class="text-lg font-medium text-foreground">Thank you for your purchase!</p>
        <p class="text-muted-foreground text-center text-sm">
          Your order has been saved. This dialog will close automatically.
        </p>
      </div>

      <!-- Checkout Form Content -->
      <div v-else class="my-4 space-y-4">
        <!-- Order Summary -->
        <div>
          <h3 class="font-semibold text-sm mb-2">Order Summary</h3>
          <div class="space-y-2 rounded-md bg-muted p-4 border border-border/30">
            <div 
              v-for="item in cartStore.cart" 
              :key="item.id" 
              class="flex justify-between text-xs text-foreground/80 font-medium"
            >
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="border-t border-border mt-3 pt-3"></div>
            <div class="flex justify-between font-bold text-sm text-foreground">
              <span>Total</span>
              <span class="text-primary">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="space-y-1.5">
          <label for="delivery-address" class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin class="h-3.5 w-3.5 text-primary" />
            Delivery Address <span class="font-normal">(optional)</span>
          </label>
          <textarea
            id="delivery-address"
            placeholder="Enter your delivery address…"
            v-model="deliveryAddress"
            rows="2"
            class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground"
          ></textarea>
        </div>

        <!-- Form Action Buttons -->
        <div class="flex justify-end gap-2 pt-2">
          <button 
            @click="handleClose" 
            :disabled="isProcessing"
            class="px-4 py-2 border border-border rounded-md text-sm font-semibold hover:bg-secondary disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            @click="handlePayment" 
            :disabled="isProcessing || cartStore.cart.length === 0"
            class="px-5 py-2 bg-primary text-white rounded-md text-sm font-bold hover:bg-primary/95 disabled:opacity-50 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          >
            <Loader2 v-if="isProcessing" class="mr-2 h-4 w-4 animate-spin" />
            <span>{{ isProcessing ? 'Processing…' : `Pay $${cartStore.totalPrice.toFixed(2)}` }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { Loader2, CheckCircle2, MapPin } from '@lucide/vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['update:open']);

const cartStore = useCartStore();
const authStore = useAuthStore();

const isProcessing = ref(false);
const isSuccess = ref(false);
const deliveryAddress = ref('');

const handlePayment = async () => {
  isProcessing.value = true;

  try {
    const authHeaders = await authStore.getAuthHeader();
    
    // API server runs on port 5000
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeaders && 'Authorization' in authHeaders && authHeaders.Authorization) {
      headers['Authorization'] = authHeaders.Authorization;
    }
    
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items: cartStore.cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: cartStore.totalPrice,
        deliveryAddress: deliveryAddress.value.trim() || undefined,
      }),
    });

    const result = await response.json();

    isProcessing.value = false;

    if (!response.ok) {
      alert(result.error || 'Something went wrong. Please try again.');
      return;
    }

    isSuccess.value = true;
    cartStore.clearCart();
    deliveryAddress.value = '';
    
    // Close automatically after 3 seconds
    setTimeout(() => {
      handleClose();
    }, 3000);
  } catch (err) {
    isProcessing.value = false;
    console.error('Order network error:', err);
    alert('Failed to connect to order server.');
  }
};

const handleClose = () => {
  if (isProcessing.value) return;
  emit('update:open', false);
  // Reset success state after animation transition
  setTimeout(() => {
    isSuccess.value = false;
  }, 300);
};
</script>
