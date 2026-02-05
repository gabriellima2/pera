import { createTheme } from '@shopify/restyle'

export const theme = createTheme({
  colors: {
    background: '#000000',
    foreground: '#ffffff',
    foregroundSecondary: '#777777',

    surface: '#222222',
    surfaceAlt: '#333333',
    surfaceForeground: '#ffffff',

    muted: '#777777',
    mutedForeground: '#ffffff',

    accent: '#8AA1FF',
    accentSoft: '#2E3557',
    accentForeground: '#ffffff',

    success: '#00C853',
    successSoft: '#004D40',

    error: '#D32F2F',
    errorSoft: '#4A0004',

    warning: '#FFA000',
    warningSoft: '#4A2900',

    info: '#00B8D9',
    infoSoft: '#003647',
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
    xl: 24,
    full: 9999,
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },

  textVariants: {
    defaults: {
      fontFamily: 'Poppins_400Regular',
      color: 'foreground',
    },

    title: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 22,
      lineHeight: 28,
    },

    subtitle: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 16,
      lineHeight: 22,
    },

    body: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },

    bodyMedium: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      lineHeight: 20,
    },

    caption: {
      fontFamily: 'Poppins_400Regular',
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
      backgroundColor: 'surfaceAlt',
    },
  },
})

export type Theme = typeof theme
