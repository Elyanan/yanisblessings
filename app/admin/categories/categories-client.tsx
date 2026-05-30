'use client'

import { useState } from 'react'
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
import { ResponsiveTableWrap } from '@/components/admin/responsive-table-wrap'

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
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0 },
  })

  const load = async () => {
    const res = await fetch('/api/admin/categories', { credentials: 'include' })
    const data = await res.json()
    setCategories(data.categories ?? [])
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

  const editCategory = (cat: SanityCategory) => {
    reset({
      _id: cat._id,
      title: cat.title,
      titleAm: cat.titleAm,
      sortOrder: cat.sortOrder,
    })
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
    <div className="space-y-6">
      <AdminPageHeader title="Categories" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{watch('_id') ? 'Edit Category' : 'Add Category'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register('_id')} />
              <div><Label>Title</Label><Input {...register('title')} className="mt-1" /></div>
              <div><Label>Title (Amharic)</Label><Input {...register('titleAm')} className="mt-1" /></div>
              <div><Label>Sort Order</Label><Input type="number" {...register('sortOrder')} className="mt-1" /></div>
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
              <Button type="submit" className="w-full sm:w-auto" disabled={saving}>{saving ? 'Saving...' : 'Save Category'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>All Categories</CardTitle></CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No categories yet.</p>
            ) : (
              <ResponsiveTableWrap>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat._id}>
                      <TableCell>{cat.title}</TableCell>
                      <TableCell>{cat.sortOrder ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => editCategory(cat)}
                            aria-label={`Edit ${cat.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
