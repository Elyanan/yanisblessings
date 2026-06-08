import { fetchCategories, fetchMenuItems } from '@/lib/sanity/queries'
import { AdminMenuClient } from './menu-client'

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([fetchMenuItems(), fetchCategories()])
  return <AdminMenuClient initialItems={items} initialCategories={categories} />
}