import { BackButton } from '@/components/buttons/back-button'
import { Box } from '@/components/ui/box'
import { EmotionListSkeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { EMOTION_COLORS, EMOTION_ICONS } from '@/constants/emotions'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { ChevronRight } from 'lucide-react-native'
import { FlatList } from 'react-native'

export function DailyEntriesList() {
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

  return (
    <FlatList
      data={dailyEntries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
      }}
      ListHeaderComponent={() => (
        <Box
          gap="md"
          flexDirection="row"
          alignItems="center"
          height={42}
          my="lg"
        >
          <BackButton />
          <Text variant="title">Registros diários</Text>
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
            <Text variant="bodyMuted">
              {formatDate(item.date, 'dd/MM/yyyy')}
            </Text>
            {item.notes ? (
              <Text variant="caption" numberOfLines={1}>
                {item.notes}
              </Text>
            ) : (
              <Text variant="caption" fontStyle="italic">
                Registro sem anotações
              </Text>
            )}
          </Box>

          <ChevronRight size={16} color={theme.colors.foregroundSecondary} />
        </Box>
      )}
      ListEmptyComponent={
        isLoadingDailyEntries ? (
          <EmotionListSkeleton />
        ) : (
          <Box py="xl" alignItems="center">
            <Text color="foregroundSecondary">Nenhum registro encontrado.</Text>
          </Box>
        )
      }
    />
  )
}
