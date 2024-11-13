import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin)
  const { pathname } = request.nextUrl

  // Only run this middleware for /admin routes
  if (pathname.startsWith('/admin')) {
    // Exclude the main admin login page from middleware
    if (pathname === '/admin') {
      return NextResponse.next()
    }

    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      // Redirect to admin login page with return URL
      const url = new URL('/admin', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    try {
      verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      // Token is invalid - redirect to login
      const url = new URL('/admin', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}