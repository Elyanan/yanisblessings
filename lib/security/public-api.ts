import { NextResponse } from 'next/server'
import { isAllowedOrigin } from '@/lib/security/origin'

/** Reject cross-site POSTs to public mutation endpoints in production. */
export function rejectIfBadOrigin(request: Request): NextResponse | null {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
