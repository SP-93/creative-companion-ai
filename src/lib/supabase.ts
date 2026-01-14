import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bznqnuhljvtcvnjdmpbh.supabase.co';
const supabaseAnonKey = 'sb_publishable_LG9vXZLgpdv_b4pPgNHbAA_pmdhA8b2';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
