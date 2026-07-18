<template>
  <section id="offers" class="py-12 bg-secondary/30 rounded-xl my-12 px-6">
    <div class="container mx-auto">
      <div class="flex items-center justify-center gap-3 mb-8">
        <Tag class="h-7 w-7 text-primary animate-pulse" />
        <h2 class="text-3xl font-bold text-center font-headline text-foreground">Special Offers</h2>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="border border-border/50 bg-card rounded-xl p-6 animate-pulse space-y-4">
          <div class="h-5 w-3/4 bg-muted rounded"></div>
          <div class="h-4 w-full bg-muted rounded"></div>
          <div class="h-4 w-5/6 bg-muted rounded"></div>
          <div class="h-9 w-full bg-muted rounded pt-4"></div>
        </div>
      </div>

      <!-- Empty state -->
      <p v-else-if="offers.length === 0" class="text-center text-muted-foreground py-8 font-medium">
        No active offers right now. Check back soon!
      </p>

      <!-- Offers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="offer in offers" 
          :key="offer.id" 
          class="flex flex-col bg-card border border-border/40 rounded-xl shadow-sm transform transition-all duration-300 hover:scale-[1.02] p-5 h-full"
        >
          <div class="flex items-start gap-2 mb-2">
            <TicketPercent class="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <h3 class="font-bold text-foreground text-base leading-tight">{{ offer.title }}</h3>
          </div>
          
          <p class="text-muted-foreground text-sm flex-grow mb-4">{{ offer.description }}</p>

          <!-- Validity Dates -->
          <div v-if="offer.valid_from || offer.valid_to" class="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <CalendarDays class="h-3.5 w-3.5 shrink-0" />
            <span v-if="offer.valid_from">From {{ formatDate(offer.valid_from) }}</span>
            <span v-if="offer.valid_from && offer.valid_to">–</span>
            <span v-if="offer.valid_to">Until {{ formatDate(offer.valid_to) }}</span>
          </div>

          <!-- Coupon Code Box -->
          <div class="flex items-center gap-2 p-2 rounded-md bg-muted mt-auto border border-border/10">
            <span class="font-mono text-sm font-bold text-foreground flex-1 tracking-widest pl-1">
              {{ offer.code }}
            </span>
            <button 
              @click="copyCode(offer.code)"
              class="p-1.5 hover:bg-secondary rounded-md text-foreground transition-colors cursor-pointer"
              :aria-label="'Copy code ' + offer.code"
            >
              <Copy class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Tag, TicketPercent, CalendarDays, Copy } from '@lucide/vue';

interface Offer {
  id: string;
  title: string;
  description: string | null;
  code: string;
  active: boolean;
  valid_from: string | null;
  valid_to: string | null;
}

const offers = ref<Offer[]>([]);
const loading = ref(true);

const fetchOffers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/offers');
    const data = await response.json();
    offers.value = data || [];
  } catch (err) {
    console.error('Failed to load offers:', err);
  } finally {
    loading.value = false;
  }
};

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  alert(`Coupon code "${code}" copied to clipboard!`);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  fetchOffers();
});
</script>
