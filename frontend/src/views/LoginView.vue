<template>
  <div class="flex min-h-screen items-center justify-center bg-secondary/20 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-card border border-border/50 rounded-xl p-6 shadow-xl">
      <!-- Title Header -->
      <div class="space-y-1 text-center mb-6">
        <h2 class="text-2xl font-bold tracking-tight text-foreground font-headline">
          Foodie Forecast
        </h2>
        <p class="text-xs text-muted-foreground">
          Sign in to your account or create a new one
        </p>
      </div>

      <!-- Error message alerts -->
      <div 
        v-if="errorMsg" 
        class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Info message alerts -->
      <div 
        v-if="infoMsg" 
        class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2"
      >
        <CheckCircle2 class="h-4 w-4 shrink-0" />
        <span>{{ infoMsg }}</span>
      </div>

      <!-- Tabs list -->
      <div class="w-full">
        <div class="grid grid-cols-2 bg-muted p-1 rounded-lg mb-6">
          <button 
            @click="activeTab = 'login'"
            :class="[
              'py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer',
              activeTab === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            Login
          </button>
          <button 
            @click="activeTab = 'signup'"
            :class="[
              'py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer',
              activeTab === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form Panel -->
        <div v-if="activeTab === 'login'">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1">
              <label for="login-email" class="text-xs font-semibold text-muted-foreground">Email</label>
              <input 
                id="login-email" 
                type="email" 
                v-model="loginForm.email"
                placeholder="m@example.com" 
                required 
                class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="space-y-1">
              <label for="login-password" class="text-xs font-semibold text-muted-foreground">Password</label>
              <input 
                id="login-password" 
                type="password" 
                v-model="loginForm.password"
                required 
                class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full bg-primary text-white font-bold py-2.5 rounded-md hover:bg-primary/95 transition-colors text-sm flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin shrink-0" />
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>
        </div>

        <!-- Signup Form Panel -->
        <div v-else>
          <form @submit.prevent="handleSignup" class="space-y-4">
            <div class="space-y-1">
              <label for="signup-email" class="text-xs font-semibold text-muted-foreground">Email</label>
              <input 
                id="signup-email" 
                type="email" 
                v-model="signupForm.email"
                placeholder="m@example.com" 
                required 
                class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="space-y-1">
              <label for="signup-name" class="text-xs font-semibold text-muted-foreground">Full Name</label>
              <input 
                id="signup-name" 
                type="text" 
                v-model="signupForm.fullName"
                placeholder="John Doe" 
                required 
                class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="space-y-1">
              <label for="signup-password" class="text-xs font-semibold text-muted-foreground">Password</label>
              <input 
                id="signup-password" 
                type="password" 
                v-model="signupForm.password"
                required 
                class="w-full rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full bg-primary text-white font-bold py-2.5 rounded-md hover:bg-primary/95 transition-colors text-sm flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin shrink-0" />
              <span>{{ isLoading ? 'Creating account...' : 'Create Account' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const activeTab = ref<'login' | 'signup'>('login');
const isLoading = ref(false);
const errorMsg = ref<string | null>(null);
const infoMsg = ref<string | null>(null);

const loginForm = reactive({
  email: '',
  password: '',
});

const signupForm = reactive({
  email: '',
  fullName: '',
  password: '',
});

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = null;
  infoMsg.value = null;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      errorMsg.value = error.message;
      return;
    }

    // Success redirect
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err.message || 'Login process failed.';
  } finally {
    isLoading.value = false;
  }
};

const handleSignup = async () => {
  isLoading.value = true;
  errorMsg.value = null;
  infoMsg.value = null;

  try {
    const { error } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      options: {
        data: {
          full_name: signupForm.fullName,
        },
      },
    });

    if (error) {
      errorMsg.value = error.message;
      return;
    }

    infoMsg.value = 'Account created successfully! Please check your email or log in.';
    activeTab.value = 'login';
  } catch (err: any) {
    errorMsg.value = err.message || 'Account registration failed.';
  } finally {
    isLoading.value = false;
  }
};
</script>
