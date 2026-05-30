import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  children: ReactNode
}

export function PolicySection({ id, title, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <h2 id={`${id}-heading`} className="font-serif text-2xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80">
        {children}
      </div>
    </section>
  )
}
