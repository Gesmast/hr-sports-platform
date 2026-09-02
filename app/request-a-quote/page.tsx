import { Metadata } from 'next';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { QuoteChecklist } from '@/components/contact/QuoteChecklist';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { SITE_CONFIG, MOQ_LABEL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Request a Production Quote — HR Sports OEM Manufacturing',
  description: 'Submit your sportswear manufacturing requirements, upload tech packs or design artwork, and receive a commercial proforma quote within 24 hours.',
};

export default async function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ garment?: string; fabric?: string; category?: string; market?: string; source?: string }>;
}) {
  const { garment, fabric } = await searchParams;

  return (
    <main className="min-h-screen py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Commercial Intake Desk"
          title="Factory-Direct Production Quote."
          description={`Submit custom apparel specifications and design requirements. Minimum order: ${MOQ_LABEL}. Full physical pre-production sample provided prior to bulk cutting.`}
        />

        {/* Split Layout: Left Info & Preparation vs Right Dynamic Form & Live Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Quote Checklist & Logistics Routing Hub */}
          <div className="lg:col-span-4 space-y-6">
            <QuoteChecklist />

            {/* Embedded Export Hub Terminal */}
            <div className="bg-surface border-hairline border-border rounded-base p-4 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Logistics & Air Freight Routing Hub
              </div>
              <div className="w-full aspect-16/9 bg-zinc-900 rounded-base border-hairline border-border-light overflow-hidden relative flex items-center justify-center text-center p-4">
                <div className="text-zinc-400 space-y-1 text-xs font-mono">
                  <div className="text-white font-bold text-sm">International Export Terminal</div>
                  <div>Direct Express Cargo Routes:</div>
                  <div className="text-emerald-400 font-bold">USA (JFK/ORD/LAX) • UK (LHR) • EU (FRA/CDG) • AU (SYD)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Master Form */}
          <div className="lg:col-span-8">
            <InquiryForm
              initialGarment={garment}
              initialFabric={fabric}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
