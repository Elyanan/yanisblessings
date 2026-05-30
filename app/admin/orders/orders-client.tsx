'use client'

import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Phone,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RegularOrderDetailSheet } from '@/components/admin/regular-order-detail-sheet'
import { OrderStatusBadge } from '@/components/admin/order-status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ORDER_STATUSES } from '@/lib/order-status'
import { calculateOrderTotals, type OrderLineItem } from '@/lib/order-totals'
import type { SanityMenuItem, SanityOrder } from '@/lib/sanity/types'

const emptyLine = (): OrderLineItem => ({ name: '', quantity: 1, price: 0 })

type Props = {
  initialOrders: SanityOrder[]
  initialMenuItems: SanityMenuItem[]
}

export function AdminOrdersClient({ initialOrders, initialMenuItems }: Props) {
  const [orders, setOrders] = useState(initialOrders)
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<SanityOrder | null>(null)
  const [search, setSearch] = useState('')

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<(typeof ORDER_STATUSES)[number]>('pending')
  const [orderNumber, setOrderNumber] = useState('')
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([emptyLine()])
  const [menuPick, setMenuPick] = useState('')

  const totals = useMemo(() => {
    const valid = lineItems.filter((i) => i.name.trim() && i.quantity > 0)
    return calculateOrderTotals(valid)
  }, [lineItems])

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.orderNumber?.toLowerCase().includes(q) ?? false) ||
        o.email?.toLowerCase().includes(q),
    )
  }, [orders, search])

  const load = async () => {
    setRefreshing(true)
    const [ordersRes, menuRes] = await Promise.all([
      fetch('/api/admin/orders', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/menu', { credentials: 'include' }).then((r) => r.json()),
    ])
    setOrders(ordersRes.orders ?? [])
    setMenuItems(menuRes.items ?? [])
    setRefreshing(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'updateStatus', id, status: newStatus }),
    })
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus as SanityOrder['status'] } : o)),
    )
    setSelectedOrder((prev) =>
      prev?._id === id ? { ...prev, status: newStatus as SanityOrder['status'] } : prev,
    )
  }

  const updateLine = (index: number, field: keyof OrderLineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )
  }

  const addLine = () => setLineItems((prev) => [...prev, emptyLine()])

  const removeLine = (index: number) => {
    setLineItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const addFromMenu = () => {
    if (!menuPick) return
    const item = menuItems.find((m) => m._id === menuPick)
    if (!item) return
    setLineItems((prev) => [
      ...prev.filter((row) => row.name.trim()),
      { name: item.title, quantity: 1, price: item.price },
    ])
    setMenuPick('')
  }

  const resetForm = () => {
    setCustomerName('')
    setPhone('')
    setEmail('')
    setAddress('')
    setNotes('')
    setStatus('pending')
    setOrderNumber('')
    setLineItems([emptyLine()])
    setMenuPick('')
    setEditingId(null)
  }

  const editOrder = (order: SanityOrder) => {
    setCustomerName(order.customerName)
    setPhone(order.phone)
    setEmail(order.email ?? '')
    setAddress(order.address)
    setNotes(order.notes ?? '')
    setStatus(order.status)
    setOrderNumber(order.orderNumber ?? '')
    setLineItems(order.items?.length ? order.items : [emptyLine()])
    setEditingId(order._id)
    setShowForm(true)
    setMessage('')
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order?')) return
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

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const items = lineItems.filter((i) => i.name.trim() && i.quantity > 0)
    if (!customerName.trim() || !phone.trim() || !address.trim() || items.length === 0) {
      setMessage('Fill in customer details and at least one item.')
      setSaving(false)
      return
    }

    const { subtotal, deliveryFee, total } = calculateOrderTotals(items)

    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'saveOrder',
        document: {
          ...(editingId ? { _id: editingId } : {}),
          orderNumber: editingId && orderNumber ? orderNumber : `YB-WA-${Date.now()}`,
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim(),
          notes: notes.trim() || undefined,
          items,
          subtotal,
          deliveryFee,
          total,
          status,
        },
      }),
    })

    setSaving(false)
    const payload = await res.json().catch(() => ({}))

    if (res.ok) {
      setMessage(editingId ? 'Order updated' : 'Order saved')
      resetForm()
      setShowForm(false)
      load()
    } else {
      setMessage(payload.error ?? 'Failed to save order')
    }
  }

  const openEdit = (order: SanityOrder) => {
    setSelectedOrder(null)
    editOrder(order)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Orders</h1>
        <Button onClick={() => {
          if (showForm) {
            resetForm()
            setShowForm(false)
            setMessage('')
          } else {
            resetForm()
            setShowForm(true)
          }
        }}>
          {showForm ? 'Cancel' : 'Add order'}
        </Button>
      </div>

      {refreshing && <p className="text-sm text-muted-foreground">Refreshing...</p>}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit order' : 'Add manual order'}</CardTitle>
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
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Delivery address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" placeholder="e.g. WhatsApp order" />
              </div>

              <div className="space-y-3">
                <Label>Items</Label>
                <div className="flex flex-wrap gap-2">
                  <Select value={menuPick} onValueChange={setMenuPick}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="Add from menu" /></SelectTrigger>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.title} — {item.price} ETB
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={addFromMenu} disabled={!menuPick}>
                    Add item
                  </Button>
                </div>

                {lineItems.map((line, index) => (
                  <div key={index} className="grid grid-cols-[1fr_80px_100px_auto] gap-2 items-end">
                    <div>
                      {index === 0 && <Label className="text-xs text-muted-foreground">Name</Label>}
                      <Input
                        value={line.name}
                        onChange={(e) => updateLine(index, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      {index === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(index, 'quantity', Number(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      {index === 0 && <Label className="text-xs text-muted-foreground">Price (ETB)</Label>}
                      <Input
                        type="number"
                        min={0}
                        value={line.price}
                        onChange={(e) => updateLine(index, 'price', Number(e.target.value) || 0)}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(index)} aria-label="Remove line">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <Plus className="w-4 h-4 mr-1" /> Add line
                </Button>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4 text-sm space-y-1">
                <p className="flex justify-between"><span>Subtotal</span><span>{totals.subtotal.toLocaleString()} ETB</span></p>
                <p className="flex justify-between"><span>Delivery</span><span>{totals.deliveryFee.toLocaleString()} ETB</span></p>
                <p className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                  <span>Total</span><span>{totals.total.toLocaleString()} ETB</span>
                </p>
              </div>

              {message && (
                <p className={`text-sm ${message.includes('saved') || message.includes('updated') ? 'text-green-600' : 'text-destructive'}`}>{message}</p>
              )}
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update order' : 'Save order'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Orders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{orders.length} total · click a card for full details</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
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
                      <div>
                        <p className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.orderNumber || 'No order #'} · {new Date(order._createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <span className="font-semibold text-foreground">{order.total?.toLocaleString()} ETB</span>
                      <Badge variant="secondary" className="text-xs">
                        {(order.items?.length ?? 0)} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setSelectedOrder(order)}
                      aria-label="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(order)} aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
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

      <RegularOrderDetailSheet
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
