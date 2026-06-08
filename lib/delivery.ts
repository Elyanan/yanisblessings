/**
 * Delivery fee configuration.
 * Add zones with area names when area-based pricing is ready.
 */
export type DeliveryZone = {
  id: string
  name: string
  fee: number
  /** Optional area labels matched against customer delivery area (future use). */
  areas?: string[]
}

export const deliveryConfig = {
  /** Orders at or above this subtotal receive free delivery. */
  freeDeliveryThreshold: 5000,
  defaultZoneId: 'default',
  zones: [
    {
      id: 'default',
      name: 'Standard delivery',
      fee: 100,
    },
    // Example for future area-based fees:
    // { id: 'bole', name: 'Bole', fee: 150, areas: ['Bole', 'Bole Bulbula'] },
  ] satisfies DeliveryZone[],
}

export function getDeliveryZone(zoneId?: string): DeliveryZone {
  const id = zoneId ?? deliveryConfig.defaultZoneId
  const zone = deliveryConfig.zones.find((z) => z.id === id) ?? deliveryConfig.zones[0]
  return { ...zone }
}

export function getDeliveryFee(subtotal: number, zoneId?: string): number {
  if (subtotal >= deliveryConfig.freeDeliveryThreshold) return 0
  return getDeliveryZone(zoneId).fee
}

export function calculateDeliveryTotals(subtotal: number, zoneId?: string) {
  const deliveryFee = getDeliveryFee(subtotal, zoneId)
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  }
}
