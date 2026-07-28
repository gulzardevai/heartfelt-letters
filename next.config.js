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
