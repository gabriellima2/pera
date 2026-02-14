import { LoadingScreen } from '@/components/ui/loading'
import { supabaseClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

type SessionContextType = {
  session: Session | null
}

const SessionContext = createContext<SessionContextType>({
  session: null,
})

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const listener = supabaseClient.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setIsLoading(false)
    })

    return () => {
      listener.data.subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ session }}>
      {isLoading ? <LoadingScreen /> : children}
    </SessionContext.Provider>
  )
}
