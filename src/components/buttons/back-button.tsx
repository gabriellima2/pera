import { Href, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

type BackButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'onPress' | 'children'
> & {
  fallbackHref?: Href
}

export function BackButton({ fallbackHref, ...props }: BackButtonProps) {
  const router = useRouter()

  if (!router.canGoBack() && !fallbackHref) {
    return null
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      flexShrink={0}
      accessibilityLabel="Voltar"
      onPress={() => {
        if (router.canGoBack()) {
          router.back()
        } else if (fallbackHref) {
          router.replace(fallbackHref)
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
