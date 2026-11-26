import { dailyEntriesQueryKeys } from '@/lib/react-query/queries/daily-entries'

export const QUERY_KEYS = {
  DAILY_ENTRIES: dailyEntriesQueryKeys,
  MOMENT_ENTRIES: {
    ALL: ['moment-entries'],
    GET_TO_EDIT: ['moment-entry-to-edit'],
  },
  SITUATIONS: {
    OPTIONS: ['situations-options'],
  },
}
