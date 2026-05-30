import { getSanityClient, getSanityWriteClient } from './client'
import type { SanityCategory, SanityCustomOrder, SanityMenuItem, SanityOrder } from './types'
import { sanitizeCategory, sanitizeMenuItem } from './sanitize'

export const menuItemsQuery = `*[_type == "menuItem"] | order(sortOrder asc, title asc) {
  _id, title, titleAm, description, descriptionAm, price, featured, availability, sortOrder,
  slug, ingredients,
  "image": image { asset-> { url } },
  "category": category->{ _id, title, slug }
}`

export const categoriesQuery = `*[_type == "category"] | order(sortOrder asc, title asc) {
  _id, title, titleAm, description, descriptionAm, sortOrder, slug,
  "image": image { asset-> { url } }
}`

export const ordersQuery = `*[_type == "order"] | order(_createdAt desc) {
  _id, _createdAt, orderNumber, customerName, phone, email, address, notes,
  items, subtotal, deliveryFee, total, status
}`

export const customOrdersQuery = `*[_type == "customOrder"] | order(_createdAt desc) {
  _id, _createdAt, customerName, phone, email, productType, quantity, preferredDate,
  deliveryOption, deliveryArea, customMessage, flavorPreference, budgetRange, specialNotes,
  "attachment": attachment { asset-> { url } },
  status
}`

export const dashboardStatsQuery = `{
  "totalOrders": count(*[_type == "order"]),
  "totalRevenue": math::sum(*[_type == "order" && status == "delivered"].total),
  "totalItemsOrdered": math::sum(*[_type == "order"].items[].quantity),
  "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
    _id, _createdAt, customerName, total, status
  },
  "customOrderCount": count(*[_type == "customOrder"]),
  "recentCustomOrders": *[_type == "customOrder"] | order(_createdAt desc)[0...5] {
    _id, _createdAt, customerName, productType, status
  }
}`

export async function fetchMenuItems(): Promise<SanityMenuItem[]> {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(menuItemsQuery)
}

export async function fetchCategories(): Promise<SanityCategory[]> {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(categoriesQuery)
}

export async function fetchOrders(): Promise<SanityOrder[]> {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(ordersQuery)
}

export async function fetchCustomOrders(): Promise<SanityCustomOrder[]> {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(customOrdersQuery)
}

export async function fetchDashboardStats() {
  const client = getSanityClient()
  if (!client) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalItemsOrdered: 0,
      recentOrders: [],
      customOrderCount: 0,
      recentCustomOrders: [],
    }
  }
  return client.fetch(dashboardStatsQuery)
}

export async function fetchMonthOrdersForCharts() {
  const client = getSanityClient()
  if (!client) return []

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  return client.fetch<Array<{ _createdAt: string; total: number; status: string }>>(
    `*[_type == "order" && _createdAt >= $monthStart] | order(_createdAt asc) {
      _createdAt, total, status
    }`,
    { monthStart },
  )
}

export async function createOrderDocument(data: Omit<SanityOrder, '_id' | '_createdAt'>) {
  const client = getSanityWriteClient()
  if (!client) return null
  return client.create({ _type: 'order', ...data })
}

export async function mutateOrder(data: Omit<SanityOrder, '_id' | '_createdAt'> & { _id?: string }) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured. Add SANITY_API_TOKEN with Editor permissions to .env.local and restart the dev server.')
  }

  const { _id, ...fields } = data
  if (_id) {
    return client.patch(_id).set(fields).commit()
  }

  return client.create({ _type: 'order', ...fields })
}

export async function createCustomOrderDocument(data: Record<string, unknown>) {
  return mutateCustomOrder(data)
}

export async function mutateCustomOrder(data: Record<string, unknown>) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured. Add SANITY_API_TOKEN with Editor permissions to .env.local and restart the dev server.')
  }

  const { attachmentAssetId, _id, ...rest } = data
  const doc: Record<string, unknown> = { ...rest }
  if (attachmentAssetId) {
    doc.attachment = {
      _type: 'image',
      asset: { _type: 'reference', _ref: attachmentAssetId },
    }
  }

  if (_id) {
    return client.patch(_id as string).set(doc).commit()
  }

  return client.create({ _type: 'customOrder', ...doc } as { _type: string; [key: string]: unknown })
}

export async function updateDocumentStatus(id: string, status: string) {
  const client = getSanityWriteClient()
  if (!client) return null
  return client.patch(id).set({ status }).commit()
}

export async function mutateMenuItem(doc: Record<string, unknown>) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured. Add SANITY_API_TOKEN with Editor permissions to .env.local and restart the dev server.')
  }

  const { id, data } = sanitizeMenuItem(doc)

  if (id) {
    return client.patch(id).set(data).commit()
  }

  return client.create({ _type: 'menuItem', ...data })
}

export async function deleteDocument(id: string) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured.')
  }
  return client.delete(id)
}

export async function mutateCategory(doc: Record<string, unknown>) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured. Add SANITY_API_TOKEN with Editor permissions to .env.local and restart the dev server.')
  }

  const { id, data } = sanitizeCategory(doc)

  if (id) {
    return client.patch(id).set(data).commit()
  }

  return client.create({ _type: 'category', ...data })
}
