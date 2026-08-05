import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// A quiz that exists in admin_quizzes but has been unpublished is a deliberate,
// permanent removal — it must answer 410 Gone rather than 404 so Google drops it
// from the index quickly instead of logging a "Not found (404)" coverage error.
// Genuinely unknown slugs still fall through to the page's normal 404. No
// redirect to the hub: redirecting removed content creates soft-404s.
// admin_quizzes has RLS with no policies, so this reads with the service key and
// caches the (tiny) slug list in the isolate to keep it off the request path.
const RETIRED_TTL_MS = 5 * 60 * 1000
let retiredCache: { slugs: Set<string>; at: number } | null = null

async function getRetiredQuizSlugs(): Promise<Set<string> | null> {
  if (retiredCache && Date.now() - retiredCache.at < RETIRED_TTL_MS) return retiredCache.slugs
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(`${url}/rest/v1/admin_quizzes?select=slug&published=eq.false`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const rows = (await res.json()) as { slug: string }[]
    const slugs = new Set(rows.map(r => r.slug))
    retiredCache = { slugs, at: Date.now() }
    return slugs
  } catch {
    return null
  }
}

const GONE_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>This quiz has been removed — ShareLove Letters</title>
<style>
:root{color-scheme:light}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:linear-gradient(135deg,#fff1f2,#fdf8f0);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#881337;padding:24px}
.card{background:#fff;border:1px solid #ffe4e6;border-radius:24px;box-shadow:0 4px 24px rgba(136,19,55,.06);
padding:48px 40px;max-width:34rem;text-align:center}
.mark{font-size:44px;margin-bottom:20px}
h1{font-family:Georgia,"Times New Roman",serif;font-size:28px;line-height:1.25;margin:0 0 16px;color:#881337}
p{font-size:15px;line-height:1.7;color:rgba(159,18,57,.75);margin:0 0 14px}
.btn{display:inline-block;margin-top:14px;background:#e11d48;color:#fff;text-decoration:none;
padding:13px 30px;border-radius:9999px;font-weight:600;font-size:14px}
.small{margin-top:22px;font-size:13px}
.small a{color:#e11d48}
</style></head><body>
<div class="card">
<div class="mark">🗑️</div>
<h1>This quiz has been removed</h1>
<p>We retired this one for good. It has not moved somewhere else, so there is nothing here to send you on to.</p>
<p>The quizzes we kept are the ones about the people you actually write letters to — how well you know your best friend, how you handle an apology, what kind of letter you should write next.</p>
<a class="btn" href="/quizzes">Browse the quizzes</a>
<p class="small"><a href="/">ShareLove Letters</a> &middot; <a href="/write">Write a letter</a></p>
</div></body></html>`

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

  // Unpublished quizzes: 410 Gone (see note above). Only single-segment
  // /quizzes/<slug> paths are candidates; the hub itself is untouched.
  const retiredQuiz = /^\/quizzes\/([^/]+)\/?$/.exec(pathname)
  if (retiredQuiz) {
    const retired = await getRetiredQuizSlugs()
    if (retired?.has(retiredQuiz[1])) {
      return new NextResponse(GONE_PAGE, {
        status: 410,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
          'X-Robots-Tag': 'noindex',
        },
      })
    }
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

  // User-generated quiz instances (/tools/quiz/<id>, its /scoreboard and /card,
  // and the /create builder) are never indexable — only the /tools/quiz hub is.
  // Match anything UNDER /tools/quiz/ (the trailing slash spares the hub itself).
  // noindex here + no self-referencing Link canonical, so UGC never enters search
  // or the index-coverage sweep.
  const isQuizInstance = /^\/tools\/quiz\/.+/.test(pathname)
  if (isQuizInstance) {
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
