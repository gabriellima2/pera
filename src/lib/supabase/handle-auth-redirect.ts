import { supabaseClient } from '@/lib/supabase/client'

export async function handleSupabaseAuthRedirect(url: string) {
  const hashIndex = url.indexOf('#')
  if (hashIndex === -1) {
    return
  }

  const hash = url.slice(hashIndex + 1)
  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')

  if (!accessToken || !refreshToken) {
    return
  }

  await supabaseClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
}
