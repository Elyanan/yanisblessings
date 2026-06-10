import { fetchCategoriesFresh, fetchMenuItemsFresh } from '@/lib/sanity/queries'
import { AdminMenuClient } from './menu-client'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([fetchMenuItemsFresh(), fetchCategoriesFresh()])
  return <AdminMenuClient initialItems={items} initialCategories={categories} />
}