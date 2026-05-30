'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useLanguage } from '@/lib/language-context'
import { useProducts } from '@/lib/use-products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MenuPage() {
  const { t, tp, language } = useLanguage()
  const { products, categories, loading } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const name = language === 'am' ? product.nameAm : product.name
      const description = language === 'am' ? product.descriptionAm : product.description
      const matchesSearch = searchQuery === '' || 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery, language, products])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('menu.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-40 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('menu.searchProducts')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-secondary border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-foreground font-medium"
            >
              <Filter className="w-5 h-5" />
              {t('menu.filters')}
            </button>

            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {language === 'am' ? category.nameAm : category.name}
                </button>
              ))}
            </div>
          </div>

          {showFilters && (
            <div className="md:hidden flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setShowFilters(false)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {language === 'am' ? category.nameAm : category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">{t('common.loading')}</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">{t('menu.noResults')}</p>
              <Button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                variant="outline"
                className="rounded-full"
              >
                {t('menu.clearFilters')}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {tp('menu.productsFound', { count: String(filteredProducts.length) })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
