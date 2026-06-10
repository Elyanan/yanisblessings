const RETRYABLE_PATTERN =
  /fetch failed|connect timeout|connection timeout|econnreset|etimedout|und_err|network/i

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const parts = [error.message]
  if (error.cause instanceof Error) {
    parts.push(error.cause.message)
    const code = (error.cause as NodeJS.ErrnoException).code
    if (code) parts.push(code)
  }
  return RETRYABLE_PATTERN.test(parts.join(' '))
}

/** Retry Sanity API calls when the network drops or times out (common on slow connections). */
export async function withSanityRetry<T>(
  fn: () => Promise<T>,
  label = 'Sanity request',
  maxAttempts = 3,
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt >= maxAttempts || !isRetryableError(error)) {
        throw error
      }
      const delayMs = 1000 * attempt
      console.warn(`[Sanity] ${label} failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError
}

export function formatSanityError(error: unknown): string {
  if (!(error instanceof Error)) return 'Request failed'

  const cause = error.cause instanceof Error ? error.cause.message : ''
  const combined = `${error.message} ${cause}`.trim()

  if (RETRYABLE_PATTERN.test(combined)) {
    return 'Could not reach Sanity (network timeout). Check your internet connection and try again.'
  }

  if (combined.includes('permission') && combined.includes('required')) {
    return 'Your SANITY_API_TOKEN is read-only. Create a new token with Editor permissions at sanity.io/manage → API → Tokens, update SANITY_API_TOKEN, and redeploy.'
  }

  return error.message || 'Request failed'
}
