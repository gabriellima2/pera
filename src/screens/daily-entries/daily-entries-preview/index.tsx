import { ScrollView } from 'react-native'
import { LastDailyEntries } from './last-daily-entries'
import { TodayDailyEntry } from './today-daily-entry'

export function DailyEntriesPreview() {
  return (
    <ScrollView>
      <TodayDailyEntry />
      <LastDailyEntries />
    </ScrollView>
  )
}
