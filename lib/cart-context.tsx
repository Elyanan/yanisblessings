'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { parseCartLineId } from '@/lib/granola-sizes'

export interface CartItem {
  id: string
  productId: string
  name: string
  nameAm?: string
  price: number
  quantity: number
  image: string
  category: string
  sizeLabel?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('yanis-cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[]
        setItems(
          parsed.map((item) => {
            const { productId } = parseCartLineId(item.id)
            return {
              ...item,
              productId: item.productId ?? productId,
            }
          }),
        )
      } catch {
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('yanis-cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const { productId: parsedProductId } = parseCartLineId(item.id)
    const normalized = {
      ...item,
      productId: item.productId ?? parsedProductId,
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === normalized.id)
      if (existing) {
        return prev.map(i =>
          i.id === normalized.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...normalized, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
