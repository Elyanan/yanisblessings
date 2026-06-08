import { getSanityClient, getSanityWriteClient } from './client'
import { calculateCustomOrderTotals, validateDeliveredLineItems } from '@/lib/custom-order-totals'
import type { SanityCategory, SanityCustomOrder, SanityMenuItem, SanityOrder } from './types'
import { sanitizeCategory, sanitizeMenuItem } from './sanitize'

async function safeSanityFetch<T>(label: string, fallback: T, fetcher: () => Promise<T>): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    console.error(`[Sanity] ${label} failed:`, error)
    return fallback
  }
}

const emptyDashboardStats = {
  menuOrderCount: 0,
  customOrderCount: 0,
  totalOrders: 0,
  deliveredOrdersCount: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  averageOrderValue: 0,
  totalItemsOrdered: 0,
  recentOrders: [] as Array<{ _id: string; _createdAt: string; customerName: string; total: number; status: string }>,
  recentCustomOrders: [] as Array<{
    _id: string
    _createdAt: string
    customerName: string
    productType: string
    status: string
    total?: number
  }>,
}

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
  _id, _createdAt, orderNumber, customerName, phone, telegram, email, address, notes,
  items, subtotal, deliveryFee, total, status
}`

export const customOrdersQuery = `*[_type == "customOrder"] | order(_createdAt desc) {
  _id, _createdAt, customerName, phone, telegram, email, productType, quantity, preferredDate,
  deliveryOption, deliveryArea, customMessage, flavorPreference, budgetRange, specialNotes,
  "attachment": attachment { asset-> { url } },
  status, items, subtotal, deliveryFee, total, deliveredAt
}`

export const dashboardStatsQuery = `{
  "menuOrderCount": count(*[_type == "order"]),
  "customOrderCount": count(*[_type == "customOrder"]),
  "deliveredOrdersCount": count(*[_type == "order" && status == "delivered"]) + count(*[_type == "customOrder" && status == "delivered"]),
  "totalRevenue": math::sum(*[_type == "order" && status == "delivered"].total) + math::sum(*[_type == "customOrder" && status == "delivered"].total),
  "monthlyRevenue": math::sum(*[_type == "order" && status == "delivered" && _createdAt >= $monthStart].total)
    + math::sum(*[_type == "customOrder" && status == "delivered" && _createdAt >= $monthStart].total),
  "totalItemsOrdered": math::sum(*[_type == "order"].items[].quantity) + math::sum(*[_type == "customOrder" && status == "delivered"].items[].quantity),
  "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
    _id, _createdAt, customerName, total, status
  },
  "recentCustomOrders": *[_type == "customOrder"] | order(_createdAt desc)[0...5] {
    _id, _createdAt, customerName, productType, status, total
  }
}`

export async function fetchMenuItems(): Promise<SanityMenuItem[]> {
  const client = getSanityClient()
  if (!client) return []
  return safeSanityFetch('fetchMenuItems', [], () =>
    client.fetch(menuItemsQuery, {}, { next: { revalidate: 300, tags: ['menu-items'] } }),
  )
}

export async function fetchCategories(): Promise<SanityCategory[]> {
  const client = getSanityClient()
  if (!client) return []
  return safeSanityFetch('fetchCategories', [], () =>
    client.fetch(categoriesQuery, {}, { next: { revalidate: 300, tags: ['categories'] } }),
  )
}

export async function fetchOrders(): Promise<SanityOrder[]> {
  const client = getSanityClient()
  if (!client) return []
  return safeSanityFetch('fetchOrders', [], () => client.fetch(ordersQuery))
}

export async function fetchCustomOrders(): Promise<SanityCustomOrder[]> {
  const client = getSanityClient()
  if (!client) return []
  return safeSanityFetch('fetchCustomOrders', [], () => client.fetch(customOrdersQuery))
}

export async function fetchAllOrdersForAnalytics() {
  const client = getSanityClient()
  if (!client) return []

  return safeSanityFetch('fetchAllOrdersForAnalytics', [], async () => {
    const result = await client.fetch<{
      menu: Array<{ _createdAt: string; total?: number; status: string }>
      custom: Array<{ _createdAt: string; total?: number; status: string }>
    }>(`{
      "menu": *[_type == "order"]{ _createdAt, total, status },
      "custom": *[_type == "customOrder"]{ _createdAt, total, status }
    }`)
    return [
      ...(result.menu ?? []).map((o) => ({ ...o, _type: 'order' as const })),
      ...(result.custom ?? []).map((o) => ({ ...o, _type: 'customOrder' as const })),
    ]
  })
}

export async function fetchDashboardRecents() {
  const client = getSanityClient()
  if (!client) {
    return { recentOrders: [], recentCustomOrders: [] }
  }

  return safeSanityFetch(
    'fetchDashboardRecents',
    { recentOrders: [], recentCustomOrders: [] },
    () =>
      client.fetch<{
        recentOrders: typeof emptyDashboardStats.recentOrders
        recentCustomOrders: typeof emptyDashboardStats.recentCustomOrders
      }>(`{
        "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
          _id, _createdAt, customerName, total, status
        },
        "recentCustomOrders": *[_type == "customOrder"] | order(_createdAt desc)[0...5] {
          _id, _createdAt, customerName, productType, status, total
        }
      }`),
  )
}

/** @deprecated Use fetchAllOrdersForAnalytics + buildDashboardMetrics */
export async function fetchDashboardStats() {
  const client = getSanityClient()
  if (!client) return emptyDashboardStats

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const raw = await safeSanityFetch('fetchDashboardStats', emptyDashboardStats, () =>
    client.fetch<typeof emptyDashboardStats>(dashboardStatsQuery, { monthStart }),
  )

  const menuOrderCount = raw.menuOrderCount ?? 0
  const customOrderCount = raw.customOrderCount ?? 0
  const totalOrders = menuOrderCount + customOrderCount
  const deliveredOrdersCount = raw.deliveredOrdersCount ?? 0
  const totalRevenue = raw.totalRevenue ?? 0
  const monthlyRevenue = raw.monthlyRevenue ?? 0

  return {
    menuOrderCount,
    customOrderCount,
    totalOrders,
    deliveredOrdersCount,
    totalRevenue,
    monthlyRevenue,
    averageOrderValue: deliveredOrdersCount > 0 ? Math.round(totalRevenue / deliveredOrdersCount) : 0,
    totalItemsOrdered: raw.totalItemsOrdered ?? 0,
    recentOrders: raw.recentOrders ?? [],
    recentCustomOrders: raw.recentCustomOrders ?? [],
  }
}

/** @deprecated Use fetchAllOrdersForAnalytics + buildChartData */
export async function fetchDashboardRecent() {
  const client = getSanityClient()
  if (!client) {
    return { recentOrders: [], recentCustomOrders: [] }
  }
  return safeSanityFetch('fetchDashboardRecent', { recentOrders: [], recentCustomOrders: [] }, () =>
    client.fetch<{
      recentOrders: typeof emptyDashboardStats.recentOrders
      recentCustomOrders: typeof emptyDashboardStats.recentCustomOrders
    }>(`{
      "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
        _id, _createdAt, customerName, total, status
      },
      "recentCustomOrders": *[_type == "customOrder"] | order(_createdAt desc)[0...5] {
        _id, _createdAt, customerName, productType, status, total
      }
    }`),
  )
}

export async function fetchAnalyticsOrders() {
  const client = getSanityClient()
  if (!client) return []

  const since = new Date()
  since.setFullYear(since.getFullYear() - 8)
  const sinceIso = since.toISOString()

  return safeSanityFetch('fetchAnalyticsOrders', [], async () => {
    const result = await client.fetch<{
      menu: Array<{ _createdAt: string; total?: number; status: string }>
      custom: Array<{ _createdAt: string; total?: number; status: string }>
    }>(
      `{
        "menu": *[_type == "order" && _createdAt >= $since] {
          _createdAt, total, status
        },
        "custom": *[_type == "customOrder" && _createdAt >= $since] {
          _createdAt, total, status
        }
      }`,
      { since: sinceIso },
    )
    return [
      ...(result.menu ?? []).map((o) => ({ ...o, _type: 'order' as const })),
      ...(result.custom ?? []).map((o) => ({ ...o, _type: 'customOrder' as const })),
    ]
  })
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

export async function deliverCustomOrder(
  id: string,
  items: Array<{ name: string; quantity: number; price: number }>,
) {
  const client = getSanityWriteClient()
  if (!client) {
    throw new Error('Sanity is not configured. Add SANITY_API_TOKEN with Editor permissions to .env.local and restart the dev server.')
  }

  const validationError = validateDeliveredLineItems(items)
  if (validationError) {
    throw new Error(validationError)
  }

  const normalized = items
    .filter((i) => i.name.trim() && i.quantity > 0)
    .map((i) => ({
      name: i.name.trim(),
      quantity: Math.floor(i.quantity),
      price: Number(i.price),
    }))

  const { subtotal, deliveryFee, total } = calculateCustomOrderTotals(normalized)

  return client
    .patch(id)
    .set({
      status: 'delivered',
      items: normalized,
      subtotal,
      deliveryFee,
      total,
      deliveredAt: new Date().toISOString(),
    })
    .commit()
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
