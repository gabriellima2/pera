import { BackButton } from '@/components/buttons/back-button'
import {
  DailyEntryCard,
  DailyEntryCardProvider,
  type DailyEntry,
} from '@/components/daily-entries/daily-entry-card'
import {
  ScreenFlatList,
  ScreenHeader,
  ScreenTitle,
} from '@/components/private-screen/screen'
import { StateText } from '@/components/texts/state-text'
import { ListItemSkeleton, ListSkeleton } from '@/components/ui/skeleton'
import { allDailyEntriesQueryOptions } from '@/lib/react-query/queries/daily-entries'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export function DailyEntriesList() {
  const { data: dailyEntries, isPending: isLoadingDailyEntries } = useQuery(
    allDailyEntriesQueryOptions(),
  )

  const keyExtractor = useCallback((item: DailyEntry) => item.id, [])

  const renderItem = useCallback(
    ({ item }: { item: DailyEntry }) => <DailyEntryCard dailyEntry={item} />,
    [],
  )

  const renderListHeaderComponent = useCallback(
    () => (
      <ScreenHeader>
        <BackButton />
        <ScreenTitle>Registros diários</ScreenTitle>
      </ScreenHeader>
    ),
    [],
  )

  const renderListEmptyComponent = useCallback(
    () =>
      isLoadingDailyEntries ? (
        <ListSkeleton item={<ListItemSkeleton />} />
      ) : (
        <StateText>Nenhum registro encontrado.</StateText>
      ),
    [isLoadingDailyEntries],
  )

  return (
    <DailyEntryCardProvider>
      <ScreenFlatList
        data={dailyEntries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeaderComponent}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </DailyEntryCardProvider>
  )
}
