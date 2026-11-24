export function getProfileInitials(name: string, email: string) {
  if (name !== '—') {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    if (parts[0]) {
      return parts[0].slice(0, 2).toUpperCase()
    }
  }

  if (email) {
    return email.slice(0, 2).toUpperCase()
  }

  return '?'
}
