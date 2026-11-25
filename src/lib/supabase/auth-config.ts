import * as Linking from 'expo-linking'

/**
 * Keep in sync with Auth email OTP length:
 * - local: `otp_length` in supabase/config.toml (`[auth.email]`)
 * - hosted: Dashboard → Authentication → Sign In / Providers → Email (OTP length)
 */
export const AUTH_EMAIL_OTP_LENGTH = 6

export const AUTH_PASSWORD_MIN_LENGTH = 6

export const AUTH_USER_NAME_MAX_LENGTH = 255

export const AUTH_REDIRECT_URL = Linking.createURL('reset-password')
