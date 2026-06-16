import { SITE_URL } from '@/lib/seo/constants'

/** Strip optional www. so yanisblessings.com and www.yanisblessings.com match. */
function normalizeHost(host: string): string {
  return host.replace(/^www\./i, '').toLowerCase()
}

function hostMatchesSite(requestHost: string, siteHost: string): boolean {
  return normalizeHost(requestHost) === normalizeHost(siteHost)
}

function hostFromHeaderUrl(value: string): string | null {
  try {
    return new URL(value).host
  } catch {
    return null
  }
}

function getRequestHostFromOriginOrReferer(request: Request): string | null {
  const origin = request.headers.get('origin')
  // Browsers send the literal string "null" for opaque origins — don't treat it as a URL.
  if (origin && origin !== 'null') {
    const host = hostFromHeaderUrl(origin)
    if (host) return host
  }

  const referer = request.headers.get('referer')
  if (referer) {
    const host = hostFromHeaderUrl(referer)
    if (host) return host
  }

  return null
}

function getForwardedRequestHost(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = forwarded || request.headers.get('host')
  if (!host) return null
  return host.split(':')[0]
}

/** Validate request origin/referer matches our site (production security). */
export function isAllowedOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true

  const siteHost = new URL(SITE_URL).host

  const requestHost = getRequestHostFromOriginOrReferer(request)
  if (requestHost && hostMatchesSite(requestHost, siteHost)) {
    return true
  }

  // Some hosts/proxies strip Origin/Referer on same-site POSTs. Sec-Fetch-Site is set by
  // the browser and cannot be spoofed from cross-site pages, so it is safe to pair with Host.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'same-origin' || fetchSite === 'same-site') {
    const forwardedHost = getForwardedRequestHost(request)
    if (forwardedHost && hostMatchesSite(forwardedHost, siteHost)) {
      return true
    }
  }

  return false
}
