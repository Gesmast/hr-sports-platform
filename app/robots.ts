import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/portal/'],
    },
    sitemap: 'https://thehrsports.com/sitemap.xml',
  }
}
