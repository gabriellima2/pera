import { parseMinutesToMilliseconds } from '@/utils/general'
import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: false,
        refetchOnWindowFocus: false,
        staleTime: parseMinutesToMilliseconds(10), // 10 minutes
      },
    },
  })
}
