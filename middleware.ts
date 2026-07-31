import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const protectedPaths = ['/profile', '/dashboard', '/admin']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Tool RESULT permalinks (/tools/<slug>/r/<data>, plus their /card and /story
  // image routes) are shareable artifacts, not indexable surfaces. They carry an
  // HTML canonical back to the base /tools/<slug> page; here we reinforce that
  // with X-Robots-Tag: noindex and deliberately do NOT emit a self-referencing
  // Link canonical, so they never spawn thin duplicate index bloat.
  const isToolResult = /^\/tools\/[^/]+\/r\//.test(pathname)
  if (isToolResult) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex, follow')
    return supabaseResponse
  }

  // Emit a self-referencing HTTP canonical header on public marketing pages.
  // Scrapers copy our HTML but rarely replicate response headers, so this is a
  // strong anti-hijack signal (Google weights the header canonical highly).
  // Skip private/noindex letter pages and auth/account areas.
  const noCanonicalPrefixes = ['/letter', '/api', '/auth', '/profile', '/dashboard', '/admin']
  const skipCanonical = noCanonicalPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (!skipCanonical) {
    const canonicalUrl = `https://www.shareloveletters.com${pathname}`
    supabaseResponse.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
