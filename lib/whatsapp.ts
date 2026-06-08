/** Normalize Ethiopian phone numbers for wa.me links (digits only, 251 prefix). */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('251')) return digits
  if (digits.startsWith('0')) return `251${digits.slice(1)}`
  if (digits.length === 9) return `251${digits}`
  return digits
}

export function whatsappCustomerUrl(phone: string, message: string): string {
  const normalized = normalizePhoneForWhatsApp(phone)
  if (!normalized) return '#'
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
