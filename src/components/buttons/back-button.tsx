import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

export function BackButton(
  props: Omit<React.ComponentProps<typeof Button>, 'onPress' | 'children'>,
) {
  const router = useRouter()
  return (
    <Button
      size="sm"
      variant="secondary"
      onPress={() => {
        if (router.canGoBack()) {
          router.back()
        } else {
          router.replace('/(private)/(tabs)/(daily-entries)')
        }
      }}
      {...props}
    >
      <Text>
        <ArrowLeft />
      </Text>
    </Button>
  )
}
