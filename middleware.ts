import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/users-management',
  '/communication-tool',
  '/notifications',
  '/content-moderation',
  '/audit-logs',
  '/billing-plan',
  '/club-management',
  '/data-export',
  '/reports-abuse',
  '/reviews-rating',
  '/settings',
  '/profile-setting'
]

// const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authToken = request.cookies.get('auth_token')?.value
  const isAuth = request.cookies.get('auth')?.value === 'true'

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route) || pathname.startsWith(`/admin${route}`)
  )

//   const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && (!authToken || !isAuth)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && authToken && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
