'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app/error]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We are sorry — an unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="rounded-full">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-full w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
