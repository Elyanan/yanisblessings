import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email/order-emails'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
})

export async function POST(request: Request) {
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
