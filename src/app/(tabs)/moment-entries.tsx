import { Box } from '@/components/ui/box'
import Button from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import { PlusIcon } from 'lucide-react-native'
import { FlatList } from 'react-native'
import { toast } from 'sonner-native'

export default function Screen() {
  const router = useRouter()

  const { data: momentEntries, isPending: isLoadingMomentEntries } = useQuery({
    queryFn: async () => {
      const user = await supabaseClient.auth.getUser()
      if (user.error) {
        throw new Error(
          'Você precisa estar autenticado para buscar registros diários',
        )
      }

      const momentEntries = await supabaseClient
        .from('moment_entries')
        .select(
          'id, situation_description, date, emotion, notes, situations ( id, label, code )',
        )
        .order('created_at', { ascending: false })

      if (momentEntries.error) {
        console.error(momentEntries.error)
        throw new Error('Erro ao buscar registros de momentos')
      }

      return momentEntries.data
    },
    queryKey: ['moment-entries'],
    throwOnError: (error) => {
      toast.error(error.message)
      if (error.message.includes('Você precisa estar autenticado')) {
        router.replace('/')
      }
      return false
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  if (isLoadingMomentEntries) {
    return <LoadingScreen />
  }

  return (
    <Box gap="lg">
      <Box>
        <Text>Momentos</Text>
        <Link href="/create-moment-entry" asChild>
          <Button>
            <PlusIcon />
          </Button>
        </Link>
      </Box>
      <FlatList
        data={momentEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: theme.spacing.md }}
        renderItem={({ item }) => (
          <Box>
            <Text>{item.date}</Text>
            <Text>{item.emotion}</Text>
            {item.notes && <Text>{item.notes}</Text>}
            {item.situation_description && (
              <Text>{item.situation_description}</Text>
            )}
            {item.situations && <Text>{item.situations.label}</Text>}
          </Box>
        )}
      />
    </Box>
  )
}
