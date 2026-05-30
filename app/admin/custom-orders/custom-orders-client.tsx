'use client'

import { useMemo, useState } from 'react'
import { Pencil, Trash2, Search, Phone, Eye, Cake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ORDER_STATUSES } from '@/lib/order-status'
import type { SanityCustomOrder } from '@/lib/sanity/types'
import { CustomOrderDetailSheet } from '@/components/admin/custom-order-detail-sheet'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { OrderStatusBadge } from '@/components/admin/order-status-badge'

const statuses = [...ORDER_STATUSES]

const productTypes = [
  'Birthday Cake',
  'Custom Cupcakes',
  'Gift Box',
  'Corporate Order',
  'Event Order',
  'Other',
]

const budgetRanges = [
  'Under 2,000 ETB',
  '2,000 - 5,000 ETB',
  '5,000 - 10,000 ETB',
  'Above 10,000 ETB',
]

type Props = {
  initialOrders: SanityCustomOrder[]
}

export function AdminCustomOrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<SanityCustomOrder | null>(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [productType, setProductType] = useState('')
  const [customProductType, setCustomProductType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [deliveryOption, setDeliveryOption] = useState('delivery')
  const [deliveryArea, setDeliveryArea] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [flavorPreference, setFlavorPreference] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [specialNotes, setSpecialNotes] = useState('Manual order')
  const [status, setStatus] = useState<(typeof ORDER_STATUSES)[number]>('pending')

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.productType.toLowerCase().includes(q),
    )
  }, [orders, search])

  const load = async () => {
    const res = await fetch('/api/admin/custom-orders', { credentials: 'include' })
    const data = await res.json()
    setOrders(data.orders ?? [])
  }

  const resetForm = () => {
    setCustomerName('')
    setPhone('')
    setEmail('')
    setProductType('')
    setCustomProductType('')
    setQuantity('')
    setPreferredDate('')
    setDeliveryOption('delivery')
    setDeliveryArea('')
    setCustomMessage('')
    setFlavorPreference('')
    setBudgetRange('')
    setSpecialNotes('')
    setStatus('pending')
    setEditingId(null)
  }

  const editOrder = (order: SanityCustomOrder) => {
    setCustomerName(order.customerName)
    setPhone(order.phone)
    setEmail(order.email ?? '')
    if (productTypes.includes(order.productType)) {
      setProductType(order.productType)
      setCustomProductType('')
    } else {
      setProductType('Other')
      setCustomProductType(order.productType)
    }
    setQuantity(order.quantity ?? '')
    setPreferredDate(order.preferredDate ?? '')
    setDeliveryOption(order.deliveryOption ?? 'delivery')
    setDeliveryArea(order.deliveryArea ?? '')
    setCustomMessage(order.customMessage ?? '')
    setFlavorPreference(order.flavorPreference ?? '')
    setBudgetRange(order.budgetRange ?? '')
    setSpecialNotes(order.specialNotes ?? '')
    setStatus(order.status)
    setEditingId(order._id)
    setShowForm(true)
    setMessage('')
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this custom order?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete', id }),
    })
    if (editingId === id) {
      resetForm()
      setShowForm(false)
    }
    if (selectedOrder?._id === id) setSelectedOrder(null)
    load()
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'updateStatus', id, status: newStatus }),
    })
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: newStatus as SanityCustomOrder['status'] } : o)))
    setSelectedOrder((prev) =>
      prev?._id === id ? { ...prev, status: newStatus as SanityCustomOrder['status'] } : prev,
    )
  }

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const resolvedProductType = productType === 'Other' ? customProductType.trim() : productType
    if (!customerName.trim() || !phone.trim() || !resolvedProductType) {
      setMessage('Fill in customer name, phone, and product type.')
      setSaving(false)
      return
    }

    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'saveCustomOrder',
        document: {
          ...(editingId ? { _id: editingId } : {}),
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          productType: resolvedProductType,
          quantity: quantity.trim() || undefined,
          preferredDate: preferredDate || undefined,
          deliveryOption,
          deliveryArea: deliveryArea.trim() || undefined,
          customMessage: customMessage.trim() || undefined,
          flavorPreference: flavorPreference.trim() || undefined,
          budgetRange: budgetRange || undefined,
          specialNotes: specialNotes.trim() || undefined,
          status,
        },
      }),
    })

    setSaving(false)
    const payload = await res.json().catch(() => ({}))

    if (res.ok) {
      setMessage(editingId ? 'Custom order updated' : 'Custom order saved')
      resetForm()
      setShowForm(false)
      load()
    } else {
      setMessage(payload.error ?? 'Failed to save custom order')
    }
  }

  const openEdit = (order: SanityCustomOrder) => {
    setSelectedOrder(null)
    editOrder(order)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Custom Orders"
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              if (showForm) {
                resetForm()
                setShowForm(false)
                setMessage('')
              } else {
                resetForm()
                setShowForm(true)
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add order'}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit custom order' : 'Add manual custom order'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitOrder} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Customer name</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1" required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" required />
                </div>
                <div>
                  <Label>Email (optional)</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Product type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {productType === 'Other' && (
                  <div>
                    <Label>Custom product type</Label>
                    <Input value={customProductType} onChange={(e) => setCustomProductType(e.target.value)} className="mt-1" required />
                  </div>
                )}
                <div>
                  <Label>Quantity</Label>
                  <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1" placeholder="e.g. 24 cupcakes" />
                </div>
                <div>
                  <Label>Preferred date</Label>
                  <Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Delivery option</Label>
                  <Select value={deliveryOption} onValueChange={setDeliveryOption}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Delivery area</Label>
                  <Input value={deliveryArea} onChange={(e) => setDeliveryArea(e.target.value)} className="mt-1" placeholder="e.g. Bole, Addis Ababa" />
                </div>
                <div>
                  <Label>Budget range</Label>
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select budget" /></SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Flavor preference</Label>
                  <Input value={flavorPreference} onChange={(e) => setFlavorPreference(e.target.value)} className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Custom message</Label>
                <Textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="mt-1" placeholder="Message for cake/box" />
              </div>
              <div>
                <Label>Special notes</Label>
                <Textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="mt-1" />
              </div>

              {message && (
                <p className={`text-sm ${message.includes('saved') || message.includes('updated') ? 'text-green-600' : 'text-destructive'}`}>{message}</p>
              )}
              <Button type="submit" className="w-full sm:w-auto" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update custom order' : 'Save custom order'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Custom Order Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{orders.length} total · click a card for full details</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              {orders.length === 0 ? 'No custom orders yet.' : 'No orders match your search.'}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="group rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedOrder(order)
                      }
                    }}
                    className="text-left cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                          <Cake className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {order.productType}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.customerName}</p>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>
                    {order.preferredDate && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Preferred: {new Date(order.preferredDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
                      <span>{new Date(order._createdAt).toLocaleDateString()}</span>
                      {order.attachment?.asset?.url && (
                        <span className="text-primary font-medium">Has image</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedOrder(order)} aria-label="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(order)} aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteOrder(order._id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomOrderDetailSheet
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onStatusChange={updateStatus}
        onEdit={openEdit}
        onDelete={deleteOrder}
      />
    </div>
  )
}
