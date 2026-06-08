/** Allow digits and a single optional decimal point while typing. */
export function sanitizeNumericInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  if (parts.length <= 1) return cleaned
  return `${parts[0]}.${parts.slice(1).join('')}`
}

/** Parse a positive number (> 0) from user input, or return null if invalid. */
export function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || !/^\d+(\.\d+)?$/.test(trimmed)) return null
  const num = Number(trimmed)
  if (!Number.isFinite(num) || num <= 0) return null
  return num
}

/** Parse a non-negative number (>= 0), or return null if invalid. */
export function parseNonNegativeNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || !/^\d+(\.\d+)?$/.test(trimmed)) return null
  const num = Number(trimmed)
  if (!Number.isFinite(num) || num < 0) return null
  return num
}
