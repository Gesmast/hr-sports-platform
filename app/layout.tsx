import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { WhatsAppWidget } from '@/components/shared/WhatsAppWidget';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'HR Sports — Precision OEM & Custom Sports Apparel Manufacturer',
    template: '%s | HR Sports',
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  keywords: [
    'custom sportswear manufacturer',
    'OEM clothing factory',
    'sublimated jerseys wholesale',
    'activewear manufacturing',
    'athletic team kits factory',
    'corporate sports uniforms',
    'private label activewear',
  ],
  authors: [{ name: 'HR Sports International' }],
  creator: 'HR Sports',
  publisher: 'HR Sports',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'HR Sports — Precision OEM & Custom Sports Apparel Manufacturer',
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'sales and manufacturing inquiry',
      email: SITE_CONFIG.email,
      availableLanguage: ['English', 'German', 'French'],
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-ink antialiased">
        <AuthProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <WhatsAppWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
