import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

export function BackButton() {
  const router = useRouter()
  return (
    <Button onPress={() => router.back()}>
      <Text>
        <ArrowLeft size={24} color="white" />
      </Text>
    </Button>
  )
}
