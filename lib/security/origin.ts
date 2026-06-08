import { SITE_URL } from '@/lib/seo/constants'

/** Validate request origin/referer matches our site (production security). */
export function isAllowedOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true

  const siteHost = new URL(SITE_URL).host
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (origin) {
    try {
      return new URL(origin).host === siteHost
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      return new URL(referer).host === siteHost
    } catch {
      return false
    }
  }

  return false
}
