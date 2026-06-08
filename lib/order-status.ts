export const ORDER_STATUSES = ['pending', 'confirmed', 'delivered'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
