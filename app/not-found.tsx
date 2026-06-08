'use client'

import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-6xl font-serif font-bold text-primary mb-4">404</p>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            Page not found
            <span className="block text-lg font-normal text-muted-foreground mt-1">
              ገጹ አልተገኘም
            </span>
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you are looking for may have been moved or no longer exists.
            Browse our menu for fresh homemade treats.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="rounded-full w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" className="rounded-full w-full sm:w-auto gap-2">
                <Search className="w-4 h-4" aria-hidden="true" />
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
