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
import { parsePositiveNumber, sanitizeNumericInput } from '@/lib/numeric-input'
import type { OrderLineItem } from '@/lib/order-totals'
import type { SanityCustomOrder } from '@/lib/sanity/types'

type LineDraft = {
  name: string
  quantity: number
  priceInput: string
}

const emptyLine = (): LineDraft => ({ name: '', quantity: 1, priceInput: '' })

function toLineItem(row: LineDraft): OrderLineItem {
  return {
    name: row.name.trim(),
    quantity: Math.floor(Number(row.quantity) || 1),
    price: parsePositiveNumber(row.priceInput) ?? 0,
  }
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: SanityCustomOrder | null
  onConfirm: (items: OrderLineItem[]) => Promise<void>
}

export function DeliverCustomOrderDialog({ open, onOpenChange, order, onConfirm }: Props) {
  const [lineItems, setLineItems] = useState<LineDraft[]>([emptyLine()])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !order) return
    setError('')
    setFieldErrors({})
    setSaving(false)
    if (order.items?.length) {
      setLineItems(
        order.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          priceInput: i.price > 0 ? String(i.price) : '',
        })),
      )
    } else {
      setLineItems([
        {
          name: order.productType || '',
          quantity: 1,
          priceInput: '',
        },
      ])
    }
  }, [open, order])

  const normalizedItems = useMemo(
    () => lineItems.map(toLineItem),
    [lineItems],
  )

  const totals = useMemo(
    () => calculateCustomOrderTotals(normalizedItems),
    [normalizedItems],
  )

  const updateLine = (index: number, field: keyof LineDraft, value: string | number) => {
    setLineItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[`${index}-${field}`]
      return next
    })
  }

  const addLine = () => setLineItems((prev) => [...prev, emptyLine()])

  const removeLine = (index: number) => {
    setLineItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    lineItems.forEach((row, index) => {
      if (!row.name.trim()) {
        errors[`${index}-name`] = 'Item name is required.'
      }
      if (!Number.isFinite(row.quantity) || row.quantity < 1) {
        errors[`${index}-quantity`] = 'Quantity must be at least 1.'
      }
      const price = parsePositiveNumber(row.priceInput)
      if (price === null) {
        errors[`${index}-priceInput`] = 'Enter a valid positive ETB amount.'
      }
    })

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError('Please fix the highlighted fields.')
      return false
    }

    const items = lineItems.map(toLineItem)
    const validationError = validateDeliveredLineItems(items)
    if (validationError) {
      setError(validationError)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const normalized = lineItems
      .map(toLineItem)
      .filter((i) => i.name.trim() && i.quantity > 0 && i.price > 0)

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
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
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
            {lineItems.map((line, index) => {
              const price = parsePositiveNumber(line.priceInput) ?? 0
              const lineTotal = price * (line.quantity || 0)

              return (
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
                      aria-invalid={!!fieldErrors[`${index}-name`]}
                    />
                    {fieldErrors[`${index}-name`] && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors[`${index}-name`]}</p>
                    )}
                  </div>
                  <div>
                    {index === 0 && <Label className="text-xs text-muted-foreground mb-1 block">Qty</Label>}
                    <Input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => updateLine(index, 'quantity', Number(e.target.value) || 1)}
                      aria-invalid={!!fieldErrors[`${index}-quantity`]}
                    />
                    {fieldErrors[`${index}-quantity`] && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors[`${index}-quantity`]}</p>
                    )}
                  </div>
                  <div>
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground mb-1 block">ETB</Label>
                    )}
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={line.priceInput}
                      onChange={(e) =>
                        updateLine(index, 'priceInput', sanitizeNumericInput(e.target.value))
                      }
                      placeholder="0"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-invalid={!!fieldErrors[`${index}-priceInput`]}
                    />
                    {fieldErrors[`${index}-priceInput`] && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors[`${index}-priceInput`]}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                    <p className="text-sm font-medium text-foreground sm:hidden">
                      {lineTotal.toLocaleString()} ETB
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
                    Line total: {lineTotal.toLocaleString()} ETB
                  </p>
                </div>
              )
            })}
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
