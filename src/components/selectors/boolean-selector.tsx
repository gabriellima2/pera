import { Chip, ChipGroup } from '../ui/chip'

type BooleanSelectorProps = {
  value: boolean
  onSelect: (value: boolean) => void
}

export function BooleanSelector({ value, onSelect }: BooleanSelectorProps) {
  return (
    <ChipGroup>
      <Chip
        label="Sim"
        variant={value ? 'accent' : undefined}
        onPress={() => onSelect(true)}
      />
      <Chip
        label="Não"
        variant={!value ? 'accent' : undefined}
        onPress={() => onSelect(false)}
      />
    </ChipGroup>
  )
}
