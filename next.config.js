/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old *.vercel.app production URL serves a full duplicate of the
      // site — permanently redirect it to the canonical custom domain.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'heartfelt-letters-eight.vercel.app' }],
        destination: 'https://www.shareloveletters.com/:path*',
        permanent: true,
      },
      // Consolidated 2026-08-13: four pages were competing for one
      // anonymous-letter intent and neither of these two had ever been
      // crawled. Their unique content was folded into the survivors first.
      {
        source: '/blog/anonymous-love-letter-online',
        destination: '/blog/how-to-send-an-anonymous-letter-to-someone',
        permanent: true,
      },
      {
        source: '/blog/best-online-love-letter-websites',
        destination: '/compare',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/letter/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
