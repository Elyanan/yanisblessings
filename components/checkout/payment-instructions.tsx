'use client'

import { Building2, HandCoins, ShieldCheck, Smartphone } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { paymentMethods } from '@/lib/payments'

export function PaymentInstructions() {
  const { language } = useLanguage()
  const en = language === 'en'

  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-beige/80 via-card to-primary/10 p-4 sm:p-5 shadow-md ring-1 ring-gold/10">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {en ? 'Payment on delivery' : 'በመላክ ጊዜ ክፍያ'}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-foreground sm:text-xl">
          {en ? 'Pay when your order arrives' : 'ትዕዛዝዎ ሲደርስ ይክፈሉ'}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {en
            ? 'You can pay at delivery using cash, Telebirr, or bank transfer. Please keep your phone available for delivery confirmation.'
            : 'በመላክ ጊዜ በጥሬ ገንዘብ፣ በቴሌብር ወይም በባንክ ዝውውር መክፈል ይችላሉ። ለማረጋገጫ ስልክዎን ክፍት ያድርጉ።'}
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="text-sm text-muted-foreground">
            {en
              ? 'Our team will confirm your order details first. No manual total entry is needed.'
              : 'ቡድናችን ትዕዛዝዎን በመጀመሪያ ያረጋግጣል። ጠቅላላ መጠን በራስ-ሰር ይታያል።'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A651]/15 text-[#00A651]">
              <Smartphone className="h-4 w-4" />
            </span>
            <span className="font-semibold text-foreground">Telebirr</span>
          </div>
          <p className="font-mono text-lg font-bold text-foreground tracking-wide">{paymentMethods.telebirr}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-chocolate/10 text-chocolate">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="font-semibold text-foreground">
              {en ? 'Commercial Bank of Ethiopia' : 'የኢትዮጵያ ንግድ ባንክ (CBE)'}
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">{en ? 'Account number' : 'የሂሳብ ቁጥር'}</dt>
              <dd className="font-mono font-semibold text-foreground">{paymentMethods.bankAccountNumber}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{en ? 'Account name' : 'የሂሳብ ስም'}</dt>
              <dd className="font-medium text-foreground">{paymentMethods.bankAccountName}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <HandCoins className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            {en
              ? 'Cash on delivery is also accepted.'
              : 'በመላክ ጊዜ በጥሬ ገንዘብ መክፈልም ይቻላል።'}
          </span>
        </p>
      </div>
    </div>
  )
}
