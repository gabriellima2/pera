import { theme } from '@/theme'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create-moment-entry"
        options={{
          presentation: 'formSheet',
          sheetCornerRadius: theme.borderRadii.lg,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <Stack.Screen name="moment-entries-list" />
    </Stack>
  )
}
