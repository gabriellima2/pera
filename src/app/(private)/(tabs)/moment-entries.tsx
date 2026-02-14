import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { PlusIcon } from 'lucide-react-native'
import { FlatList } from 'react-native'

export default function Screen() {
  const { data: momentEntries, isPending: isLoadingMomentEntries } = useQuery({
    queryFn: async () => {
      const momentEntries = await supabaseClient
        .from('moment_entries')
        .select(
          'id, situation_description, date, emotion, notes, situations ( id, label, code )',
        )
        .order('created_at', { ascending: false })

      if (momentEntries.error) {
        throw new Error('Erro ao buscar registros de momentos')
      }

      return momentEntries.data
    },
    queryKey: QUERY_KEYS.MOMENT_ENTRIES.ALL,
    throwOnError: true,
  })

  if (isLoadingMomentEntries) {
    return <LoadingScreen />
  }

  return (
    <Box gap="lg">
      <Box>
        <Text>Momentos</Text>
        <Link href="/(private)/create-moment-entry" asChild>
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
