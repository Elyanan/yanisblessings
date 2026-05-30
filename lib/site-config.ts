export const siteConfig = {
  name: "Yani's Blessings",
  phone: '+251926773391',
  phoneDisplay: '+251 926 773 391',
  phoneTel: 'tel:+251926773391',
  whatsappNumber: '251926773391',
  whatsappUrl: 'https://wa.me/251926773391',
  email: 'hello@yanisblessings.com',
  emailMailto: 'mailto:hello@yanisblessings.com',
  location: 'Addis Ababa, Ethiopia',
  ownerEmail: process.env.OWNER_EMAIL ?? 'hello@yanisblessings.com',
  deliveryFee: 100,
  freeDeliveryThreshold: 1000,
  social: {
    instagram: 'https://instagram.com/yanisblessings',
    facebook: 'https://facebook.com/yanisblessings',
  },
  hours: {
    weekdays: { en: 'Monday - Friday: 8:00 AM - 6:00 PM', am: 'ሰኞ - አርብ፡ 8:00 ጥዋት - 6:00 ማታ' },
    saturday: { en: 'Saturday: 9:00 AM - 5:00 PM', am: 'ቅዳሜ፡ 9:00 ጥዋት - 5:00 ማታ' },
    sunday: { en: 'Sunday: 10:00 AM - 3:00 PM', am: 'እሁድ፡ 10:00 ጥዋት - 3:00 ማታ' },
  },
} as const

export function whatsappOrderUrl(message: string) {
  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`
}
