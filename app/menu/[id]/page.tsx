'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, Minus, Truck, Clock, CheckCircle, Package } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { useProducts } from '@/lib/use-products'
import { ProductCard } from '@/components/product-card'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addItem, items, updateQuantity } = useCart()
  const { t, language } = useLanguage()
  const { products, loading } = useProducts()

  const product = products.find(p => p.id === id)

  if (!loading && !product) {
    notFound()
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center text-muted-foreground">{t('common.loading')}</div>
        <Footer />
      </main>
    )
  }

  const cartItem = items.find(item => item.id === product.id)
  const quantity = cartItem?.quantity || 0

  const name = language === 'am' ? product.nameAm : product.name
  const description = language === 'am' ? product.descriptionAm : product.description

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      nameAm: product.nameAm,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 md:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('product.backToMenu')}
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-beige shadow-lg">
                <Image
                  src={product.image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {!product.available && (
                  <div className="absolute inset-0 bg-chocolate/60 flex items-center justify-center">
                    <span className="text-cream font-medium px-6 py-3 bg-chocolate/80 rounded-full">
                      {t('product.outOfStock')}
                    </span>
                  </div>
                )}
                {product.featured && product.available && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-white text-sm font-medium px-4 py-2 rounded-full">
                      {t('product.bestSeller')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground capitalize mb-2">
                  {product.category.replace('-', ' ')}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {name}
                </h1>
                <p className="text-2xl font-serif font-bold text-primary mb-6">
                  {product.price.toLocaleString()} {t('common.etb')}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {description}
                </p>
              </div>

              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                    {t('product.ingredients')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-3 py-1 bg-beige text-foreground text-sm rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {product.available ? (
                  quantity === 0 ? (
                    <Button
                      onClick={handleAdd}
                      size="lg"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {t('btn.addToOrder')}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3 bg-beige rounded-full p-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-8 text-center font-medium text-lg">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <Link href="/cart" className="flex-1">
                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6">
                          {t('cart.title')}
                        </Button>
                      </Link>
                    </div>
                  )
                ) : (
                  <Button disabled size="lg" className="flex-1 rounded-full py-6">
                    {t('product.unavailable')}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t('product.freeDelivery')}</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t('product.freshDaily')}</p>
                </div>
                <div className="text-center">
                  <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t('product.beautifulPackaging')}</p>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                {t('product.related')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} showDescription={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
