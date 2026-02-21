import { getDateString } from '@/utils/date'
import { useMemo } from 'react'
import RNDatePicker from 'react-native-date-picker'

type DatePickerProps = {
  id?: string
  value: string
  onChangeDate: (value: string) => void
}

export function DatePicker({ id, value, onChangeDate }: DatePickerProps) {
  const date = useMemo(() => getDatePickerValue(value), [value])
  return (
    <RNDatePicker
      mode="date"
      locale="pt-BR"
      theme="light"
      aria-labelledby={id}
      date={date}
      onDateChange={(date) => onChangeDate(getDateString(date))}
    />
  )
}

function getDatePickerValue(value: string | undefined | null) {
  const fallback = new Date()
  const date = value ? new Date(value) : fallback

  if (isNaN(date.getTime())) {
    return fallback
  }

  return date
}
