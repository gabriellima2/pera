import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner-native'

type DeleteDailyEntryBottomSheetProps = {
  isVisible: boolean
  dailyEntryId: string
  onClose: () => void
}

export function DeleteDailyEntryBottomSheet({
  isVisible,
  dailyEntryId,
  onClose,
}: DeleteDailyEntryBottomSheetProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteDailyEntry, isPending } = useMutation({
    mutationFn: async () => {
      const result = await supabaseClient
        .from('daily_entries')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', dailyEntryId)
        .is('deleted_at', null)

      if (result.error) {
        throw new Error('Erro ao deletar registro diário')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL,
      })
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
      })
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
      })
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.GET_TO_EDIT,
      })
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.HAS_TODAY,
      })
      toast.success('Registro deletado com sucesso')
      onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <Box gap="lg">
        <Box gap="xs">
          <Text variant="subtitle">Deletar registro</Text>
          <Text variant="bodyMuted">
            Tem certeza que deseja deletar este registro? Esta ação não pode ser
            desfeita.
          </Text>
        </Box>

        <Box gap="sm">
          <Button
            variant="danger"
            label="Confirmar"
            loading={isPending}
            disabled={isPending}
            onPress={() => deleteDailyEntry()}
          />
          <Button
            variant="secondary"
            label="Cancelar"
            disabled={isPending}
            onPress={onClose}
          />
        </Box>
      </Box>
    </BottomSheet>
  )
}
