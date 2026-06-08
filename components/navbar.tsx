'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/brand-logo'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems } = useCart()
  const { language, setLanguage, t } = useLanguage()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/menu', label: t('nav.menu') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/custom-orders', label: t('nav.custom') },
  ]

  const nextLanguage = language === 'en' ? 'am' : 'en'
  const languageLabel =
    language === 'en' ? 'Switch to Amharic (አማ)' : 'Switch to English (EN)'

  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[4.75rem] py-1 sm:min-h-[5.25rem] md:min-h-[6rem] md:py-1.5">
            <BrandLogo size="nav" priority className="drop-shadow-sm" />

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLanguage(nextLanguage)}
                className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition-colors"
                aria-label={languageLabel}
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline" aria-hidden="true">
                  {language === 'en' ? 'አማ' : 'EN'}
                </span>
              </button>

              <Link href="/cart" className="relative" aria-label={`${t('cart.title')}${totalItems > 0 ? `, ${totalItems} items` : ''}`}>
                <ShoppingBag className="w-6 h-6 text-foreground" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium" aria-hidden="true">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link href="/menu" className="hidden sm:block">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                  {t('nav.order')}
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-foreground"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
              >
                {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div id="mobile-nav-menu" className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/menu" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                    {t('nav.order')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
