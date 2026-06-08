'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/logo.png'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { PaymentInstructions } from '@/components/checkout/payment-instructions'
import { TelegramIcon } from '@/components/telegram-icon'
import { calculateDeliveryTotals } from '@/lib/delivery'
import { siteConfig, telegramOrderUrl, whatsappOrderUrl } from '@/lib/site-config'
import { OrderSuccessScreen } from '@/components/order-success-screen'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  MessageCircle,
  Truck,
  Gift,
  Sparkles
} from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart()
  const { t, tp, language } = useLanguage()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState('')

  const freeDeliveryThreshold = siteConfig.freeDeliveryThreshold
  const { deliveryFee, total: orderTotal } = calculateDeliveryTotals(totalPrice)

  const buildMessagingOrderText = () => {
    const itemsList = items
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ETB`,
      )
      .join('\n')

    return (
      `*New Order from Yani's Blessings Website*\n\n` +
      `*Customer:* ${customerInfo.name}\n` +
      `*Phone:* ${customerInfo.phone}\n` +
      `*Delivery Address:* ${customerInfo.address}\n\n` +
      `*Order Items:*\n${itemsList}\n\n` +
      `*Subtotal:* ${totalPrice.toLocaleString()} ETB\n` +
      `*Delivery:* ${totalPrice >= freeDeliveryThreshold ? 'FREE' : `${deliveryFee} ETB`}\n` +
      `*Total:* ${orderTotal.toLocaleString()} ETB\n\n` +
      `${customerInfo.notes ? `*Notes:* ${customerInfo.notes}` : ''}`
    )
  }

  const canMessageOrder =
    Boolean(customerInfo.name) && Boolean(customerInfo.phone) && Boolean(customerInfo.address)

  const handleWhatsAppOrder = () => {
    window.open(whatsappOrderUrl(buildMessagingOrderText()), '_blank')
  }

  const handleTelegramOrder = () => {
    window.open(telegramOrderUrl(buildMessagingOrderText()), '_blank')
  }

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true)
    setOrderError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
          notes: customerInfo.notes,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })
      if (!res.ok) throw new Error('Order failed')
      setOrderPlaced(true)
      clearCart()
    } catch {
      setOrderError(t('cart.error'))
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (orderPlaced) {
    return (
      <OrderSuccessScreen
        title={t('cart.orderSuccess')}
        description={t('cart.orderSuccessDesc')}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
              {t('btn.continueShopping')}
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full px-8 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('footer.whatsapp')}
              </Button>
            </a>
            <a href={siteConfig.telegramUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full px-8 w-full sm:w-auto">
                <TelegramIcon className="w-5 h-5 mr-2" />
                {t('footer.telegram')}
              </Button>
            </a>
          </div>
        </div>
      </OrderSuccessScreen>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 md:pt-40 pb-20 mt-8">
          <div className="max-w-md w-full text-center">
            <div className="relative mx-auto mb-8 h-28 w-28 sm:h-32 sm:w-32">
              <Image
                src={logo}
                alt="Yani's Blessings"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 112px, 128px"
                priority
              />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('cart.empty')}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('cart.emptyDesc')}
            </p>
            <Link href="/menu" className="inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                {t('btn.browseMenu')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-beige/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {t('cart.title')}
              </h1>
              <p className="text-muted-foreground">
                {totalItems} {t('cart.items')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border flex gap-4"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-foreground text-lg">
                          {language === 'am' && item.nameAm ? item.nameAm : item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm capitalize">
                          {item.category.replace('-', ' ')}
                          {item.sizeLabel ? ` · ${item.sizeLabel}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-beige rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-background transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-background transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-serif font-bold text-lg text-foreground">
                        {(item.price * item.quantity).toLocaleString()} ETB
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('btn.clearCart')}
              </button>
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-3xl p-6 md:p-8 shadow-lg border border-border sticky top-24">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                  {t('checkout.orderSummary')}
                </h2>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('cart.subtotal')}</span>
                    <span>{totalPrice.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {t('cart.delivery')}
                    </span>
                    <span>
                      {totalPrice >= freeDeliveryThreshold ? (
                        <span className="text-green-600 font-medium">{t('cart.free')}</span>
                      ) : (
                        `${deliveryFee} ETB`
                      )}
                    </span>
                  </div>
                  {totalPrice < freeDeliveryThreshold && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {tp('cart.freeDeliveryHint', { amount: (freeDeliveryThreshold - totalPrice).toLocaleString() })}
                    </p>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-serif font-bold text-lg text-foreground">
                    <span>{t('cart.total')}</span>
                    <span>{orderTotal.toLocaleString()} ETB</span>
                  </div>
                </div>

                <PaymentInstructions />

                {/* Customer Info Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('cart.fullName')} *
                    </label>
                    <Input
                      required
                      placeholder={t('cart.namePlaceholder')}
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('cart.phone')} *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder={t('cart.phonePlaceholder')}
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('cart.email')}
                    </label>
                    <Input
                      type="email"
                      placeholder={t('cart.emailPlaceholder')}
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('cart.address')} *
                    </label>
                    <Input
                      required
                      placeholder={t('cart.addressPlaceholder')}
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {language === 'en' ? 'Special Instructions' : 'ልዩ መመሪያዎች'}
                    </label>
                    <textarea
                      placeholder={language === 'en' ? 'Any notes for your order?' : 'ለትዕዛዝዎ ማስታወሻዎች?'}
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none text-sm"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Checkout Buttons */}
                {orderError && <p className="text-destructive text-sm">{orderError}</p>}
                <div className="space-y-3">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address || isCheckingOut}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg font-medium"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('cart.processing')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {t('btn.placeOrder')}
                      </span>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        {t('cart.or')}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleWhatsAppOrder}
                    disabled={!canMessageOrder}
                    variant="outline"
                    className="w-full rounded-full py-6 text-lg font-medium border-2 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('btn.orderViaWhatsapp')}
                  </Button>

                  <Button
                    onClick={handleTelegramOrder}
                    disabled={!canMessageOrder}
                    variant="outline"
                    className="w-full rounded-full py-6 text-lg font-medium border-2 border-[#0088cc] text-[#0088cc] hover:bg-[#0088cc]/10"
                  >
                    <TelegramIcon className="w-5 h-5 mr-2" />
                    {t('btn.orderViaTelegram')}
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>{t('cart.fastDelivery')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      <span>{t('cart.freshPacked')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
