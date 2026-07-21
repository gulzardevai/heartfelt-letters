'use client'

import { sendGAEvent } from '@next/third-parties/google'

interface Props {
  placement: string
  className: string
  children: React.ReactNode
}

export default function WriteCta({ placement, className, children }: Props) {
  return (
    <a
      href="/write"
      className={className}
      onClick={() => sendGAEvent('event', 'recipient_cta_clicked', { placement })}
    >
      {children}
    </a>
  )
}
