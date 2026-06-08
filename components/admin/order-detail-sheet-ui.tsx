'use client'

import type { LucideIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ORDER_STATUSES } from '@/lib/order-status'
import { cn } from '@/lib/utils'

/** Visible close (X) on dark sheet headers */
export const orderSheetCloseClass =
  '[&>button]:absolute [&>button]:top-4 [&>button]:right-4 [&>button]:z-20 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-white/50 [&>button]:bg-white/20 [&>button]:text-white [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:ring-offset-0 [&>button]:transition-colors hover:[&>button]:bg-white/30 hover:[&>button]:text-white focus-visible:[&>button]:ring-2 focus-visible:[&>button]:ring-white/60 [&>button_svg]:size-4'

const statusTriggerClass =
  'w-full h-11 rounded-xl border-2 border-cream/80 bg-cream text-chocolate shadow-md font-medium capitalize hover:bg-cream/95 focus:ring-2 focus:ring-cream/80 focus:ring-offset-2 [&_svg]:!text-chocolate/70 [&_svg]:!opacity-100'

type StatusSelectProps = {
  value: string
  onValueChange: (value: string) => void
  label?: string
  labelClassName?: string
  ringOffsetClass?: string
}

export function OrderStatusSelect({
  value,
  onValueChange,
  label = 'Order status',
  labelClassName = 'text-cream/80',
  ringOffsetClass = 'focus:ring-offset-chocolate',
}: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <label className={cn('text-xs font-semibold uppercase tracking-wider', labelClassName)}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(statusTriggerClass, ringOffsetClass)}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border shadow-lg">
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize font-medium">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type SectionHeaderProps = {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export function OrderDetailSectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}

export const orderDetailBodyClass =
  'flex-1 space-y-5 bg-gradient-to-b from-beige/50 via-background to-background px-4 py-6 pb-8 sm:space-y-6 sm:px-6'

export const orderDetailCardClass =
  'rounded-2xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5'
