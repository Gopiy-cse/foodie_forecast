<template>
  <section id="categories" class="py-12">
    <h2 class="text-3xl font-bold text-center mb-8 font-headline text-foreground">Categories</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div 
        v-for="cat in categories" 
        :key="cat.name" 
        class="group overflow-hidden rounded-xl border border-border bg-card p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="bg-primary/10 p-4 rounded-full transition-all duration-300 group-hover:bg-primary">
            <component 
              :is="cat.icon" 
              class="h-8 w-8 text-primary transition-all duration-300 group-hover:text-white" 
            />
          </div>
          <h3 class="text-lg font-semibold text-foreground">{{ cat.name }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Leaf, Drumstick, GlassWater, Cake } from 'lucide-vue-next';

const categories = [
  { name: 'Veg', icon: Leaf },
  { name: 'Non-Veg', icon: Drumstick },
  { name: 'Beverages', icon: GlassWater },
  { name: 'Desserts', icon: Cake },
];
</script>
