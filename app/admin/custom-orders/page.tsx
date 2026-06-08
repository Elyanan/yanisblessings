import { fetchCustomOrders } from '@/lib/sanity/queries'
import { AdminCustomOrdersClient } from './custom-orders-client'

export default async function AdminCustomOrdersPage() {
  const orders = await fetchCustomOrders()
  return <AdminCustomOrdersClient initialOrders={orders} />
}
