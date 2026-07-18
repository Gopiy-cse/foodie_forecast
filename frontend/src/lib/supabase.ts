import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pvnfloroioclvkxpncbr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bmZsb3JvaW9jbHZreHBuY2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQyNzgsImV4cCI6MjA2ODk0MDI3OH0.s0in7oRwCv0PiRuDiTBX_CK60x496ytQExvm6pQcUGw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
