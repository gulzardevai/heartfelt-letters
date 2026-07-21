'use client'

import { useState } from 'react'
import { Letter } from '@/lib/supabase'
import LetterView from '@/components/LetterView'
import { getTheme, envelopeCssVars } from '@/lib/themes'
import { sendGAEvent } from '@next/third-parties/google'

const TYPE_EMOJI: Record<string, string> = {
  love: '💕', birthday: '🎂', anniversary: '💍', thank_you: '🙏',
  apology: '💙', friendship: '🤝', condolence: '🕊️', get_well: '🌸',
  congratulations: '🎉', farewell: '👋',
}

type Stage = 'closed' | 'opening' | 'open'

export default function EnvelopeReveal({ letter, unlockPassword }: { letter: Letter; unlockPassword?: string }) {
  const [stage, setStage] = useState<Stage>('closed')
  const emoji = TYPE_EMOJI[letter.type] || '💌'
  const theme = getTheme(letter.theme)
  const themed = theme.id !== 'classic'

  const handleOpen = () => {
    if (stage !== 'closed') return
    setStage('opening')
    sendGAEvent('event', 'envelope_opened', { letter_type: letter.type })
    setTimeout(() => setStage('open'), 1900)
  }

  if (stage === 'open') {
    return (
      <div className="letter-reveal">
        <LetterView letter={letter} unlockPassword={unlockPassword} />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-cream to-pink-50 overflow-hidden"
      style={themed ? (envelopeCssVars(theme) as React.CSSProperties) : undefined}
    >
      <div
        className={`envelope-scene ${stage === 'opening' ? 'is-opening' : ''}`}
        onClick={handleOpen}
        role="button"
        aria-label="Open the letter"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
      >
        <div className="envelope">
          {/* Letter peeking out during animation */}
          <div className="envelope-letter">
            <div className="envelope-letter-inner">
              <p
                className={`font-serif text-sm italic leading-relaxed px-6 pt-5 text-center ${themed ? '' : 'text-rose-900'}`}
                style={themed ? { color: theme.text } : undefined}
              >
                {letter.title || 'A letter for you...'}
              </p>
            </div>
          </div>

          {/* Back of envelope */}
          <div className="envelope-back" />

          {/* Front pocket */}
          <div className="envelope-front">
            <div className="text-center">
              {letter.recipient_name && (
                <p
                  className={`font-cursive text-2xl mb-1 ${themed ? '' : 'text-rose-800'}`}
                  style={themed ? { color: theme.envelope.frontText } : undefined}
                >
                  For {letter.recipient_name}
                </p>
              )}
              <p
                className={`text-xs tracking-widest uppercase ${themed ? 'opacity-70' : 'text-rose-400'}`}
                style={themed ? { color: theme.envelope.frontText } : undefined}
              >
                {stage === 'closed' ? 'Tap to open' : ''}
              </p>
            </div>
          </div>

          {/* Flap */}
          <div className="envelope-flap" />

          {/* Wax seal */}
          <div className="wax-seal">
            <span>{emoji}</span>
          </div>
        </div>

        {/* Floating hearts on open */}
        {stage === 'opening' && (
          <>
            <span className="float-heart" style={{ left: '20%', animationDelay: '0s' }}>💕</span>
            <span className="float-heart" style={{ left: '50%', animationDelay: '0.3s' }}>💗</span>
            <span className="float-heart" style={{ left: '75%', animationDelay: '0.15s' }}>💞</span>
          </>
        )}
      </div>

      <p className={`mt-10 text-rose-400 text-sm transition-opacity duration-500 ${stage === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
        💌 Someone sent you a heartfelt letter
      </p>
    </div>
  )
}
