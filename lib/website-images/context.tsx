'use client'

import { createContext, useContext, useMemo } from 'react'
import type { WebsiteImageKey } from './definitions'
import { resolveWebsiteImages } from './resolve'
import type { ResolvedWebsiteImage, SanityWebsiteImageSlot, WebsiteImagesMap } from './types'

const WebsiteImagesContext = createContext<WebsiteImagesMap | null>(null)

type ProviderProps = {
  slots?: SanityWebsiteImageSlot[] | null
  images?: WebsiteImagesMap
  children: React.ReactNode
}

export function WebsiteImagesProvider({ slots, images, children }: ProviderProps) {
  const value = useMemo(
    () => images ?? resolveWebsiteImages(slots),
    [images, slots],
  )

  return (
    <WebsiteImagesContext.Provider value={value}>{children}</WebsiteImagesContext.Provider>
  )
}

export function useWebsiteImages(): WebsiteImagesMap {
  const ctx = useContext(WebsiteImagesContext)
  if (!ctx) {
    return resolveWebsiteImages(null)
  }
  return ctx
}

export function useWebsiteImage(key: WebsiteImageKey): ResolvedWebsiteImage {
  return useWebsiteImages()[key]
}
