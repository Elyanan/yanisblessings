import { Resend } from 'resend'

export const ORDERS_INBOX = process.env.ORDERS_EMAIL ?? 'orders@yanisblessings.com'
export const CONTACT_INBOX = process.env.CONTACT_EMAIL ?? 'contact@yanisblessings.com'

const DEFAULT_FROM = "Yani's Blessings <noreply@yanisblessings.com>"
const SANDBOX_FROM = "Yani's Blessings <onboarding@resend.dev>"

function resolveFromAddress(): string {
  if (process.env.RESEND_SANDBOX === 'true') {
    return SANDBOX_FROM
  }
  return process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM
}

export type SendEmailOptions = {
  to?: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (!resendClient) {
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

export async function sendEmail({
  to = ORDERS_INBOX,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions) {
  const client = getResendClient()
  if (!client) {
    console.warn('[email] Resend not configured — set RESEND_API_KEY')
    return { success: false as const, error: 'not_configured' }
  }

  const from = resolveFromAddress()
  const recipients = Array.isArray(to) ? to : [to]

  const { data, error } = await client.emails.send({
    from,
    to: recipients,
    subject,
    html,
    text,
    replyTo,
  })

  if (error) {
    const hint =
      error.message?.includes('domain is not verified')
        ? ' Verify yanisblessings.com at https://resend.com/domains, or set RESEND_SANDBOX=true in .env.local for local testing with onboarding@resend.dev'
        : ''
    console.error('[email] Resend failed', error, hint)
    throw new Error(`${error.message}${hint}`)
  }

  console.info('[email] Resend sent', { subject, to: recipients, id: data?.id })
  return { success: true as const, id: data?.id }
}
