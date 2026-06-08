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
  if (items.length === 0) {
    return 'Add at least one order item.'
  }

  for (let i = 0; i < items.length; i++) {
    const row = items[i]
    const rowLabel = items.length > 1 ? ` (row ${i + 1})` : ''

    if (!row.name.trim()) {
      return `Item name is required${rowLabel}.`
    }
    if (!Number.isFinite(row.quantity) || row.quantity < 1) {
      return `Quantity must be at least 1${rowLabel}.`
    }
    if (!Number.isFinite(row.price) || row.price <= 0) {
      return `ETB price must be a positive number${rowLabel}.`
    }
  }

  return null
}
