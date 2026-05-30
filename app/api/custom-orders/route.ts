import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendCustomOrderEmail } from '@/lib/email/order-emails'
import { createCustomOrderDocument } from '@/lib/sanity/queries'

const customOrderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  productType: z.string().min(1),
  quantity: z.string().optional(),
  preferredDate: z.string().optional(),
  deliveryOption: z.string().optional(),
  deliveryArea: z.string().optional(),
  customMessage: z.string().optional(),
  flavorPreference: z.string().optional(),
  budgetRange: z.string().optional(),
  specialNotes: z.string().optional(),
  attachmentAssetId: z.string().optional(),
  attachmentUrl: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = customOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid custom order data', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const createdAt = new Date()

    try {
      await createCustomOrderDocument({
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || undefined,
        productType: data.productType,
        quantity: data.quantity,
        preferredDate: data.preferredDate,
        deliveryOption: data.deliveryOption,
        deliveryArea: data.deliveryArea,
        customMessage: data.customMessage,
        flavorPreference: data.flavorPreference,
        budgetRange: data.budgetRange,
        specialNotes: data.specialNotes,
        attachmentAssetId: data.attachmentAssetId,
        status: 'pending',
      })
    } catch (error) {
      console.error('[custom-orders] Sanity save failed', error)
    }

    sendCustomOrderEmail({
      ...data,
      email: data.email || undefined,
      attachmentUrl: data.attachmentUrl,
      createdAt,
    }).catch((error) => {
      console.error('[custom-orders] Email notification failed', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[custom-orders] Unexpected error', error)
    return NextResponse.json({ error: 'Failed to process custom order' }, { status: 500 })
  }
}
