<template>
  <section id="hotels" class="py-12">
    <h2 class="text-3xl font-bold text-center mb-8 font-headline text-foreground">Explore Restaurants</h2>

    <!-- Loading skeleton grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="flex flex-col space-y-3">
        <div class="h-[180px] w-full bg-muted rounded-xl animate-pulse"></div>
        <div class="space-y-2 animate-pulse">
          <div class="h-4 w-3/4 bg-muted rounded"></div>
          <div class="h-4 w-1/2 bg-muted rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredHotels.length === 0" class="text-center py-16">
      <p class="text-lg text-muted-foreground">
        No hotels found matching your search. Try something else!
      </p>
    </div>

    <!-- Hotels listing grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <HotelCard 
        v-for="hotel in filteredHotels" 
        :key="hotel.id" 
        :hotel="hotel" 
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HotelCard from './HotelCard.vue';

const props = defineProps<{
  searchTerm: string;
}>();

const hotels = ref<any[]>([]);
const loading = ref(true);

const fetchHotels = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/hotels');
    const data = await response.json();
    hotels.value = data || [];
  } catch (err) {
    console.error('Failed to fetch hotels:', err);
  } finally {
    loading.value = false;
  }
};

const filteredHotels = computed(() => {
  const filter = props.searchTerm.trim().toLowerCase();
  if (!filter) return hotels.value;

  return hotels.value.filter(
    (h) =>
      h.name.toLowerCase().includes(filter) ||
      (h.cuisine && h.cuisine.toLowerCase().includes(filter))
  );
});

onMounted(() => {
  fetchHotels();
});
</script>
