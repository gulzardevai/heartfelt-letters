import { Letter } from '@/lib/supabase'
import { LETTER_TYPES } from '@/lib/templates'
import { getTheme } from '@/lib/themes'
import LetterActions from '@/components/LetterActions'
import WriteCta from '@/components/WriteCta'

interface Props {
  letter: Letter
}

const TYPE_EMOJI: Record<string, string> = {
  love: '💕', birthday: '🎂', anniversary: '💍', thank_you: '🙏',
  apology: '💙', friendship: '🤝', condolence: '🕊️', get_well: '🌸',
  congratulations: '🎉', farewell: '👋',
}

const TYPE_LABEL: Record<string, string> = {
  love: 'Love Letter', birthday: 'Birthday Wish', anniversary: 'Anniversary',
  thank_you: 'Thank You', apology: 'Apology', friendship: 'Friendship Letter',
  condolence: 'Condolence', get_well: 'Get Well Soon',
  congratulations: 'Congratulations', farewell: 'Farewell Letter',
}

function buildReplyHref(letter: Letter): string {
  const params = new URLSearchParams({ replyTo: letter.share_id })
  if (letter.sender_name) params.set('to', letter.sender_name)
  if (letter.recipient_name) params.set('from', letter.recipient_name)
  return `/write?${params.toString()}`
}

export default function LetterView({ letter }: Props) {
  const date = new Date(letter.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const emoji = TYPE_EMOJI[letter.type] || '💌'
  const typeLabel = TYPE_LABEL[letter.type] || 'Letter'
  const theme = getTheme(letter.theme)
  const themed = theme.id !== 'classic'
  const replyHref = buildReplyHref(letter)

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-rose-50 via-cream to-pink-50">
      <div className="max-w-2xl mx-auto">
        {/* Header badge */}
        <div className="no-print text-center mb-6 fade-in">
          <div className="inline-flex items-center gap-2 bg-white border border-rose-200 rounded-full px-4 py-2 shadow-sm">
            <span>{emoji}</span>
            <span className="text-rose-700 text-sm font-medium">{typeLabel}</span>
          </div>
        </div>

        {/* Letter paper */}
        <div
          className={`${themed ? 'relative overflow-hidden' : 'letter-paper'} rounded-3xl shadow-paper-lg p-8 sm:p-12 fade-in`}
          style={{
            animationDelay: '0.1s',
            ...(themed ? { backgroundColor: theme.paper, '--letter-text': theme.text } : {}),
          } as React.CSSProperties}
        >
          {/* Blossom floral corner accents */}
          {theme.id === 'blossom' && (
            <>
              <svg className="absolute top-0 left-0 w-24 h-24 opacity-30 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="10" fill="#f9a8d4" />
                <circle cx="34" cy="10" r="6" fill="#fbcfe8" />
                <circle cx="10" cy="34" r="6" fill="#fbcfe8" />
                <circle cx="30" cy="28" r="4" fill="#f472b6" />
                <path d="M40 40 Q20 30 14 14" stroke="#f9a8d4" strokeWidth="1.5" />
              </svg>
              <svg className="absolute bottom-0 right-0 w-24 h-24 opacity-30 pointer-events-none rotate-180" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="10" fill="#f9a8d4" />
                <circle cx="34" cy="10" r="6" fill="#fbcfe8" />
                <circle cx="10" cy="34" r="6" fill="#fbcfe8" />
                <circle cx="30" cy="28" r="4" fill="#f472b6" />
                <path d="M40 40 Q20 30 14 14" stroke="#f9a8d4" strokeWidth="1.5" />
              </svg>
            </>
          )}

          {/* Title */}
          {letter.title && (
            <h1
              className={`font-serif text-3xl sm:text-4xl font-bold text-center mb-6 ${themed ? '' : 'text-rose-900'}`}
              style={themed ? { color: theme.accent } : undefined}
            >
              {letter.title}
            </h1>
          )}

          {/* To / From */}
          <div className="mb-8">
            {letter.recipient_name && (
              <p
                className={`font-serif text-lg mb-1 ${themed ? '' : 'text-rose-800'}`}
                style={themed ? { color: theme.text } : undefined}
              >
                Dear <em>{letter.recipient_name}</em>,
              </p>
            )}
            <p
              className={`text-sm ${themed ? 'opacity-60' : 'text-rose-600/50'}`}
              style={themed ? { color: theme.accent } : undefined}
            >
              {date}
            </p>
          </div>

          <div className="ornamental-divider mb-8">
            <span className="text-xl">{emoji}</span>
          </div>

          {/* Content */}
          <div
            className="letter-content"
            dangerouslySetInnerHTML={{ __html: letter.content }}
          />

          {/* Signature */}
          {letter.sender_name && (
            <div className="mt-10">
              <div className="ornamental-divider mb-6">
                <span className="text-lg">{emoji}</span>
              </div>
              <p
                className={`font-cursive text-xl text-right ${themed ? '' : 'text-rose-700'}`}
                style={themed ? { color: theme.accent } : undefined}
              >
                With love, {letter.sender_name}
              </p>
            </div>
          )}
        </div>

        {/* Print & share actions */}
        <LetterActions senderName={letter.sender_name} replyHref={replyHref} />

        {/* Write-your-own CTA */}
        <div className="no-print mt-10 bg-white/80 border border-rose-100 rounded-3xl p-6 sm:p-8 text-center shadow-sm fade-in">
          <div className="text-3xl mb-2">✍️</div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-rose-900 mb-2">
            Touched by this letter?
          </h2>
          <p className="text-sm text-rose-700/70 mb-5 max-w-md mx-auto">
            Write one of your own — it&apos;s free, takes a few minutes, and arrives as a sealed envelope just like this one. No account needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={replyHref}
              className="inline-block border-2 border-rose-300 text-rose-700 px-8 py-3 rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors"
            >
              💌 Write Back{letter.sender_name ? ` to ${letter.sender_name}` : ''}
            </a>
            <WriteCta
              placement="below_letter"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors shadow-md"
            >
              Write Your Own Letter — Free
            </WriteCta>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print text-center mt-8 fade-in" style={{animationDelay: '0.2s'}}>
          <p className="text-rose-400 text-xs">
            Created with 💌 <a href="/" className="underline hover:text-rose-600 transition-colors">ShareLove Letters</a>
          </p>
          <p className="text-rose-300 text-[11px] mt-1">🔐 This letter is protected with AES-256 encryption</p>
          {letter.view_count > 0 && (
            <p className="text-rose-300 text-xs mt-1">{letter.view_count} {letter.view_count === 1 ? 'read' : 'reads'}</p>
          )}
        </div>
      </div>
    </div>
  )
}
