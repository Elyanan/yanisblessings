import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ORDER_STATUSES } from '@/lib/order-status'
import { calculateOrderTotals, type OrderLineItem } from '@/lib/order-totals'
import { deleteDocument, deliverCustomOrder, mutateCategory, mutateMenuItem, mutateOrder, mutateCustomOrder, updateDocumentStatus } from '@/lib/sanity/queries'
import type { SanityOrder } from '@/lib/sanity/types'

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { action, id, status, document } = body

  try {
    if (action === 'updateStatus' && id && status) {
      if (status === 'delivered' && body.documentType === 'customOrder') {
        return NextResponse.json(
          {
            error:
              'Custom orders must be marked delivered with final line items. Use the delivery form in the admin panel.',
          },
          { status: 400 },
        )
      }
      await updateDocumentStatus(id, status)
      return NextResponse.json({ success: true })
    }

    if (action === 'deliverCustomOrder' && id && Array.isArray(body.items)) {
      const items = body.items as OrderLineItem[]
      const result = await deliverCustomOrder(id, items)
      return NextResponse.json({ success: true, result })
    }

    if (action === 'saveMenuItem' && document) {
      const result = await mutateMenuItem(document)
      return NextResponse.json({ success: true, result })
    }

    if (action === 'saveCategory' && document) {
      const result = await mutateCategory(document)
      return NextResponse.json({ success: true, result })
    }

    if (action === 'saveOrder' && document) {
      const items = (document.items as OrderLineItem[]) ?? []
      const { subtotal, deliveryFee, total } = calculateOrderTotals(items)
      const status = ORDER_STATUSES.includes(document.status)
        ? document.status
        : 'pending'

      const orderPayload: Omit<SanityOrder, '_id' | '_createdAt'> & { _id?: string } = {
        orderNumber: (document.orderNumber as string) || `YB-WA-${Date.now()}`,
        customerName: document.customerName as string,
        phone: document.phone as string,
        email: document.email as string | undefined,
        address: document.address as string,
        notes: document.notes as string | undefined,
        items,
        subtotal,
        deliveryFee,
        total,
        status,
      }
      if (typeof document._id === 'string') {
        orderPayload._id = document._id
      }

      const result = await mutateOrder(orderPayload)
      return NextResponse.json({ success: true, result })
    }

    if (action === 'saveCustomOrder' && document) {
      const status = ORDER_STATUSES.includes(document.status)
        ? document.status
        : 'pending'

      if (status === 'delivered') {
        return NextResponse.json(
          {
            error:
              'Cannot save custom orders as delivered without line items. Use deliverCustomOrder from the order details panel.',
          },
          { status: 400 },
        )
      }

      const result = await mutateCustomOrder({
        _id: document._id as string | undefined,
        customerName: document.customerName as string,
        phone: document.phone as string,
        email: document.email as string | undefined,
        productType: document.productType as string,
        quantity: document.quantity as string | undefined,
        preferredDate: document.preferredDate as string | undefined,
        deliveryOption: document.deliveryOption as string | undefined,
        deliveryArea: document.deliveryArea as string | undefined,
        customMessage: document.customMessage as string | undefined,
        flavorPreference: document.flavorPreference as string | undefined,
        budgetRange: document.budgetRange as string | undefined,
        specialNotes: document.specialNotes as string | undefined,
        attachmentAssetId: document.attachmentAssetId as string | undefined,
        status,
      })
      return NextResponse.json({ success: true, result })
    }

    if (action === 'delete' && id) {
      await deleteDocument(id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[admin/api] Mutation failed', error)
    let message = error instanceof Error ? error.message : 'Mutation failed'
    if (message.includes('permission "create" required') || message.includes('permission "update" required')) {
      message =
        'Your SANITY_API_TOKEN is read-only. At sanity.io/manage → API → Tokens, create a new token with Editor (or Developer) role for project bwoxbrpd, replace SANITY_API_TOKEN in .env.local, and restart the dev server.'
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}