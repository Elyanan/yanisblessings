import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

export function PolicyContactBlock() {
  return (
    <aside className="rounded-2xl border border-border bg-beige/50 p-6 not-prose">
      <h2 className="font-serif text-xl font-bold text-foreground mb-3">Questions about these policies?</h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        We are happy to help. Reach out and we will respond as soon as we can during business hours.
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="text-muted-foreground">Email: </span>
          <a href={siteConfig.emailMailto} className="text-primary font-medium hover:underline">
            {siteConfig.email}
          </a>
        </li>
        <li>
          <span className="text-muted-foreground">Phone / WhatsApp: </span>
          <a href={siteConfig.whatsappUrl} className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">
            {siteConfig.phoneDisplay}
          </a>
        </li>
        <li>
          <span className="text-muted-foreground">Contact form: </span>
          <Link href="/contact" className="text-primary font-medium hover:underline">
            yanisblessings.com/contact
          </Link>
        </li>
      </ul>
    </aside>
  )
}
