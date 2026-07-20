'use client'

import { useState } from 'react'
import PasswordGate from '@/components/PasswordGate'
import LetterView from '@/components/LetterView'
import { Letter } from '@/lib/supabase'

interface Props {
  shareId: string
}

export default function PasswordGateWrapper({ shareId }: Props) {
  const [letter, setLetter] = useState<Letter | null>(null)

  if (letter) {
    return <LetterView letter={letter} />
  }

  return <PasswordGate shareId={shareId} onUnlock={setLetter} />
}
