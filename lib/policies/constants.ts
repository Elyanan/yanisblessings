import { siteConfig } from '@/lib/site-config'

export const POLICY_LAST_UPDATED = 'May 29, 2026'

export const policySite = {
  name: siteConfig.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanisblessings.com',
  email: siteConfig.email,
  phone: siteConfig.phoneDisplay,
  location: siteConfig.location,
} as const

/** Placeholders — update in site settings or env when ready */
export const policyPlaceholders = {
  bankAccount: '[BANK ACCOUNT NAME AND NUMBER — add when ready]',
  telebirr: '[TELEBIRR NUMBER — add when ready]',
  deliveryAreas: '[DELIVERY AREAS IN ADDIS ABABA — add when ready]',
  pickupAddress: '[PICKUP LOCATION / ADDRESS — add when ready]',
  cancellationHoursStandard: '24',
  cancellationHoursCustom: '48–72',
} as const
