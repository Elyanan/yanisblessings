'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/products'
import type { CategoryFilter } from '@/lib/get-products'

const defaultCategories: CategoryFilter[] = [{ id: 'all', name: 'All', nameAm: 'ሁሉም' }]

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryFilter[]>(defaultCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.products)) setProducts(data.products)
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories)
        }
      })
      .catch(() => {
        setProducts([])
        setCategories(defaultCategories)
      })
      .finally(() => setLoading(false))
  }, [])

  return { products, categories, loading }
}
