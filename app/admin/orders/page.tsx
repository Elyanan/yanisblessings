import { fetchMenuItems, fetchOrders } from '@/lib/sanity/queries'
import { AdminOrdersClient } from './orders-client'

export default async function AdminOrdersPage() {
  const [orders, menuItems] = await Promise.all([fetchOrders(), fetchMenuItems()])
  return <AdminOrdersClient initialOrders={orders} initialMenuItems={menuItems} />
}
