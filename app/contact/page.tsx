'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/language-context'
import { siteConfig } from '@/lib/site-config'
import { TikTokIcon } from '@/components/tiktok-icon'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  Instagram,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      if (!res.ok) throw new Error('Failed')
      setIsSubmitted(true)
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      alert(t('common.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.location'),
      value: siteConfig.location,
      subtext: t('contact.locationSub'),
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: siteConfig.phoneDisplay,
      subtext: t('contact.phoneSub'),
      href: siteConfig.phoneTel,
    },
    {
      icon: Mail,
      title: t('contact.email'),
      value: siteConfig.email,
      subtext: t('contact.emailSub'),
      href: siteConfig.emailMailto,
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      value: t('contact.hoursValue'),
      subtext: t('contact.hoursSub'),
    },
  ]

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: siteConfig.social.instagram },
    { icon: TikTokIcon, label: 'TikTok', href: siteConfig.social.tiktok },
    { icon: MessageCircle, label: 'WhatsApp', href: siteConfig.whatsappUrl },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-beige/50" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>{t('contact.getInTouch')}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              {t('contact.heroTitle')}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed text-pretty">
              {t('contact.heroDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center mb-4">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                {info.href ? (
                  <a href={info.href} className="text-gold hover:text-gold/80 font-medium block mb-1">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-foreground font-medium mb-1">{info.value}</p>
                )}
                <p className="text-muted-foreground text-sm">{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                {t('contact.sendMessage')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('contact.formDesc')}
              </p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {t('contact.messageSent')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('contact.messageSentDesc')}
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full">
                    {t('contact.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.yourName')} *
                      </label>
                      <Input
                        required
                        placeholder={language === 'en' ? 'Enter your name' : 'ስምዎን ያስገቡ'}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="rounded-xl border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('cart.phone')} *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="+251 9XX XXX XXX"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="rounded-xl border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('cart.email')}
                    </label>
                    <Input
                      type="email"
                      placeholder={language === 'en' ? 'Enter your email' : 'ኢሜይልዎን ያስገቡ'}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="rounded-xl border-border focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.subject')} *
                    </label>
                    <Input
                      required
                      placeholder={language === 'en' ? 'What is this about?' : 'ይህ ስለ ምንድነው?'}
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="rounded-xl border-border focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.yourMessage')} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={language === 'en' ? 'Tell us how we can help you...' : 'እንዴት ልንረዳዎት እንደምንችል ይንገሩን...'}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('contact.sending')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {t('btn.sendMessage')}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Contact & Social */}
            <div className="space-y-8">
              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {t('contact.whatsappTitle')}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {t('contact.whatsappDesc')}
                    </p>
                    <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-white text-green-600 hover:bg-white/90 rounded-full">
                        {t('contact.chatWhatsapp')}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card rounded-3xl p-8 shadow-lg border border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                  {t('contact.followUs')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('contact.followDesc')}
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center text-foreground hover:scale-110 transition-transform"
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="bg-beige rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-gold" />
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {t('contact.faq')}
                  </h3>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">Q:</span>
                    {t('contact.faqQ')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-gold font-bold">A:</span>
                    {t('contact.faqA')}
                  </p>
                </div>
                <Link href="/custom-orders" className="inline-block mt-4">
                  <Button variant="outline" className="rounded-full">
                    {t('contact.viewCustom')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
