'use client'

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ImageIcon, Loader2, RotateCcw, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { refreshAdminData } from '@/lib/admin-refresh'
import {
  WEBSITE_IMAGE_SLOTS,
  type WebsiteImageKey,
  type WebsiteImageSlotDefinition,
} from '@/lib/website-images/definitions'
import { resolveWebsiteImages } from '@/lib/website-images/resolve'
import type { SanityWebsiteImageSlot } from '@/lib/website-images/types'

type SlotState = {
  alt: string
  previewUrl: string
  isCustom: boolean
  pendingAssetId: string
  uploading: boolean
  saving: boolean
  message: string
}

type Props = {
  initialSlots: SanityWebsiteImageSlot[]
}

function buildInitialState(slots: SanityWebsiteImageSlot[]): Record<WebsiteImageKey, SlotState> {
  const resolved = resolveWebsiteImages(slots)
  return WEBSITE_IMAGE_SLOTS.reduce(
    (acc, definition) => {
      const image = resolved[definition.key]
      acc[definition.key] = {
        alt: image.alt,
        previewUrl: image.src,
        isCustom: image.isCustom,
        pendingAssetId: '',
        uploading: false,
        saving: false,
        message: '',
      }
      return acc
    },
    {} as Record<WebsiteImageKey, SlotState>,
  )
}

function SlotCard({
  definition,
  state,
  onAltChange,
  onUpload,
  onSave,
  onReset,
}: {
  definition: WebsiteImageSlotDefinition
  state: SlotState
  onAltChange: (alt: string) => void
  onUpload: (file: File) => void
  onSave: () => void
  onReset: () => void
}) {
  const busy = state.uploading || state.saving

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {state.previewUrl ? (
          <Image
            src={state.previewUrl}
            alt={state.alt || definition.defaultAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {state.isCustom && (
          <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            Custom
          </span>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <p className="font-medium text-sm text-foreground">{definition.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Fallback: {definition.fallbackSrc}</p>
        </div>
        <div>
          <Label htmlFor={`alt-${definition.key}`}>Alt text (SEO)</Label>
          <Input
            id={`alt-${definition.key}`}
            value={state.alt}
            onChange={(e) => onAltChange(e.target.value)}
            className="mt-1"
            placeholder={definition.defaultAlt}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file)
                e.target.value = ''
              }}
            />
            <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" disabled={busy} asChild>
              <span>
                {state.uploading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-1.5 h-4 w-4" />
                )}
                {state.uploading ? 'Uploading…' : 'Upload'}
              </span>
            </Button>
          </label>
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            disabled={busy}
            onClick={onSave}
          >
            {state.saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
            {state.saving ? 'Saving…' : 'Save'}
          </Button>
          {state.isCustom && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto"
              disabled={busy}
              onClick={onReset}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Use default
            </Button>
          )}
        </div>
        {state.message && (
          <p
            className={`text-xs ${state.message.includes('saved') || state.message.includes('Uploaded') ? 'text-green-600' : 'text-destructive'}`}
          >
            {state.message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminWebsiteImagesClient({ initialSlots }: Props) {
  const router = useRouter()
  const [slotState, setSlotState] = useState(() => buildInitialState(initialSlots))

  const grouped = useMemo(() => {
    const pages = ['Home', 'About', 'Custom Orders'] as const
    return pages.map((page) => ({
      page,
      slots: WEBSITE_IMAGE_SLOTS.filter((slot) => {
        if (page === 'Home') return slot.page === 'Home' && slot.key !== 'story-bakery'
        if (page === 'About') return slot.key === 'story-bakery'
        return slot.page === page
      }),
    }))
  }, [])

  const updateSlot = useCallback((key: WebsiteImageKey, patch: Partial<SlotState>) => {
    setSlotState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }, [])

  const reload = useCallback(async () => {
    const res = await fetch('/api/admin/website-images', { credentials: 'include', cache: 'no-store' })
    const data = await res.json()
    if (res.ok) {
      setSlotState(buildInitialState(data.slots ?? []))
      refreshAdminData(router)
    }
  }, [router])

  const handleUpload = async (key: WebsiteImageKey, file: File) => {
    updateSlot(key, { uploading: true, message: '' })
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const result = await res.json()
      if (!res.ok || !result.assetId) {
        updateSlot(key, { uploading: false, message: result.error ?? 'Upload failed' })
        return
      }
      updateSlot(key, {
        uploading: false,
        pendingAssetId: result.assetId,
        previewUrl: result.url ?? slotState[key].previewUrl,
        message: 'Uploaded — click Save to publish',
      })
    } catch {
      updateSlot(key, { uploading: false, message: 'Upload failed' })
    }
  }

  const handleSave = async (key: WebsiteImageKey) => {
    const state = slotState[key]
    updateSlot(key, { saving: true, message: '' })
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'saveWebsiteImage',
          document: {
            key,
            alt: state.alt,
            ...(state.pendingAssetId ? { imageAssetId: state.pendingAssetId } : {}),
          },
        }),
      })
      const payload = await res.json()
      if (!res.ok) {
        updateSlot(key, { saving: false, message: payload.error ?? 'Failed to save' })
        return
      }
      await reload()
      updateSlot(key, {
        saving: false,
        pendingAssetId: '',
        message: 'Image saved',
        isCustom: true,
      })
    } catch {
      updateSlot(key, { saving: false, message: 'Failed to save' })
    }
  }

  const handleReset = async (key: WebsiteImageKey) => {
    const definition = WEBSITE_IMAGE_SLOTS.find((slot) => slot.key === key)!
    updateSlot(key, { saving: true, message: '' })
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'saveWebsiteImage',
          document: { key, alt: definition.defaultAlt, clearImage: true },
        }),
      })
      const payload = await res.json()
      if (!res.ok) {
        updateSlot(key, { saving: false, message: payload.error ?? 'Failed to reset' })
        return
      }
      await reload()
    } catch {
      updateSlot(key, { saving: false, message: 'Failed to reset' })
    }
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <AdminPageHeader
        title="Website Images"
        description="Manage photos on the Home, About, and Custom Orders pages. Changes appear on the live site after saving."
      />

      {grouped.map(({ page, slots }) => (
        <section key={page} className="space-y-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">{page}</h2>
            <p className="text-sm text-muted-foreground">
              {page === 'About'
                ? 'The story image is shared between the Home and About pages.'
                : `Images used on the ${page} page.`}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slots.map((definition) => (
              <SlotCard
                key={definition.key}
                definition={definition}
                state={slotState[definition.key]}
                onAltChange={(alt) => updateSlot(definition.key, { alt })}
                onUpload={(file) => handleUpload(definition.key, file)}
                onSave={() => handleSave(definition.key)}
                onReset={() => handleReset(definition.key)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
