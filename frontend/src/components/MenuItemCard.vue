<template>
  <div class="flex flex-col overflow-hidden bg-card border border-border/40 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg">
    <!-- Thumbnail -->
    <div class="aspect-video overflow-hidden bg-muted relative">
      <img 
        :src="item.image_url" 
        :alt="item.name" 
        class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
    </div>

    <!-- Description -->
    <div class="p-4 flex-grow">
      <div class="flex justify-between items-start gap-2">
        <h3 class="text-lg font-bold text-foreground line-clamp-1">{{ item.name }}</h3>
        <span class="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-foreground shrink-0 bg-background/50">
          <Star class="h-3 w-3 text-accent fill-accent shrink-0" />
          <span>{{ item.rating }}</span>
        </span>
      </div>
      <p class="text-xs text-muted-foreground font-medium mt-1">{{ item.cuisine }}</p>
    </div>

    <!-- Footer actions -->
    <div class="flex justify-between items-center p-4 bg-secondary/20 border-t border-border/30 mt-auto">
      <p class="text-lg font-bold text-foreground">${{ item.price.toFixed(2) }}</p>
      <button 
        @click="handleAddToCart"
        class="inline-flex items-center justify-center rounded-md text-xs font-bold h-9 px-3 bg-primary text-white hover:bg-primary/95 transition-all cursor-pointer shadow-sm min-w-[110px]"
      >
        <PlusCircle v-if="!added" class="mr-1.5 h-4 w-4 shrink-0" />
        <CheckCircle2 v-else class="mr-1.5 h-4 w-4 shrink-0 text-green-200 animate-in zoom-in-50" />
        <span>{{ added ? 'Added! ✓' : 'Add to Cart' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore, type MenuItem } from '../store/cart';
import { Star, PlusCircle, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps<{
  item: MenuItem;
}>();

const cartStore = useCartStore();
const added = ref(false);

const handleAddToCart = () => {
  cartStore.addToCart(props.item);
  added.value = true;
  
  // Revert back after 1.5s
  setTimeout(() => {
    added.value = false;
  }, 1500);
};
</script>
