'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowRight, Sparkles, Heart, Gift, Star, Wheat, Cookie, Cake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { testimonials } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { siteConfig } from '@/lib/site-config'
import { useProducts } from '@/lib/use-products'

// Decorative Sparkle Component
function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />

      {/* Decorative Elements */}
      <Sparkle className="absolute top-32 left-10 w-4 h-4 text-gold/40 animate-pulse" />
      <Sparkle className="absolute top-48 right-20 w-6 h-6 text-primary/40 animate-pulse delay-75" />
      <Sparkle className="absolute bottom-32 left-1/4 w-5 h-5 text-gold/30 animate-pulse delay-150" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              {t('hero.title')}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/menu">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-primary/30">
                  {t('hero.orderNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-medium border-2 border-foreground/20 hover:bg-secondary">
                  {t('hero.viewMenu')}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">
              {[
                { icon: Heart, label: t('hero.madeWithLove') },
                { icon: Wheat, label: t('hero.qualityIngredients') },
                { icon: Gift, label: t('hero.perfectForGifts') },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
                  <badge.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="absolute inset-4 md:inset-8 rounded-full bg-gradient-to-br from-primary/30 via-beige to-secondary overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-granola.png"
                  alt="Delicious homemade granola"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 90vw, 512px"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 top-1/4 bg-card rounded-2xl p-4 shadow-lg border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('hero.freshDaily')}</p>
                    <p className="text-xs text-muted-foreground">{t('hero.bakedWithCare')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card rounded-2xl p-4 shadow-lg border border-border animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-gold fill-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('hero.rating')}</p>
                    <p className="text-xs text-muted-foreground">{t('hero.reviews')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved Section Divider */}
      {/* <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full h-16 md:h-24">
          <path
            d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z"
            fill="currentColor"
            className="text-beige"
          />
        </svg>
      </div> */}
    </section>
  )
}

export function CategoriesSection() {
  const { t, language } = useLanguage()

  const categories = [
    {
      id: 'granola',
      name: t('cat.granola'),
      description: t('home.catGranolaDesc'),
      image: '/images/cat-granola.png',
      icon: Wheat,
    },
    {
      id: 'cupcakes',
      name: t('cat.cupcakes'),
      description: language === 'en' ? 'Sweet treats for every occasion' : 'ለእያንዳንዱ አጋጣሚ ጣፋጥ ጣፋጮች',
      image: '/images/cat-cupcakes.png',
      icon: Cake,
    },
    {
      id: 'cookies',
      name: t('cat.cookies'),
      description: language === 'en' ? 'Homemade with love' : 'በፍቅር የተሰራ',
      image: '/images/cat-cookies.png',
      icon: Cookie,
    },
    {
      id: 'gift-boxes',
      name: t('cat.giftBoxes'),
      description: language === 'en' ? 'Perfect for gifting' : 'ለስጦታ ፍፁም',
      image: '/images/cat-giftbox.png',
      icon: Gift,
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-beige relative overflow-hidden">
      {/* Background Decorations */}
      {/* <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Enhanced */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-foreground px-5 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>{language === 'en' ? 'Explore Our Selection' : 'ምርጫችንን ያስሱ'}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            {t('section.featured')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'From crunchy granola to sweet cupcakes, discover our handcrafted treats made with love and the finest ingredients.'
              : 'ከክራንቺ ግራኖላ እስከ ጣፋጥ ካፕኬኮች፣ በፍቅር እና በምርጥ ንጥረ ነገሮች የተሰሩ የእጅ ስራዎቻችንን ያግኙ።'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-12 h-1 bg-primary/30 rounded-full" />
            <div className="w-20 h-1.5 bg-gold rounded-full" />
            <div className="w-12 h-1 bg-primary/30 rounded-full" />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/30 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-cream/95 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-lg">
                  <category.icon className="w-6 h-6 md:w-7 md:h-7 text-gold group-hover:text-cream transition-colors" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-cream mb-2">
                  {category.name}
                </h3>
                <p className="text-cream/80 text-sm md:text-base line-clamp-2">
                  {category.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-3 flex items-center gap-2 text-cream/70 group-hover:text-gold transition-colors">
                  <span className="text-sm font-medium">{language === 'en' ? 'Shop Now' : 'አሁን ይግዙ'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WhyUsSection() {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: Wheat,
      title: t('why.quality'),
      description: t('why.qualityDesc'),
      color: 'from-amber-500/20 to-yellow-500/20',
      iconColor: 'text-amber-600',
    },
    {
      icon: Heart,
      title: t('why.homemade'),
      description: t('why.homemadeDesc'),
      color: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-500',
    },
    {
      icon: Sparkles,
      title: t('why.fresh'),
      description: t('why.freshDesc'),
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Gift,
      title: t('why.packed'),
      description: t('why.packedDesc'),
      color: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-600',
    },
    {
      icon: Star,
      title: t('why.gift'),
      description: t('why.giftDesc'),
      color: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-500',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-primary/50 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-gold/50 rounded-full" />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-primary/30 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Enhanced */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-foreground px-5 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 text-primary" />
            <span>{language === 'en' ? 'Why We Stand Out' : 'ለምን ልዩ እንሆናለን'}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            {t('section.whyUs')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Every treat we create is made with intention, quality, and a whole lot of love.'
              : 'የምንፈጥራቸው ሁሉም ጣፋጮች በዓላማ፣ በጥራት እና በብዙ ፍቅር የተሰሩ ናቸው።'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-12 h-1 bg-gold/30 rounded-full" />
            <div className="w-20 h-1.5 bg-primary rounded-full" />
            <div className="w-12 h-1 bg-gold/30 rounded-full" />
          </div>
        </div>

        {/* Feature Cards - Bento Grid Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-3xl p-6 md:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-border hover:border-primary/30 hover:-translate-y-2 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.icon className={`w-8 h-8 md:w-10 md:h-10 ${feature.iconColor}`} />
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/about">
            <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 border-foreground/20 hover:bg-beige hover:border-primary/30 transition-all">
              {language === 'en' ? 'Learn More About Us' : 'ስለ እኛ ተጨማሪ ይወቁ'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BestSellersSection() {
  const { t } = useLanguage()
  const { products } = useProducts()
  const featuredProducts = products.filter(p => p.featured).slice(0, 4)

  return (
    <section className="py-16 md:py-24 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.bestSellers')}
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/menu">
            <Button size="lg" variant="outline" className="rounded-full px-8 border-2 border-foreground/20 hover:bg-background">
              {t('home.viewAllProducts')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function StorySection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/story-bakery.png"
                alt="Yani's Blessings bakery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg max-w-[200px]">
              <p className="font-serif text-lg font-semibold italic">
                &quot;A Little Blessing in Every Bite&quot;
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {t('section.story')}
            </h2>
            <div className="w-24 h-1 bg-gold rounded-full" />
            <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
              <p>
                {language === 'en'
                  ? "Yani's Blessings was created from a love for homemade treats, thoughtful gifts, and sweet moments shared with family and friends."
                  : "የያኒስ በረከቶች ከቤት ውስጥ ጣፋጮች፣ አስተዋይ ስጦታዎች እና ከቤተሰብ እና ጓደኞች ጋር ከሚጋሩ ጣፋጭ ጊዜያት ፍቅር ተፈጠረ።"}
              </p>
              <p>
                {language === 'en'
                  ? "Every order is prepared with care using quality ingredients, because we believe every bite should feel warm, fresh, and special."
                  : "ሁሉም ትዕዛዝ በጥራት ንጥረ ነገሮች በእንክብካቤ ይዘጋጃል፣ ምክንያቱም ሁሉም ንክሻ ሞቅ ያለ፣ አዲስ እና ልዩ መሆን አለበት ብለን እናምናለን።"}
              </p>
            </div>
            <Link href="/about">
              <Button className="mt-4 bg-gold hover:bg-gold/90 text-white rounded-full px-8">
                Read Our Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function GiftBoxesSection() {
  const { t, language } = useLanguage()

  const giftTypes = [
    { name: language === 'en' ? 'Birthday Boxes' : 'የልደት ሳጥኖች', icon: Cake },
    { name: language === 'en' ? 'Thank You Boxes' : 'አመሰግናለሁ ሳጥኖች', icon: Heart },
    { name: language === 'en' ? 'Office Treats' : 'የቢሮ ጣፋጮች', icon: Gift },
    { name: language === 'en' ? 'Custom Packages' : 'ብጁ ጥቅሎች', icon: Sparkles },
  ]

  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {t('section.giftBoxes')}
            </h2>
            <div className="w-24 h-1 bg-gold rounded-full" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              {language === 'en'
                ? 'Give the gift of sweetness with our beautifully curated blessing boxes. Perfect for birthdays, thank-you gifts, office celebrations, or any special occasion.'
                : 'በቆንጆ ሁኔታ ከተዘጋጁ የበረከት ሳጥኖቻችን ጋር የጣፋጭነት ስጦታ ይስጡ። ለልደት፣ ለአመሰግናለሁ ስጦታዎች፣ ለቢሮ በዓላት ወይም ለማንኛውም ልዩ አጋጣሚ ፍፁም።'}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {giftTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-3 bg-background rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="font-medium text-foreground">{type.name}</span>
                </div>
              ))}
            </div>

            <Link href="/menu?category=gift-boxes">
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                Shop Gift Boxes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/gift-boxes-display.png"
                alt="Yani's Blessings gift boxes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('section.reviews')}
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold fill-gold" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-foreground text-base md:text-lg leading-relaxed mb-6">
                &quot;{language === 'am' ? testimonial.textAm : testimonial.text}&quot;
              </blockquote>

              <p className="font-semibold text-foreground">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-chocolate via-chocolate to-chocolate/95 text-cream relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

        {/* Decorative Sparkles */}
        <Sparkle className="absolute top-16 left-16 w-8 h-8 text-gold/30 animate-pulse" />
        <Sparkle className="absolute bottom-16 right-16 w-6 h-6 text-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Sparkle className="absolute top-1/3 right-1/4 w-5 h-5 text-gold/20 animate-pulse" style={{ animationDelay: '1s' }} />
        <Sparkle className="absolute bottom-1/3 left-1/4 w-4 h-4 text-primary/20 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <Sparkle className="absolute top-1/2 left-16 w-6 h-6 text-gold/25 animate-pulse" style={{ animationDelay: '0.75s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm text-cream px-5 py-2 rounded-full text-sm font-medium mb-8 border border-cream/20">
            <Gift className="w-4 h-4 text-gold" />
            <span>{language === 'en' ? 'Fresh Treats Await' : 'አዲስ ጣፋጮች ይጠብቃሉ'}</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
            {t('section.cta')}
          </h2>

          {/* Subtext */}
          <p className="text-cream/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Order your favorite treats today and experience the blessing of homemade goodness. We deliver fresh to your doorstep across Addis Ababa.'
              : 'ዛሬ ተወዳጅ ጣፋጮችዎን ይዘዙ እና የቤት ውስጥ ጥሩነት በረከትን ያጣጥሙ። በአዲስ አበባ ዙሪያ ወደ ደጃፍዎ አዲስ እናደርሳለን።'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-7 text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1">
                {t('hero.orderNow')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-10 py-7 text-lg font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white border-0 shadow-lg shadow-black/25 hover:shadow-xl hover:-translate-y-1 transition-all">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('btn.whatsapp')}
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-cream/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center">
                <Wheat className="w-4 h-4 text-gold" />
              </div>
              <span className="text-sm font-medium">{language === 'en' ? 'Quality Ingredients' : 'ጥራት ያላቸው ንጥረ ነገሮች'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{language === 'en' ? 'Made with Love' : 'በፍቅር የተሰራ'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-gold fill-gold" />
              </div>
              <span className="text-sm font-medium">{language === 'en' ? '5.0 Rating' : '5.0 ደረጃ'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
