import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const profile = ref<any>(null);
  const loading = ref(true);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => profile.value?.is_admin === true);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      profile.value = data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      profile.value = null;
    }
  }

  // Set up auth state listener
  function initialize() {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null;
      token.value = session?.access_token ?? null;
      loading.value = false;

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        profile.value = null;
      }
    });
  }

  async function getAuthHeader() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { 'Authorization': `Bearer ${session.access_token}` };
    }
    return {};
  }

  async function logout() {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
    token.value = null;
  }

  return {
    user,
    profile,
    loading,
    token,
    isAuthenticated,
    isAdmin,
    initialize,
    getAuthHeader,
    logout
  };
});
