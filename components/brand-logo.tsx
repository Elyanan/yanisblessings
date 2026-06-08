import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/logo.png'
import logoWhite from '@/assets/logo_white.png'
import { cn } from '@/lib/utils'

const sizeWrappers = {
  sm: 'h-12 w-12',
  md: 'h-24 w-48',
  lg: 'h-28 w-56',
  nav: 'h-[4.25rem] w-[11.5rem] sm:h-[4.75rem] sm:w-[13.5rem] md:h-[5.5rem] md:w-[17rem] lg:h-[5.75rem] lg:w-[19rem]',
  footer: 'h-36 w-56 sm:h-40 sm:w-64 md:h-44 md:w-72',
  admin: 'h-11 w-11',
} as const

type BrandLogoProps = {
  size?: keyof typeof sizeWrappers
  variant?: 'default' | 'white'
  className?: string
  linkToHome?: boolean
  priority?: boolean
}

export function BrandLogo({
  size = 'md',
  variant = 'default',
  className,
  linkToHome = true,
  priority = false,
}: BrandLogoProps) {
  const src = variant === 'white' ? logoWhite : logo
  const image = (
    <span className={cn('relative inline-block flex-shrink-0', sizeWrappers[size], className)}>
      <Image
        src={src}
        alt="Yani's Blessings — granola, cupcakes, and cakes"
        fill
        sizes="(max-width: 640px) 184px, (max-width: 768px) 216px, 304px"
        className="object-contain object-left"
        priority={priority}
      />
    </span>
  )

  if (!linkToHome) {
    return image
  }

  return (
    <Link href="/" className="inline-flex flex-shrink-0 items-center">
      {image}
    </Link>
  )
}
