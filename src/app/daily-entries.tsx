import { Box } from '@/components/ui/box'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { FlatList } from 'react-native'
import { toast } from 'sonner-native'

export default function Screen() {
  const router = useRouter()

  const { data: dailyEntries, isPending: isLoadingDailyEntries } = useQuery({
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

      if (dailyEntries.error) {
        console.error(dailyEntries.error)
        throw new Error('Erro ao buscar registros diários')
      }

      return dailyEntries.data
    },
    queryKey: ['daily-entries'],
    throwOnError: (error) => {
      toast.error(error.message)
      if (error.message.includes('Você precisa estar autenticado')) {
        router.replace('/')
      }
      return false
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
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
