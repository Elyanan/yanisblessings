'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappCustomerUrl } from '@/lib/whatsapp'
import { TelegramIcon } from '@/components/telegram-icon'
import { telegramCustomerUrl } from '@/lib/telegram'

type Props = {
  phone: string
  telegram?: string | null
  message: string
}

export function CustomerContactButtons({ phone, telegram, message }: Props) {
  const telegramUrl = telegramCustomerUrl(telegram, phone, message)
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`

  return (
    <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:flex-wrap">
      <Button
        size="sm"
        variant="outline"
        className="h-10 w-full rounded-full border-primary/30 sm:w-auto"
        asChild
      >
        <a href={phoneHref}>
          <Phone className="mr-1.5 h-4 w-4" />
          Call customer
        </a>
      </Button>
      <Button
        size="sm"
        className="h-10 w-full rounded-full border-0 bg-[#25D366] text-white hover:bg-[#20BD5A] sm:w-auto"
        asChild
      >
        <a href={whatsappCustomerUrl(phone, message)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-1.5 h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      {telegramUrl && (
        <Button
          size="sm"
          className="h-10 w-full rounded-full border-0 bg-[#0088cc] text-white hover:bg-[#0077b5] sm:w-auto"
          asChild
        >
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="mr-1.5 h-4 w-4" />
            Telegram
          </a>
        </Button>
      )}
    </div>
  )
}
