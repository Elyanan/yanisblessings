'use client'

import { cn } from '@/lib/utils'
import {
  GRANOLA_SIZES,
  getGranolaPrice,
  type GranolaSizeKey,
} from '@/lib/granola-sizes'

type Props = {
  basePrice: number
  selectedSize: GranolaSizeKey
  onSizeChange: (size: GranolaSizeKey) => void
  language?: 'en' | 'am'
  className?: string
  compact?: boolean
}

export function GranolaSizeSelector({
  basePrice,
  selectedSize,
  onSizeChange,
  language = 'en',
  className,
  compact = false,
}: Props) {
  return (
    <div className={cn('space-y-2', className)}>
      {!compact && (
        <p className="text-sm font-medium text-foreground">
          {language === 'am' ? 'መጠን' : 'Size'}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {GRANOLA_SIZES.map((size) => {
          const isSelected = selectedSize === size.key
          const price = getGranolaPrice(basePrice, size.key)
          const label = language === 'am' ? size.labelAm : size.label

          return (
            <button
              key={size.key}
              type="button"
              onClick={() => onSizeChange(size.key)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                compact ? 'px-2.5 py-1 text-xs' : 'px-4 py-2',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5',
              )}
            >
              {label}
              {!compact && (
                <span className="ml-1.5 opacity-80">
                  · {price.toLocaleString()} ETB
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
