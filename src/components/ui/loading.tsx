import { theme } from '@/theme'
import { ActivityIndicator } from 'react-native'
import { Box } from './box'

export function LoadingScreen() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <ActivityIndicator size="large" color={theme.colors.foreground} />
    </Box>
  )
}

export const LoadingIndicator = ({
  color = theme.colors.foreground,
}: {
  color?: string
}) => {
  return <ActivityIndicator size="small" color={color} />
}
