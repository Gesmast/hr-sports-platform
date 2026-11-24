import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, FileText, Mail, MapPin, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_CONFIG.name}`,
  description: `Commercial terms and conditions governing custom sports apparel manufacturing, client portal access, and OEM orders with ${SITE_CONFIG.legalName}.`,
};

export const revalidate = 0; // Dynamic on-demand update

export default async function TermsOfServicePage() {
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
      .eq('slug', 'terms-of-service')
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
    console.warn('Could not fetch dynamic terms of service, using fallback:', err);
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
            <FileText className="w-3.5 h-3.5 text-black" />
            <span>Commercial Agreement</span>
          </div>
        </div>
      </div>

      <div className="container py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black italic mb-12 uppercase tracking-tighter border-b-4 border-[#1D1D1F] pb-6">
          {dynamicPolicy?.title || 'Terms of Service'}
        </h1>

        <section className="mb-12">
          <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono mb-8 border-l-2 border-black pl-4">
            Last Updated: {lastUpdatedDisplay}
          </div>
          <div className="space-y-6 text-[#1D1D1F]/80 leading-relaxed text-base md:text-lg">
            <p>
              This website and client portal is operated by <strong>{SITE_CONFIG.legalName}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to {SITE_CONFIG.legalName}. {SITE_CONFIG.legalName} offers this website, including all information, digital mockups, tech pack review systems, quotation tools, and manufacturing services available from this site to you, the client, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
            </p>
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-16" />

        {dynamicPolicy && dynamicPolicy.content ? (
          <div
            className="space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: dynamicPolicy.content }}
          />
        ) : (

        <div className="space-y-16">
          {/* Section 1 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 1 - Commercial Terms &amp; Eligibility
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your jurisdiction and possess the legal authority to bind your company or organization to commercial purchase orders and manufacturing contracts.
              </p>
              <p>
                You may not utilize our manufacturing services or products for any unlawful or unauthorized purpose, nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to intellectual property and international trade compliance laws).
              </p>
              <p>
                You must not transmit any malicious code, destructive scripts, or viruses into our web infrastructure or digital client portal.
              </p>
              <p>
                A breach or violation of any of the Terms will result in an immediate termination of your client account and access to manufacturing services.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 2 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 2 - General Conditions &amp; Manufacturing Acceptance
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                We reserve the right to decline manufacturing service or quotation requests to anyone for legitimate commercial reasons at any time.
              </p>
              <p>
                You understand that your digital content (excluding banking and credit card details) may be transferred unencrypted across networks to coordinate production schedules with our factory management system. Financial payment details are always encrypted under TLS protocols.
              </p>
              <p>
                You agree not to duplicate, reverse-engineer, resell, or exploit any proprietary manufacturing processes, specialized pattern templates, or software tools provided through the Service without express written permission by {SITE_CONFIG.legalName}.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 3 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 3 - Accuracy, Completeness and Timeliness of Information
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                We strive for total precision across all technical fabric specifications, GSM yarn charts, and sizing matrices. However, general information on the site is provided for preliminary guidance; binding technical parameters are confirmed strictly through individual proforma invoices and pre-production sample approvals.
              </p>
              <p>
                Historical gallery photos and portfolio archives represent previous OEM productions and do not guarantee perpetual availability of historical trims or discontinued seasonal fabrics.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 4 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 4 - Modifications to the Service and Quotations
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                Unit manufacturing prices and raw material rates are subject to change based on global yarn market index fluctuations, order volume, and custom embellishments. Formal written quotations provided to clients are valid for the period specified in the quotation (typically 30 days).
              </p>
              <p>
                We reserve the right at any time to modify or discontinue any manufacturing technique, fabric blend, or service line without notice.
              </p>
              <p>
                We shall not be liable to you or to any third party for any price adjustments, suspension, or discontinuance of specific custom garment lines.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 5 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 5 - Products, Samples &amp; OEM Manufacturing Services
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                Our sportswear and athletic apparel items are manufactured to custom client order. All orders, lead times, sample approvals, and returns are strictly subject to our{' '}
                <Link href="/shipping-and-returns" className="font-bold underline text-black hover:opacity-75">
                  Shipping &amp; Returns Policy
                </Link>.
              </p>
              <p>
                We make every effort to display garment colors, sublimation gradients, and textures on screen with maximum fidelity. However, because monitor calibrations differ, we strongly advise ordering a pre-production sample or referencing physical Pantone Matching System (PMS) color codes before approving bulk runs.
              </p>
              <p>
                Unless explicitly covered by an exclusive private label contract, manufacturing slots are allocated on a rolling commercial basis. We reserve the right to limit production volumes based on factory seasonal capacity.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 6 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 6 - Accuracy of Invoicing, Billing &amp; Account Details
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                We reserve the right to refuse or halt any production order that violates trademark rights or fails international compliance audits.
              </p>
              <p>
                <strong>Payments and commercial deposits are handled securely through certified international banking partners.</strong> {SITE_CONFIG.legalName} does not store sensitive cardholder verification cryptograms on its website databases.
              </p>
              <p>
                You agree to provide accurate, complete, and current company purchasing credentials, tax identification (VAT/EIN/EORI where applicable), and freight delivery addresses.
              </p>
              <p>
                For complete delivery and freight guidelines, please review our{' '}
                <Link href="/shipping-and-returns" className="font-bold underline text-black hover:opacity-75">
                  Shipping &amp; Returns Policy
                </Link>.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 7 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 7 - Optional Tools &amp; 3D Visualizers
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                We may provide you with access to third-party digital tools, 3D garment visualizers, or AI layout generators over which we exert no direct operational control.
              </p>
              <p>
                You acknowledge and agree that we provide access to such interactive tools &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranty or endorsement. Use of optional digital tools is at your sole discretion.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 8 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 8 - Third-Party Links &amp; Freight Services
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                Certain third-party links on our website or portal may connect to external courier tracking tools (DHL, FedEx, UPS) or payment gateways. We are not liable for external third-party policies, service interruptions, or third-party website content.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 9 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 9 - Client Tech Packs, Artwork &amp; Proprietary Designs
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                <strong>Intellectual Property &amp; Non-Disclosure:</strong> All logos, trademarks, proprietary patterns, vector artwork, and tech packs submitted by clients remain the exclusive intellectual property of the client. {SITE_CONFIG.legalName} agrees never to distribute, sell, or manufacture client-owned designs for any unauthorized third party.
              </p>
              <p>
                You warrant that you own or possess valid licensing rights for all logos, team emblems, and artwork supplied to {SITE_CONFIG.legalName} for apparel customization, and agree to hold {SITE_CONFIG.legalName} harmless from any trademark infringement claims resulting from client-provided assets.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 10 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 10 - Personal &amp; Business Information
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                Your submission of business, contact, and billing information through the website and portal is governed strictly by our{' '}
                <Link href="/privacy-policy" className="font-bold underline text-black hover:opacity-75">
                  Privacy Policy
                </Link>.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 11 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 11 - Errors, Inaccuracies and Omissions
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                Occasionally, information on our site or portal may contain typographical errors or omissions relating to fabric stock, lead time estimates, or shipping calculations. We reserve the right to correct any clerical errors and adjust quotation figures prior to contract confirmation.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 12 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 12 - Prohibited Uses
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                In addition to standard statutory prohibitions, you are prohibited from utilizing the site or manufacturing services: (a) for counterfeit apparel production or unauthorized trademark cloning; (b) to solicit others to perform illegal commercial acts; (c) to violate international export control regulations; (d) to upload malicious files or unauthorized scraping tools; or (e) to circumvent portal security features.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 13 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 13 - Disclaimer of Warranties; Limitation of Liability
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                We do not guarantee that your use of the website or digital portal will be completely uninterrupted or error-free at all hours, though we maintain high server uptime protocols.
              </p>
              <p>
                In no case shall <strong>{SITE_CONFIG.legalName}</strong>, our directors, factory managers, production staff, or affiliates be liable for indirect, incidental, punitive, or consequential damages of any kind, including lost profits or business interruption, arising from third-party logistics transit delays or unforeseen raw material shortages beyond reasonable control.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 14 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 14 - Indemnification
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                You agree to indemnify, defend, and hold harmless <strong>{SITE_CONFIG.legalName}</strong>, its directors, employees, and production affiliates from any claim or demand, including legal fees, arising out of your breach of these Terms of Service or trademark disputes involving client-provided graphics.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 15 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 15 - Severability
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                In the event that any provision of these Terms of Service is determined to be unlawful, void, or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the remainder of the terms shall remain in full force and effect.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 16 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 16 - Termination
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement. Either party may terminate ongoing business relationships upon completion of confirmed manufacturing contracts.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 17 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 17 - Entire Agreement
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                These Terms of Service, along with confirmed proforma invoices, approved sample sign-offs, and our published operating policies, constitute the entire agreement between you and {SITE_CONFIG.legalName}.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 18 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 18 - Governing Law
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                These Terms of Service and any separate agreements whereby we provide you manufacturing services shall be governed by and construed in accordance with the laws of <strong>Pakistan</strong>, with dispute jurisdiction in Punjab, alongside applicable international commercial sales conventions (CISG/Incoterms 2020).
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 19 */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 19 - Changes to Terms of Service
            </h2>
            <div className="space-y-4 text-base md:text-lg text-[#1D1D1F]/80 leading-relaxed">
              <p>
                You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update or amend any portion of these Terms of Service by posting updates on our website.
              </p>
            </div>
            <hr className="border-[#1D1D1F]/10 mt-16" />
          </section>

          {/* Section 20 */}
          <section className="mt-16 mb-12 scroll-mt-32">
            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
              Section 20 - Contact Information
            </h2>
            <div className="bg-[#F5F5F7] p-8 md:p-10 rounded-3xl border border-[#1D1D1F]/5 space-y-6">
              <p className="text-base md:text-lg text-[#1D1D1F]/80">
                Questions about the Terms of Service should be sent to us at{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold text-black underline underline-offset-2">
                  {SITE_CONFIG.supportEmail}
                </a>.
              </p>
              <div className="pt-6 border-t border-[#1D1D1F]/10 space-y-3">
                <p className="font-black text-[#1D1D1F] text-2xl tracking-tight">{SITE_CONFIG.legalName}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-[#1D1D1F]/60">
                  OEM Athletic Apparel Manufacturer
                </p>
                <div className="text-[#1D1D1F]/80 text-sm md:text-base space-y-1">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-black shrink-0 mt-1" />
                    <span>{SITE_CONFIG.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-black shrink-0" />
                    <span className="font-mono">{SITE_CONFIG.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-black shrink-0" />
                    <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="underline underline-offset-2">
                      {SITE_CONFIG.supportEmail}
                    </a>
                  </p>
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
