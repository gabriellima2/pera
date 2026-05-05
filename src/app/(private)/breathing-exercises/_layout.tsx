import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="select-breathing-mode" />
      <Stack.Screen name="do-breathing-exercise" />
    </Stack>
  )
}
