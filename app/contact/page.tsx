import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { GeneralContactForm } from '@/components/contact/GeneralContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — HR Sports OEM & Sportswear Manufacturing',
  description: 'Get in touch with the HR Sports direct-to-factory team for general inquiries, customer support, and partnership questions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-12 md:py-20 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Styled Accent Bar */}
        <div className="mb-10 sm:mb-14">
          <div className="border-l-4 border-ink pl-4 sm:pl-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight">
              Contact Us
            </h1>
          </div>
          <p className="mt-3 text-sm sm:text-base text-muted pl-4 sm:pl-5 max-w-2xl">
            Have a question, feedback, or want to connect with our team? Send us a message below or reach out directly through our contact channels.
          </p>
        </div>

        {/* Master 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Info Cards & Socials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Company Info */}
            <div className="bg-white border-hairline border-border-light rounded-3xl p-6 sm:p-8 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <h2 className="text-lg font-extrabold text-ink tracking-tight">
                Company Info
              </h2>
              <div className="text-xs sm:text-sm text-muted space-y-1 leading-relaxed">
                <p className="font-semibold text-ink">{SITE_CONFIG.legalName}</p>
                <p>{SITE_CONFIG.address}</p>
              </div>
              <div className="pt-2 text-xs font-medium text-muted">
                Email:{' '}
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}`}
                  className="text-ink hover:underline font-semibold"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </div>
            </div>

            {/* Card 2: Socials */}
            <div className="bg-white border-hairline border-border-light rounded-3xl p-6 sm:p-8 text-center shadow-xs">
              <h2 className="text-lg font-extrabold text-ink tracking-tight mb-4">
                Socials
              </h2>
              <div className="flex items-center justify-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border-hairline border-border-light bg-zinc-50 hover:bg-white hover:scale-105 transition-all flex items-center justify-center text-blue-600 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border-hairline border-border-light bg-zinc-50 hover:bg-white hover:scale-105 transition-all flex items-center justify-center text-pink-600 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-full border-hairline border-border-light bg-zinc-50 hover:bg-white hover:scale-105 transition-all flex items-center justify-center text-emerald-600 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Row with Response Time & Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 3: Response Time */}
              <div className="bg-white border-hairline border-border-light rounded-3xl p-6 shadow-xs space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-base font-extrabold text-ink tracking-tight">
                  Response Time
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  We typically respond within 24-48 business hours.
                </p>
              </div>

              {/* Card 4: Direct Channels */}
              <div className="bg-white border-hairline border-border-light rounded-3xl p-6 shadow-xs space-y-2.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-base font-extrabold text-ink tracking-tight">
                  Direct Channels
                </h2>
                <div className="text-xs text-muted leading-relaxed">
                  <p>Prefer email? Reach out to us at</p>
                  <a
                    href={`mailto:${SITE_CONFIG.supportEmail}`}
                    className="text-blue-600 hover:underline font-semibold block mt-0.5"
                  >
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              </div>

            </div>

            {/* Quote Intake CTA Banner */}
            <div className="bg-surface border-hairline border-border rounded-3xl p-6 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                Need Manufacturing Pricing?
              </div>
              <h3 className="text-base font-extrabold text-ink">
                Looking for a Commercial Tech-Pack Quote?
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                If you have garment tech packs or 3D files and need an itemized pricing breakdown with sample turnaround, use our dedicated quote portal.
              </p>
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-burgundy pt-1"
              >
                <span>Go to Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right Column: Master Contact Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            <GeneralContactForm />

            {/* Inbuilt Google Maps Location Card */}
            <div className="bg-white border-hairline border-border-light rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-ink tracking-tight">
                      Where to Find us
                    </h2>
                    <p className="text-xs text-muted">
                      HR Sports, Green Building, Block B New Chauburji Park, Multan Road, Lahore, 54000, Pakistan
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=HR+Sports%2C+Green+Building%D8%8C+Block+B+New+Chauburji+Park+%2C%D9%85%D9%8F%D9%84%D8%AA%D8%A7%D9%86+%D8%B1%D9%88%DA%88%2C+Block+B+New+Chauburji+Park%2C+Lahore%2C+54000%2C+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 hover:underline shrink-0 hidden sm:inline-block"
                >
                  Open in Maps ↗
                </a>
              </div>

              {/* Embedded Google Maps iFrame with Pin Marker */}
              <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-border-light relative bg-zinc-100 shadow-inner">
                <iframe
                  title="HR Sports Location - Green Building, Block B New Chauburji Park, Lahore"
                  src="https://maps.google.com/maps?q=HR%20Sports%D8%8C%20Green%20Building%D8%8C%20Block%20B%20New%20Chauburji%20Park%20%2C%D9%85%D9%8F%D9%84%D8%AA%D8%A7%D9%86%20%D8%B1%D9%88%DA%88%2C%20Block%20B%20New%20Chauburji%20Park%2C%20Lahore%2C%2054000%2C%20Pakistan&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
