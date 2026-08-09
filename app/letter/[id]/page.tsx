export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EnvelopeReveal from '@/components/EnvelopeReveal'
import { decryptContent } from '@/lib/crypto'
import PasswordGateWrapper from './PasswordGateWrapper'
import SealedUntil from '@/components/SealedUntil'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function LetterPage({ params }: Props) {
  const { data: letter } = await supabase
    .from('letters')
    .select('*')
    .eq('share_id', params.id)
    .single()

  if (!letter) notFound()

  if (letter.is_deleted === true) notFound()

  if (letter.expires_at && new Date(letter.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-6">⏳</div>
          <h1 className="font-serif text-3xl font-bold text-rose-900 mb-3">This letter has expired</h1>
          <p className="text-rose-600/70 mb-6 leading-relaxed">
            The link to this letter is no longer active. Letters on the free plan are available for 30 days.
          </p>
          <Link
            href="/write"
            className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-rose-700 transition-colors shadow-md"
          >
            Write a New Letter
          </Link>
        </div>
      </div>
    )
  }

  // Scheduled letter: stays sealed (and encrypted, never decrypted) until open_at
  if (letter.open_at && new Date(letter.open_at) > new Date()) {
    return (
      <SealedUntil
        openAt={letter.open_at}
        recipientName={letter.recipient_name}
        senderName={letter.sender_name}
        theme={letter.theme}
      />
    )
  }

  // Increment view count (fire and forget)
  supabase
    .from('letters')
    .update({ view_count: (letter.view_count || 0) + 1 })
    .eq('share_id', params.id)
    .then(() => {})

  if (letter.has_password) {
    return <PasswordGateWrapper shareId={params.id} />
  }

  return <EnvelopeReveal letter={{ ...letter, content: decryptContent(letter.content), password_hash: null }} />
}

export async function generateMetadata({ params }: Props) {
  const { data: letter } = await supabase
    .from('letters')
    .select('title, type, recipient_name, sender_name')
    .eq('share_id', params.id)
    .single()

  const noindex = {
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }

  if (!letter) return { title: 'Letter Not Found', ...noindex }

  const title = letter.title
    || (letter.recipient_name ? `A letter for ${letter.recipient_name}` : 'A heartfelt letter')

  return {
    title: `${title} — ShareLove Letters`,
    description: letter.sender_name
      ? `A ${letter.type.replace('_', ' ')} letter from ${letter.sender_name}`
      : `A heartfelt ${letter.type.replace('_', ' ')} letter`,
    ...noindex,
  }
}
