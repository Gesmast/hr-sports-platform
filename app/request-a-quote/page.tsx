import { Metadata } from 'next';
import { QuoteHeaderAnimated } from '@/components/contact/QuoteHeaderAnimated';
import { InquiryForm } from '@/components/contact/InquiryForm';

export const metadata: Metadata = {
  title: 'Request a Production Quote — HR Sports OEM Manufacturing',
  description: 'Submit your sportswear manufacturing requirements, upload tech packs or design artwork, and receive a commercial proforma quote within 24 hours.',
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ garment?: string; fabric?: string; category?: string; market?: string; source?: string }>;
}) {
  const { garment, fabric, category } = await searchParams;

  return (
    <main className="min-h-screen py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuoteHeaderAnimated />

        {/* Centered Master Inquiry Form & Stepper Rail */}
        <div className="max-w-5xl mx-auto">
          <InquiryForm
            initialGarment={garment}
            initialFabric={fabric}
            initialCategory={category}
          />
        </div>
      </div>
    </main>
  );
}
