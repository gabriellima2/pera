// Leituras Supabase + tipos Pick do schema (sem sufixo Row/Data).
// React Query: src/lib/react-query/queries/daily-entries.ts

import { supabaseClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database-types'
import { getCurrentDateString } from '@/utils/date'

type DailyEntry = Tables<'daily_entries'>

export const DAILY_ENTRIES_PREVIEW_LIMIT = 7

export type TodayDailyEntry = Pick<DailyEntry, 'id' | 'emotion'>
export type DailyEntryPreview = Pick<
  DailyEntry,
  'id' | 'date' | 'emotion' | 'notes'
>

export type DailyEntryList = Pick<
  DailyEntry,
  'id' | 'date' | 'emotion' | 'notes'
>

export async function fetchTodayDailyEntry(): Promise<TodayDailyEntry | null> {
  const dailyEntry = await supabaseClient
    .from('daily_entries')
    .select('id, emotion')
    .eq('date', getCurrentDateString())
    .is('deleted_at', null)

  if (dailyEntry.error) {
    throw new Error('Erro ao buscar registro diário do dia atual')
  }

  return dailyEntry.data?.[0] ?? null
}

export async function fetchLastDailyEntriesPreview(): Promise<
  DailyEntryPreview[]
> {
  const dailyEntries = await supabaseClient
    .from('daily_entries')
    .select('id, date, emotion, notes')
    .order('date', { ascending: false })
    .is('deleted_at', null)
    .limit(DAILY_ENTRIES_PREVIEW_LIMIT + 1)

  if (dailyEntries.error) {
    throw new Error('Erro ao buscar registros diários')
  }

  return dailyEntries.data ?? []
}

export async function fetchAllDailyEntries(): Promise<DailyEntryList[]> {
  const dailyEntries = await supabaseClient
    .from('daily_entries')
    .select('id, date, emotion, notes')
    .order('date', { ascending: false })
    .is('deleted_at', null)

  if (dailyEntries.error) {
    throw new Error('Erro ao buscar registros diários')
  }

  return dailyEntries.data ?? []
}
