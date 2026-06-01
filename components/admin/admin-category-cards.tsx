'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SanityCategory } from '@/lib/sanity/types'

type Props = {
  categories: SanityCategory[]
  onEdit: (cat: SanityCategory) => void
  onDelete: (id: string) => void
}

export function AdminCategoryCards({ categories, onEdit, onDelete }: Props) {
  return (
    <ul className="space-y-3 md:hidden">
      {categories.map((cat) => (
        <li
          key={cat._id}
          className="rounded-xl border border-border bg-muted/20 p-3 sm:p-4 flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="font-serif font-semibold text-foreground truncate">{cat.title}</p>
            {cat.titleAm && (
              <p className="text-sm text-muted-foreground truncate">{cat.titleAm}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Sort order: {cat.sortOrder ?? 0}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => onEdit(cat)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(cat._id)}
              aria-label={`Delete ${cat.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
