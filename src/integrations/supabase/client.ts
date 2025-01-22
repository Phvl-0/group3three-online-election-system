import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhnylsozrytziyajtznb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlobnlsc296cnl0eml5YWp0em5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzY4MDAsImV4cCI6MjAyNTQxMjgwMH0.qDPHvM1yYW-5uxRx1RUP0jXn0YZjHGRhf8YrisL4Ifs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    redirectTo: window.location.origin
  }
});