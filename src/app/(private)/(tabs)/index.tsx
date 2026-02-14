import { Box } from '@/components/ui/box'
import { LoadingIndicator } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { EMOTIONS_ENUM } from '@/constants/enums'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { getCurrentDateString } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useMemo } from 'react'
import { FlatList } from 'react-native'

export default function Screen() {
  const {
    data: todayDailyEntry,
    error: errorTodayDailyEntry,
    isPending: isLoadingTodayDailyEntry,
  } = useQuery({
    queryFn: async () => {
      const dailyEntry = await supabaseClient
        .from('daily_entries')
        .select('id, emotion')
        .eq('date', getCurrentDateString())

      if (dailyEntry.error) {
        console.error(dailyEntry.error)
        throw new Error('Erro ao buscar registro diário do dia atual')
      }

      return dailyEntry.data?.[0] || null
    },
    queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
  })

  const {
    data: lastDailyEntries,
    error: errorLastDailyEntries,
    isPending: isLoadingLastDailyEntries,
  } = useQuery({
    queryFn: async () => {
      const dailyEntries = await supabaseClient
        .from('daily_entries')
        .select('id, date, emotion, notes')
        .order('date', { ascending: false })
        .limit(8)

      if (dailyEntries.error) {
        console.error(dailyEntries.error)
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data
    },
    queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
  })

  const lastDailyEntriesPreview = useMemo(() => {
    if (!lastDailyEntries) return []
    return lastDailyEntries.slice(0, LAST_DAILY_ENTRIES_PREVIEW_COUNT)
  }, [lastDailyEntries])

  return (
    <Box gap="lg">
      {isLoadingTodayDailyEntry ? (
        <LoadingIndicator />
      ) : errorTodayDailyEntry ? (
        <Text>{errorTodayDailyEntry.message}</Text>
      ) : todayDailyEntry ? (
        <Box>
          <Text>Você já criou um registro diário para hoje</Text>
          <Text>{todayDailyEntry.emotion}</Text>
        </Box>
      ) : (
        <Box>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.CALM,
              },
            }}
            prefetch={false}
          >
            <Text>Calmo </Text>
          </Link>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.HAPPY,
              },
            }}
            prefetch={false}
          >
            <Text>Feliz </Text>
          </Link>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.NEUTRAL,
              },
            }}
            prefetch={false}
          >
            <Text>Neutro</Text>
          </Link>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.ANXIOUS,
              },
            }}
            prefetch={false}
          >
            <Text>Ansioso</Text>
          </Link>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.SAD,
              },
            }}
            prefetch={false}
          >
            <Text>Triste </Text>
          </Link>
          <Link
            href={{
              pathname: '/create-daily-entry',
              params: {
                emotion: EMOTIONS_ENUM.FRUSTRATED,
              },
            }}
            prefetch={false}
          >
            <Text>Frustrado</Text>
          </Link>
        </Box>
      )}
      <Box>
        <Box>
          <Text>Seus últimos registros diários</Text>
          {lastDailyEntries &&
            lastDailyEntries.length > LAST_DAILY_ENTRIES_PREVIEW_COUNT && (
              <Link href="/(private)/daily-entries">
                <Text>Ver todos</Text>
              </Link>
            )}
        </Box>
        {errorLastDailyEntries ? (
          <Text>{errorLastDailyEntries.message}</Text>
        ) : isLoadingLastDailyEntries ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            data={lastDailyEntriesPreview}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: theme.spacing.md }}
            renderItem={({ item }) => (
              <Box>
                <Text>{item.date}</Text>
                <Text>{item.emotion}</Text>
                {item.notes && <Text>{item.notes}</Text>}
              </Box>
            )}
          />
        )}
      </Box>
    </Box>
  )
}

const LAST_DAILY_ENTRIES_PREVIEW_COUNT = 7
