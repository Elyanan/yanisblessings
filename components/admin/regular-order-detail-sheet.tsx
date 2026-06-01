'use client'

import {
  MessageCircle,
  Package,
  Pencil,
  Phone,
  StickyNote,
  Trash2,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { whatsappOrderUrl } from '@/lib/site-config'
import type { SanityOrder } from '@/lib/sanity/types'
import { OrderStatusBadge } from './order-status-badge'
import { CopyField } from './copy-field'
import {
  orderDetailBodyClass,
  orderDetailCardClass,
  OrderDetailSectionHeader,
  orderSheetCloseClass,
  OrderStatusSelect,
} from './order-detail-sheet-ui'

type Props = {
  order: SanityOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => void
  onEdit: (order: SanityOrder) => void
  onDelete: (id: string) => void
}

export function RegularOrderDetailSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
  onEdit,
  onDelete,
}: Props) {
  if (!order) return null

  const items = order.items ?? []
  const whatsappText = [
    `Hi ${order.customerName},`,
    '',
    `Regarding your order${order.orderNumber ? ` #${order.orderNumber}` : ''} from Yani's Blessings.`,
    `Total: ${order.total?.toLocaleString()} ETB`,
  ].join('\n')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={`flex w-full max-w-[100vw] flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg ${orderSheetCloseClass}`}
      >
        <div className="relative shrink-0 bg-gradient-to-br from-chocolate via-chocolate to-chocolate/90 px-4 pb-6 pt-12 text-cream sm:px-6 sm:pb-8">
          <SheetHeader className="space-y-4 p-0 text-left">
            <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <SheetTitle className="font-serif text-xl font-bold text-cream sm:text-2xl">
                  {order.orderNumber || 'Order'}
                </SheetTitle>
                <SheetDescription className="mt-1 text-sm text-cream/75">
                  {new Date(order._createdAt).toLocaleString('en-ET', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'Africa/Addis_Ababa',
                  })}
                </SheetDescription>
              </div>
              <OrderStatusBadge status={order.status} className="w-fit shrink-0" />
            </div>
            <OrderStatusSelect
              value={order.status}
              onValueChange={(v) => onStatusChange(order._id, v)}
            />
          </SheetHeader>
        </div>

        <div className={orderDetailBodyClass}>
          <section className={`${orderDetailCardClass} space-y-4`}>
            <OrderDetailSectionHeader icon={User} title="Customer" subtitle="Contact & delivery" />
            <div className="grid gap-3 sm:grid-cols-2">
              <CopyField label="Name" value={order.customerName} />
              <CopyField
                label="Phone"
                value={order.phone}
                href={`tel:${order.phone.replace(/\s/g, '')}`}
              />
              <CopyField
                label="Email"
                value={order.email ?? ''}
                href={order.email ? `mailto:${order.email}` : undefined}
                className="sm:col-span-2"
              />
              <CopyField label="Address" value={order.address} className="sm:col-span-2" />
            </div>
            <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row">
              <Button
                size="sm"
                variant="outline"
                className="h-10 w-full rounded-full border-primary/30 sm:w-auto"
                asChild
              >
                <a href={`tel:${order.phone.replace(/\s/g, '')}`}>
                  <Phone className="mr-1.5 h-4 w-4" />
                  Call customer
                </a>
              </Button>
              <Button
                size="sm"
                className="h-10 w-full rounded-full border-0 bg-[#25D366] text-white hover:bg-[#20BD5A] sm:w-auto"
                asChild
              >
                <a href={whatsappOrderUrl(whatsappText)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </section>

          <section className={`${orderDetailCardClass} overflow-hidden p-0`}>
            <div className="flex items-center gap-3 border-b border-border/80 bg-muted/30 px-4 py-3 sm:px-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-semibold text-foreground">Order items</h3>
                <p className="text-xs text-muted-foreground">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
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
                <span>{order.subtotal?.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>
                  {order.deliveryFee === 0 ? (
                    <span className="font-medium text-emerald-700">FREE</span>
                  ) : (
                    `${order.deliveryFee?.toLocaleString()} ETB`
                  )}
                </span>
              </div>
              <Separator className="bg-border/80" />
              <div className="flex justify-between font-serif text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">{order.total?.toLocaleString()} ETB</span>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-amber-50/40 p-4 shadow-sm sm:p-5">
              <h3 className="mb-2 flex items-center gap-2 font-medium text-amber-950">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <StickyNote className="h-4 w-4 text-amber-800" />
                </span>
                Notes
              </h3>
              <p className="text-sm leading-relaxed text-amber-950/90">{order.notes}</p>
            </section>
          )}

          <div className="flex flex-col gap-2 border-t border-border/60 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              variant="outline"
              className="h-11 w-full rounded-full sm:w-auto"
              onClick={() => onEdit(order)}
            >
              <Pencil className="mr-1.5 h-4 w-4" />
              Edit order
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
              onClick={() => onDelete(order._id)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
