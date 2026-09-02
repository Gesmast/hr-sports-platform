import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Quote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { countries } from '@/data/countries';
import { faqs } from '@/data/faqs';
import { CountryHero } from '@/components/manufacturers/CountryHero';
import { LocalRetailComparisonTable } from '@/components/manufacturers/LocalRetailComparisonTable';
import { HowWeWork } from '@/components/home/HowWeWork';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { BorderCard } from '@/components/shared/BorderCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/shared/Button';

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return countries.map((c) => ({
    country: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countries.find((c) => c.slug === slug);

  if (!country) {
    return {
      title: 'Market Not Found | HR Sports',
    };
  }

  const title = `Custom Sportswear & Activewear Manufacturer — ${country.name} | HR Sports`;
  const description = country.subcopy;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function CountryLandingPage({
  params,
}: CountryPageProps) {
  const { country: slug } = await params;
  const country = countries.find((c) => c.slug === slug);

  if (!country) {
    notFound();
  }

  const countryFaqs = faqs.slice(0, 5);

  return (
    <main className="min-h-screen">
      {/* 1. Country Specific Hero */}
      <CountryHero country={country} />

      {/* 2. Why HR Sports in this Market */}
      <section className="py-16 md:py-24 bg-white border-b border-hairline border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={`Direct Factory Advantage • ${country.name}`}
            title={`Tailored Sourcing For ${country.name} Brands.`}
            description={`Why leading athletic clubs, corporate organizations, and independent labels in ${country.name} partner directly with HR Sports.`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {country.localizedWhyUs.map((point, idx) => (
              <BorderCard key={idx} variant="surface" hoverEffect className="p-6 sm:p-7 space-y-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                  0{idx + 1} / Advantage
                </div>
                <h3 className="text-lg font-extrabold text-ink tracking-tight">
                  {point.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {point.description}
                </p>
              </BorderCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Direct Factory vs Local Retail Comparison Table */}
      <LocalRetailComparisonTable
        countryName={country.name}
        rows={country.comparisonRows}
        isWorldwide={country.isWorldwide}
      />

      {/* 4. Factory Process Recap */}
      <HowWeWork />

      {/* 5. Verified Market Testimonial if Available */}
      {country.testimonial && (
        <section className="py-16 md:py-24 bg-white border-b border-hairline border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-2">
                Client Verification • {country.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Trusted Across {country.name}
              </h2>
            </div>

            <BorderCard variant="surface" className="p-8 sm:p-10 text-center relative">
              <Quote className="w-8 h-8 text-ink/20 mx-auto mb-4" />
              <blockquote className="text-lg sm:text-xl font-medium text-ink leading-relaxed italic mb-6">
                &ldquo;{country.testimonial.quote}&rdquo;
              </blockquote>
              <div className="border-t border-border-light pt-4 font-mono text-xs">
                <span className="font-bold text-ink block">{country.testimonial.author}</span>
                <span className="text-muted">{country.testimonial.role} — {country.testimonial.company}</span>
              </div>
            </BorderCard>
          </div>
        </section>
      )}

      {/* 6. Market FAQ Excerpt */}
      <section className="py-16 md:py-24 bg-surface border-b border-hairline border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Market Questions"
            title={`Ordering Direct From ${country.name}`}
            description="Frequently asked questions about customs clearance, currency invoicing, and express delivery."
          />

          <div className="mt-8">
            <FAQAccordion items={countryFaqs} />
          </div>
        </div>
      </section>

      {/* 7. Closing Direct CTA Banner */}
      <section className="py-16 bg-ink text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-surface font-bold mb-2">
            Direct OEM Factory Supply
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Start Your Custom Production Run for {country.name}
          </h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto">
            Submit your technical requirements or 3D files. Receive a comprehensive proforma invoice and sample timeline in 24 hours.
          </p>
          <Link href={`/request-a-quote?market=${encodeURIComponent(country.slug)}`}>
            <Button variant="inverted" size="lg" className="gap-2">
              Request {country.name} Factory Quote
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
