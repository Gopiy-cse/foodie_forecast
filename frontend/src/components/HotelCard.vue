<template>
  <router-link :to="`/hotel/${hotel.id}`" class="group">
    <div class="flex flex-col overflow-hidden bg-card border border-border/40 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg h-full">
      <!-- Thumbnail -->
      <div class="aspect-video overflow-hidden bg-muted relative">
        <img 
          :src="imgSrc || 'https://placehold.co/600x400?text=Foodie+Forecast'" 
          :alt="hotel.name"
          class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          @error="handleImgError"
        />
      </div>

      <!-- Description content -->
      <div class="p-4 flex-grow flex justify-between items-start">
        <div>
          <h3 class="text-lg font-bold group-hover:text-primary transition-colors text-foreground line-clamp-1">
            {{ hotel.name }}
          </h3>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ hotel.cuisine }}</p>
        </div>
        <ChevronRight class="h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary mt-1" />
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight } from '@lucide/vue';

interface Hotel {
  id: string;
  name: string;
  cuisine: string;
  image_url: string;
}

const props = defineProps<{
  hotel: Hotel;
}>();

const imgSrc = ref(props.hotel.image_url);

const handleImgError = () => {
  imgSrc.value = 'https://placehold.co/600x400?text=No+Image';
};
</script>
