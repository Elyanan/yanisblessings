import { z } from 'zod'
import { NextResponse } from 'next/server'
import { buildRegularOrderEmailParams, sendRegularOrderEmail } from '@/lib/email/order-emails'
import { createOrderDocument } from '@/lib/sanity/queries'
import { siteConfig } from '@/lib/site-config'

const orderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid order data', details: parsed.error.flatten() }, { status: 400 })
    }

    const { customerName, phone, email, address, notes, items } = parsed.data
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = subtotal >= siteConfig.freeDeliveryThreshold ? 0 : siteConfig.deliveryFee
    const total = subtotal + deliveryFee
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
