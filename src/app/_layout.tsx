import { LoadingIndicator } from '@/components/ui/loading'
import { queryClient } from '@/lib/react-query/client'
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'
import { ThemeProvider } from '@shopify/restyle'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from 'lucide-react-native'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'
import { theme } from '../theme'
export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '/',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
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
          <StatusBar style="light" />
          <QueryClientProvider client={queryClient}>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                paddingTop: theme.spacing.md,
              }}
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="daily-entries" />
                <Stack.Screen name="create-daily-entry" />
                <Stack.Screen name="create-moment-entry" />
              </Stack>
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
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  descriptionStyle: {
    color: theme.colors.surfaceForeground,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
}
