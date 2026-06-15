import { SITE_URL } from '@/lib/seo/constants'

/** Strip optional www. so yanisblessings.com and www.yanisblessings.com match. */
function normalizeHost(host: string): string {
  return host.replace(/^www\./i, '')
}

function hostMatchesSite(requestHost: string, siteHost: string): boolean {
  return normalizeHost(requestHost) === normalizeHost(siteHost)
}

/** Validate request origin/referer matches our site (production security). */
export function isAllowedOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true

  const siteHost = new URL(SITE_URL).host
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (origin) {
    try {
      return hostMatchesSite(new URL(origin).host, siteHost)
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      return hostMatchesSite(new URL(referer).host, siteHost)
    } catch {
      return false
    }
  }

  return false
}
