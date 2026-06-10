import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { LanguageProvider } from '@/lib/language-context'
import { LanguageScript } from '@/components/language-script'
import { JsonLdScript } from '@/components/seo/json-ld-script'
import { isValidLanguage } from '@/lib/constants/language'
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/json-ld'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  ...buildPageMetadata(pageSeo.home),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanisblessings.com'),
  applicationName: "Yani's Blessings",
  creator: "Yani's Blessings",
  publisher: "Yani's Blessings",
  other: {
    'content-language': 'en, am',
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
  manifest: '/manifest.webmanifest',
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
        <JsonLdScript data={[buildOrganizationSchema(), buildWebsiteSchema()]} id="site-jsonld" />
        <LanguageScript />
        <LanguageProvider initialLanguage={initialLanguage}>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
