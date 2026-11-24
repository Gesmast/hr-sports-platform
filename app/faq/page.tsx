import { Metadata } from 'next';
import { FAQSearchHub } from '@/components/faq/FAQSearchHub';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions & Knowledge Base | HR Sports',
  description: 'Search questions and answers regarding our minimum order quantities (MOQ), sample approval protocol, sublimation printing, fabric weights, and global shipping.',
  openGraph: {
    title: 'Frequently Asked Questions & Knowledge Base | HR Sports',
    description: 'Instant answers to custom sportswear manufacturing questions.',
    type: 'website',
    url: `${SITE_CONFIG.url}/faq`,
  },
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <FAQSearchHub />
    </main>
  );
}
