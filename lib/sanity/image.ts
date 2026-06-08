import { createImageUrlBuilder } from '@sanity/image-url'
import { getSanityClient } from './client'

const builder = (() => {
  const client = getSanityClient()
  if (!client) return null
  return createImageUrlBuilder(client)
})()

type ImageOptions = {
  width?: number
  height?: number
  quality?: number
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
}

/** Build an optimized Sanity CDN URL, or return the raw URL / fallback. */
export function sanityImageUrl(
  source: { asset?: { _ref?: string; url?: string } } | string | null | undefined,
  options: ImageOptions = {},
): string {
  const { width = 800, height, quality = 80, fit = 'max' } = options

  if (!source) return '/placeholder.svg'

  if (typeof source === 'string') {
    if (source.startsWith('http') || source.startsWith('/')) return source
    return '/placeholder.svg'
  }

  if (!builder) return '/placeholder.svg'

  let img = builder.image(source).auto('format').quality(quality).fit(fit).width(width)
  if (height) img = img.height(height)
  return img.url()
}

/** Append Sanity CDN params to an existing asset URL when possible. */
export function optimizeSanityCdnUrl(url: string | undefined, width = 800, quality = 80): string {
  if (!url) return '/placeholder.svg'
  if (!url.includes('cdn.sanity.io')) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=${width}&q=${quality}&auto=format`
}
