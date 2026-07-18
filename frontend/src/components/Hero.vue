<template>
  <section 
    class="relative h-[40vh] w-full bg-cover bg-center" 
    style="background-image: url('https://pvnfloroioclvkxpncbr.supabase.co/storage/v1/object/public/images-hotel/hotels/front-cover.jpg'); background-attachment: fixed;"
  >
    <!-- Overlay backdrop -->
    <div class="absolute inset-0 bg-black/50" />
    
    <!-- Hero contents -->
    <div class="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
      <h2 class="text-4xl font-bold md:text-5xl font-headline">Find Your Next Craving</h2>
      <p class="mt-4 max-w-2xl text-base md:text-lg text-neutral-200">
        From local delights to global cuisines, we've got you covered. What are you in the mood for today?
      </p>

      <!-- Search Input & Suggestions Autocomplete -->
      <div class="mt-8 w-full max-w-lg relative" ref="searchContainerRef">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for dishes, hotels or cuisines..."
            v-model="query"
            @focus="onFocus"
            @input="onInput"
            class="w-full rounded-full bg-white/95 py-3.5 pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-lg transition-all"
          />

          <!-- Suggestions Dropdown -->
          <ul 
            v-if="isSuggestionsVisible && filteredSuggestions.length > 0" 
            class="absolute top-full left-0 right-0 mt-2 rounded-lg bg-card border border-border shadow-2xl z-20 text-left overflow-hidden max-h-60 overflow-y-auto"
          >
            <li
              v-for="(item, index) in filteredSuggestions"
              :key="index"
              @mousedown="handleSuggestionClick(item)"
              class="flex items-center px-4 py-3 cursor-pointer text-foreground hover:bg-secondary/60 transition-colors border-b border-border/20 last:border-b-0"
            >
              <Building v-if="item.type === 'hotel'" class="mr-3 h-4 w-4 text-primary/70 shrink-0" />
              <Utensils v-if="item.type === 'cuisine'" class="mr-3 h-4 w-4 text-primary/70 shrink-0" />
              <Pizza v-if="item.type === 'dish'" class="mr-3 h-4 w-4 text-primary/70 shrink-0" />

              <div class="flex flex-col">
                <span class="text-sm font-semibold text-foreground">{{ item.name }}</span>
                <span v-if="item.type === 'dish'" class="text-xs text-muted-foreground font-medium mt-0.5">
                  {{ item.hotelName }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Building, Utensils, Pizza } from '@lucide/vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const query = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

interface Suggestion {
  name: string;
  type: 'hotel' | 'cuisine' | 'dish';
  id?: string;
  hotelName?: string;
  hotelId?: string;
}

const hotels = ref<any[]>([]);
const isSuggestionsVisible = ref(false);
const searchContainerRef = ref<HTMLElement | null>(null);

// Fetch search indexing data from backend
const fetchSearchData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/hotels');
    const data = await response.json();
    hotels.value = data || [];
    buildIndex();
  } catch (err) {
    console.error('Failed to load search index data:', err);
  }
};

const allCuisines = ref<string[]>([]);
const allDishes = ref<{ name: string; hotelName: string; hotelId: string }[]>([]);

const buildIndex = () => {
  const cuisinesSet = new Set<string>();
  const dishesList: { name: string; hotelName: string; hotelId: string }[] = [];

  hotels.value.forEach((hotel) => {
    if (hotel.cuisine) {
      hotel.cuisine.split(',').forEach((c: string) => cuisinesSet.add(c.trim()));
    }
    if (hotel.hotel_menus) {
      hotel.hotel_menus.forEach((menu: any) => {
        if (menu.menu_items) {
          menu.menu_items.forEach((item: any) => {
            dishesList.push({
              name: item.name,
              hotelName: hotel.name,
              hotelId: hotel.id
            });
          });
        }
      });
    }
  });

  allCuisines.value = Array.from(cuisinesSet);
  allDishes.value = dishesList;
};

const filteredSuggestions = computed(() => {
  if (query.value.length <= 1) return [];

  const lower = query.value.toLowerCase();
  
  const hotelMatches = hotels.value
    .filter((h) => h.name.toLowerCase().includes(lower))
    .map((h) => ({ name: h.name, type: 'hotel' as const, id: h.id }));

  const cuisineMatches = allCuisines.value
    .filter((c) => c.toLowerCase().includes(lower))
    .map((c) => ({ name: c, type: 'cuisine' as const }));

  const dishMatches = allDishes.value
    .filter((d) => d.name.toLowerCase().includes(lower))
    .map((d) => ({
      name: d.name,
      type: 'dish' as const,
      hotelName: d.hotelName,
      hotelId: d.hotelId
    }));

  return [...dishMatches, ...hotelMatches, ...cuisineMatches].slice(0, 7);
});

const onFocus = () => {
  isSuggestionsVisible.value = query.value.length > 1;
};

const onInput = () => {
  isSuggestionsVisible.value = query.value.length > 1;
};

const handleSuggestionClick = (item: Suggestion) => {
  if (item.type === 'dish' && item.hotelId) {
    router.push(`/hotel/${item.hotelId}`);
  } else {
    query.value = item.name;
  }
  isSuggestionsVisible.value = false;
};

const clickOutside = (e: MouseEvent) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target as Node)) {
    isSuggestionsVisible.value = false;
  }
};

onMounted(() => {
  fetchSearchData();
  document.addEventListener('mousedown', clickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', clickOutside);
});
</script>
