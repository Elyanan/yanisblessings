import { Package } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { OrderDetailSectionHeader } from '@/components/admin/order-detail-sheet-ui'

type LineItem = { name: string; quantity: number; price: number }

type Props = {
  items: LineItem[]
  subtotal?: number
  deliveryFee?: number
  total?: number
  title?: string
  showDeliveryRow?: boolean
}

export function OrderLineItemsDisplay({
  items,
  subtotal,
  deliveryFee,
  total,
  title = 'Final order items',
  showDeliveryRow = false,
}: Props) {
  const computedSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const displaySubtotal = subtotal ?? computedSubtotal
  const displayTotal = total ?? displaySubtotal

  return (
    <section className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden ring-1 ring-black/[0.03]">
      <div className="border-b border-border/80 bg-muted/30 px-4 py-3 sm:px-5">
        <OrderDetailSectionHeader
          icon={Package}
          title={title}
          subtitle={`${items.length} item${items.length !== 1 ? 's' : ''}`}
        />
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/20 sm:px-5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity} × {item.price.toLocaleString()} ETB
              </p>
            </div>
            <p className="shrink-0 font-semibold text-foreground">
              {(item.quantity * item.price).toLocaleString()} ETB
            </p>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-border/80 bg-gradient-to-br from-beige/40 to-secondary/20 px-4 py-4 text-sm sm:px-5">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{displaySubtotal.toLocaleString()} ETB</span>
        </div>
        {showDeliveryRow && deliveryFee !== undefined && (
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0 ? (
                <span className="font-medium text-emerald-700">FREE</span>
              ) : (
                `${deliveryFee.toLocaleString()} ETB`
              )}
            </span>
          </div>
        )}
        <Separator className="bg-border/80" />
        <div className="flex justify-between font-serif text-lg font-bold text-foreground">
          <span>Total</span>
          <span className="text-primary">{displayTotal.toLocaleString()} ETB</span>
        </div>
      </div>
    </section>
  )
}
