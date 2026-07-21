import { Letter } from '@/lib/supabase'
import { LETTER_TYPES } from '@/lib/templates'
import LetterActions from '@/components/LetterActions'

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

export default function LetterView({ letter }: Props) {
  const date = new Date(letter.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const emoji = TYPE_EMOJI[letter.type] || '💌'
  const typeLabel = TYPE_LABEL[letter.type] || 'Letter'

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
        <div className="letter-paper rounded-3xl shadow-paper-lg p-8 sm:p-12 fade-in" style={{animationDelay: '0.1s'}}>
          {/* Title */}
          {letter.title && (
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-900 text-center mb-6">
              {letter.title}
            </h1>
          )}

          {/* To / From */}
          <div className="mb-8">
            {letter.recipient_name && (
              <p className="font-serif text-lg text-rose-800 mb-1">
                Dear <em>{letter.recipient_name}</em>,
              </p>
            )}
            <p className="text-rose-600/50 text-sm">{date}</p>
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
              <p className="font-cursive text-xl text-rose-700 text-right">
                With love, {letter.sender_name}
              </p>
            </div>
          )}
        </div>

        {/* Print & share actions */}
        <LetterActions senderName={letter.sender_name} />

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
