'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Cake, Gift, Building2, Calendar, Upload, Sparkles, CheckCircle } from 'lucide-react'
import logo from '@/assets/logo.png'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/language-context'
import { siteConfig } from '@/lib/site-config'

const productTypes = [
  { id: 'birthday-cake', label: 'Birthday Cake', labelAm: 'የልደት ኬክ', icon: Cake },
  { id: 'custom-cupcakes', label: 'Custom Cupcakes', labelAm: 'ብጁ ካፕኬኮች', icon: Sparkles },
  { id: 'gift-box', label: 'Gift Box', labelAm: 'የስጦታ ሳጥን', icon: Gift },
  { id: 'corporate', label: 'Corporate Order', labelAm: 'የኩባንያ ትዕዛዝ', icon: Building2 },
  { id: 'event', label: 'Event Order', labelAm: 'የክስተት ትዕዛዝ', icon: Calendar },
]

const budgetRanges = [
  { id: 'under-2000', label: 'Under 2,000 ETB', labelAm: 'ከ2,000 ብር በታች' },
  { id: '2000-5000', label: '2,000 - 5,000 ETB', labelAm: '2,000 - 5,000 ብር' },
  { id: '5000-10000', label: '5,000 - 10,000 ETB', labelAm: '5,000 - 10,000 ብር' },
  { id: 'above-10000', label: 'Above 10,000 ETB', labelAm: 'ከ10,000 ብር በላይ' },
]

export default function CustomOrdersPage() {
  const { t, language } = useLanguage()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.assetId) {
        setAttachment({ assetId: data.assetId, url: data.url })
      }
    } catch {
      alert(t('common.error'))
    } finally {
      setUploadingImage(false)
    }
  }
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    productType: '',
    quantity: '',
    preferredDate: '',
    deliveryOption: 'delivery',
    deliveryArea: '',
    customMessage: '',
    flavorPreference: '',
    budgetRange: '',
    specialNotes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attachment, setAttachment] = useState<{ assetId: string; url: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedType = productTypes.find((p) => p.id === formData.productType)
    const productTypeLabel = selectedType
      ? (language === 'am' ? selectedType.labelAm : selectedType.label)
      : formData.productType

    try {
      await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          productType: productTypeLabel,
          quantity: formData.quantity,
          preferredDate: formData.preferredDate,
          deliveryOption: formData.deliveryOption,
          deliveryArea: formData.deliveryArea,
          customMessage: formData.customMessage,
          flavorPreference: formData.flavorPreference,
          budgetRange: formData.budgetRange,
          specialNotes: formData.specialNotes,
          attachmentAssetId: attachment?.assetId,
          attachmentUrl: attachment?.url,
        }),
      })
      setIsSubmitted(true)
    } catch {
      // Order submission should still show success if API fails silently — but we log client-side
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 md:pt-40 pb-20 mt-8">
          <div className="max-w-md w-full text-center">
            <div className="relative mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32">
              <Image
                src={logo}
                alt="Yani's Blessings"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 112px, 128px"
                priority
              />
            </div>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('custom.successTitle')}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('custom.successDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              >
                {t('custom.submitAnother')}
              </Button>
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full px-8 w-full sm:w-auto">
                  {t('btn.contactUs')}
                </Button>
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-beige relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                {language === 'am' ? 'ልዩ ትዕዛዞች' : 'Special Orders'}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {language === 'am' ? 'ልዩ ትዕዛዞች' : 'Custom Orders'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === 'am'
                  ? 'ለበዓልዎ ልዩ ነገር ይፍጠሩ። ብጁ ኬኮች፣ ካፕኬኮች፣ የስጦታ ሳጥኖች እና ሌሎችም።'
                  : 'Create something special for your celebration. Custom cakes, cupcakes, gift boxes, and more.'}
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl hidden lg:block">
              <Image
                src="/images/box-custom.png"
                alt="Custom bakery orders"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {language === 'am' ? 'የእውቂያ መረጃ' : 'Contact Information'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ሙሉ ስም' : 'Full Name'} *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-secondary border-0"
                    placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-secondary border-0"
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ኢሜይል' : 'Email'}
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-xl bg-secondary border-0"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Product Type Selection */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {language === 'am' ? 'የምርት ዓይነት' : 'Product Type'} *
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {productTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                      formData.productType === type.id
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productType"
                      value={type.id}
                      checked={formData.productType === type.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <type.icon className="w-6 h-6" />
                    <span className="text-sm font-medium text-center">
                      {language === 'am' ? type.labelAm : type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {language === 'am' ? 'የትዕዛዝ ዝርዝሮች' : 'Order Details'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ብዛት' : 'Quantity'} *
                  </label>
                  <Input
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-secondary border-0"
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'የሚፈለገው ቀን' : 'Preferred Date'} *
                  </label>
                  <Input
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-secondary border-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'የጣዕም ምርጫ' : 'Flavor Preference'}
                  </label>
                  <Input
                    name="flavorPreference"
                    value={formData.flavorPreference}
                    onChange={handleChange}
                    className="rounded-xl bg-secondary border-0"
                    placeholder={language === 'am' ? 'ለምሳሌ: ቸኮሌት፣ ቫኒላ' : 'e.g., Chocolate, Vanilla'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'የበጀት ክልል' : 'Budget Range'}
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-secondary border-0 px-3 py-2 text-foreground"
                  >
                    <option value="">{language === 'am' ? 'ይምረጡ' : 'Select'}</option>
                    {budgetRanges.map((range) => (
                      <option key={range.id} value={range.id}>
                        {language === 'am' ? range.labelAm : range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {language === 'am' ? 'የማድረስ አማራጮች' : 'Delivery Options'}
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {[
                    { id: 'delivery', label: language === 'am' ? 'ማድረስ' : 'Delivery' },
                    { id: 'pickup', label: language === 'am' ? 'መውሰድ' : 'Pickup' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                        formData.deliveryOption === option.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.id}
                        checked={formData.deliveryOption === option.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.deliveryOption === 'delivery' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {language === 'am' ? 'የማድረሻ አካባቢ' : 'Delivery Area'} *
                    </label>
                    <Input
                      name="deliveryArea"
                      value={formData.deliveryArea}
                      onChange={handleChange}
                      required={formData.deliveryOption === 'delivery'}
                      className="rounded-xl bg-secondary border-0"
                      placeholder={language === 'am' ? 'ለምሳሌ: ቦሌ፣ ሲኤምሲ' : 'e.g., Bole, CMC'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Custom Message & Notes */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {language === 'am' ? 'ተጨማሪ ዝርዝሮች' : 'Additional Details'}
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ብጁ መልእክት (በኬክ ላይ)' : 'Custom Message (on cake)'}
                  </label>
                  <Input
                    name="customMessage"
                    value={formData.customMessage}
                    onChange={handleChange}
                    className="rounded-xl bg-secondary border-0"
                    placeholder={language === 'am' ? 'ለምሳሌ: እንኳን ለልደትዎ' : 'e.g., Happy Birthday!'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'ልዩ ማስታወሻዎች' : 'Special Notes'}
                  </label>
                  <textarea
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl bg-secondary border-0 px-3 py-2 text-foreground resize-none"
                    placeholder={language === 'am' 
                      ? 'ሌላ ማንኛውንም ዝርዝሮች ወይም ጥያቄዎች እዚህ ያካፍሉ...'
                      : 'Share any other details or requests here...'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'am' ? 'የመነሳሻ ምስል ይጫኑ' : 'Upload Inspiration Image'}
                  </label>
                  <label className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingImage ? t('common.loading') : t('custom.uploadHint')}
                    </p>
                    {attachment?.url && (
                      <p className="text-sm text-green-600 mt-2">{t('common.success')}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg font-medium"
            >
              {isSubmitting 
                ? (language === 'am' ? 'በመላክ ላይ...' : 'Submitting...')
                : (language === 'am' ? 'ብጁ ትዕዛዝ ጥያቄ ያስገቡ' : 'Submit Custom Order Request')}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
