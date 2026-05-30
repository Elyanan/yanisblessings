'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: string
  href?: string
  className?: string
}

export function CopyField({ label, value, href, className }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-xl border border-border/80 bg-muted/30 p-3', className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-start justify-between gap-2">
        {href ? (
          <a href={href} className="text-sm font-medium text-foreground hover:text-primary break-all">
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-foreground break-all">{value || '—'}</p>
        )}
        {value && (
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copy} aria-label={`Copy ${label}`}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        )}
      </div>
    </div>
  )
}
