import { Box } from '@/components/ui/box'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { FlatList } from 'react-native'
import { toast } from 'sonner-native'

export default function Screen() {
  const router = useRouter()

  const { data: todayDailyEntry, isPending: isLoadingTodayDailyEntry } =
    useQuery({
      queryFn: async () => {
        const user = await supabaseClient.auth.getUser()
        if (user.error) {
          throw new Error(
            'Você precisa estar autenticado para buscar registros diários',
          )
        }

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
      queryKey: ['today-daily-entry'],
      throwOnError: (error) => {
        toast.error(error.message)
        if (error.message.includes('Você precisa estar autenticado')) {
          router.replace('/')
        }
        return false
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })

  const { data: lastDailyEntries, isPending: isLoadingLastDailyEntries } =
    useQuery({
      queryFn: async () => {
        const user = await supabaseClient.auth.getUser()
        if (user.error) {
          throw new Error(
            'Você precisa estar autenticado para buscar registros diários',
          )
        }

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
      queryKey: ['daily-entries-preview'],
      throwOnError: (error) => {
        toast.error(error.message)
        if (error.message.includes('Você precisa estar autenticado')) {
          router.replace('/')
        }
        return false
      },
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

  const lastDailyEntriesPreview = useMemo(() => {
    if (!lastDailyEntries) return []
    return lastDailyEntries.slice(0, LAST_DAILY_ENTRIES_PREVIEW_COUNT)
  }, [lastDailyEntries])

  if (isLoadingTodayDailyEntry || isLoadingLastDailyEntries) {
    return <LoadingScreen />
  }

  return (
    <Box gap="lg">
      {todayDailyEntry ? (
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
                emotion: 'calm',
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
                emotion: 'happy',
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
                emotion: 'neutral',
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
                emotion: 'anxious',
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
                emotion: 'sad',
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
                emotion: 'frustrated',
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
              <Link href="/daily-entries">
                <Text>Ver todos</Text>
              </Link>
            )}
        </Box>
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
      </Box>
    </Box>
  )
}

const LAST_DAILY_ENTRIES_PREVIEW_COUNT = 7

function getCurrentDateString() {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}
