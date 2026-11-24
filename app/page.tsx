import { Metadata } from 'next';
import { DynamicHomeRenderer } from '@/components/home/DynamicHomeRenderer';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'HR Sports — Precision OEM & Custom Sports Apparel Manufacturer',
  description: SITE_CONFIG.description,
  openGraph: {
    title: 'HR Sports — Precision OEM & Custom Sports Apparel Manufacturer',
    description: SITE_CONFIG.description,
    type: 'website',
    url: SITE_CONFIG.url,
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <DynamicHomeRenderer />
    </main>
  );
}
