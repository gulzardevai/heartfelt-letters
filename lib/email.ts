import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const SITE = 'https://www.shareloveletters.com'
const FROM = 'Gulzar from ShareLove <hello@shareloveletters.com>'

function welcomeEmailHtml(firstName: string) {
  const features: Array<[string, string, string, string]> = [
    ['✍️', 'Write your first letter', 'Ten beautiful letter types, handwriting fonts, and templates to get you started.', `${SITE}/write`],
    ['✉️', 'Sealed with a wax seal', 'Every letter arrives as a real envelope your reader opens — wax seal, paper, and all.', `${SITE}/write`],
    ['🔐', 'Private by design', 'AES-256 encryption at rest, optional password, and hidden from search engines.', `${SITE}/letters/secret-letter`],
    ['⏰', 'Send a letter to the future', 'Schedule a letter to unlock on a birthday, an anniversary — or years from now.', `${SITE}/letters/future-self`],
    ['🔔', 'Know the moment it lands', 'We email you the first time your letter is opened, and whenever someone replies to it.', `${SITE}/dashboard`],
    ['💐', 'Bouquets & songs', 'Attach a virtual flower bouquet or a song so your letter arrives with music.', `${SITE}/write`],
    ['🧠', '"How well do you know me?" quiz', 'Build a playful quiz and see how well they really know you.', `${SITE}/tools/quiz/create`],
    ['💬', '700+ quotes', 'Stuck for words? Browse hundreds of love, gratitude, and friendship quotes.', `${SITE}/quotes`],
    ['📖', 'Occasion guides', 'Guides and examples for every occasion, from apologies to anniversaries.', `${SITE}/letters`],
  ]

  const featureRows = features.map(([emoji, title, desc, url]) => `
    <tr>
      <td style="padding:0 0 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="40" valign="top" style="font-size:24px; line-height:1.2;">${emoji}</td>
            <td valign="top">
              <a href="${url}" style="color:#9f1239; font-weight:bold; font-size:16px; text-decoration:none;">${title} →</a>
              <p style="margin:4px 0 0; color:#6b4c4c; font-size:14px; line-height:1.6;">${desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:#fdf8f0; font-family:Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="font-size:48px; line-height:1;">💌</div>
              <h1 style="margin:12px 0 0; font-size:28px; color:#9f1239; font-weight:bold;">Welcome to ShareLove Letters</h1>
              <p style="margin:8px 0 0; color:#be123c; font-size:14px;">Letters that last a lifetime</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff; border:1px solid #fecdd3; border-radius:24px; padding:32px;">
              <p style="margin:0 0 16px; color:#6b4c4c; font-size:16px; line-height:1.7;">Dear ${firstName},</p>
              <p style="margin:0 0 24px; color:#6b4c4c; font-size:16px; line-height:1.7;">
                We're so glad you're here. ShareLove Letters is a quiet corner of the internet for
                writing the things that matter — letters that last a lifetime. Here's everything
                waiting for you:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${featureRows}
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 20px;">
                    <a href="${SITE}/write" style="display:inline-block; background:#e11d48; color:#ffffff; padding:14px 36px; border-radius:50px; text-decoration:none; font-weight:bold; font-size:16px;">Write Your First Letter</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0; color:#9f7b7b; font-size:13px; line-height:1.7; text-align:center;">
                Your free account includes 10 letters a month. Letters expire after 30 days,
                and you can manage them anytime from your
                <a href="${SITE}/dashboard" style="color:#be123c;">dashboard</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0; color:#fda4af; font-size:12px;">Sent with 💌 by <strong>ShareLove Letters</strong></p>
              <p style="margin:6px 0 0;"><a href="${SITE}" style="color:#fda4af; font-size:12px;">shareloveletters.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// --- Notification emails -----------------------------------------------
//
// These are the plain, personal notes that make an account worth keeping:
// the sender hears about the moment their letter is opened and about every
// reply. They are deliberately NOT branded template emails — a short note
// from a person lands in Gmail's Primary tab, a marketing layout does not.
//
// The letter itself is never quoted. Content is AES-256 encrypted at rest
// precisely so we cannot read it; these emails only ever link to the site.

// Link previews (WhatsApp, iMessage, Slack, Discord...) fetch the letter URL
// the moment the sender pastes it. That is not somebody opening the letter,
// so it must never trigger the "it was opened" email.
const BOT_UA = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|twitter|linkedin|embedly|pinterest|skype|curl|wget|python-requests|node-fetch|axios|headless|lighthouse|monitor|pingdom|uptime/i

// Notification sends are awaited so we know whether to keep the send claim,
// but they can never hold a page or an API response open for long.
const NOTIFY_TIMEOUT_MS = 5000

function withTimeout(p: Promise<void>): Promise<void> {
  return Promise.race([p, new Promise<void>(resolve => setTimeout(resolve, NOTIFY_TIMEOUT_MS))])
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Renders plain paragraphs (bare URLs auto-linked) as a personal-looking note. */
function personalEmailHtml(paragraphs: string[]): string {
  const body = paragraphs
    .map(p => {
      const html = escapeHtml(p).replace(
        /(https:\/\/[^\s<]+)/g,
        '<a href="$1" style="color:#be123c;">$1</a>'
      )
      return `<p style="margin:0 0 16px;">${html}</p>`
    })
    .join('\n')
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#3f3030;">\n${body}\n</div>`
}

async function sendPersonalEmail(to: string, subject: string, paragraphs: string[]): Promise<void> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    text: paragraphs.join('\n\n'),
    html: personalEmailHtml(paragraphs),
  })
  // The SDK reports API failures in `error` rather than throwing, so without
  // this a rejected send would look like a delivered one — and the "already
  // notified" claim would be kept for an email nobody ever received.
  if (error) throw new Error(`Resend refused the send: ${error.name} — ${error.message}`)
}

async function getOwnerContact(userId: string): Promise<{ email: string; firstName: string } | null> {
  const { data } = await getSupabaseAdmin()
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()
  if (!data?.email) return null
  return {
    email: data.email,
    firstName: (data.full_name || '').trim().split(/\s+/)[0] || 'there',
  }
}

/** Who is looking at this page right now, if anyone is signed in. */
async function getViewerId(): Promise<string | null> {
  try {
    const { data } = await createSupabaseServerClient().auth.getUser()
    return data.user?.id ?? null
  } catch {
    return null
  }
}

async function runNotifyLetterOpened(shareId: string, userAgent: string | null): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  if (userAgent && BOT_UA.test(userAgent)) return

  const admin = getSupabaseAdmin()

  // Claim the send first: only the request whose conditional update actually
  // matches a row (user_id set, opened_notified_at still NULL) sends. This is
  // what makes it one email per letter rather than one per view, it is
  // race-safe across concurrent opens, and it means a guest letter or an
  // already-notified one costs exactly one query and nothing else.
  const { data: claimed } = await admin
    .from('letters')
    .update({ opened_notified_at: new Date().toISOString() })
    .eq('share_id', shareId)
    .is('opened_notified_at', null)
    .not('user_id', 'is', null)
    .select('id, user_id, recipient_name')
    .maybeSingle()

  if (!claimed?.user_id) return

  // The author checking their own link is not an open.
  const viewerId = await getViewerId()
  if (viewerId && viewerId === claimed.user_id) {
    await admin.from('letters').update({ opened_notified_at: null }).eq('id', claimed.id)
    return
  }

  const owner = await getOwnerContact(claimed.user_id)
  if (!owner) return

  const target = claimed.recipient_name ? ` to ${claimed.recipient_name}` : ''
  const subject = claimed.recipient_name
    ? `${claimed.recipient_name} just opened your letter`
    : 'Your letter was just opened'

  try {
    await sendPersonalEmail(owner.email, subject, [
      `Hi ${owner.firstName},`,
      `Your letter${target} has just been opened for the first time.`,
      `You can see the opens, and read any replies, on your dashboard: ${SITE}/dashboard`,
      `We never read your letters — they're encrypted, so all we can tell you is that it was opened.`,
      `— Gulzar`,
      `You're getting this because this letter is saved to your ShareLove account. Just reply to this email if you'd rather not hear about opens.`,
    ])
  } catch (sendErr) {
    // Release the claim so the next open can try again.
    await admin.from('letters').update({ opened_notified_at: null }).eq('id', claimed.id)
    console.error('[letter-opened-email] Send failed, claim released:', sendErr)
  }
}

/**
 * Emails the letter's author the FIRST time somebody else opens it.
 * De-duplicated by claiming `letters.opened_notified_at`, so repeat views send
 * nothing. Only fires for letters that belong to an account. Never throws and
 * never blocks the caller for more than NOTIFY_TIMEOUT_MS.
 */
export function notifyLetterOpened(shareId: string, userAgent: string | null): Promise<void> {
  return withTimeout(
    runNotifyLetterOpened(shareId, userAgent).catch(err => {
      console.error('[letter-opened-email] Unexpected error:', err)
    })
  )
}

async function runNotifyLetterReply(
  letterId: string,
  authorName: string | null,
  authorUserId: string | null
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  const admin = getSupabaseAdmin()
  const { data: letter } = await admin
    .from('letters')
    .select('user_id, share_id, recipient_name')
    .eq('id', letterId)
    .single()

  if (!letter?.user_id) return // guest letter — no address, and none was promised
  if (authorUserId && authorUserId === letter.user_id) return // the author replying to their own thread

  const owner = await getOwnerContact(letter.user_id)
  if (!owner) return

  const from = authorName || letter.recipient_name || 'Someone'
  await sendPersonalEmail(owner.email, `${from} replied to your letter`, [
    `Hi ${owner.firstName},`,
    `${from} has written back on the letter you sent${letter.recipient_name ? ` to ${letter.recipient_name}` : ''}.`,
    `You can read the reply on the letter itself: ${SITE}/letter/${letter.share_id}`,
    `Replies are encrypted just like your letters, so we can't show it to you here — but it's waiting for you.`,
    `— Gulzar`,
    `You're getting this because this letter is saved to your ShareLove account. Just reply to this email if you'd rather not hear about replies.`,
  ])
}

/**
 * Emails the letter's author when their letter gets a reply. One email per
 * reply (replies are already rate limited to 5 per IP per letter per day).
 * Never throws and never blocks the reply insert for more than NOTIFY_TIMEOUT_MS.
 */
export function notifyLetterReply(
  letterId: string,
  authorName: string | null,
  authorUserId: string | null
): Promise<void> {
  return withTimeout(
    runNotifyLetterReply(letterId, authorName, authorUserId).catch(err => {
      console.error('[letter-reply-email] Unexpected error:', err)
    })
  )
}

/**
 * Sends the branded welcome email to a user exactly once.
 * Race-safe: claims the send by setting welcome_sent_at where it is still NULL;
 * only the request that wins the claim actually sends. Never throws.
 */
export async function sendWelcomeEmailIfNew(userId: string): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('[welcome-email] RESEND_API_KEY not set — skipping welcome email')
      return
    }
    const admin = getSupabaseAdmin()
    const { data: claimed, error } = await admin
      .from('profiles')
      .update({ welcome_sent_at: new Date().toISOString() })
      .eq('id', userId)
      .is('welcome_sent_at', null)
      .select('email, full_name')
      .single()

    if (error || !claimed?.email) return // already sent, no profile yet, or no email

    const firstName = (claimed.full_name || '').trim().split(/\s+/)[0] || 'friend'

    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Gulzar from ShareLove <hello@shareloveletters.com>',
        to: claimed.email,
        subject: '💌 Welcome to ShareLove Letters — your first letter awaits',
        html: welcomeEmailHtml(firstName),
      })
      console.log(`[welcome-email] Sent welcome email to user ${userId}`)
    } catch (sendErr) {
      // Release the claim so a later sign-in can retry
      await admin.from('profiles').update({ welcome_sent_at: null }).eq('id', userId)
      console.error('[welcome-email] Send failed, claim released:', sendErr)
    }
  } catch (err) {
    console.error('[welcome-email] Unexpected error:', err)
  }
}
