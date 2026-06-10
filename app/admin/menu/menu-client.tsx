'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { isGranolaProduct, isGranolaWithSizes } from '@/lib/granola-sizes'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminMenuItemCards } from '@/components/admin/admin-menu-item-cards'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'
import { refreshAdminData } from '@/lib/admin-refresh'

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
  hasGranolaSizes: z.boolean().optional(),
  featured: z.boolean().optional(),
  availability: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
  initialItems: SanityMenuItem[]
  initialCategories: SanityCategory[]
}

export function AdminMenuClient({ initialItems, initialCategories }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
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
    defaultValues: {
      hasGranolaSizes: false,
      featured: false,
      availability: true,
      sortOrder: 0,
      categoryId: '',
    },
  })

  const editingId = watch('_id')
  const selectedCategoryId = watch('categoryId')
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat._id === selectedCategoryId),
    [categories, selectedCategoryId],
  )
  const isGranolaCategory = isGranolaProduct(selectedCategory?.slug?.current ?? '')

  const load = async () => {
    try {
      const fetchOpts: RequestInit = { credentials: 'include', cache: 'no-store' }
      const [menuRes, catRes] = await Promise.all([
        fetch('/api/admin/menu', fetchOpts),
        fetch('/api/admin/categories', fetchOpts),
      ])

      const menuPayload = await menuRes.json().catch(() => ({}))
      const catPayload = await catRes.json().catch(() => ({}))

      if (!menuRes.ok || !catRes.ok) {
        const err = menuPayload.error ?? catPayload.error ?? 'Could not load menu data from Sanity'
        setMessage(err)
        return
      }

      setItems(menuPayload.items ?? [])
      setCategories(catPayload.categories ?? [])
      refreshAdminData(router)
    } catch {
      setMessage('Network error — could not refresh the menu list. Check your connection and try again.')
    }
  }

  const filteredItems = useMemo(() => {
    if (listCategoryFilter === 'all') return items
    return items.filter((item) => item.category?._id === listCategoryFilter)
  }, [items, listCategoryFilter])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
    try {
      const ingredients = data.ingredients?.split(',').map((s) => s.trim()).filter(Boolean)
      const { categoryId, hasGranolaSizes, ...fields } = data
      const document: Record<string, unknown> = {
        ...fields,
        ingredients,
        hasGranolaSizes: isGranolaCategory ? hasGranolaSizes === true : false,
        featured: data.featured === true,
        availability: data.availability !== false,
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
      const payload = await res.json().catch(() => ({}))
      if (res.ok) {
        setMessage('Menu item saved')
        reset({
          hasGranolaSizes: false,
          featured: false,
          availability: true,
          sortOrder: 0,
          categoryId: '',
        })
        setImageAssetId('')
        setImagePreview('')
        await load()
      } else {
        setMessage(payload.error ?? 'Failed to save menu item')
      }
    } catch {
      setMessage('Network error — could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const clearForm = () => {
    reset({
      hasGranolaSizes: false,
      featured: false,
      availability: true,
      sortOrder: 0,
      categoryId: '',
    })
    setImageAssetId('')
    setImagePreview('')
    setMessage('')
  }

  const editItem = (item: SanityMenuItem) => {
    const categorySlug = item.category?.slug?.current ?? ''
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
      hasGranolaSizes: isGranolaWithSizes({
        id: item.slug?.current ?? item._id,
        category: categorySlug,
        hasGranolaSizes: item.hasGranolaSizes,
      }),
      featured: item.featured ?? false,
      availability: item.availability !== false,
    })
    setImageAssetId('')
    setImagePreview(item.image?.asset?.url ?? '')
    scrollToForm()
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
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <AdminPageHeader title="Menu Items" />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* List first on mobile for quicker scanning */}
        <Card className="order-1 lg:order-2">
          <CardHeader className="flex flex-col gap-3 space-y-0 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              All Items ({filteredItems.length}
              {listCategoryFilter !== 'all' ? ` of ${items.length}` : ''})
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
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {filteredItems.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center sm:text-left">
                {items.length === 0
                  ? 'No menu items yet. Add one in the form below.'
                  : 'No items in this category.'}
              </p>
            ) : (
              <>
                <AdminMenuItemCards
                  items={filteredItems}
                  onEdit={editItem}
                  onDelete={deleteItem}
                />
                <div className="hidden lg:block">
                  <ResponsiveTableWrap minWidth="32rem">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-14">Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="w-[88px]" />
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
                            <TableCell className="max-w-[12rem] truncate">{item.title}</TableCell>
                            <TableCell className="max-w-[8rem] truncate">{item.category?.title ?? '—'}</TableCell>
                            <TableCell className="whitespace-nowrap">{item.price} ETB</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => editItem(item)}
                                  aria-label={`Edit ${item.title}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card ref={formRef} className="order-2 lg:order-1 scroll-mt-20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              {editingId ? 'Edit Item' : 'Add Item'}
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
                <Textarea {...register('description')} className="mt-1 min-h-[80px]" />
              </div>
              <div>
                <Label>Description (Amharic)</Label>
                <Textarea {...register('descriptionAm')} className="mt-1 min-h-[80px]" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Price (ETB)</Label>
                  <Input type="number" {...register('price')} className="mt-1" />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" {...register('sortOrder')} className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    No categories yet.{' '}
                    <a href="/admin/categories" className="text-primary underline">
                      Create a category
                    </a>{' '}
                    first.
                  </p>
                ) : (
                  <>
                    <Select
                      value={watch('categoryId')}
                      onValueChange={(value) => {
                        setValue('categoryId', value, { shouldValidate: true })
                        const cat = categories.find((c) => c._id === value)
                        if (isGranolaProduct(cat?.slug?.current ?? '')) {
                          setValue('hasGranolaSizes', true)
                        } else {
                          setValue('hasGranolaSizes', false)
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1 w-full">
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

              <div>
                <Label>Ingredients (comma-separated)</Label>
                <Input {...register('ingredients')} className="mt-1" />
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
                {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-24 w-24 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3 sm:p-4">
                {isGranolaCategory && (
                  <div className="flex items-start gap-3">
                    <Switch
                      id="hasGranolaSizes"
                      checked={watch('hasGranolaSizes') === true}
                      onCheckedChange={(v) => setValue('hasGranolaSizes', v)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <Label htmlFor="hasGranolaSizes">1kg / 0.5kg sizes</Label>
                      <p className="text-xs text-muted-foreground">
                        Price is per kg — customers can pick 1kg or 0.5kg
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Switch
                    id="featured"
                    checked={watch('featured') === true}
                    onCheckedChange={(v) => setValue('featured', v)}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <Label htmlFor="featured">Best seller</Label>
                    <p className="text-xs text-muted-foreground">
                      Shows a Best Seller badge on the menu and product page
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="availability"
                    checked={watch('availability') !== false}
                    onCheckedChange={(v) => setValue('availability', v)}
                    className="shrink-0"
                  />
                  <Label htmlFor="availability">Available</Label>
                </div>
              </div>

              {message && (
                <p
                  className={`text-sm ${message.includes('saved') ? 'text-green-600' : 'text-destructive'}`}
                >
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={saving || categories.length === 0}
                >
                  {saving ? 'Saving...' : editingId ? 'Update item' : 'Save item'}
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
