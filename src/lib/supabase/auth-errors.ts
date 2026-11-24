import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Do not map (generic fallback only — user enumeration or unnecessary detail):
  // email_exists, user_already_exists, user_not_found

  // Login e cadastro
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
  signup_disabled: 'Novos cadastros estão indisponíveis no momento.',
  email_provider_disabled: 'Cadastro por e-mail está indisponível.',
  email_address_invalid: 'E-mail inválido.',
  user_banned:
    'Esta conta está suspensa. Entre em contato com o suporte, se necessário.',

  // Senha
  weak_password: 'A senha não atende aos requisitos de segurança.',
  same_password: 'A nova senha deve ser diferente da atual.',
  current_password_required: 'Informe sua senha atual.',
  current_password_mismatch: 'A senha atual está incorreta.',

  // Reautenticação / OTP
  reauthentication_needed:
    'Por segurança, informe o código de confirmação enviado ao seu e-mail.',
  reauthentication_not_valid: 'Código de confirmação incorreto.',
  reauth_nonce_missing: 'Informe o código de confirmação.',
  otp_expired: 'Código de confirmação expirado. Solicite um novo.',
  otp_disabled: 'Login por código está indisponível.',

  // E-mail (envio)
  email_address_not_authorized:
    'Não foi possível enviar o e-mail. Tente novamente mais tarde.',
  over_email_send_rate_limit:
    'Muitos e-mails foram enviados. Aguarde um pouco e tente novamente.',
  over_sms_send_rate_limit:
    'Muitas mensagens foram enviadas. Aguarde um pouco e tente novamente.',

  // Rate limit e rede
  over_request_rate_limit:
    'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  request_timeout: 'A operação demorou demais. Tente novamente.',

  // Sessão
  session_expired: 'Sua sessão expirou. Entre novamente.',
  session_not_found: 'Sessão inválida. Entre novamente.',
  refresh_token_not_found: 'Sessão inválida. Entre novamente.',
  refresh_token_already_used: 'Sessão inválida. Entre novamente.',
  flow_state_expired: 'O link expirou. Solicite um novo.',
  flow_state_not_found: 'O link não é mais válido. Solicite um novo.',

  // Outros
  validation_failed: 'Verifique os dados informados e tente novamente.',
  unexpected_failure:
    'Ocorreu um erro inesperado. Tente novamente em instantes.',
}

const GENERIC_AUTH_ERROR_MESSAGE = 'Não foi possível concluir a operação.'

export function getAuthErrorMessage(error: SupabaseAuthError): string {
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code]
  }
  return GENERIC_AUTH_ERROR_MESSAGE
}

class AuthError extends Error {
  readonly code: string | undefined

  constructor(supabaseError: SupabaseAuthError) {
    super(getAuthErrorMessage(supabaseError))
    this.name = 'AuthError'
    this.code = supabaseError.code
  }
}

export function throwAuthError(error: SupabaseAuthError): never {
  throw new AuthError(error)
}

export function isReauthenticationNeeded(error: unknown): boolean {
  if (error instanceof AuthError) {
    return error.code === 'reauthentication_needed'
  }
  return false
}
