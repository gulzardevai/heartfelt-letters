'use client'

import { useState } from 'react'
import PasswordGate from '@/components/PasswordGate'
import EnvelopeReveal from '@/components/EnvelopeReveal'
import { Letter } from '@/lib/supabase'

interface Props {
  shareId: string
}

export default function PasswordGateWrapper({ shareId }: Props) {
  const [unlocked, setUnlocked] = useState<{ letter: Letter; password: string } | null>(null)

  if (unlocked) {
    return <EnvelopeReveal letter={unlocked.letter} unlockPassword={unlocked.password} />
  }

  return <PasswordGate shareId={shareId} onUnlock={(letter, password) => setUnlocked({ letter, password })} />
}
