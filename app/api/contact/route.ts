import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email/order-emails'
import { rejectIfBadOrigin } from '@/lib/security/public-api'
import {
  customerNameField,
  emailField,
  messageField,
  phoneField,
  subjectField,
} from '@/lib/security/validation'

const contactSchema = z.object({
  name: customerNameField,
  email: emailField,
  phone: phoneField,
  subject: subjectField,
  message: messageField,
})

export async function POST(request: Request) {
  const originError = rejectIfBadOrigin(request)
  if (originError) return originError

  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const { name, email, phone, subject, message } = parsed.data
    sendContactEmail({
      name,
      email: email || undefined,
      phone,
      subject,
      message,
      createdAt: new Date(),
    }).catch((err) => {
      console.error('[contact] Email failed', err)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] Error', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
