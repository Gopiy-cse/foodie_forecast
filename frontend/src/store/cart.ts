import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  cuisine: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartItem[]>([]);
  const isCartHydrated = ref(false);

  // Load cart from local storage on init
  function hydrate() {
    try {
      const storedCart = localStorage.getItem('foodie-forecast-cart');
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      }
    } catch (error) {
      console.error("Could not read cart from localStorage", error);
    } finally {
      isCartHydrated.value = true;
    }
  }

  // Watch cart changes and save
  watch(cart, (newCart) => {
    if (isCartHydrated.value) {
      try {
        localStorage.setItem('foodie-forecast-cart', JSON.stringify(newCart));
      } catch (error) {
        console.error("Could not save cart to localStorage", error);
      }
    }
  }, { deep: true });

  const totalItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  function addToCart(item: MenuItem) {
    const existingItem = cart.value.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
  }

  function removeFromCart(itemId: string) {
    cart.value = cart.value.filter((item) => item.id !== itemId);
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = cart.value.find((item) => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    cart.value = [];
  }

  return {
    cart,
    isCartHydrated,
    totalItems,
    totalPrice,
    hydrate,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
});
