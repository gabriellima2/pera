export function getDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export function getCurrentDateString() {
  return getDateString(new Date())
}

export function getNowISOString() {
  return new Date().toISOString()
}
