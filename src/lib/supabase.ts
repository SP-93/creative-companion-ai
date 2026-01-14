import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for production, fallback to hardcoded for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bznqnuhljvtcvnjdmpbh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LG9vXZLgpdv_b4pPgNHbAA_pmdhA8b2';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
