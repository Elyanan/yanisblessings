export const WEBSITE_IMAGES_DOC_ID = 'websiteImages'

export type WebsiteImageKey =
  | 'home-hero'
  | 'home-cat-granola'
  | 'home-cat-cupcakes'
  | 'home-cat-cookies'
  | 'home-cat-giftbox'
  | 'story-bakery'
  | 'home-gift-boxes'
  | 'custom-orders-hero'

export type WebsiteImageSlotDefinition = {
  key: WebsiteImageKey
  page: 'Home' | 'About' | 'Custom Orders'
  label: string
  fallbackSrc: string
  defaultAlt: string
}

export const WEBSITE_IMAGE_SLOTS: WebsiteImageSlotDefinition[] = [
  {
    key: 'home-hero',
    page: 'Home',
    label: 'Hero — main granola image',
    fallbackSrc: '/images/hero-granola.png',
    defaultAlt: 'Delicious homemade granola',
  },
  {
    key: 'home-cat-granola',
    page: 'Home',
    label: 'Categories — Granola',
    fallbackSrc: '/images/cat-granola.png',
    defaultAlt: 'Granola category',
  },
  {
    key: 'home-cat-cupcakes',
    page: 'Home',
    label: 'Categories — Cupcakes',
    fallbackSrc: '/images/cat-cupcakes.png',
    defaultAlt: 'Cupcakes category',
  },
  {
    key: 'home-cat-cookies',
    page: 'Home',
    label: 'Categories — Cookies',
    fallbackSrc: '/images/cat-cookies.png',
    defaultAlt: 'Cookies category',
  },
  {
    key: 'home-cat-giftbox',
    page: 'Home',
    label: 'Categories — Gift boxes',
    fallbackSrc: '/images/cat-giftbox.png',
    defaultAlt: 'Gift boxes category',
  },
  {
    key: 'story-bakery',
    page: 'Home',
    label: 'Our story — bakery image (also used on About page)',
    fallbackSrc: '/images/story-bakery.png',
    defaultAlt: "Yani's Blessings bakery",
  },
  {
    key: 'home-gift-boxes',
    page: 'Home',
    label: 'Gift boxes section',
    fallbackSrc: '/images/gift-boxes-display.png',
    defaultAlt: 'Beautiful gift boxes display',
  },
  {
    key: 'custom-orders-hero',
    page: 'Custom Orders',
    label: 'Custom orders hero image',
    fallbackSrc: '/images/box-custom.png',
    defaultAlt: 'Custom bakery orders',
  },
]

export const WEBSITE_IMAGE_SLOT_MAP = Object.fromEntries(
  WEBSITE_IMAGE_SLOTS.map((slot) => [slot.key, slot]),
) as Record<WebsiteImageKey, WebsiteImageSlotDefinition>

export const CATEGORY_IMAGE_KEYS: Record<string, WebsiteImageKey> = {
  granola: 'home-cat-granola',
  cupcakes: 'home-cat-cupcakes',
  cookies: 'home-cat-cookies',
  'gift-boxes': 'home-cat-giftbox',
}
