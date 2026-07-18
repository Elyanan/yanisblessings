'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon, Loader2, Pencil, Trash2 } from 'lucide-react'
import type { SanityCategory } from '@/lib/sanity/types'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCategoryCards } from '@/components/admin/admin-category-cards'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'
import { refreshAdminData } from '@/lib/admin-refresh'

const schema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  titleAm: z.string().optional(),
  description: z.string().optional(),
  descriptionAm: z.string().optional(),
  showOnHome: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
  initialCategories: SanityCategory[]
}

export function AdminCategoriesClient({ initialCategories }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [imageAssetId, setImageAssetId] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0, showOnHome: true },
  })

  const editingId = watch('_id')

  const load = async () => {
    const res = await fetch('/api/admin/categories', { credentials: 'include' })
    const data = await res.json()
    setCategories(data.categories ?? [])
    refreshAdminData(router)
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || !result.assetId) {
        setMessage(result.error ?? 'Upload failed')
        return
      }
      setImageAssetId(result.assetId)
      setImagePreview(result.url ?? '')
      setMessage('Image uploaded - save category to publish it')
    } catch {
      setMessage('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setMessage('')
    const document: Record<string, unknown> = {
      ...data,
      showOnHome: data.showOnHome !== false,
    }
    if (imageAssetId) {
      document.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId },
      }
    }

    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'saveCategory', document }),
    })
    setSaving(false)
    const payload = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage('Category saved')
      reset({ sortOrder: 0, showOnHome: true })
      setImageAssetId('')
      setImagePreview('')
      load()
    } else {
      setMessage(payload.error ?? 'Failed to save — check Sanity credentials')
    }
  }

  const clearForm = () => {
    reset({ sortOrder: 0, showOnHome: true })
    setImageAssetId('')
    setImagePreview('')
    setMessage('')
  }

  const editCategory = (cat: SanityCategory) => {
    reset({
      _id: cat._id,
      title: cat.title,
      titleAm: cat.titleAm,
      description: cat.description,
      descriptionAm: cat.descriptionAm,
      showOnHome: cat.showOnHome !== false,
      sortOrder: cat.sortOrder ?? 0,
    })
    setImageAssetId('')
    setImagePreview(cat.image?.asset?.url ?? '')
    scrollToForm()
  }

  const toggleHomeVisibility = async (cat: SanityCategory, showOnHome: boolean) => {
    setCategories((current) =>
      current.map((item) => (item._id === cat._id ? { ...item, showOnHome } : item)),
    )
    setMessage('')

    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'saveCategory',
        document: {
          _id: cat._id,
          showOnHome,
        },
      }),
    })

    if (res.ok) {
      load()
      return
    }

    const payload = await res.json().catch(() => ({}))
    setCategories((current) =>
      current.map((item) => (item._id === cat._id ? { ...item, showOnHome: cat.showOnHome } : item)),
    )
    setMessage(payload.error ?? 'Failed to update home page visibility')
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete', id }),
    })
    load()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Add, delete, and control which categories appear in the home page categories section."
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="order-1 lg:order-2">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              All Categories ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center sm:text-left">
                No categories yet. Add one in the form below.
              </p>
            ) : (
              <>
                <AdminCategoryCards
                  categories={categories}
                  onEdit={editCategory}
                  onDelete={deleteCategory}
                  onToggleHomeVisibility={toggleHomeVisibility}
                />
                <div className="hidden md:block">
                  <ResponsiveTableWrap>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-14">Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="w-32">Home</TableHead>
                          <TableHead className="w-20">Order</TableHead>
                          <TableHead className="w-[88px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((cat) => (
                          <TableRow key={cat._id}>
                            <TableCell>
                              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                                {cat.image?.asset?.url ? (
                                  <Image
                                    src={cat.image.asset.url}
                                    alt={cat.title}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <span className="flex h-full items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-4 w-4" />
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-0">
                                <p className="truncate font-medium">{cat.title}</p>
                                {cat.titleAm && (
                                  <p className="text-sm text-muted-foreground truncate">{cat.titleAm}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={cat.showOnHome !== false}
                                  onCheckedChange={(checked) => toggleHomeVisibility(cat, checked)}
                                  aria-label={`${cat.showOnHome === false ? 'Show' : 'Hide'} ${cat.title} on home page`}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {cat.showOnHome === false ? 'Hidden' : 'Shown'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{cat.sortOrder ?? 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => editCategory(cat)}
                                  aria-label={`Edit ${cat.title}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteCategory(cat._id)}
                                  aria-label={`Delete ${cat.title}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ResponsiveTableWrap>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card ref={formRef} className="order-2 lg:order-1 scroll-mt-20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              {editingId ? 'Edit Category' : 'Add Category'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register('_id')} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input {...register('title')} className="mt-1" />
                </div>
                <div>
                  <Label>Title (Amharic)</Label>
                  <Input {...register('titleAm')} className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  {...register('description')}
                  className="mt-1 min-h-[80px]"
                  placeholder="Short text for the home page category card"
                />
              </div>
              <div>
                <Label>Description (Amharic)</Label>
                <Textarea
                  {...register('descriptionAm')}
                  className="mt-1 min-h-[80px]"
                  placeholder="Optional translated home page card text"
                />
              </div>

              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 max-w-full"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading...
                  </p>
                )}
                {imagePreview && (
                  <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3 sm:p-4">
                  <Switch
                    id="showOnHome"
                    checked={watch('showOnHome') !== false}
                    onCheckedChange={(checked) => setValue('showOnHome', checked)}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <Label htmlFor="showOnHome">Show on home page</Label>
                    <p className="text-xs text-muted-foreground">
                      Turn this off to hide the category from the home page categories section.
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" {...register('sortOrder')} className="mt-1" />
                </div>
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.includes('saved') || message.includes('uploaded')
                      ? 'text-green-600'
                      : message.includes('failed') || message.includes('Failed')
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update category' : 'Save category'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={clearForm}>
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
