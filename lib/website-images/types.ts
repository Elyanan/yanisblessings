import type { WebsiteImageKey } from './definitions'

export type ResolvedWebsiteImage = {
  key: WebsiteImageKey
  src: string
  alt: string
  isCustom: boolean
}

export type WebsiteImagesMap = Record<WebsiteImageKey, ResolvedWebsiteImage>

export type SanityWebsiteImageSlot = {
  key: string
  alt?: string
  assetId?: string
  url?: string
}
