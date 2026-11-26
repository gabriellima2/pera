import {
  fetchAllDailyEntries,
  fetchLastDailyEntriesPreview,
  fetchTodayDailyEntry,
} from '@/lib/supabase/queries/daily-entries'
import { queryOptions } from '@tanstack/react-query'

export type {
  DailyEntryList,
  DailyEntryPreview,
  TodayDailyEntry,
} from '@/lib/supabase/queries/daily-entries'

export { DAILY_ENTRIES_PREVIEW_LIMIT } from '@/lib/supabase/queries/daily-entries'

export const dailyEntriesQueryKeys = {
  ALL: ['daily-entries'],
  TODAY: ['today-daily-entry'],
  HAS_TODAY: ['has-today-daily-entry'],
  PREVIEW: ['daily-entries-preview'],
  GET_TO_EDIT: ['daily-entry-to-edit'],
} as const

export function todayDailyEntryQueryOptions() {
  return queryOptions({
    queryKey: dailyEntriesQueryKeys.TODAY,
    queryFn: fetchTodayDailyEntry,
    retry: false,
  })
}

export function lastDailyEntriesPreviewQueryOptions() {
  return queryOptions({
    queryKey: dailyEntriesQueryKeys.PREVIEW,
    queryFn: fetchLastDailyEntriesPreview,
    retry: false,
  })
}

export function allDailyEntriesQueryOptions() {
  return queryOptions({
    queryKey: dailyEntriesQueryKeys.ALL,
    queryFn: fetchAllDailyEntries,
    throwOnError: true,
  })
}
