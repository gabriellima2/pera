import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/contexts/auth-context'

export function ProfileScreen() {
  const { session, signOut } = useAuth()

  const email = session?.user.email ?? ''
  const name =
    (session?.user.user_metadata?.name as string | undefined)?.trim() || '—'

  return (
    <Box flex={1} px="md" pt="xl" gap="xl">
      <Text variant="title">Perfil</Text>

      <Box gap="md">
        <Box gap="xs">
          <Text color="foregroundSecondary" variant="caption">
            Nome
          </Text>
          <Text>{name}</Text>
        </Box>
        <Box gap="xs">
          <Text color="foregroundSecondary" variant="caption">
            E-mail
          </Text>
          <Text>{email}</Text>
        </Box>
      </Box>

      <Button label="Sair" variant="danger" onPress={() => signOut()} />
    </Box>
  )
}
