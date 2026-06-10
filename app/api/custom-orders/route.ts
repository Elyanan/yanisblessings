import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendCustomOrderEmail } from '@/lib/email/order-emails'
import { createCustomOrderDocument } from '@/lib/sanity/queries'
import { rejectIfBadOrigin } from '@/lib/security/public-api'
import {
  customerNameField,
  emailField,
  phoneField,
  shortTextField,
} from '@/lib/security/validation'

const customOrderSchema = z.object({
  customerName: customerNameField,
  phone: phoneField,
  email: emailField,
  productType: z.string().trim().min(1).max(200),
  quantity: shortTextField,
  preferredDate: shortTextField,
  deliveryOption: shortTextField,
  deliveryArea: shortTextField,
  customMessage: z.string().trim().max(2000).optional(),
  flavorPreference: shortTextField,
  budgetRange: shortTextField,
  specialNotes: z.string().trim().max(2000).optional(),
  attachmentAssetId: z.string().trim().max(100).optional(),
  attachmentUrl: z.string().url().max(500).optional(),
})

export async function POST(request: Request) {
  const originError = rejectIfBadOrigin(request)
  if (originError) return originError

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
