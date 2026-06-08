/** Normalize Ethiopian phone numbers for t.me links (+251…). */
export function normalizePhoneForTelegram(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null

  let normalized = digits
  if (digits.startsWith('251')) {
    normalized = digits
  } else if (digits.startsWith('0')) {
    normalized = `251${digits.slice(1)}`
  } else if (digits.length === 9) {
    normalized = `251${digits}`
  }

  if (normalized.length < 10) return null
  return `+${normalized}`
}

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

function buildTelegramUrl(target: string, message?: string): string {
  const base = target.startsWith('http') ? target : `https://t.me/${target}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/**
 * Open a Telegram chat with the customer.
 * Prefers @username when set; otherwise uses phone (t.me/+251…).
 */
export function telegramCustomerUrl(
  username: string | undefined | null,
  phone: string | undefined | null,
  message?: string,
): string | null {
  const normalizedUsername = normalizeTelegramUsername(username)
  if (normalizedUsername) {
    return buildTelegramUrl(normalizedUsername, message)
  }

  if (username?.trim()) {
    const phoneFromUsername = normalizePhoneForTelegram(username)
    if (phoneFromUsername) {
      return buildTelegramUrl(phoneFromUsername, message)
    }
  }

  if (phone?.trim()) {
    const phoneTarget = normalizePhoneForTelegram(phone)
    if (phoneTarget) {
      return buildTelegramUrl(phoneTarget, message)
    }
  }

  return null
}
