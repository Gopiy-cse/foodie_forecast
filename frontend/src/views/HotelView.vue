<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <Header @cart-click="isCartOpen = true" />

    <!-- Main Content -->
    <main class="flex-1">
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 class="h-12 w-12 text-primary animate-spin" />
        <p class="text-muted-foreground font-semibold text-sm">Loading restaurant menu…</p>
      </div>

      <div v-else-if="!hotel" class="container mx-auto px-4 py-16 text-center">
        <h2 class="text-2xl font-bold text-foreground">Restaurant Not Found</h2>
        <p class="text-muted-foreground mt-2">The restaurant you are trying to view does not exist.</p>
        <router-link to="/">
          <button class="mt-4 bg-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-primary/95 transition-colors cursor-pointer">
            Back to Home
          </button>
        </router-link>
      </div>

      <div v-else>
        <!-- Restaurant Hero Platter Banner -->
        <section class="relative h-[30vh] w-full">
          <img 
            :src="hotel.image_url" 
            :alt="hotel.name" 
            class="object-cover w-full h-full"
          />
          <div class="absolute inset-0 bg-black/60" />
          <div class="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 class="text-4xl font-bold md:text-5xl font-headline leading-tight">{{ hotel.name }}</h1>
            <p class="mt-2 text-base md:text-lg text-neutral-200 font-medium">{{ hotel.cuisine }}</p>
          </div>
        </section>

        <!-- Menu items Section -->
        <div class="container mx-auto max-w-7xl px-4 py-8 md:py-12">
          <section id="menu" class="py-12">
            <h2 class="text-3xl font-bold text-center mb-8 font-headline text-foreground">Our Menu</h2>
            
            <div v-if="menuItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <MenuItemCard 
                v-for="item in menuItems" 
                :key="item.id" 
                :item="item" 
              />
            </div>
            
            <div v-else class="text-center py-16">
              <p class="text-lg text-muted-foreground">No dishes found for this hotel.</p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Side-cart panel -->
    <CartSheet 
      v-model:open="isCartOpen" 
      @checkout="isCheckoutOpen = true" 
    />

    <!-- Checkout simulator dialog -->
    <CheckoutDialog 
      v-model:open="isCheckoutOpen" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';
import Header from '../components/Header.vue';
import MenuItemCard from '../components/MenuItemCard.vue';
import CartSheet from '../components/CartSheet.vue';
import CheckoutDialog from '../components/CheckoutDialog.vue';

const route = useRoute();
const hotelId = route.params.id as string;

const hotel = ref<any>(null);
const loading = ref(true);
const isCartOpen = ref(false);
const isCheckoutOpen = ref(false);

const menuItems = computed(() => {
  if (!hotel.value || !hotel.value.hotel_menus) return [];
  // Flatten menu items from join table
  return hotel.value.hotel_menus.flatMap((m: any) => m.menu_items || []);
});

const fetchHotelDetail = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/hotels/${hotelId}`);
    const data = await response.json();
    if (data && data.length > 0) {
      hotel.value = data[0];
    }
  } catch (err) {
    console.error('Failed to load hotel detail:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHotelDetail();
});
</script>
