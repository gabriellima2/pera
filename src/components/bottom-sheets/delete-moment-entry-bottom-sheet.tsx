import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { getNowISOString } from '@/utils/date'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner-native'

type DeleteMomentEntryBottomSheetProps = {
  isVisible: boolean
  momentEntryId: string
  onClose: () => void
}

export function DeleteMomentEntryBottomSheet({
  isVisible,
  momentEntryId,
  onClose,
}: DeleteMomentEntryBottomSheetProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteMomentEntry, isPending: isDeletingMomentEntry } =
    useMutation({
      mutationFn: async () => {
        const result = await supabaseClient
          .from('moment_entries')
          .update({ deleted_at: getNowISOString() })
          .eq('id', momentEntryId)
          .is('deleted_at', null)

        if (result.error) {
          throw new Error('Erro ao deletar registro de momento')
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MOMENT_ENTRIES.ALL,
        })
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MOMENT_ENTRIES.GET_TO_EDIT,
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
            loading={isDeletingMomentEntry}
            disabled={isDeletingMomentEntry}
            onPress={() => deleteMomentEntry()}
          />
          <Button
            variant="secondary"
            label="Cancelar"
            disabled={isDeletingMomentEntry}
            onPress={onClose}
          />
        </Box>
      </Box>
    </BottomSheet>
  )
}
