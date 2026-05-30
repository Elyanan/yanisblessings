import { NextResponse } from 'next/server'
import { getSanityWriteClient } from '@/lib/sanity/client'

export async function POST(request: Request) {
  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json({ error: 'Upload not available' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error) {
    console.error('[upload] Failed', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
