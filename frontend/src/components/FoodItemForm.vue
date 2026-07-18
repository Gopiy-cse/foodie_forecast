<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Item Name -->
    <div class="space-y-1">
      <label for="form-name" class="text-xs font-semibold text-muted-foreground">Name</label>
      <input 
        id="form-name"
        type="text" 
        v-model="form.name" 
        placeholder="E.g. Paneer Butter Masala"
        required
        class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      />
      <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
    </div>

    <!-- Cuisine & Price Row -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1">
        <label for="form-cuisine" class="text-xs font-semibold text-muted-foreground">Cuisine</label>
        <input 
          id="form-cuisine"
          type="text" 
          v-model="form.cuisine" 
          placeholder="E.g. North Indian"
          required
          class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <p v-if="errors.cuisine" class="text-xs text-destructive">{{ errors.cuisine }}</p>
      </div>

      <div class="space-y-1">
        <label for="form-price" class="text-xs font-semibold text-muted-foreground">Price ($)</label>
        <input 
          id="form-price"
          type="number" 
          step="0.01"
          v-model.number="form.price" 
          required
          class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <p v-if="errors.price" class="text-xs text-destructive">{{ errors.price }}</p>
      </div>
    </div>

    <!-- Category -->
    <div class="space-y-1">
      <label for="form-category" class="text-xs font-semibold text-muted-foreground">Category</label>
      <select 
        id="form-category"
        v-model="form.category" 
        required
        class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      >
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <p v-if="errors.category" class="text-xs text-destructive">{{ errors.category }}</p>
    </div>

    <!-- Image URL -->
    <div class="space-y-1">
      <label for="form-image" class="text-xs font-semibold text-muted-foreground">Image URL</label>
      <input 
        id="form-image"
        type="text" 
        v-model="form.image_url" 
        placeholder="https://example.com/image.png"
        required
        class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      />
      <p v-if="errors.image_url" class="text-xs text-destructive">{{ errors.image_url }}</p>
    </div>

    <!-- Actions -->
    <div class="pt-2 flex justify-end">
      <button 
        type="submit" 
        class="bg-primary text-white font-bold px-5 py-2.5 rounded-md hover:bg-primary/95 text-sm transition-colors cursor-pointer shadow-sm"
      >
        {{ itemToEdit ? 'Save Changes' : 'Create Item' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { MenuItem } from '../store/cart';

const props = defineProps<{
  itemToEdit?: MenuItem | null;
}>();

const emit = defineEmits(['submit']);

const categories = ['Veg', 'Non-Veg', 'Beverages', 'Desserts'];

const form = reactive({
  id: props.itemToEdit?.id || '',
  name: props.itemToEdit?.name || '',
  cuisine: props.itemToEdit?.cuisine || '',
  price: props.itemToEdit?.price || 0,
  category: props.itemToEdit?.category || '',
  rating: props.itemToEdit?.rating || 4.5,
  image_url: props.itemToEdit?.image_url || 'https://placehold.co/600x400.png',
});

const errors = reactive({
  name: '',
  cuisine: '',
  price: '',
  category: '',
  image_url: '',
});

const validate = () => {
  let isValid = true;
  
  if (form.name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
    isValid = false;
  } else {
    errors.name = '';
  }

  if (form.cuisine.length < 2) {
    errors.cuisine = 'Cuisine must be at least 2 characters.';
    isValid = false;
  } else {
    errors.cuisine = '';
  }

  if (form.price < 0) {
    errors.price = 'Price must be a positive number.';
    isValid = false;
  } else {
    errors.price = '';
  }

  if (!form.category) {
    errors.category = 'Please select a category.';
    isValid = false;
  } else {
    errors.category = '';
  }

  try {
    new URL(form.image_url);
    errors.image_url = '';
  } catch (_) {
    errors.image_url = 'Please enter a valid URL.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { ...form });
  }
};
</script>
