'use client'

import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { SanityMenuItem } from '@/lib/sanity/types'

type Props = {
  items: SanityMenuItem[]
  onEdit: (item: SanityMenuItem) => void
  onDelete: (id: string) => void
}

export function AdminMenuItemCards({ items, onEdit, onDelete }: Props) {
  return (
    <ul className="space-y-3 lg:hidden">
      {items.map((item) => (
        <li
          key={item._id}
          className="rounded-xl border border-border bg-muted/20 p-3 sm:p-4"
        >
          <div className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image?.asset?.url ? (
                <Image
                  src={item.image.asset.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-muted-foreground">—</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif font-semibold text-foreground truncate">{item.title}</p>
              <p className="text-sm text-muted-foreground truncate">{item.category?.title ?? '—'}</p>
              <p className="text-sm font-medium text-foreground mt-1">{item.price?.toLocaleString()} ETB</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.featured && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Featured
                  </Badge>
                )}
                {item.availability === false && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Unavailable
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border/60">
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => onEdit(item)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item._id)}
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
