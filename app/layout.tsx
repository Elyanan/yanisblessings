import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { LanguageProvider } from '@/lib/language-context'
import { LanguageScript } from '@/components/language-script'
import { isValidLanguage } from '@/lib/constants/language'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanisblessings.com'),
  title: "Yani's Blessings | Homemade Granola, Cupcakes & Cookies",
  description: 'A Little Blessing in Every Bite. Premium homemade granola, cupcakes, cookies and gift boxes made with love in Addis Ababa, Ethiopia.',
  keywords: ['bakery', 'granola', 'cupcakes', 'cookies', 'gift boxes', 'Addis Ababa', 'Ethiopia', 'homemade', 'artisan'],
  authors: [{ name: "Yani's Blessings" }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Yani's Blessings | Homemade Granola, Cupcakes & Cookies",
    description: 'A Little Blessing in Every Bite. Premium homemade treats made with love in Addis Ababa.',
    type: 'website',
    images: [{ url: '/logo.png', alt: "Yani's Blessings" }],
  },
}

export const viewport: Viewport = {
  themeColor: '#FFF7ED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('yanis-language')?.value
  const initialLanguage = isValidLanguage(langCookie) ? langCookie : 'en'

  return (
    <html lang={initialLanguage} className={`${inter.variable} ${playfair.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <LanguageScript />
        <LanguageProvider initialLanguage={initialLanguage}>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
