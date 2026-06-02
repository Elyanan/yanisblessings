import type { OrderLineItem } from '@/lib/order-totals'

/** Custom delivered orders: total is the sum of line items (no delivery fee). */
export function calculateCustomOrderTotals(items: OrderLineItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return {
    subtotal,
    deliveryFee: 0,
    total: subtotal,
  }
}

export function validateDeliveredLineItems(items: OrderLineItem[]): string | null {
  const valid = items.filter((i) => i.name.trim() && i.quantity > 0 && i.price >= 0)
  if (valid.length === 0) {
    return 'Add at least one item with a name, quantity, and unit price.'
  }
  return null
}
