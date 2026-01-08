import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseServiceKey) {
    console.error('CRITICAL: Supabase Key is missing in environment variables.');
}

// Use service role key to bypass RLS in server-side operations
// Fallback to anon key if service role is missing (might fail RLS but won't crash)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
