<template>
  <div class="flex flex-col min-h-screen bg-background">
    <!-- Header -->
    <Header @cart-click="isCartOpen = true" />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- Search Hero banner -->
      <Hero v-model="searchTerm" />

      <!-- Content sections -->
      <div class="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <FoodSuggestions />
        <CategoryCards />
        <OffersSection />
        <HotelSection :searchTerm="searchTerm" />
      </div>
    </main>

    <!-- Side-cart panel -->
    <CartSheet 
      v-model:open="isCartOpen" 
      @checkout="isCheckoutOpen = true" 
    />

    <!-- Checkout Payment simulator dialog -->
    <CheckoutDialog 
      v-model:open="isCheckoutOpen" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Hero from '../components/Hero.vue';
import FoodSuggestions from '../components/FoodSuggestions.vue';
import CategoryCards from '../components/CategoryCards.vue';
import OffersSection from '../components/OffersSection.vue';
import HotelSection from '../components/HotelSection.vue';
import CartSheet from '../components/CartSheet.vue';
import CheckoutDialog from '../components/CheckoutDialog.vue';

const isCartOpen = ref(false);
const isCheckoutOpen = ref(false);
const searchTerm = ref('');
</script>
