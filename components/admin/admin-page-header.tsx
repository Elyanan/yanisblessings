import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({ title, description, actions, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm sm:text-base mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">{actions}</div>}
    </div>
  )
}
