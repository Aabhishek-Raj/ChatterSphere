import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  console.log('middleware calling...')
  const token = req.cookies.get('token')

  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Only apply middleware to specific routes
export const config = {
  matcher: ['/chat/:path*', '/profile/:path*'],
}
