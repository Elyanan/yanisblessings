'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const isStudio = pathname?.startsWith('/admin/studio')

  if (isLogin || isStudio) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  )
}
