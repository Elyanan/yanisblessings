import { optimizeSanityCdnUrl } from '@/lib/sanity/image'
import {
  WEBSITE_IMAGE_SLOTS,
  type WebsiteImageKey,
} from './definitions'
import type { SanityWebsiteImageSlot, WebsiteImagesMap } from './types'

export function resolveWebsiteImages(
  slots: SanityWebsiteImageSlot[] | null | undefined,
  width = 1200,
): WebsiteImagesMap {
  const byKey = new Map((slots ?? []).map((slot) => [slot.key, slot]))

  return WEBSITE_IMAGE_SLOTS.reduce((acc, definition) => {
    const remote = byKey.get(definition.key)
    const hasCustom = Boolean(remote?.url)

    acc[definition.key] = {
      key: definition.key,
      src: hasCustom
        ? optimizeSanityCdnUrl(remote!.url, width, 85)
        : definition.fallbackSrc,
      alt: remote?.alt?.trim() || definition.defaultAlt,
      isCustom: hasCustom,
    }
    return acc
  }, {} as WebsiteImagesMap)
}

export function getResolvedImage(
  map: WebsiteImagesMap,
  key: WebsiteImageKey,
): WebsiteImagesMap[WebsiteImageKey] {
  return map[key]
}
