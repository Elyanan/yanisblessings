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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { whatsappOrderUrl } from '@/lib/site-config'
import type { SanityCustomOrder } from '@/lib/sanity/types'
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
  order: SanityCustomOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: string) => void
  onEdit: (order: SanityCustomOrder) => void
  onDelete: (id: string) => void
}

function DetailBlock({ icon: Icon, label, children }: { icon: typeof User; label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/25 p-3.5 ring-1 ring-black/[0.02] sm:p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </p>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
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
      <SheetContent
        className={`flex w-full max-w-[100vw] flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg ${orderSheetCloseClass}`}
      >
        <div className="relative shrink-0 bg-gradient-to-br from-chocolate via-chocolate to-chocolate/90 px-4 pb-6 pt-12 text-cream sm:px-6 sm:pb-8">
          <SheetHeader className="space-y-4 p-0 text-left">
            <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <SheetTitle className="flex items-center gap-2 font-serif text-xl font-bold text-cream sm:text-2xl">
                  <Sparkles className="h-5 w-5 shrink-0 text-cream" />
                  Custom order
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
          <section className={orderDetailCardClass}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20">
                <Cake className="h-7 w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product type
                </p>
                <p className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                  {order.productType}
                </p>
                {order.quantity && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quantity: <span className="font-medium text-foreground">{order.quantity}</span>
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={`${orderDetailCardClass} space-y-4`}>
            <OrderDetailSectionHeader icon={User} title="Customer" subtitle="Contact details" />
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
            <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-amber-50/40 p-4 shadow-sm sm:p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
                Special notes
              </p>
              <p className="text-sm leading-relaxed text-amber-950/90">{order.specialNotes}</p>
            </section>
          )}

          {attachmentUrl && (
            <section className={`${orderDetailCardClass} overflow-hidden p-0`}>
              <p className="border-b border-border/80 bg-muted/30 px-4 py-2.5 text-sm font-medium sm:px-5">
                Inspiration image
              </p>
              <div className="relative aspect-video w-full bg-muted">
                <Image
                  src={attachmentUrl}
                  alt="Customer inspiration"
                  fill
                  className="object-contain"
                  sizes="(max-width: 512px) 100vw"
                />
              </div>
              <div className="p-3 sm:p-4">
                <Button variant="outline" size="sm" className="h-10 w-full rounded-full" asChild>
                  <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">
                    Open full image
                  </a>
                </Button>
              </div>
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
