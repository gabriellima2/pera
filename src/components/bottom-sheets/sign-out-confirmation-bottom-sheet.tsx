import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'

type SignOutConfirmationBottomSheetProps = {
  isVisible: boolean
  onClose: () => void
}

export function SignOutConfirmationBottomSheet({
  isVisible,
  onClose,
}: SignOutConfirmationBottomSheetProps) {
  const { signOut } = useAuth()

  const { mutateAsync: confirmSignOut, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: onClose,
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <Box gap="lg">
        <Box gap="xs">
          <Text variant="subtitle">Sair da conta</Text>
          <Text variant="bodyMuted">
            Tem certeza que deseja sair da sua conta?
          </Text>
        </Box>

        <Box gap="sm">
          <Button
            variant="danger"
            label="Sair"
            loading={isSigningOut}
            onPress={confirmSignOut}
          />
          <Button
            variant="secondary"
            label="Cancelar"
            disabled={isSigningOut}
            onPress={onClose}
          />
        </Box>
      </Box>
    </BottomSheet>
  )
}
