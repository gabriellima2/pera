import { Text } from '@/components/ui/text'
import { theme } from '@/theme'
import { Tabs } from 'expo-router'
import { CalendarDaysIcon, HomeIcon } from 'lucide-react-native'

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingTop: theme.spacing.sm,
        },
      }}
    >
      <Tabs.Screen
        name="(daily-entries)"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="Início" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={HomeIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(moment-entries)"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="Momentos" focused={focused} />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={CalendarDaysIcon} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}

function TabBarLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      color="foreground"
      variant="caption"
      fontSize={10}
      mt="xs"
      opacity={focused ? 1 : 0.6}
    >
      {label}
    </Text>
  )
}

function TabBarIcon({
  icon: Icon,
  focused,
}: {
  icon: React.ElementType
  focused: boolean
}) {
  return (
    <Icon
      size={24}
      color={theme.colors.foreground}
      opacity={focused ? 1 : 0.6}
    />
  )
}
