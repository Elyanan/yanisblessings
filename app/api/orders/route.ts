import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendRegularOrderEmail } from '@/lib/email/order-emails'
import { createOrderDocument } from '@/lib/sanity/queries'
import { calculateDeliveryTotals } from '@/lib/delivery'
import { rejectIfBadOrigin } from '@/lib/security/public-api'
import {
  addressField,
  customerNameField,
  emailField,
  notesField,
  phoneField,
} from '@/lib/security/validation'

const orderSchema = z.object({
  customerName: customerNameField,
  phone: phoneField,
  email: emailField,
  address: addressField,
  notes: notesField,
  items: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    quantity: z.number().int().min(1).max(99),
    price: z.number().min(0).max(1_000_000),
  })).min(1).max(50),
})

export async function POST(request: Request) {
  const originError = rejectIfBadOrigin(request)
  if (originError) return originError

  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order data', details: parsed.error.flatten() }, { status: 400 })
    }

    const { customerName, phone, email, address, notes, items } = parsed.data
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const { deliveryFee, total } = calculateDeliveryTotals(subtotal)
    const createdAt = new Date()
    const orderNumber = `YB-${Date.now()}`

    try {
      await createOrderDocument({
        orderNumber,
        customerName,
        phone,
        email: email || undefined,
        address,
        notes,
        items,
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
      })
    } catch (error) {
      console.error('[orders] Sanity save failed', error)
    }

    sendRegularOrderEmail({
      customerName,
      phone,
      email: email || undefined,
      address,
      items,
      notes,
      subtotal,
      deliveryFee,
      total,
      createdAt,
      orderNumber,
    }).catch((error) => {
      console.error('[orders] Email notification failed', error)
    })

    return NextResponse.json({ success: true, orderNumber, total })
  } catch (error) {
    console.error('[orders] Unexpected error', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
