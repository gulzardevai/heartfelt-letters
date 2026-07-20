import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { to_email, to_name, message } = body

    if (!to_email) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
    }

    const { data: letter, error } = await supabaseAdmin
      .from('letters')
      .select('*')
      .eq('share_id', params.id)
      .single()

    if (error || !letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 })
    }

    const letterUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/letter/${params.id}`
    const recipientDisplay = to_name || to_email
    const senderDisplay = letter.sender_name || 'Someone special'

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Georgia, serif; background: #fdf8f0; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; margin-bottom: 32px; }
  .emoji { font-size: 48px; display: block; margin-bottom: 8px; }
  .title { font-size: 28px; color: #9f1239; font-weight: bold; margin: 0; }
  .subtitle { color: #be123c; font-size: 14px; margin-top: 8px; }
  .card { background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 24px; border: 1px solid #fecdd3; }
  .personal-note { background: #fff1f2; border-left: 3px solid #fb7185; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-style: italic; color: #9f1239; }
  .cta { text-align: center; margin: 24px 0; }
  .btn { display: inline-block; background: #e11d48; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; }
  .footer { text-align: center; color: #fda4af; font-size: 12px; margin-top: 32px; }
  .divider { text-align: center; color: #fda4af; margin: 16px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <span class="emoji">💌</span>
    <h1 class="title">You Have a Heartfelt Letter</h1>
    <p class="subtitle">From ${senderDisplay}, with love</p>
  </div>

  <div class="card">
    <p style="color: #6b4c4c; font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
      Dear ${recipientDisplay},
    </p>
    <p style="color: #6b4c4c; font-size: 16px; line-height: 1.7; margin: 0;">
      ${senderDisplay} has written you a heartfelt letter and would love for you to read it.
    </p>

    ${message ? `
    <div class="personal-note">
      <p style="margin: 0 0 8px; font-size: 12px; color: #be123c; font-weight: bold; font-style: normal;">Personal note:</p>
      <p style="margin: 0;">"${message}"</p>
    </div>
    ` : ''}

    <div class="divider">— 💕 —</div>

    <div class="cta">
      <a href="${letterUrl}" class="btn">Read Your Letter</a>
    </div>

    <p style="color: #fda4af; font-size: 12px; text-align: center; margin-top: 16px;">
      Or copy this link: ${letterUrl}
    </p>
  </div>

  <div class="footer">
    <p>Delivered with love by <strong>ShareLove Letters</strong></p>
    <p style="color: #fecdd3;">ShareLove Letters — Write Letters That Last Forever</p>
  </div>
</div>
</body>
</html>
    `

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'ShareLove Letters <letters@heartfelt.love>',
      to: to_email,
      subject: `💌 ${senderDisplay} has written you a heartfelt letter`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error sending email:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
