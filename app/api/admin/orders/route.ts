import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchCustomOrders, fetchOrders } from '@/lib/sanity/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = await fetchOrders()
  return NextResponse.json({ orders })
}
