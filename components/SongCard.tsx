import type { Song } from '@/lib/song'

const PROVIDER_LABEL: Record<Song['provider'], string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  youtube: 'YouTube',
}

export default function SongCard({ song, senderName }: { song: Song; senderName?: string | null }) {
  return (
    <div
      className="no-print mt-6 bg-white/80 border border-rose-100 rounded-3xl p-6 shadow-sm fade-in"
      style={{ animationDelay: '0.18s' }}
    >
      <h2 className="font-serif text-lg font-semibold text-rose-900 mb-1">🎵 Our song</h2>
      <p className="text-sm text-rose-700/70 leading-relaxed mb-4">
        {senderName ? `${senderName} attached this` : 'This came'} with the letter. Press play.
      </p>
      <div
        className={`rounded-2xl overflow-hidden bg-rose-50/60 ${song.provider === 'youtube' ? 'aspect-video' : ''}`}
      >
        <iframe
          src={song.embedUrl}
          className="w-full block border-0"
          style={song.provider === 'youtube' ? { height: '100%' } : { height: song.height }}
          loading="lazy"
          allow="autoplay *; encrypted-media *; clipboard-write; fullscreen; picture-in-picture"
          title="Song attached to this letter"
        />
      </div>
      <a
        href={song.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs text-rose-600 underline hover:text-rose-800"
      >
        {song.label} ({PROVIDER_LABEL[song.provider]}) →
      </a>
    </div>
  )
}
