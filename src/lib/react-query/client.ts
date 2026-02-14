import { parseMinutesToMilliseconds } from '@/utils/general'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: parseMinutesToMilliseconds(10), // 10 minutes
    },
  },
})
