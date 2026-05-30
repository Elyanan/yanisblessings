import { fetchCategories } from '@/lib/sanity/queries'
import { AdminCategoriesClient } from './categories-client'

export default async function AdminCategoriesPage() {
  const categories = await fetchCategories()
  return <AdminCategoriesClient initialCategories={categories} />
}
