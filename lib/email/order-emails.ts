import { CONTACT_INBOX, sendEmail } from './resend'

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string | undefined) {
  const display = value?.trim() ? escapeHtml(value) : '—'
  return `<tr><td style="padding:8px 12px;color:#6B4832;font-weight:600;vertical-align:top;width:160px;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#4A2412;">${display}</td></tr>`
}

function emailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFF7ED;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;border:1px solid #E9D5C3;overflow:hidden;">
        <tr><td style="background:#E9A8A6;padding:24px 32px;">
          <h1 style="margin:0;color:#4A2412;font-size:22px;font-weight:bold;">Yani's Blessings</h1>
          <p style="margin:6px 0 0;color:#4A2412;font-size:14px;opacity:0.85;">${escapeHtml(title)}</p>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 32px;background:#F3E3CF;color:#6B4832;font-size:12px;text-align:center;">
          Addis Ababa, Ethiopia &middot; yanisblessings.com
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildRegularOrderHtml(data: RegularOrderEmailData) {
  const itemsRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #E9D5C3;color:#4A2412;">${escapeHtml(item.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #E9D5C3;color:#4A2412;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #E9D5C3;color:#4A2412;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`,
    )
    .join('')

  const body = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row('Order #', data.orderNumber)}
      ${row('Customer', data.customerName)}
      ${row('Phone', data.phone)}
      ${row('Email', data.email ?? 'Not provided')}
      ${row('Address', data.address)}
      ${row('Notes', data.notes ?? 'None')}
      ${row('Date', formatDateTime(data.createdAt))}
    </table>
    <h2 style="margin:0 0 12px;color:#4A2412;font-size:16px;">Order Items</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E9D5C3;border-radius:8px;margin-bottom:24px;">
      <tr style="background:#F3E3CF;">
        <th style="padding:10px 12px;text-align:left;color:#4A2412;font-size:13px;">Item</th>
        <th style="padding:10px 12px;text-align:center;color:#4A2412;font-size:13px;">Qty</th>
        <th style="padding:10px 12px;text-align:right;color:#4A2412;font-size:13px;">Total</th>
      </tr>
      ${itemsRows}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Subtotal', formatCurrency(data.subtotal))}
      ${row('Delivery', data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee))}
      ${row('Total', formatCurrency(data.total))}
    </table>`

  return emailShell('New Menu Order', body)
}

function buildRegularOrderText(data: RegularOrderEmailData) {
  const itemsText = data.items
    .map((item) => `• ${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
    .join('\n')

  return [
    'A new order has been placed on the website.',
    '',
    `Order #: ${data.orderNumber ?? '—'}`,
    `Customer: ${data.customerName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email ?? 'Not provided'}`,
    `Address: ${data.address}`,
    `Notes: ${data.notes ?? 'None'}`,
    `Date: ${formatDateTime(data.createdAt)}`,
    '',
    'ORDER ITEMS',
    itemsText,
    '',
    `Subtotal: ${formatCurrency(data.subtotal)}`,
    `Delivery: ${data.deliveryFee === 0 ? 'FREE' : formatCurrency(data.deliveryFee)}`,
    `Total: ${formatCurrency(data.total)}`,
  ].join('\n')
}

function buildCustomOrderHtml(data: CustomOrderEmailData) {
  const body = `
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Customer', data.customerName)}
      ${row('Phone', data.phone)}
      ${row('Email', data.email ?? 'Not provided')}
      ${row('Product Type', data.productType)}
      ${row('Quantity', data.quantity)}
      ${row('Preferred Date', data.preferredDate)}
      ${row('Delivery Option', data.deliveryOption)}
      ${row('Delivery Area', data.deliveryArea)}
      ${row('Custom Message', data.customMessage)}
      ${row('Flavor Preference', data.flavorPreference)}
      ${row('Budget Range', data.budgetRange)}
      ${row('Special Notes', data.specialNotes)}
      ${data.attachmentUrl ? row('Attachment', data.attachmentUrl) : ''}
      ${row('Date', formatDateTime(data.createdAt))}
    </table>`

  return emailShell('New Custom Order Request', body)
}

function buildCustomOrderText(data: CustomOrderEmailData) {
  return [
    'A new custom order request has been submitted.',
    '',
    `Customer: ${data.customerName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email ?? 'Not provided'}`,
    `Product Type: ${data.productType}`,
    `Quantity: ${data.quantity ?? '—'}`,
    `Preferred Date: ${data.preferredDate ?? '—'}`,
    `Delivery Option: ${data.deliveryOption ?? '—'}`,
    `Delivery Area: ${data.deliveryArea ?? '—'}`,
    `Custom Message: ${data.customMessage ?? '—'}`,
    `Flavor Preference: ${data.flavorPreference ?? '—'}`,
    `Budget Range: ${data.budgetRange ?? '—'}`,
    `Special Notes: ${data.specialNotes ?? '—'}`,
    `Attachment: ${data.attachmentUrl ?? '—'}`,
    `Date: ${formatDateTime(data.createdAt)}`,
  ].join('\n')
}

function buildContactHtml(data: ContactEmailData) {
  const body = `
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Name', data.name)}
      ${row('Phone', data.phone)}
      ${row('Email', data.email ?? 'Not provided')}
      ${row('Subject', data.subject)}
      ${row('Date', formatDateTime(data.createdAt))}
    </table>
    <h2 style="margin:24px 0 8px;color:#4A2412;font-size:16px;">Message</h2>
    <p style="margin:0;color:#4A2412;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>`

  return emailShell('New Contact Message', body)
}

function buildContactText(data: ContactEmailData) {
  return [
    'A new contact form message was received.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email ?? 'Not provided'}`,
    `Subject: ${data.subject}`,
    `Date: ${formatDateTime(data.createdAt)}`,
    '',
    'MESSAGE',
    data.message,
  ].join('\n')
}

export async function sendRegularOrderEmail(data: RegularOrderEmailData) {
  return sendEmail({
    subject: `New Order — ${data.customerName}`,
    html: buildRegularOrderHtml(data),
    text: buildRegularOrderText(data),
    replyTo: data.email,
  })
}

export async function sendCustomOrderEmail(data: CustomOrderEmailData) {
  return sendEmail({
    subject: `New Custom Order — ${data.customerName}`,
    html: buildCustomOrderHtml(data),
    text: buildCustomOrderText(data),
    replyTo: data.email,
  })
}

export async function sendContactEmail(data: ContactEmailData) {
  return sendEmail({
    to: CONTACT_INBOX,
    subject: `Contact: ${data.subject} — ${data.name}`,
    html: buildContactHtml(data),
    text: buildContactText(data),
    replyTo: data.email,
  })
}
