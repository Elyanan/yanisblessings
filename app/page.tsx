import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
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

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
  )
}
