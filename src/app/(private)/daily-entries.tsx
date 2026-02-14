import { Box } from '@/components/ui/box'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'react-native'

export default function Screen() {
  const { data: dailyEntries, isPending: isLoadingDailyEntries } = useQuery({
    queryFn: async () => {
      const dailyEntries = await supabaseClient
        .from('daily_entries')
        .select('id, date, emotion, notes')
        .order('date', { ascending: false })

      if (dailyEntries.error) {
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data
    },
    queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL,
    throwOnError: true,
  })

  if (isLoadingDailyEntries) {
    return <LoadingScreen />
  }

  return (
    <Box gap="lg">
      <Box>
        <Text>Registros diários</Text>
      </Box>
      <FlatList
        data={dailyEntries}
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
  )
}
