'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Tags,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo.png'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: Sparkles },
  { href: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/studio', label: 'Sanity Studio', icon: ExternalLink },
]

type SidebarNavProps = {
  onNavigate?: () => void
  className?: string
}

export function AdminSidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex h-full flex-col bg-chocolate text-cream', className)}>
      <div className="flex items-center gap-3 border-b border-cream/10 px-5 py-5">
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-cream/10">
          <Image src={logo} alt="Yani's Blessings" fill className="object-contain p-1" sizes="44px" />
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-base font-bold leading-tight truncate">Yani&apos;s Blessings</h1>
          <p className="text-cream/60 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              pathname === href ? 'bg-primary text-primary-foreground' : 'text-cream/80 hover:bg-cream/10',
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-cream/10 p-4">
        <Button
          variant="outline"
          className="w-full border-cream/50 bg-cream/15 text-cream hover:bg-cream/25 hover:text-cream hover:border-cream/70"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}

/** Desktop sidebar — hidden below lg */
export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:flex">
      <AdminSidebarNav className="w-full" />
    </aside>
  )
}
