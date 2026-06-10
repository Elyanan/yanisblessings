import { deliveryConfig, getDeliveryZone } from '@/lib/delivery'
import { telegramCustomerUrl } from '@/lib/telegram'

const BUSINESS_PHONE = '+251988235153'
const DEFAULT_OWNER_EMAIL = 'contact@yanisblessings.com'
const DEFAULT_TELEGRAM_URL = 'https://t.me/+251988235153'

const defaultZone = getDeliveryZone()

export type SiteHours = Record<'en' | 'am', string>

export type SiteConfig = {
  name: string
  phone: string
  phoneDisplay: string
  phoneTel: string
  whatsappNumber: string
  whatsappUrl: string
  telegramUrl: string
  email: string
  emailMailto: string
  location: string
  ownerEmail: string
  deliveryFee: number
  freeDeliveryThreshold: number
  social: {
    instagram: string
    tiktok: string
  }
  hours: {
    weekdays: SiteHours
    saturday: SiteHours
    sunday: SiteHours
  }
}

export const siteConfig: SiteConfig = {
  name: "Yani's Blessings",
  phone: BUSINESS_PHONE,
  phoneDisplay: '0988235153',
  phoneTel: 'tel:+251988235153',
  whatsappNumber: '251988235153',
  whatsappUrl: 'https://wa.me/251988235153',
  telegramUrl:
    telegramCustomerUrl(
      process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? null,
      BUSINESS_PHONE,
    ) ?? DEFAULT_TELEGRAM_URL,
  email: 'contact@yanisblessings.com',
  emailMailto: 'mailto:contact@yanisblessings.com',
  location: 'Addis Ababa, Ethiopia',
  ownerEmail: process.env.OWNER_EMAIL ?? DEFAULT_OWNER_EMAIL,
  deliveryFee: defaultZone.fee,
  freeDeliveryThreshold: deliveryConfig.freeDeliveryThreshold,
  social: {
    instagram: 'https://instagram.com/yanisblessings',
    tiktok: 'https://tiktok.com/@yanis.blessings',
  },
  hours: {
    weekdays: {
      en: 'Monday - Friday: 8:00 AM - 6:00 PM',
      am: 'ሰኞ - አርብ፡ 8:00 ጥዋት - 6:00 ማታ',
    },
    saturday: {
      en: 'Saturday: 9:00 AM - 5:00 PM',
      am: 'ቅዳሜ፡ 9:00 ጥዋት - 5:00 ማታ',
    },
    sunday: {
      en: 'Sunday: 10:00 AM - 3:00 PM',
      am: 'እሁድ፡ 10:00 ጥዋት - 3:00 ማታ',
    },
  },
}

export function whatsappOrderUrl(message: string) {
  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`
}

export function telegramOrderUrl(message: string) {
  const base = siteConfig.telegramUrl
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
