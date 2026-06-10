'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GranolaSizeSelector } from '@/components/granola-size-selector'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import {
  cartLineId,
  formatItemNameWithSize,
  getGranolaPrice,
  getGranolaSizeOption,
  isGranolaWithSizes,
  type GranolaSizeKey,
} from '@/lib/granola-sizes'
import type { Product } from '@/lib/products'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  showDescription?: boolean
}

export function ProductCard({ product, showDescription = true }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart()
  const { language, t } = useLanguage()
  const hasSizes = isGranolaWithSizes(product)
  const [selectedSize, setSelectedSize] = useState<GranolaSizeKey>('1kg')

  const lineId = hasSizes ? cartLineId(product.id, selectedSize) : product.id
  const cartItem = items.find((item) => item.id === lineId)
  const quantity = cartItem?.quantity || 0

  const name = language === 'am' ? product.nameAm : product.name
  const description = language === 'am' ? product.descriptionAm : product.description
  const sizeOption = hasSizes ? getGranolaSizeOption(selectedSize) : null
  const displayPrice = hasSizes
    ? getGranolaPrice(product.price, selectedSize)
    : product.price
  const sizeLabel = sizeOption
    ? language === 'am'
      ? sizeOption.labelAm
      : sizeOption.label
    : undefined

  const handleAdd = () => {
    addItem({
      id: lineId,
      productId: product.id,
      name: formatItemNameWithSize(product.name, sizeLabel),
      nameAm: formatItemNameWithSize(product.nameAm, sizeLabel),
      price: displayPrice,
      image: product.image,
      category: product.category,
      sizeLabel,
    })
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
      <Link href={`/menu/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-beige">
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!product.available && (
            <div className="absolute inset-0 bg-chocolate/60 flex items-center justify-center">
              <span className="text-cream font-medium px-4 py-2 bg-chocolate/80 rounded-full text-sm">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
          {product.featured && product.available && (
            <div className="absolute top-3 left-3">
              <span className="bg-gold text-white text-xs font-medium px-3 py-1 rounded-full">
                {t('product.bestSeller')}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 md:p-5">
        <Link href={`/menu/${product.id}`}>
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
            {name}
          </h3>
        </Link>

        {showDescription && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}

        {hasSizes && product.available && (
          <GranolaSizeSelector
            basePrice={product.price}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            language={language}
            compact
            className="mt-3"
          />
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl font-bold text-gold">
              {displayPrice.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">ETB</span>
          </div>

          {product.available && (
            <>
              {quantity === 0 ? (
                <Button
                  onClick={handleAdd}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm"
                >
                  {t('btn.addToOrder')}
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-secondary rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(lineId, quantity - 1)}
                    className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={handleAdd}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
