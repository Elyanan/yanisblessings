'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SanityMenuItem, SanityCategory } from '@/lib/sanity/types'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'

const schema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  titleAm: z.string().optional(),
  description: z.string().optional(),
  descriptionAm: z.string().optional(),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1, 'Please select a category'),
  ingredients: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  featured: z.boolean().optional(),
  availability: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
  initialItems: SanityMenuItem[]
  initialCategories: SanityCategory[]
}

export function AdminMenuClient({ initialItems, initialCategories }: Props) {
  const [items, setItems] = useState(initialItems)
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [imageAssetId, setImageAssetId] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [listCategoryFilter, setListCategoryFilter] = useState('all')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { featured: false, availability: true, sortOrder: 0, categoryId: '' },
  })

  const load = async () => {
    const [menuRes, catRes] = await Promise.all([
      fetch('/api/admin/menu', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/categories', { credentials: 'include' }).then((r) => r.json()),
    ])
    setItems(menuRes.items ?? [])
    setCategories(catRes.categories ?? [])
  }

  const filteredItems = useMemo(() => {
    if (listCategoryFilter === 'all') return items
    return items.filter((item) => item.category?._id === listCategoryFilter)
  }, [items, listCategoryFilter])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' })
    const result = await res.json()
    setUploading(false)
    if (result.assetId) {
      setImageAssetId(result.assetId)
      setImagePreview(result.url)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setMessage('')
    const ingredients = data.ingredients?.split(',').map((s) => s.trim()).filter(Boolean)
    const { categoryId, ...fields } = data
    const document: Record<string, unknown> = {
      ...fields,
      ingredients,
      category: { _type: 'reference', _ref: categoryId },
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
      body: JSON.stringify({
        action: 'saveMenuItem',
        document,
      }),
    })
    setSaving(false)
    const payload = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage('Menu item saved')
      reset({ featured: false, availability: true, sortOrder: 0, categoryId: '' })
      setImageAssetId('')
      setImagePreview('')
      load()
    } else {
      setMessage(payload.error ?? 'Failed to save — check Sanity credentials')
    }
  }

  const editItem = (item: SanityMenuItem) => {
    reset({
      _id: item._id,
      title: item.title,
      titleAm: item.titleAm,
      description: item.description,
      descriptionAm: item.descriptionAm,
      price: item.price,
      categoryId: item.category?._id ?? '',
      ingredients: item.ingredients?.join(', '),
      sortOrder: item.sortOrder,
      featured: item.featured,
      availability: item.availability,
    })
    setImageAssetId('')
    setImagePreview(item.image?.asset?.url ?? '')
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete', id }),
    })
    load()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Menu Items" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{watch('_id') ? 'Edit Item' : 'Add Item'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register('_id')} />
              <div><Label>Title</Label><Input {...register('title')} className="mt-1" /></div>
              <div><Label>Title (Amharic)</Label><Input {...register('titleAm')} className="mt-1" /></div>
              <div><Label>Description</Label><Textarea {...register('description')} className="mt-1" /></div>
              <div><Label>Description (Amharic)</Label><Textarea {...register('descriptionAm')} className="mt-1" /></div>
              <div><Label>Price (ETB)</Label><Input type="number" {...register('price')} className="mt-1" /></div>
              <div>
                <Label>Category</Label>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    No categories yet. <a href="/admin/categories" className="text-primary underline">Create a category</a> first.
                  </p>
                ) : (
                  <>
                    <Select
                      value={watch('categoryId')}
                      onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>
                    )}
                  </>
                )}
              </div>
              <div><Label>Ingredients (comma-separated)</Label><Input {...register('ingredients')} className="mt-1" /></div>
              <div><Label>Sort Order</Label><Input type="number" {...register('sortOrder')} className="mt-1" /></div>
              <div>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" disabled={uploading} />
                {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-lg" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={watch('featured')} onCheckedChange={(v) => setValue('featured', v)} />
                <div>
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground">Show on the home page featured section</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={watch('availability')} onCheckedChange={(v) => setValue('availability', v)} />
                <Label>Available</Label>
              </div>
              {message && (
                <p className={`text-sm ${message.includes('saved') ? 'text-green-600' : 'text-destructive'}`}>
                  {message}
                </p>
              )}
              <Button type="submit" className="w-full sm:w-auto" disabled={saving || categories.length === 0}>{saving ? 'Saving...' : 'Save Item'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
            <CardTitle>
              All Items ({filteredItems.length}{listCategoryFilter !== 'all' ? ` of ${items.length}` : ''})
            </CardTitle>
            <Select value={listCategoryFilter} onValueChange={setListCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {items.length === 0
                  ? 'No menu items in Sanity yet. Add one above or in Sanity Studio.'
                  : 'No items in this category.'}
              </p>
            ) : (
              <ResponsiveTableWrap minWidth="36rem">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                          {item.image?.asset?.url ? (
                            <Image
                              src={item.image.asset.url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center justify-center h-full">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.category?.title ?? '—'}</TableCell>
                      <TableCell>{item.price} ETB</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => editItem(item)}
                            aria-label={`Edit ${item.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteItem(item._id)}
                            aria-label={`Delete ${item.title}`}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
