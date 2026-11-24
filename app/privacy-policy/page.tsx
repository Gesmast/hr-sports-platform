import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_CONFIG.name}`,
  description: `Privacy Policy and data protection terms for ${SITE_CONFIG.legalName} custom athletic apparel and OEM sportswear manufacturing.`,
};

export const revalidate = 0; // Dynamic on-demand update

export default async function PrivacyPolicyPage() {
  let dynamicPolicy: { title: string; contentUpdatedAt: string; content: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('policies')
      .select(`
        title,
        content_updated_at,
        policy_versions (
          version_number,
          content
        )
      `)
      .eq('slug', 'privacy-policy')
      .eq('status', 'active')
      .maybeSingle();

    if (data && data.policy_versions && data.policy_versions.length > 0) {
      const sorted = [...data.policy_versions].sort((a: any, b: any) => b.version_number - a.version_number);
      dynamicPolicy = {
        title: data.title,
        contentUpdatedAt: data.content_updated_at,
        content: sorted[0]?.content || '',
      };
    }
  } catch (err) {
    console.warn('Could not fetch dynamic privacy policy, using fallback:', err);
  }

  const lastUpdatedDisplay = dynamicPolicy?.contentUpdatedAt
    ? new Date(dynamicPolicy.contentUpdatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'February 26, 2026';

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-black selection:text-white">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-black/10 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-black/50">
            <Shield className="w-3.5 h-3.5 text-black" />
            <span>Legal Documentation</span>
          </div>
        </div>
      </div>

      <div className="container py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-12 border-b-4 border-[#1D1D1F] pb-6">
          {dynamicPolicy?.title || 'Privacy Policy'}
        </h1>

        <section className="mb-12">
          <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono mb-8 border-l-2 border-black pl-4">
            Last Updated: {lastUpdatedDisplay}
          </div>
          <div className="space-y-6 text-base md:text-lg leading-relaxed text-[#1D1D1F]/80">
            <p>
              This Privacy Policy describes how <strong>{SITE_CONFIG.legalName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), collects, uses, and discloses your personal and business information when you visit, request quotes, or purchase custom athletic apparel and sportswear manufacturing services from{' '}
              <a href="https://hrsports.com" className="text-black font-semibold underline underline-offset-4 hover:opacity-75">
                hrsports.com
              </a>{' '}
              (the &ldquo;Site&rdquo;), or interact with our client portal.
            </p>
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-12" />

        {dynamicPolicy && dynamicPolicy.content ? (
          <div
            className="space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: dynamicPolicy.content }}
          />
        ) : (

        <div className="space-y-16">
          {/* Section 1 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              1. Information We Collect
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                When you visit the Site, submit a quote request, or create a production account, we collect information necessary to fulfill your orders, prepare tech pack evaluations, and deliver high-precision manufacturing.
              </p>

              <div className="bg-[#F5F5F7] p-8 rounded-2xl border border-[#1D1D1F]/5">
                <ul className="space-y-4 text-[#1D1D1F]/80 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Account &amp; Corporate Details:</strong> Contact name, business email address, company/brand name, registration details, and account credentials when you register on our portal.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Order &amp; Manufacturing Information:</strong> Delivery destination address, commercial billing address, phone contact, tech packs, garment design files, vector artwork, Pantone color specifications, and order quantities.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Communication Data:</strong> Inquiries, quotation requests, and design correspondence you provide when contacting our production team at{' '}
                      <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                        {SITE_CONFIG.supportEmail}
                      </a>{' '}
                      or{' '}
                      <a href={`mailto:${SITE_CONFIG.email}`} className="text-black font-semibold underline underline-offset-2">
                        {SITE_CONFIG.email}
                      </a>.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Site Functionality:</strong> Essential technical data for maintaining authenticated client sessions, quote draft caching, and client portal security.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 2 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                We utilize the information we collect for the following commercial purposes:
              </p>

              <div className="bg-[#F5F5F7] p-8 rounded-2xl border border-[#1D1D1F]/5">
                <ul className="space-y-4 text-[#1D1D1F]/80 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Manufacturing &amp; Fulfillment:</strong> To calculate custom quotations, fabricate pre-production samples, manage bulk cutting, printing, stitching, quality inspection, and arrange worldwide air or ocean freight.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Client Support &amp; Order Updates:</strong> To share high-resolution progress photos/videos, dispatch tracking numbers, issue commercial invoices, and handle revision requests.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Confidentiality &amp; Security:</strong> To protect our Site and your proprietary garment patterns, trademarks, and artwork under strict OEM non-disclosure standards.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 3 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              3. Data Storage and Third Parties
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                We take the security of your proprietary design files and business data with utmost gravity:
              </p>

              <div className="bg-[#F5F5F7] p-8 rounded-2xl border border-[#1D1D1F]/5">
                <ul className="space-y-4 text-[#1D1D1F]/80 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Infrastructure &amp; Storage:</strong> We use secure cloud infrastructure with encrypted database clusters, strict role-based access controls, and TLS encryption in transit.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Payment Gateways:</strong> We process commercial payments and international wires through compliant, accredited banking partners and global payment processors. We do not store credit card numbers or banking secrets on our front-facing web servers.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-black mt-2 mr-3 shrink-0" />
                    <span>
                      <strong>Logistics Carriers:</strong> We share necessary shipping documentation (consignee address, contact phone, and customs declarations) exclusively with accredited international freight carriers including DHL, FedEx, UPS, and certified air/ocean cargo forwarders.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 4 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              4. International Data Transfers
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                Because HR Sports manufactures and exports worldwide, your design specifications, order details, and contact information are processed across our administrative offices and factory headquarters in Pakistan, as well as global cloud service nodes. By engaging our manufacturing services or utilizing the Site, you consent to these cross-border data transfers necessary for international apparel manufacturing and export delivery.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 5 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              5. Your Rights
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                Depending on your geographical jurisdiction (such as GDPR in the European Union or statutory privacy laws in the United Kingdom and United States), you hold rights to access, review, amend, or request erasure of your personal data. To exercise any of these rights, please contact our data compliance desk at{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-4">
                  {SITE_CONFIG.supportEmail}
                </a>.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 6 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              6. Retention
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                We retain client design files, sizing charts, grading patterns, and commercial transaction records only for as long as necessary to fulfill existing production orders, expedite future seasonal re-orders, comply with international customs and taxation audit regulations, or until you request deletion.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 7 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
              7. Contact Us
            </h2>
            <div className="space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
                For any questions or privacy inquiries regarding this Privacy Policy, please contact our corporate team:
              </p>

              <div className="bg-[#111111] text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="font-black text-2xl tracking-tight">{SITE_CONFIG.legalName}</p>
                    <p className="text-white/60 font-mono text-xs uppercase tracking-widest mt-1">
                      OEM Sports Apparel Manufacturer
                    </p>
                  </div>

                  <div className="text-white/80 space-y-2 text-sm md:text-base">
                    <p className="flex items-start gap-2.5">
                      <MapPin className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                      <span>{SITE_CONFIG.address}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-5 h-5 text-white/50 shrink-0" />
                      <span className="font-mono">{SITE_CONFIG.phone}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-white/50 shrink-0" />
                      <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:text-white underline underline-offset-2">
                        {SITE_CONFIG.supportEmail}
                      </a>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={`mailto:${SITE_CONFIG.supportEmail}`}
                      className="text-xl md:text-2xl font-black text-white hover:text-zinc-300 transition-colors break-all"
                    >
                      {SITE_CONFIG.supportEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}

        <div className="mt-20 text-xs text-[#86868B] border-t border-[#1D1D1F]/10 pt-8 text-center uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
