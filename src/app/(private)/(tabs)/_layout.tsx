import { Text } from '@/components/ui/text'
import { theme } from '@/theme'
import { Tabs, usePathname } from 'expo-router'
import { CalendarDaysIcon, HomeIcon } from 'lucide-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'

const hideTabBarPaths = [
  '/create-daily-entry',
  '/edit-daily-entry',
  '/daily-entries-list',
  '/create-moment-entry',
]

export default function Layout() {
  const pathname = usePathname()

  const animatedValue = useRef(new Animated.Value(1)).current
  const [translateY, setTranslateY] = useState(0)
  const [opacity, setOpacity] = useState(1)

  const shouldHideTabBar = useMemo(() => {
    if (!pathname) return false
    return hideTabBarPaths.some((path) => pathname.includes(path))
  }, [pathname])

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setOpacity(value)
      setTranslateY((1 - value) * 100)
    })

    Animated.timing(animatedValue, {
      toValue: shouldHideTabBar ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start()

    return () => {
      animatedValue.removeListener(listener)
    }
  }, [shouldHideTabBar, animatedValue])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: [
          {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingTop: theme.spacing.sm,
            opacity,
            transform: [{ translateY }],
            pointerEvents: opacity === 0 ? 'none' : 'auto',
            position: 'absolute',
            bottom: 0,
          },
        ],
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
