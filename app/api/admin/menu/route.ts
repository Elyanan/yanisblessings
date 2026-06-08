import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchMenuItems } from '@/lib/sanity/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await fetchMenuItems()
  return NextResponse.json({ items })
}
