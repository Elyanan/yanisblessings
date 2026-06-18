import { fetchWebsiteImagesFresh } from '@/lib/sanity/queries'
import { AdminWebsiteImagesClient } from './website-images-client'

export const dynamic = 'force-dynamic'

export default async function AdminWebsiteImagesPage() {
  const slots = await fetchWebsiteImagesFresh()
  return <AdminWebsiteImagesClient initialSlots={slots} />
}
