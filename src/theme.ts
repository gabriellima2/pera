import { createTheme } from '@shopify/restyle'

export const theme = createTheme({
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    foregroundSecondary: '#6B7280',

    surface: '#F9FAFB',
    surfaceForeground: '#1A1A1A',

    accent: '#000000',
    accentForeground: '#FFFFFF',

    success: '#10B981',

    error: '#EF4444',

    warning: '#F59E0B',

    info: '#3B82F6',

    emotionCalm: '#D1FAE5',
    emotionHappy: '#DBEAFE',
    emotionNeutral: '#F3F4F6',
    emotionAnxious: '#FEF3C7',
    emotionSad: '#FEE2E2',
    emotionFrustrated: '#FEE2E2',
  },

  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadii: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },

  textVariants: {
    defaults: {
      fontFamily: 'Inter_400Regular',
      color: 'foreground',
    },

    display: {
      fontFamily: 'Inter_700Bold',
      fontSize: 32,
      lineHeight: 40,
    },

    title: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 20,
      lineHeight: 24,
    },

    subtitle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      lineHeight: 20,
    },

    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },

    bodyMuted: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      color: 'foregroundSecondary',
    },

    caption: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      lineHeight: 16,
      color: 'foregroundSecondary',
    },
  },

  buttonVariants: {
    primary: {
      backgroundColor: 'accent',
    },
    secondary: {
      backgroundColor: 'surface',
      borderWidth: 1,
      borderColor: 'foregroundSecondary',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: 'error',
    },
  },

  cardVariants: {
    defaults: {
      backgroundColor: 'surface',
      borderRadius: 'md',
      padding: 'md',
    },
    default: {
      backgroundColor: 'surface',
      borderRadius: 'md',
      padding: 'md',
    },
    outlined: {
      backgroundColor: 'surface',
      borderRadius: 'md',
      padding: 'md',
      borderWidth: 1,
      borderColor: 'foregroundSecondary',
    },
    elevated: {
      backgroundColor: 'surface',
      borderRadius: 'md',
      padding: 'md',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },

  listItemVariants: {
    defaults: {
      backgroundColor: 'surface',
      padding: 'md',
    },
    default: {
      backgroundColor: 'surface',
      padding: 'md',
    },
    pressable: {
      backgroundColor: 'surface',
      padding: 'md',
      borderRadius: 'sm',
    },
    danger: {
      backgroundColor: 'surface',
      padding: 'md',
      borderLeftWidth: 3,
      borderLeftColor: 'error',
    },
  },
})

export type Theme = typeof theme
