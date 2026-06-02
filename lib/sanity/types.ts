import type { OrderStatus } from '@/lib/order-status'

export type { OrderStatus } from '@/lib/order-status'
export { ORDER_STATUSES } from '@/lib/order-status'

export type SanityMenuItem = {
  _id: string
  title: string
  titleAm?: string
  description?: string
  descriptionAm?: string
  price: number
  image?: { asset?: { url?: string } }
  ingredients?: string[]
  category?: { _id: string; title: string; slug?: { current: string } }
  featured?: boolean
  availability?: boolean
  sortOrder?: number
  slug?: { current: string }
}

export type SanityCategory = {
  _id: string
  title: string
  titleAm?: string
  description?: string
  descriptionAm?: string
  image?: { asset?: { url?: string } }
  sortOrder?: number
  slug?: { current: string }
}

export type SanityOrder = {
  _id: string
  _createdAt: string
  orderNumber?: string
  customerName: string
  phone: string
  email?: string
  address: string
  notes?: string
  items: Array<{ name: string; quantity: number; price: number }>
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
}

export type SanityCustomOrder = {
  _id: string
  _createdAt: string
  customerName: string
  phone: string
  email?: string
  productType: string
  quantity?: string
  preferredDate?: string
  deliveryOption?: string
  deliveryArea?: string
  customMessage?: string
  flavorPreference?: string
  budgetRange?: string
  specialNotes?: string
  attachment?: { asset?: { url?: string } }
  status: OrderStatus
  items?: Array<{ name: string; quantity: number; price: number }>
  subtotal?: number
  deliveryFee?: number
  total?: number
  deliveredAt?: string
}
