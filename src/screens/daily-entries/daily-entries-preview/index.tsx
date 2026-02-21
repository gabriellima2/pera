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
import { Pressable, ScrollView } from 'react-native'

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
    <ScrollView
      contentContainerStyle={{
        paddingBottom: theme.spacing.lg,
      }}
    >
      {todayDailyEntry ? (
        <Box
          alignItems="center"
          backgroundColor="surface"
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
          backgroundColor="surface"
          py="lg"
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
              gap: theme.spacing.md,
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

      <Box flex={1} px="md" gap="md" backgroundColor="background">
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

        <Box>
          {lastDailyEntries && lastDailyEntries.length > 0 ? (
            lastDailyEntries?.map((dailyEntry) => (
              <Box
                key={dailyEntry.id}
                backgroundColor="surface"
                p="md"
                borderRadius="lg"
                flexDirection="row"
                alignItems="center"
                gap="md"
                mb="sm"
              >
                <Box
                  backgroundColor={EMOTION_COLORS[dailyEntry.emotion]}
                  width={40}
                  height={40}
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                >
                  <Text fontSize={20} lineHeight={24}>
                    {EMOTION_ICONS[dailyEntry.emotion]}
                  </Text>
                </Box>

                <Box flex={1} gap="xs">
                  <Text variant="bodyMuted">
                    {formatDate(dailyEntry.date, 'dd/MM/yyyy')}
                  </Text>
                  {dailyEntry.notes ? (
                    <Text variant="caption" numberOfLines={1}>
                      {dailyEntry.notes}
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
            ))
          ) : (
            <Box py="xl" alignItems="center">
              <Text color="foregroundSecondary">
                Nenhum registro encontrado.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

const LAST_DAILY_ENTRIES_PREVIEW_COUNT = 7
