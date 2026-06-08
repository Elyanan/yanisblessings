'use client'

import { useLayoutEffect, type ReactNode } from 'react'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import logo from '@/assets/logo.png'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

type Props = {
  title: string
  description: string
  children?: ReactNode
}

export function OrderSuccessScreen({ title, description, children }: Props) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-24 pb-16 sm:pt-28 sm:justify-center sm:pb-20">
        <div className="max-w-md w-full text-center">
          <div className="relative mx-auto mb-6 h-24 w-24 sm:h-28 sm:w-28">
            <Image
              src={logo}
              alt="Yani's Blessings"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 96px, 112px"
              priority
            />
          </div>
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {description}
          </p>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
