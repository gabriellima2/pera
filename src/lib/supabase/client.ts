import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install'
import { z } from 'zod'
import type { Database } from './database-types'

const env = z
  .object({
    SUPABASE_URL: z.string(),
    SUPABASE_PUBLISHABLE_KEY: z.string(),
  })
  .parse({
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  })

export const supabaseClient = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
)
