'use client'

import Link from 'next/link'
import { Instagram, Facebook, Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { useLanguage } from '@/lib/language-context'
import { siteConfig } from '@/lib/site-config'

export function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-chocolate text-cream">
      {/* Wave Divider */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <BrandLogo size="footer" className="drop-shadow-md" />
            <p className="text-cream/80 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <p className="text-cream/60 text-sm">
              {t('footer.location')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/menu', label: t('nav.menu') },
                { href: '/about', label: t('nav.about') },
                { href: '/custom-orders', label: t('nav.custom') },
                { href: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold">
              {language === 'am' ? 'ፖሊሲዎች' : 'Policies'}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/privacy-policy', label: language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy' },
                { href: '/refund-policy', label: language === 'am' ? 'መመለስ እና ማስለቀቅ' : 'Refund & Cancellation' },
                { href: '/terms', label: language === 'am' ? 'ውሎች እና ሁኔታዎች' : 'Terms & Conditions' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={siteConfig.phoneTel}
                  className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('footer.whatsapp')}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.emailMailto}
                  className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{siteConfig.location}</span>
              </li>
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-gold">{t('footer.hours')}</h3>
            <div className="text-cream/80 text-sm space-y-1">
              <p>{siteConfig.hours.weekdays[language]}</p>
              <p>{siteConfig.hours.saturday[language]}</p>
              <p>{siteConfig.hours.sunday[language]}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-cream/60 mb-3">{t('footer.delivery')}</p>
              <div className="flex gap-4">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-cream/20 text-center">
          <p className="text-cream/60 text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
