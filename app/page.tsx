import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ChooseYourStyle } from '@/components/home/ChooseYourStyle';
import { HowWeWork } from '@/components/home/HowWeWork';
import { WhyChooseHRSports } from '@/components/home/WhyChooseHRSports';
import { ShipWorldwideGrid } from '@/components/home/ShipWorldwideGrid';
import { HomeFAQSection } from '@/components/home/HomeFAQSection';
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
      <Hero />
      <ChooseYourStyle />
      <HowWeWork />
      <WhyChooseHRSports />
      <ShipWorldwideGrid />
      <HomeFAQSection />
    </main>
  );
}
