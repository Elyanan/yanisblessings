/** Normalize a Telegram username (with or without @). */
export function normalizeTelegramUsername(input: string | undefined | null): string | null {
  if (!input?.trim()) return null
  let username = input.trim()
  if (username.startsWith('@')) username = username.slice(1)
  if (username.startsWith('https://t.me/')) username = username.replace('https://t.me/', '')
  if (username.startsWith('t.me/')) username = username.replace('t.me/', '')
  username = username.split(/[/?#]/)[0]
  if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) return null
  return username
}

/** Open Telegram chat with a customer when a username is available. */
export function telegramCustomerUrl(
  username: string | undefined | null,
  message?: string,
): string | null {
  const normalized = normalizeTelegramUsername(username)
  if (!normalized) return null
  const base = `https://t.me/${normalized}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
