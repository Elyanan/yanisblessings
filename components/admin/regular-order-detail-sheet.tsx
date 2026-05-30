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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ORDER_STATUSES } from '@/lib/order-status'
import { whatsappOrderUrl } from '@/lib/site-config'
import type { SanityOrder } from '@/lib/sanity/types'
import { OrderStatusBadge } from './order-status-badge'
import { CopyField } from './copy-field'

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
      <SheetContent className="w-full max-w-[100vw] overflow-y-auto p-0 sm:max-w-lg">
        <div className="bg-gradient-to-br from-chocolate to-chocolate/90 text-cream px-4 pt-6 pb-8 sm:px-6">
          <SheetHeader className="text-left space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="font-serif text-xl sm:text-2xl text-cream">
                  {order.orderNumber || 'Order'}
                </SheetTitle>
                <SheetDescription className="text-cream/70">
                  {new Date(order._createdAt).toLocaleString('en-ET', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'Africa/Addis_Ababa',
                  })}
                </SheetDescription>
              </div>
              <OrderStatusBadge status={order.status} className="shrink-0 border-cream/20" />
            </div>
            <Select value={order.status} onValueChange={(v) => onStatusChange(order._id, v)}>
              <SelectTrigger className="w-full bg-cream/10 border-cream/30 text-cream">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SheetHeader>
        </div>

        <div className="px-4 py-6 space-y-6 -mt-4 sm:px-6">
          <section className="rounded-2xl border bg-card shadow-sm p-4 space-y-3">
            <h3 className="font-serif font-semibold text-lg flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Customer
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <CopyField label="Name" value={order.customerName} />
              <CopyField label="Phone" value={order.phone} href={`tel:${order.phone.replace(/\s/g, '')}`} />
              <CopyField label="Email" value={order.email ?? ''} href={order.email ? `mailto:${order.email}` : undefined} className="sm:col-span-2" />
              <CopyField label="Address" value={order.address} className="sm:col-span-2" />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
              <Button size="sm" variant="outline" className="rounded-full w-full sm:w-auto" asChild>
                <a href={`tel:${order.phone.replace(/\s/g, '')}`}>
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </Button>
              <Button size="sm" className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 w-full sm:w-auto" asChild>
                <a href={whatsappOrderUrl(whatsappText)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-semibold">Order items</h3>
              <span className="text-xs text-muted-foreground ml-auto">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <ul className="divide-y">
              {items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {item.price.toLocaleString()} ETB
                    </p>
                  </div>
                  <p className="font-semibold text-foreground shrink-0">
                    {(item.quantity * item.price).toLocaleString()} ETB
                  </p>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 bg-secondary/30 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{order.subtotal?.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `${order.deliveryFee?.toLocaleString()} ETB`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-serif text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">{order.total?.toLocaleString()} ETB</span>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4">
              <h3 className="font-medium flex items-center gap-2 text-amber-900 mb-2">
                <StickyNote className="w-4 h-4" />
                Notes
              </h3>
              <p className="text-sm text-amber-950/90 leading-relaxed">{order.notes}</p>
            </section>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2 pb-4 px-4 sm:px-6">
            <Button variant="outline" className="rounded-full w-full sm:w-auto" onClick={() => onEdit(order)}>
              <Pencil className="w-4 h-4 mr-1" />
              Edit order
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              onClick={() => onDelete(order._id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
