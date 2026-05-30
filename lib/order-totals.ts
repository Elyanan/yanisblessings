import { siteConfig } from '@/lib/site-config'

export type OrderLineItem = {
  name: string
  quantity: number
  price: number
}

export function calculateOrderTotals(items: OrderLineItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee =
    subtotal >= siteConfig.freeDeliveryThreshold ? 0 : siteConfig.deliveryFee
  const total = subtotal + deliveryFee

  return { subtotal, deliveryFee, total }
}
