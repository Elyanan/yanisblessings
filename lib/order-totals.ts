import { calculateDeliveryTotals } from '@/lib/delivery'

export type OrderLineItem = {
  name: string
  quantity: number
  price: number
}

export function calculateOrderTotals(items: OrderLineItem[], deliveryZoneId?: string) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return calculateDeliveryTotals(subtotal, deliveryZoneId)
}
