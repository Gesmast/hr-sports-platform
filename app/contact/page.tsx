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
                <p>DBA HR Sports</p>
                <p>{SITE_CONFIG.address}</p>
                <p>United States / International Sourcing</p>
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

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full border-hairline border-border-light bg-zinc-50 hover:bg-white hover:scale-105 transition-all flex items-center justify-center text-red-600 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="w-10 h-10 rounded-full border-hairline border-border-light bg-zinc-50 hover:bg-white hover:scale-105 transition-all flex items-center justify-center text-indigo-600 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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

          {/* Right Column: Master Contact Form */}
          <div className="lg:col-span-7">
            <GeneralContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}
