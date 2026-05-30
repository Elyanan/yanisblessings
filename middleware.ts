import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === '/admin/login'
  const isStudio = pathname.startsWith('/admin/studio')

  if (pathname.startsWith('/admin') && !isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL('/admin/login', req.nextUrl.origin))
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/admin', req.nextUrl.origin))
  }

  if (isStudio && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl.origin))
  }
})

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
