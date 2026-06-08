'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Heart, Wheat, Sparkles, Star, Gift, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    { icon: Heart, title: t('about.valueLove'), description: t('about.valueLoveDesc') },
    { icon: Wheat, title: t('about.valueQuality'), description: t('about.valueQualityDesc') },
    { icon: Sparkles, title: t('about.valueFresh'), description: t('about.valueFreshDesc') },
    { icon: Gift, title: t('about.valueGift'), description: t('about.valueGiftDesc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-beige/50" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span>{t('about.ourStory')}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              {t('about.title')}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed text-pretty">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/story-bakery.png"
                  alt="Yani's Blessings bakery"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-2xl" />
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-6 shadow-xl border border-border max-w-[220px]">
                <p className="font-serif text-lg font-semibold text-foreground italic leading-relaxed">
                  &quot;A Little Blessing in Every Bite&quot;
                </p>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('about.howItBegan')}
                </h2>
                <div className="w-20 h-1 bg-gold rounded-full" />
              </div>
              
              <div className="text-muted-foreground text-lg leading-relaxed space-y-6">
                <p>{t('about.storyP1')}</p>
                <p>{t('about.storyP2')}</p>
                <p>{t('about.storyP3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('about.ourValues')}
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
            <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto">
              {t('about.valuesSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group bg-card rounded-3xl p-8 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-chocolate text-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            {t('about.missionTitle')}
          </h2>
          <p className="text-cream/90 text-xl leading-relaxed mb-8">
            &quot;{t('about.mission')}&quot;
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
              {t('hero.viewMenu')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
