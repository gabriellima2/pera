import { LoadingIndicator } from '@/components/ui/loading'
import { SessionProvider, useSession } from '@/contexts/session-context'
import { queryClient } from '@/lib/react-query/client'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter'
import { ThemeProvider } from '@shopify/restyle'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { ErrorBoundaryProps, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from 'lucide-react-native'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'
import { theme } from '../theme'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Tentar novamente</Text>
    </View>
  )
}

export const unstable_settings = {
  initialRouteName: '/',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <ThemeProvider theme={theme}>
          <StatusBar style="dark" />
          <QueryClientProvider client={queryClient}>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: theme.colors.background,
              }}
            >
              <SessionProvider>
                <Router />
              </SessionProvider>
              <Toaster
                theme="light"
                icons={toastIcons}
                toastOptions={toastOptions}
              />
            </SafeAreaView>
          </QueryClientProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

function Router() {
  const { session } = useSession()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(private)/(tabs)" />
      </Stack.Protected>
    </Stack>
  )
}

type ToasterProps = Parameters<typeof Toaster>[number]

const toastIcons: ToasterProps['icons'] = {
  success: <CheckCircle2Icon size={20} color={theme.colors.success} />,
  error: <XCircleIcon size={20} color={theme.colors.error} />,
  loading: <LoadingIndicator />,
  info: <InfoIcon size={20} color={theme.colors.foreground} />,
  warning: <AlertTriangleIcon size={20} color={theme.colors.warning} />,
}

const toastOptions: ToasterProps['toastOptions'] = {
  style: {
    backgroundColor: theme.colors.surface,
  },
  toastContentStyle: {
    alignItems: 'center',
  },
  titleStyle: {
    color: theme.colors.surfaceForeground,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  descriptionStyle: {
    color: theme.colors.surfaceForeground,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
}
