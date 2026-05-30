import { siteConfig } from '@/lib/site-config'
import { getEmailJsTemplateId, sendEmailJs } from './emailjs'

export type OrderEmailItem = {
  name: string
  quantity: number
  price: number
}

export type RegularOrderEmailData = {
  customerName: string
  phone: string
  email?: string
  address: string
  items: OrderEmailItem[]
  notes?: string
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: Date
  orderNumber?: string
}

export type CustomOrderEmailData = {
  customerName: string
  phone: string
  email?: string
  productType: string
  quantity?: string
  preferredDate?: string
  deliveryOption?: string
  deliveryArea?: string
  customMessage?: string
  flavorPreference?: string
  budgetRange?: string
  specialNotes?: string
  attachmentUrl?: string
  createdAt: Date
}

export type ContactEmailData = {
  name: string
  email?: string
  phone: string
  subject: string
  message: string
  createdAt: Date
}

function formatCurrency(amount: number) {
  return `${amount.toLocaleString()} ETB`
}

function formatDateTime(date: Date) {
  return date.toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' })
}

function line(label: string, value: string) {
  return `${label}: ${value || '—'}`
}

export function buildRegularOrderEmailParams(data: RegularOrderEmailData) {
  const itemsText = data.items
    .map((item) => `• ${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
    .join('\n')

  const message = [
    'A new order has been placed on the website.',
    '',
    line('Order #', data.orderNumber ?? '—'),
    line('Customer', data.customerName),
    line('Phone', data.phone),
    line('Email', data.email ?? 'Not provided'),
    line('Address', data.address),
    line('Notes', data.notes ?? 'None'),
    line('Date', formatDateTime(data.createdAt)),
    '',
    'ORDER ITEMS',
    itemsText,
    '',
    line('Subtotal', formatCurrency(data.subtotal)),
    line('Delivery', data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee)),
    line('Total', formatCurrency(data.total)),
  ].join('\n')

  return {
    subject: `New Order — ${data.customerName}`,
    order_type: 'Menu order',
    customer_name: data.customerName,
    customer_phone: data.phone,
    customer_email: data.email ?? 'Not provided',
    order_number: data.orderNumber ?? '',
    address: data.address,
    notes: data.notes ?? '',
    order_items: itemsText,
    subtotal: formatCurrency(data.subtotal),
    delivery_fee: data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee),
    total: formatCurrency(data.total),
    created_at: formatDateTime(data.createdAt),
    message,
  }
}

export function buildCustomOrderEmailParams(data: CustomOrderEmailData) {
  const message = [
    'A new custom order request has been submitted.',
    '',
    line('Customer', data.customerName),
    line('Phone', data.phone),
    line('Email', data.email ?? 'Not provided'),
    line('Product Type', data.productType),
    line('Quantity', data.quantity ?? '—'),
    line('Preferred Date', data.preferredDate ?? '—'),
    line('Delivery Option', data.deliveryOption ?? '—'),
    line('Delivery Area', data.deliveryArea ?? '—'),
    line('Custom Message', data.customMessage ?? '—'),
    line('Flavor Preference', data.flavorPreference ?? '—'),
    line('Budget Range', data.budgetRange ?? '—'),
    line('Special Notes', data.specialNotes ?? '—'),
    line('Attachment', data.attachmentUrl ?? '—'),
    line('Date', formatDateTime(data.createdAt)),
  ].join('\n')

  return {
    subject: `New Custom Order — ${data.customerName}`,
    order_type: 'Custom order',
    customer_name: data.customerName,
    customer_phone: data.phone,
    customer_email: data.email ?? 'Not provided',
    product_type: data.productType,
    quantity: data.quantity ?? '',
    preferred_date: data.preferredDate ?? '',
    delivery_option: data.deliveryOption ?? '',
    delivery_area: data.deliveryArea ?? '',
    custom_message: data.customMessage ?? '',
    flavor_preference: data.flavorPreference ?? '',
    budget_range: data.budgetRange ?? '',
    special_notes: data.specialNotes ?? '',
    attachment_url: data.attachmentUrl ?? '',
    created_at: formatDateTime(data.createdAt),
    message,
  }
}

export function buildContactEmailParams(data: ContactEmailData) {
  const message = [
    'A new contact form message was received.',
    '',
    line('Name', data.name),
    line('Phone', data.phone),
    line('Email', data.email ?? 'Not provided'),
    line('Subject', data.subject),
    line('Message', data.message),
    line('Date', formatDateTime(data.createdAt)),
  ].join('\n')

  return {
    subject: `Contact: ${data.subject} — ${data.name}`,
    customer_name: data.name,
    customer_phone: data.phone,
    customer_email: data.email ?? 'Not provided',
    contact_subject: data.subject,
    contact_message: data.message,
    created_at: formatDateTime(data.createdAt),
    message,
  }
}

/** @deprecated Use buildRegularOrderEmailParams — kept for compatibility */
export function buildRegularOrderEmail(data: RegularOrderEmailData) {
  const params = buildRegularOrderEmailParams(data)
  return { subject: params.subject, html: params.message.replace(/\n/g, '<br>') }
}

/** @deprecated Use buildCustomOrderEmailParams */
export function buildCustomOrderEmail(data: CustomOrderEmailData) {
  const params = buildCustomOrderEmailParams(data)
  return { subject: params.subject, html: params.message.replace(/\n/g, '<br>') }
}

/** @deprecated Use buildContactEmailParams */
export function buildContactEmail(data: ContactEmailData) {
  const params = buildContactEmailParams(data)
  return { subject: params.subject, html: params.message.replace(/\n/g, '<br>') }
}

export async function sendRegularOrderEmail(data: RegularOrderEmailData) {
  const templateId = getEmailJsTemplateId('order')
  return sendEmailJs({ templateId, templateParams: buildRegularOrderEmailParams(data) })
}

export async function sendCustomOrderEmail(data: CustomOrderEmailData) {
  const templateId = getEmailJsTemplateId('order')
  return sendEmailJs({ templateId, templateParams: buildCustomOrderEmailParams(data) })
}

export async function sendContactEmail(data: ContactEmailData) {
  const templateId = getEmailJsTemplateId('contact')
  return sendEmailJs({ templateId, templateParams: buildContactEmailParams(data) })
}

/** Sends owner notification via EmailJS */
export async function sendOwnerEmail(subject: string, htmlOrText: string) {
  const templateId = getEmailJsTemplateId('order') || getEmailJsTemplateId('contact')
  if (!templateId) {
    return sendEmailJs({
      templateId: process.env.EMAILJS_TEMPLATE_ORDER ?? '',
      templateParams: { subject, message: htmlOrText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '') },
    })
  }
  return sendEmailJs({
    templateId,
    templateParams: { subject, message: htmlOrText.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '') },
  })
}
