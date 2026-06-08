import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/order-status'

const styles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 border-sky-200',
  delivered: 'bg-emerald-100 text-emerald-900 border-emerald-200',
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
