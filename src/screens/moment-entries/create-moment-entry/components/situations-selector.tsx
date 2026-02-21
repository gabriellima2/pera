import { Chip, ChipGroup } from '@/components/ui/chip'
import { Text } from '@/components/ui/text'
import type { SituationType } from '../types'

type SituationsSelectorProps = {
  id?: string
  type: SituationType
  value: string
  situations: {
    value: string
    label: string
  }[]
  onSelect: (value: string, type: SituationType) => void
}

export function SituationsSelector({
  id,
  type,
  value,
  situations,
  onSelect,
}: SituationsSelectorProps) {
  return (
    <ChipGroup aria-labelledby={id}>
      {situations?.length ? (
        <>
          {situations?.map((situation) => {
            const isSelected = value === situation.value
            return (
              <Chip
                key={situation.value}
                label={situation.label}
                variant={isSelected ? 'accent' : undefined}
                onPress={() => {
                  onSelect(situation.value, 'predefined')
                }}
              />
            )
          })}
          <Chip
            label="Outro"
            variant={type === 'custom' ? 'accent' : undefined}
            onPress={() => {
              onSelect('', 'custom')
            }}
          />
        </>
      ) : (
        <Text>Nenhuma situação encontrada</Text>
      )}
    </ChipGroup>
  )
}
