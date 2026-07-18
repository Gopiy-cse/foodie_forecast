import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import HomeView from '../views/HomeView.vue';
import HotelView from '../views/HotelView.vue';
import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/hotel/:id',
    name: 'Hotel',
    component: HotelView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAdmin: true }
  },
  // Fallback redirect
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Admin Route Guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Wait until auth state is initialized
  if (authStore.loading) {
    // Basic polling or wait
    let attempts = 0;
    while (authStore.loading && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      return next({ name: 'Login' });
    }
  }
  
  next();
});

export default router;
