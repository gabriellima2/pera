import 'expo-sqlite/localStorage/install'
import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'
import { AppState, type AppStateStatus } from 'react-native'
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

let authRefreshSubscription: ReturnType<
  typeof AppState.addEventListener
> | null = null

export function bindSupabaseAuthRefreshToAppState() {
  const onChange = (state: AppStateStatus) => {
    if (state === 'active') {
      supabaseClient.auth.startAutoRefresh()
    } else {
      supabaseClient.auth.stopAutoRefresh()
    }
  }

  onChange(AppState.currentState)

  if (authRefreshSubscription) {
    authRefreshSubscription.remove()
  }

  authRefreshSubscription = AppState.addEventListener('change', onChange)

  return () => {
    authRefreshSubscription?.remove()
    authRefreshSubscription = null
  }
}
