import type { Metadata } from 'next'
import { JsonLdScript } from '@/components/seo/json-ld-script'
import { buildLocalBusinessSchema } from '@/lib/seo/json-ld'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'
import { getWebsiteImages } from '@/lib/get-website-images'
import { WebsiteImagesProvider } from '@/lib/website-images/context'
import {
  HeroSection,
  CategoriesSection,
  WhyUsSection,
  BestSellersSection,
  StorySection,
  GiftBoxesSection,
  TestimonialsSection,
  CTASection,
} from '@/components/home-sections'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = buildPageMetadata(pageSeo.home)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const images = await getWebsiteImages()

  return (
    <WebsiteImagesProvider images={images}>
      <JsonLdScript data={buildLocalBusinessSchema()} id="home-jsonld" />
      <main id="main-content" className="min-h-screen">
        <Navbar />
        <HeroSection />
        <CategoriesSection />
        <WhyUsSection />
        <BestSellersSection />
        <StorySection />
        <GiftBoxesSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </WebsiteImagesProvider>
  )
}
