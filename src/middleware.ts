import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware

  // Only fetch user if we're on a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/orders');

  if (!isProtectedRoute) {
    return response;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // 1. If it's an admin route, we need to check the 'profiles' table
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Fetch the role from your public.profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      // Redirect non-admins to the home page
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Early return for admin routes - no need to check customer routes
    return response;
  }

  // 2. Protect Customer Routes (Standard login check)
  const isCustomerRoute = request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/orders')

  if (isCustomerRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/orders/:path*'],
}