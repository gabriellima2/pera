import {
  DailyEntryCard,
  DailyEntryCardProvider,
} from '@/components/daily-entries/daily-entry-card'
import { TextLink } from '@/components/links/text-link'
import { Screen } from '@/components/private-screen/screen'
import {
  Section,
  SectionHeader,
  SectionTitle,
} from '@/components/private-screen/section'
import { StateText } from '@/components/texts/state-text'
import { Box } from '@/components/ui/box'
import { ListItemSkeleton, ListSkeleton } from '@/components/ui/skeleton'
import {
  DAILY_ENTRIES_PREVIEW_LIMIT,
  lastDailyEntriesPreviewQueryOptions,
} from '@/lib/react-query/queries/daily-entries'
import { useQuery } from '@tanstack/react-query'

export function LastDailyEntries() {
  const {
    data: lastDailyEntries,
    error: lastDailyEntriesError,
    isPending: isLoadingLastDailyEntries,
  } = useQuery(lastDailyEntriesPreviewQueryOptions())

  const hasLastDailyEntries = lastDailyEntries && lastDailyEntries.length > 0

  const hasMoreThanPreviewCount =
    lastDailyEntries && lastDailyEntries.length > DAILY_ENTRIES_PREVIEW_LIMIT

  return (
    <Screen pt="lg" bottomTabSpacing>
      <Section>
        <SectionHeader>
          <SectionTitle>
            Últimos {DAILY_ENTRIES_PREVIEW_LIMIT} registros
          </SectionTitle>
          {true && (
            <TextLink
              variant="caption"
              href="/(private)/(tabs)/(daily-entries)/daily-entries-list"
            >
              Ver todos
            </TextLink>
          )}
        </SectionHeader>

        <Box>
          {isLoadingLastDailyEntries ? (
            <ListSkeleton
              count={DAILY_ENTRIES_PREVIEW_LIMIT}
              item={<ListItemSkeleton />}
            />
          ) : lastDailyEntriesError ? (
            <StateText>Erro ao buscar os últimos registros.</StateText>
          ) : hasLastDailyEntries ? (
            <DailyEntryCardProvider>
              {lastDailyEntries.map((dailyEntry) => (
                <Box key={dailyEntry.id} mb="sm">
                  <DailyEntryCard key={dailyEntry.id} dailyEntry={dailyEntry} />
                </Box>
              ))}
            </DailyEntryCardProvider>
          ) : (
            <StateText>Nenhum registro encontrado.</StateText>
          )}
        </Box>
      </Section>
    </Screen>
  )
}
