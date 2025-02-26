
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhnylsozrytziyajtznb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlobnlsc296cnl0eml5YWp0em5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MDg2NTEsImV4cCI6MjA1MjQ4NDY1MX0.hOfnjngfYwXURZX0wNGV9-gCrR3uGDLY2CZXupZpi6k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

