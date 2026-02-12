import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


// Use SSR browser client - handles cookies automatically
export const supabase = createBrowserClient(supabaseUrl, supabaseKey)