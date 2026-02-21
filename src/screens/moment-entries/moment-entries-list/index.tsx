import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { EMOTION_COLORS, EMOTION_ICONS } from '@/constants/emotions'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { Link } from 'expo-router'
import { ChevronRight, PlusIcon } from 'lucide-react-native'
import { FlatList } from 'react-native'

export function MomentEntriesList() {
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
    <FlatList
      data={momentEntries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
      }}
      ListHeaderComponent={() => (
        <Box
          gap="md"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          height={42}
          my="lg"
        >
          <Text variant="title">Momentos</Text>
          <Link
            href="/(private)/(tabs)/(moment-entries)/create-moment-entry"
            asChild
          >
            <Button size="sm" variant="secondary">
              <PlusIcon />
            </Button>
          </Link>
        </Box>
      )}
      renderItem={({ item }) => (
        <Box
          backgroundColor="surface"
          p="md"
          borderRadius="lg"
          flexDirection="row"
          alignItems="center"
          gap="md"
          mb="sm"
        >
          <Box
            backgroundColor={EMOTION_COLORS[item.emotion]}
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
          >
            <Text fontSize={20} lineHeight={24}>
              {EMOTION_ICONS[item.emotion]}
            </Text>
          </Box>

          <Box flex={1} gap="xs">
            {item.date && (
              <Text variant="bodyMuted">
                {formatDate(item.date, 'dd/MM/yyyy')}
              </Text>
            )}
            {item.situations?.label && <Text>{item.situations?.label}</Text>}
            {item.situation_description && (
              <Text variant="bodyMuted">{item.situation_description}</Text>
            )}
            {item.notes && (
              <Text variant="caption" numberOfLines={1}>
                {item.notes}
              </Text>
            )}
          </Box>
          <ChevronRight size={16} color={theme.colors.foregroundSecondary} />
        </Box>
      )}
      ListEmptyComponent={
        <Box py="xl" alignItems="center">
          <Text color="foregroundSecondary">Nenhum registro encontrado.</Text>
        </Box>
      }
    />
  )
}
