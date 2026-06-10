import Link from 'next/link'
import type { ReactNode } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { POLICY_LAST_UPDATED } from '@/lib/policies/constants'

type Props = {
  title: string
  description: string
  children: ReactNode
  jsonLd: object | object[]
}

const policyLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund & Cancellation' },
  { href: '/terms', label: 'Terms & Conditions' },
]

export function PolicyLayout({ title, description, children, jsonLd }: Props) {
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          <div className="bg-gradient-to-b from-beige/80 to-background border-b border-border">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-10">
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
                <ol className="flex flex-wrap items-center gap-1">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-foreground font-medium" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
              <header>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance mb-4">
                  {title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{description}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Last updated: <time dateTime={POLICY_LAST_UPDATED}>{POLICY_LAST_UPDATED}</time>
                </p>
              </header>
            </div>
          </div>

          <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <nav
              aria-label="Related policies"
              className="mb-10 flex flex-wrap gap-2"
            >
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs sm:text-sm rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-10">{children}</div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}
