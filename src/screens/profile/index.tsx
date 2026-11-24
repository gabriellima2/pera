import { SignOutConfirmationBottomSheet } from '@/components/bottom-sheets/sign-out-confirmation-bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export function ProfileScreen() {
  const { session } = useAuth()
  const router = useRouter()

  const email = session?.user.email ?? ''
  const name =
    (session?.user.user_metadata?.name as string | undefined)?.trim() || '—'

  return (
    <Box flex={1} px="md" pt="xl" gap="xl">
      <Text variant="title">Perfil</Text>

      <Box gap="sm">
        <Box
          backgroundColor="surface"
          py="md"
          pl="md"
          borderRadius="lg"
          gap="sm"
        >
          <Text variant="caption" color="foregroundSecondary">
            Nome
          </Text>
          <Text variant="bodyMuted">{name}</Text>
        </Box>
        <Box
          backgroundColor="surface"
          py="md"
          pl="md"
          borderRadius="lg"
          gap="sm"
        >
          <Text variant="caption" color="foregroundSecondary">
            E-mail
          </Text>
          <Text variant="bodyMuted">{email}</Text>
        </Box>
      </Box>

      <Box gap="md">
        <Button
          label="Alterar senha"
          variant="secondary"
          onPress={() =>
            router.push('/(private)/(tabs)/(profile)/change-password')
          }
        />
        <SignOutButton />
      </Box>
    </Box>
  )
}

function SignOutButton() {
  const [isSignOutSheetVisible, setIsSignOutSheetVisible] = useState(false)

  return (
    <>
      <Button
        label="Sair"
        variant="danger"
        onPress={() => setIsSignOutSheetVisible(true)}
      />
      {isSignOutSheetVisible && (
        <SignOutConfirmationBottomSheet
          isVisible={isSignOutSheetVisible}
          onClose={() => setIsSignOutSheetVisible(false)}
        />
      )}
    </>
  )
}
