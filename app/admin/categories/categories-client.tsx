'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import type { SanityCategory } from '@/lib/sanity/types'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCategoryCards } from '@/components/admin/admin-category-cards'
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'
import { refreshAdminData } from '@/lib/admin-refresh'

const schema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  titleAm: z.string().optional(),
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

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0 },
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

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'saveCategory', document: data }),
    })
    setSaving(false)
    const payload = await res.json().catch(() => ({}))
    if (res.ok) {
      setMessage('Category saved')
      reset({ sortOrder: 0 })
      load()
    } else {
      setMessage(payload.error ?? 'Failed to save — check Sanity credentials')
    }
  }

  const clearForm = () => {
    reset({ sortOrder: 0 })
    setMessage('')
  }

  const editCategory = (cat: SanityCategory) => {
    reset({
      _id: cat._id,
      title: cat.title,
      titleAm: cat.titleAm,
      sortOrder: cat.sortOrder,
    })
    scrollToForm()
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
      <AdminPageHeader title="Categories" />

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
                />
                <div className="hidden md:block">
                  <ResponsiveTableWrap>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead className="w-20">Order</TableHead>
                          <TableHead className="w-[88px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((cat) => (
                          <TableRow key={cat._id}>
                            <TableCell>
                              <div className="min-w-0">
                                <p className="truncate font-medium">{cat.title}</p>
                                {cat.titleAm && (
                                  <p className="text-sm text-muted-foreground truncate">{cat.titleAm}</p>
                                )}
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

              <div className="sm:max-w-[10rem]">
                <Label>Sort Order</Label>
                <Input type="number" {...register('sortOrder')} className="mt-1" />
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.includes('saved') ? 'text-green-600' : 'text-muted-foreground'
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
