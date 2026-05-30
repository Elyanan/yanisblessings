'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import {
  Calendar,
  Cake,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Sparkles,
  Trash2,
  User,
  Wallet,
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
import { ORDER_STATUSES } from '@/lib/order-status'
import { whatsappOrderUrl } from '@/lib/site-config'
import type { SanityCustomOrder } from '@/lib/sanity/types'
import { OrderStatusBadge } from './order-status-badge'
import { CopyField } from './copy-field'

type Props = {
  order: SanityCustomOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => void
  onEdit: (order: SanityCustomOrder) => void
  onDelete: (id: string) => void
}

function DetailBlock({ icon: Icon, label, children }: { icon: typeof User; label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </p>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  )
}

export function CustomOrderDetailSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
  onEdit,
  onDelete,
}: Props) {
  if (!order) return null

  const attachmentUrl = order.attachment?.asset?.url
  const whatsappText = [
    `Hi ${order.customerName},`,
    '',
    `Regarding your custom order for ${order.productType} at Yani's Blessings.`,
  ].join('\n')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-6 pt-6 pb-8">
          <SheetHeader className="text-left space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="font-serif text-2xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Custom order
                </SheetTitle>
                <SheetDescription className="text-primary-foreground/80">
                  {new Date(order._createdAt).toLocaleString('en-ET', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'Africa/Addis_Ababa',
                  })}
                </SheetDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <Select value={order.status} onValueChange={(v) => onStatusChange(order._id, v)}>
              <SelectTrigger className="w-full bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                <SelectValue />
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

        <div className="px-6 py-6 space-y-6 -mt-4">
          <div className="rounded-2xl border bg-card shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Cake className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Product type</p>
                <p className="font-serif text-xl font-semibold text-foreground">{order.productType}</p>
              </div>
            </div>
            {order.quantity && (
              <p className="text-sm text-muted-foreground">
                Quantity: <span className="font-medium text-foreground">{order.quantity}</span>
              </p>
            )}
          </div>

          <section className="rounded-2xl border bg-card shadow-sm p-4 space-y-3">
            <h3 className="font-serif font-semibold text-lg flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Customer
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <CopyField label="Name" value={order.customerName} />
              <CopyField label="Phone" value={order.phone} href={`tel:${order.phone.replace(/\s/g, '')}`} />
              <CopyField label="Email" value={order.email ?? ''} href={order.email ? `mailto:${order.email}` : undefined} className="sm:col-span-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-full" asChild>
                <a href={`tel:${order.phone.replace(/\s/g, '')}`}>
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </Button>
              <Button size="sm" className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white border-0" asChild>
                <a href={whatsappOrderUrl(whatsappText)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {order.preferredDate && (
              <DetailBlock icon={Calendar} label="Preferred date">
                {new Date(order.preferredDate).toLocaleDateString('en-ET', { dateStyle: 'long' })}
              </DetailBlock>
            )}
            {order.deliveryOption && (
              <DetailBlock icon={MapPin} label="Delivery">
                <span className="capitalize">{order.deliveryOption}</span>
                {order.deliveryArea && (
                  <p className="mt-1 text-muted-foreground">{order.deliveryArea}</p>
                )}
              </DetailBlock>
            )}
            {order.budgetRange && (
              <DetailBlock icon={Wallet} label="Budget">
                {order.budgetRange}
              </DetailBlock>
            )}
            {order.flavorPreference && (
              <DetailBlock icon={Sparkles} label="Flavor preference">
                {order.flavorPreference}
              </DetailBlock>
            )}
          </section>

          {order.customMessage && (
            <DetailBlock icon={MessageCircle} label="Custom message">
              {order.customMessage}
            </DetailBlock>
          )}

          {order.specialNotes && (
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4">
              <p className="text-xs font-medium text-amber-900 uppercase tracking-wide mb-2">Special notes</p>
              <p className="text-sm text-amber-950/90 leading-relaxed">{order.specialNotes}</p>
            </div>
          )}

          {attachmentUrl && (
            <section className="rounded-2xl border overflow-hidden bg-card shadow-sm">
              <p className="px-4 py-2 text-sm font-medium border-b bg-muted/40">Inspiration image</p>
              <div className="relative aspect-video w-full bg-muted">
                <Image src={attachmentUrl} alt="Customer inspiration" fill className="object-contain" sizes="(max-width: 512px) 100vw" />
              </div>
              <div className="p-3">
                <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                  <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">
                    Open full image
                  </a>
                </Button>
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-2 pb-4">
            <Button variant="outline" className="rounded-full" onClick={() => onEdit(order)}>
              <Pencil className="w-4 h-4 mr-1" />
              Edit order
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
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
