'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AdminSidebar, AdminSidebarNav } from '@/components/admin/admin-sidebar'

type Props = {
  children: React.ReactNode
}

export function AdminShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw,18rem)] border-0 p-0 [&>button]:text-cream">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <AdminSidebarNav onNavigate={() => setMobileOpen(false)} className="w-full" />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <p className="font-serif text-sm font-semibold text-foreground truncate">Yani&apos;s Blessings</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
