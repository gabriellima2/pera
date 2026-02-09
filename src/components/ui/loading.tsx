import { theme } from '@/theme'
import { ActivityIndicator, View } from 'react-native'

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={theme.colors.foreground} />
    </View>
  )
}

export const LoadingIndicator = ({
  color = theme.colors.foreground,
}: {
  color?: string
}) => {
  return <ActivityIndicator size="small" color={color} />
}
