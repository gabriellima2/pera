import { SignOutConfirmationBottomSheet } from '@/components/bottom-sheets/sign-out-confirmation-bottom-sheet'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { PADDING_BOTTOM_TAB_BAR_HEIGHT } from '@/constants/styles'
import { useAuth } from '@/contexts/auth-context'
import { theme } from '@/theme'
import { getProfileInitials } from '@/utils/auth'
import { Link } from 'expo-router'
import { ChevronRightIcon } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView } from 'react-native'

export function ProfileScreen() {
  const { session } = useAuth()

  const email = session?.user.email ?? ''
  const name =
    (session?.user.user_metadata?.name as string | undefined)?.trim() || '—'
  const initials = getProfileInitials(name, email)

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM_TAB_BAR_HEIGHT,
        }}
      >
        <Box px="md" justifyContent="center" height={42} my="lg">
          <Text variant="title">Perfil</Text>
        </Box>

        <Box px="md" mb="lg">
          <Box
            backgroundColor="surface"
            p="md"
            borderRadius="lg"
            flexDirection="row"
            alignItems="center"
            gap="md"
          >
            <Box
              width={60}
              height={60}
              borderRadius="full"
              backgroundColor="accentSoft"
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="subtitle" color="accent">
                {initials}
              </Text>
            </Box>
            <Box flex={1} gap="xs">
              <Text variant="subtitle">{name}</Text>
              <Text variant="bodyMuted" numberOfLines={2}>
                {email || '—'}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box px="md" gap="md" backgroundColor="background">
          <Text variant="subtitle">Segurança</Text>
          <Link href="/(private)/(tabs)/(profile)/change-password">
            <Box
              backgroundColor="surface"
              px="md"
              py="lg"
              borderRadius="lg"
              flexDirection="row"
              alignItems="center"
              gap="md"
            >
              <Box flex={1} gap="xs">
                <Text variant="subtitle">Alterar senha</Text>
                <Text variant="bodyMuted">
                  Atualize a senha de acesso da sua conta
                </Text>
              </Box>
              <ChevronRightIcon
                size={16}
                color={theme.colors.foregroundSecondary}
              />
            </Box>
          </Link>
        </Box>

        <Box px="md" mt="lg">
          <SignOutButton />
        </Box>
      </ScrollView>
    </Box>
  )
}

function SignOutButton() {
  const [isSignOutSheetVisible, setIsSignOutSheetVisible] = useState(false)

  return (
    <>
      <Button
        label="Sair da conta"
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
