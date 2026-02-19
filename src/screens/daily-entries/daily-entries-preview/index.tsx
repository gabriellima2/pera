import type { EmotionType } from '@/@types/emotions'
import { Box } from '@/components/ui/box'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import {
  EMOTION_COLORS,
  EMOTION_ICONS,
  EMOTION_LABELS,
} from '@/constants/emotions'
import { EMOTION_TYPE_ENUM } from '@/constants/enums'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { getCurrentDateString } from '@/utils/date'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { Link, useRouter } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import { FlatList, Pressable, ScrollView } from 'react-native'

const EMOTIONS: EmotionType[] = Object.values(EMOTION_TYPE_ENUM)

export function DailyEntriesPreview() {
  const router = useRouter()

  const { data: todayDailyEntry, isPending: isLoadingTodayDailyEntry } =
    useQuery({
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
      retry: false,
      queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
    })

  const { data: lastDailyEntries, isPending: isLoadingLastDailyEntries } =
    useQuery({
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

        return dailyEntries.data || []
      },
      retry: false,
      queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
    })

  const handleSelectEmotion = (emotion: EmotionType) => {
    router.push({
      pathname: '/create-daily-entry',
      params: { emotion },
    })
  }

  if (isLoadingTodayDailyEntry || isLoadingLastDailyEntries) {
    return <LoadingScreen />
  }

  return (
    <Box flex={1} backgroundColor="surface">
      {todayDailyEntry ? (
        <Box
          alignItems="center"
          backgroundColor="background"
          px="md"
          py="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
          gap="lg"
          mb="lg"
        >
          <Text variant="title">Seu registro de hoje foi:</Text>
          <Box alignItems="center" gap="sm">
            <Box
              alignItems="center"
              justifyContent="center"
              gap="xs"
              width={60}
              height={60}
              backgroundColor={EMOTION_COLORS[todayDailyEntry.emotion]}
              borderRadius="full"
            >
              <Text fontSize={28} lineHeight={32}>
                {EMOTION_ICONS[todayDailyEntry.emotion]}
              </Text>
            </Box>
            <Text variant="caption">
              {EMOTION_LABELS[todayDailyEntry.emotion]}
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          backgroundColor="background"
          pt="xl"
          pb="lg"
          gap="lg"
          mb="lg"
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
        >
          <Text variant="title" pl="md">
            Como foi o seu dia?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            {EMOTIONS.map((emotion) => (
              <Pressable
                key={emotion}
                onPress={() => handleSelectEmotion(emotion)}
              >
                <Box alignItems="center" gap="xs">
                  <Box
                    backgroundColor={EMOTION_COLORS[emotion]}
                    borderRadius="full"
                    width={60}
                    height={60}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={28} lineHeight={32}>
                      {EMOTION_ICONS[emotion]}
                    </Text>
                  </Box>
                  <Text variant="caption">{EMOTION_LABELS[emotion]}</Text>
                </Box>
              </Pressable>
            ))}
          </ScrollView>
        </Box>
      )}

      <Box
        flex={1}
        px="md"
        gap="md"
        borderTopLeftRadius="lg"
        borderTopRightRadius="lg"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text variant="subtitle">Últimos 7 registros</Text>
          {lastDailyEntries &&
            lastDailyEntries.length > LAST_DAILY_ENTRIES_PREVIEW_COUNT && (
              <Link href="/(private)/(tabs)/(daily-entries)/daily-entries-list">
                <Text color="accent" variant="caption">
                  Ver todos
                </Text>
              </Link>
            )}
        </Box>

        <FlatList
          data={lastDailyEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Box
              backgroundColor="background"
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
                    Registro apenas por emoção
                  </Text>
                )}
              </Box>

              <ChevronRight
                size={16}
                color={theme.colors.foregroundSecondary}
              />
            </Box>
          )}
          ListEmptyComponent={
            <Box py="xl" alignItems="center">
              <Text color="foregroundSecondary">
                Nenhum registro encontrado.
              </Text>
            </Box>
          }
        />
      </Box>
    </Box>
  )
}

const LAST_DAILY_ENTRIES_PREVIEW_COUNT = 7
