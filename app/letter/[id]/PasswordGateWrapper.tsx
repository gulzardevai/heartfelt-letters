'use client'

import { useState } from 'react'
import PasswordGate from '@/components/PasswordGate'
import EnvelopeReveal from '@/components/EnvelopeReveal'
import { Letter } from '@/lib/supabase'

interface Props {
  shareId: string
}

export default function PasswordGateWrapper({ shareId }: Props) {
  const [letter, setLetter] = useState<Letter | null>(null)

  if (letter) {
    return <EnvelopeReveal letter={letter} />
  }

  return <PasswordGate shareId={shareId} onUnlock={setLetter} />
}
