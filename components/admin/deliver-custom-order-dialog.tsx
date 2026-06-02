'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateCustomOrderTotals, validateDeliveredLineItems } from '@/lib/custom-order-totals'
import type { OrderLineItem } from '@/lib/order-totals'
import type { SanityCustomOrder } from '@/lib/sanity/types'

const emptyLine = (): OrderLineItem => ({ name: '', quantity: 1, price: 0 })

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: SanityCustomOrder | null
  onConfirm: (items: OrderLineItem[]) => Promise<void>
}

export function DeliverCustomOrderDialog({ open, onOpenChange, order, onConfirm }: Props) {
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([emptyLine()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !order) return
    setError('')
    setSaving(false)
    if (order.items?.length) {
      setLineItems(order.items.map((i) => ({ ...i })))
    } else {
      setLineItems([
        {
          name: order.productType || '',
          quantity: 1,
          price: 0,
        },
      ])
    }
  }, [open, order])

  const totals = useMemo(() => calculateCustomOrderTotals(lineItems), [lineItems])

  const updateLine = (index: number, field: keyof OrderLineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )
  }

  const addLine = () => setLineItems((prev) => [...prev, emptyLine()])

  const removeLine = (index: number) => {
    setLineItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateDeliveredLineItems(lineItems)
    if (validationError) {
      setError(validationError)
      return
    }

    const normalized = lineItems
      .filter((i) => i.name.trim() && i.quantity > 0)
      .map((i) => ({
        name: i.name.trim(),
        quantity: Math.floor(Number(i.quantity) || 1),
        price: Number(i.price) || 0,
      }))

    setSaving(true)
    setError('')
    try {
      await onConfirm(normalized)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save delivery details')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Mark as delivered</DialogTitle>
          <DialogDescription>
            {order ? (
              <>
                Enter final items for <span className="font-medium text-foreground">{order.customerName}</span>.
                Totals are calculated automatically.
              </>
            ) : (
              'Enter final order items before marking as delivered.'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Order items</Label>
            {lineItems.map((line, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 sm:grid-cols-[1fr_72px_96px_auto] sm:items-end"
              >
                <div>
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground sm:sr-only">Item name</Label>
                  )}
                  <Input
                    value={line.name}
                    onChange={(e) => updateLine(index, 'name', e.target.value)}
                    placeholder="Item name"
                    required
                  />
                </div>
                <div>
                  {index === 0 && <Label className="text-xs text-muted-foreground mb-1 block">Qty</Label>}
                  <Input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateLine(index, 'quantity', Number(e.target.value) || 1)}
                    required
                  />
                </div>
                <div>
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground mb-1 block">Unit (ETB)</Label>
                  )}
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={line.price}
                    onChange={(e) => updateLine(index, 'price', Number(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                  <p className="text-sm font-medium text-foreground sm:hidden">
                    {(line.quantity * line.price).toLocaleString()} ETB
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeLine(index)}
                    disabled={lineItems.length <= 1}
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="hidden text-right text-sm font-medium text-muted-foreground sm:col-span-4 sm:block sm:-mt-1">
                  Line total: {(line.quantity * line.price).toLocaleString()} ETB
                </p>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="mr-1 h-4 w-4" />
              Add item
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{totals.subtotal.toLocaleString()} ETB</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-bold text-foreground border-t border-border/60 pt-2">
              <span>Order total</span>
              <span className="text-primary">{totals.total.toLocaleString()} ETB</span>
            </div>
            <p className="text-xs text-muted-foreground">Total is calculated by the system and cannot be edited manually.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
              {saving ? 'Saving…' : 'Save & mark delivered'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
