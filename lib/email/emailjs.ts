import { siteConfig } from '@/lib/site-config'

type SendEmailJsOptions = {
  templateId: string
  templateParams: Record<string, string>
}

export async function sendEmailJs({ templateId, templateParams }: SendEmailJsOptions) {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !publicKey || !privateKey || !templateId) {
    console.warn('[email] EmailJS not configured — set EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, and template IDs')
    return { success: false, skipped: true as const }
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: siteConfig.ownerEmail,
          reply_to: templateParams.customer_email || templateParams.email || siteConfig.email,
          ...templateParams,
        },
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `EmailJS responded with ${response.status}`)
    }

    console.info('[email] EmailJS sent', { templateId, subject: templateParams.subject })
    return { success: true as const }
  } catch (error) {
    console.error('[email] EmailJS failed', error)
    return { success: false as const, error }
  }
}

export function getEmailJsTemplateId(kind: 'order' | 'customOrder' | 'contact') {
  if (kind === 'contact') {
    return process.env.EMAILJS_TEMPLATE_CONTACT ?? ''
  }
  // Menu orders and custom orders share one template (EmailJS free tier limit)
  return process.env.EMAILJS_TEMPLATE_ORDERS ?? process.env.EMAILJS_TEMPLATE_ORDER ?? ''
}
