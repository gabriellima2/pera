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
      <Stack.Screen name="create-daily-entry" />
      <Stack.Screen name="daily-entries-list" />
      <Stack.Screen name="edit-daily-entry/[id]" />
    </Stack>
  )
}
