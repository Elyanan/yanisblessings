'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const isStudio = pathname?.startsWith('/admin/studio')

  if (isLogin) {
    return <SessionProvider>{children}</SessionProvider>
  }

  if (isStudio) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="ml-64 flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  )
}
