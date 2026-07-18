<template>
  <section id="suggestions" class="py-12">
    <div class="max-w-2xl mx-auto rounded-xl border border-primary/20 bg-card shadow-md overflow-hidden">
      <!-- Header -->
      <div class="bg-muted/50 p-6 border-b border-border/40">
        <div class="flex items-center gap-3">
          <Sparkles class="h-8 w-8 text-primary animate-pulse shrink-0" />
          <div>
            <h3 class="text-xl font-bold font-headline text-foreground leading-tight">Climate-Aware Suggestions</h3>
            <p class="text-xs text-muted-foreground mt-1">Get food ideas based on your local weather!</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4">
        <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="E.g., Chennai, India or London, UK"
            v-model="location"
            required
            aria-label="Your location"
            class="flex-grow rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button 
            type="submit" 
            :disabled="pending"
            class="bg-primary text-white font-bold px-5 py-2.5 rounded-md hover:bg-primary/95 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="pending" class="h-4 w-4 animate-spin shrink-0" />
            <span>{{ pending ? 'Getting Suggestions...' : 'Suggest Food' }}</span>
          </button>
        </form>

        <!-- Error box -->
        <div v-if="error" class="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {{ error }}
        </div>

        <!-- Suggestion details -->
        <div v-if="data" class="p-4 rounded-lg bg-secondary/40 border border-border/30 animate-in fade-in duration-300">
          <h4 class="font-bold text-base text-foreground flex items-center gap-2">
            <Lightbulb class="h-5 w-5 text-accent shrink-0" />
            Suggestions for your climate:
          </h4>
          <p class="mt-2 text-sm text-muted-foreground italic font-medium">
            "{{ data.reasoning }}"
          </p>
          <ul class="mt-3 list-disc list-inside space-y-1 text-sm text-foreground/90 pl-1 font-semibold">
            <li v-for="(food, index) in data.suggestions" :key="index">
              {{ food }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, Loader2, Lightbulb } from 'lucide-vue-next';

interface AIResult {
  suggestions: string[];
  reasoning: string;
}

const location = ref('');
const pending = ref(false);
const error = ref<string | null>(null);
const data = ref<AIResult | null>(null);

const handleSubmit = async () => {
  if (!location.value.trim()) return;
  pending.value = true;
  error.value = null;
  data.value = null;

  try {
    const response = await fetch('http://localhost:5000/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: location.value.trim() }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to generate suggestions.');
    }

    data.value = result;
  } catch (err: any) {
    console.error('Failed to get suggestions:', err);
    error.value = err.message || 'Failed to generate suggestions. Please check your connection and try again.';
  } finally {
    pending.value = false;
  }
};
</script>
