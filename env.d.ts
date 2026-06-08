/** Ambient env types (works even before `npm install` / @types/node). */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test'
    NEXT_PUBLIC_SITE_URL?: string
    NEXT_PUBLIC_TELEGRAM_USERNAME?: string
    NEXT_PUBLIC_SANITY_PROJECT_ID?: string
    NEXT_PUBLIC_SANITY_DATASET?: string
    OWNER_EMAIL?: string
    AUTH_SECRET?: string
    AUTH_URL?: string
    ADMIN_USERNAME?: string
    ADMIN_PASSWORD?: string
    SANITY_API_TOKEN?: string
    RESEND_API_KEY?: string
    RESEND_FROM_EMAIL?: string
    RESEND_SANDBOX?: string
    ORDERS_EMAIL?: string
    CONTACT_EMAIL?: string
  }
}

declare const process: {
  env: NodeJS.ProcessEnv
}
