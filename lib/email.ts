import { getSupabaseAdmin } from '@/lib/supabase-admin'

const SITE = 'https://www.shareloveletters.com'

function welcomeEmailHtml(firstName: string) {
  const features: Array<[string, string, string, string]> = [
    ['✍️', 'Write your first letter', 'Ten beautiful letter types, handwriting fonts, and templates to get you started.', `${SITE}/write`],
    ['✉️', 'Sealed with a wax seal', 'Every letter arrives as a real envelope your reader opens — wax seal, paper, and all.', `${SITE}/write`],
    ['🔐', 'Private by design', 'AES-256 encryption at rest, optional password, and hidden from search engines.', `${SITE}/letters/secret-letter`],
    ['⏰', 'Send a letter to the future', 'Schedule a letter to unlock on a birthday, an anniversary — or years from now.', `${SITE}/letters/future-self`],
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
