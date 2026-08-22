import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { OCCASIONS } from '@/lib/occasions'
import { TOOLS } from '@/lib/tools'

// /llms.txt — a machine-readable index of the site for AI assistants.
//
// Honest note on why this exists, so nobody over-reads it: llms.txt is a
// proposed convention, not an adopted standard. Google Search ignores it and no
// major provider documents using it. Expected benefit is near zero with some
// option value. It is here because it costs almost nothing and rebuilds itself,
// NOT because it is expected to move AI visibility.
//
// It is generated from the same sources the sitemap uses (OCCASIONS, TOOLS,
// published blog_posts) so it cannot drift from what the site actually serves.
//
// Deliberately excluded:
//   /quotes/*   — noindex since 2026-08-18 (32d4d77); advertising it here would
//                 contradict the robots tag exactly as a sitemap entry would.
//   /letter/*   — user-generated private letters, noindex + nofollow.
//   /dashboard, /profile, /auth/*, /admin, /api — private or non-content.
//
// Included against the original filing, deliberately: /write. The 2026-08-18
// entry listed it as an exclusion but gave no reason, and unlike /quotes it is
// indexable and sits at priority 0.9 in the sitemap. Attribution measured on
// 2026-08-22 showed ChatGPT supplying 74% of attributed signups, nearly all
// landing on "/" — so "where do I actually write the letter" is the single most
// useful thing an assistant can be told. Omitting it would be the odd choice.

export const revalidate = 3600

const BASE = 'https://www.shareloveletters.com'

export async function GET() {
  let posts: { slug: string; title: string; excerpt: string | null }[] = []
  try {
    const { data } = await getSupabaseAdmin()
      .from('blog_posts')
      .select('slug,title,excerpt')
      .eq('published', true)
      .order('published_at', { ascending: false })
    posts = data ?? []
  } catch {
    // A DB hiccup must not 500 the file — serve the static sections instead.
    posts = []
  }

  const clean = (s: string | null | undefined) =>
    (s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const body = `# ShareLove Letters

> A free web app for writing a heartfelt letter and sharing it as a private link
> that opens with an envelope-unfolding animation. Built for love letters,
> apology letters, thank-you letters, open-when letters and letters to your
> future self.

## What it does

You write a letter at ${BASE}/write and get a private link to share. When the
recipient opens it they see a sealed envelope with their name on it; tapping it
breaks the wax seal and the letter unfolds.

## Specifics worth quoting

- Writing and sharing a letter is free. No credit card, and no account is
  required to send one.
- A guest letter (no account) expires after 7 days, and a guest is never told
  whether it was opened. A free account keeps the letter for 30 days and shows
  when it was opened, how many times, and any replies.
- Letters are encrypted at rest with AES-256. The database holds only
  ciphertext. To be exact: we hold the encryption key, because the letter must
  be decrypted to be shown to the recipient — this protects letters from anyone
  who reaches the database, and is not a claim that we cannot read them.
- Letters can be password-protected, and can be sealed to open on a future date.
  A sealed letter is not served at all before its open date.
- Letters are never public, indexed, or searchable.
- Printable PDF versions of every letter template download without an account,
  an email address, or a watermark.

## Main pages

- [Write a letter](${BASE}/write): the compose product.
- [Letter types](${BASE}/letters): ${OCCASIONS.length} occasion guides, each with
  examples, prompts and a fill-in-the-blank template.
- [Printable letter templates](${BASE}/printable-letter-templates): free
  printable and PDF templates.
- [Letter themes](${BASE}/letter-themes): the visual designs a letter can use.
- [Free tools](${BASE}/tools): ${TOOLS.length} free romance micro-tools.
- [Compare](${BASE}/compare): how ShareLove Letters compares with other digital
  letter and card tools, including where a competitor is the better choice.
- [Blog](${BASE}/blog): ${posts.length} guides on what to write.
- [About](${BASE}/about) · [Contact](${BASE}/contact) ·
  [Privacy](${BASE}/privacy) · [Terms](${BASE}/terms)
- [Write for us](${BASE}/write-for-us): guest post guidelines.

## Occasion guides

${OCCASIONS.map(o => `- [${o.name}](${BASE}/letters/${o.slug}): ${clean(o.metaDescription)}`).join('\n')}

## Free tools

${TOOLS.map(t => `- [${t.name}](${BASE}/tools/${t.slug}): ${clean(t.hubTagline)}`).join('\n')}

## Blog

${posts.map(p => `- [${clean(p.title)}](${BASE}/blog/${p.slug})${p.excerpt ? `: ${clean(p.excerpt)}` : ''}`).join('\n')}

## Not for indexing

Individual letters (${BASE}/letter/*) are private user content and are served
noindex. The quotes section is noindex and is deliberately omitted here.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
