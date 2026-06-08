import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  minWidth?: string
  className?: string
}

/** Horizontal scroll wrapper for wide tables on small screens */
export function ResponsiveTableWrap({ children, minWidth = '32rem', className }: Props) {
  return (
    <div className={cn('-mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0', className)}>
      <div style={{ minWidth }}>{children}</div>
    </div>
  )
}
