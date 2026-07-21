import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /letter/ intentionally NOT disallowed: crawlers must be able to fetch
        // letter pages to see their noindex tag — blocking them here would let
        // Google index the bare URLs without ever reading the noindex.
        disallow: ['/admin', '/admin/', '/api/', '/dashboard', '/profile'],
      },
    ],
    sitemap: 'https://www.shareloveletters.com/sitemap.xml',
  }
}
