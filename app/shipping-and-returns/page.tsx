import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, Truck, Package, Clock, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: `Shipping & Returns Policy | ${SITE_CONFIG.name}`,
  description: `Worldwide shipping timelines, sample dispatch, DDP freight, and quality return policies for ${SITE_CONFIG.legalName} OEM manufacturing.`,
};

export const revalidate = 0; // Dynamic on-demand update

export default async function ShippingAndReturnsPage() {
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
      .eq('slug', 'shipping-and-returns')
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
    console.warn('Could not fetch dynamic policy from Supabase, using fallback:', err);
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
            <Truck className="w-3.5 h-3.5 text-black" />
            <span>Logistics &amp; Quality Terms</span>
          </div>
        </div>
      </div>

      <div className="container py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-12 border-b-4 border-[#1D1D1F] pb-6">
          {dynamicPolicy?.title || 'Shipping & Returns Policy'}
        </h1>

        <section className="mb-12">
          <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono mb-8 border-l-2 border-black pl-4">
            Last Updated: {lastUpdatedDisplay}
          </div>
          <div className="space-y-6 text-[#1D1D1F]/80 leading-relaxed text-base md:text-lg">
            <p>
              This Shipping &amp; Returns Policy outlines international freight terms, lead times, sample delivery protocols, and quality guarantees for all custom sportswear and OEM apparel manufactured by <strong>{SITE_CONFIG.legalName}</strong>.
            </p>
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-12" />

        {/* Dynamic Database Content (if available from Owner Dashboard) */}
        {dynamicPolicy && dynamicPolicy.content ? (
          <div
            className="space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: dynamicPolicy.content }}
          />
        ) : (
          <>
            {/* SECTION 1: SHIPPING POLICY */}
        <section className="mb-16">
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
            1. Shipping &amp; Delivery Policy
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F] flex items-center gap-2">
                <Clock className="w-5 h-5 text-black" />
                Production Lead Times &amp; Order Processing
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  <strong>Pre-Production Samples:</strong> Custom sample orders are cut, printed, sewn, and dispatched within <strong>{SITE_CONFIG.sampleLeadTimeDays}</strong> upon digital mockup and tech pack approval.
                </li>
                <li>
                  <strong>Bulk Production Orders:</strong> Standard production cycles require <strong>{SITE_CONFIG.productionLeadTimeDays}</strong> following sample sign-off, varying based on order volume and technical construction (sublimation, embroidery, custom trims).
                </li>
                <li>
                  Orders are dispatched on business working days Monday through Saturday. Factory production is paused during recognized national holidays.
                </li>
                <li>
                  In cases of seasonal peak volume or custom yarn knitting, updated milestone schedules are communicated in advance on your client dashboard and proforma invoice.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F] flex items-center gap-2">
                <Truck className="w-5 h-5 text-black" />
                Shipping Rates &amp; Delivery Estimates
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Freight charges are calculated transparently based on shipment deadweight, volumetric dimensions, destination postal code, and selected shipping tier (Air Express vs. Cargo).
                </li>
                <li>
                  <strong>DDP (Delivered Duty Paid) Service:</strong> Available for shipments to the United States, United Kingdom, European Union, Canada, and Australia upon request. Under DDP terms, all customs clearance, import tariffs, and duties are prepaid and managed end-to-end.
                </li>
                <li>
                  We partner with top-tier international couriers including <strong>DHL Express, FedEx Priority, and UPS Worldwide</strong>, alongside licensed commercial air freight forwarders and ocean lines for high-volume container shipments.
                </li>
                <li>
                  <strong>Worldwide Air Express:</strong> Typical transit duration is <strong>{SITE_CONFIG.worldwideExpressDeliveryDays}</strong> door-to-door to North America, Europe, the UK, Australia, and the Middle East.
                </li>
                <li>
                  <strong>Commercial Ocean Freight:</strong> Recommended for large-volume consignments (over 1,000 units), with typical port-to-port transit of 25–35 days.
                </li>
                <li>
                  If you require specialized routing, split-shipments, or palletized distribution, please contact our logistics desk at{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                    {SITE_CONFIG.supportEmail}
                  </a>.
                </li>
                <li>
                  While HR Sports adheres strictly to promised factory dispatch deadlines, we cannot be held liable for transit delays caused by third-party courier rerouting, extreme weather, or customs physical inspections.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F] flex items-center gap-2">
                <Package className="w-5 h-5 text-black" />
                Packaging &amp; Freight Security
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Garments are individually folded, packed in polybags (biodegradable options available), and boxed into export-grade, 7-ply corrugated export cartons reinforced with strapping bands and moisture barriers.
                </li>
                <li>
                  Custom barcode labeling, brand hangtags, and carton ratio labeling are provided in accordance with client warehouse specifications.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">
                Shipment Confirmation &amp; Tracking
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Upon dispatch from our factory logistics bay, you will receive an official shipment confirmation email containing carrier tracking numbers and the commercial export invoice.
                </li>
                <li>
                  Tracking details are synchronized to your <strong>HR Sports Client Portal</strong> for 24/7 shipment milestone visibility.
                </li>
                <li>
                  Please allow up to 24 hours for carrier tracking updates to reflect on the courier&apos;s global tracking network after pickup.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">
                Customs, Duties, and Import Taxes
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Unless a shipment is contracted specifically under DDP (Delivery Duty Paid) terms, international orders are shipped DAP (Delivered at Place) or FOB.
                </li>
                <li>
                  Under DAP terms, import duties, customs inspection fees, and destination VAT/taxes imposed by the receiving country are the responsibility of the consignee.
                </li>
                <li>
                  HR Sports prepares complete commercial documentation (GSP/COO certificates where applicable, commercial invoices, and packing lists) to expedite clean customs clearance.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">
                Damages &amp; Transit Claims
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  We inspect 100% of shipments before seal. In the rare event that cartons arrive damaged, wet, or tampered with by the carrier, take immediate photographs of the exterior carton before opening and sign the delivery receipt with a damage note.
                </li>
                <li>
                  <strong>Transit Insurance:</strong> We strongly advise clients to request comprehensive air/marine cargo insurance for bulk shipments to protect against transit loss.
                </li>
                <li>
                  Please report any transit discrepancies to our logistics team at{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                    {SITE_CONFIG.supportEmail}
                  </a>{' '}
                  within 48 hours of receipt.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-16" />

        {/* SECTION 2: ORDER CANCELLATION */}
        <section className="mb-16">
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
            2. Order Cancellation Policy
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2 text-[#1D1D1F]">When Cancellations Are Permitted</h3>
              <p className="text-[#1D1D1F]/80 text-sm md:text-base">
                Standard orders may be cancelled within <strong>24 hours</strong> of placement, provided that fabric procurement, custom dyeing, cutting, or dye-sublimation printing has not yet been initiated.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-[#1D1D1F]">Production Stage Limitations</h3>
              <p className="text-[#1D1D1F]/80 text-sm md:text-base">
                Because HR Sports manufactures bespoke OEM products tailored exclusively to your brand&apos;s custom sizing, patterns, logos, and colorways, once raw materials are cut or printed, the production cycle cannot be cancelled, halted, or recalled.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-[#1D1D1F]">Non-Refundable Payment Processing Fees</h3>
              <p className="text-[#1D1D1F]/80 text-sm md:text-base">
                In the event of an approved pre-production cancellation, international banking and credit card merchant processing fees (typically 3.5%–5%) are non-refundable, as these charges are levied directly by financial intermediaries.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-[#1D1D1F]">How to Request a Cancellation</h3>
              <p className="text-[#1D1D1F]/80 text-sm md:text-base">
                To submit an urgent cancellation request, email{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                  {SITE_CONFIG.supportEmail}
                </a>{' '}
                immediately with your PO / Quotation number and company details.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-16" />

        {/* SECTION 3: REFUNDS & RETURNS */}
        <section className="mb-16">
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-[#1D1D1F] border-l-4 border-black pl-4">
            3. Refunds &amp; Returns Policy
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" />
                Custom OEM Manufacturing Scope
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Every apparel item produced by HR Sports is custom-fabricated according to customer-approved tech packs, measurements, and pre-production samples. Consequently, off-the-shelf retail returns or buyer&apos;s remorse returns do not apply to custom OEM manufacturing runs.
                </li>
                <li>
                  <strong>Defective Products &amp; Quality Guarantee:</strong> If any garment arrives with a verifiable manufacturing defect (such as structural seam failure, incorrect sublimation print alignment, or non-conformance to approved sizing specifications exceeding agreed AQL 2.5 standards), HR Sports will replace the defective units free of cost or issue an equivalent production credit.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">Return &amp; Claim Process</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  To initiate a quality claim, contact us at{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                    {SITE_CONFIG.supportEmail}
                  </a>{' '}
                  within <strong>7 calendar days</strong> of receiving your shipment.
                </li>
                <li>
                  Include high-resolution photographs, videos, and a detailed breakdown of affected garment quantities and defects.
                </li>
                <li>
                  Once verified by our Quality Assurance team, instructions will be provided for replacement fabrication or credit issuance.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">Non-Refundable &amp; Non-Returnable Items</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  <strong>Custom Products:</strong> All garments manufactured strictly in accordance with client-approved tech packs, digital proofs, and approved physical samples are non-returnable.
                </li>
                <li>
                  <strong>Shipping &amp; Duties:</strong> Freight carrier costs, customs fees, and import taxes are non-refundable once goods have departed our logistics hub.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-[#1D1D1F]">Refund Settlement Timeline</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#1D1D1F]/80 text-sm md:text-base">
                <li>
                  Approved refund amounts or adjustments will be credited back via the original payment method or applied as credit toward subsequent manufacturing runs within <strong>7–10 business days</strong>.
                </li>
                <li>
                  If you have not received an approved refund after 12 business days, please notify{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-semibold underline underline-offset-2">
                    {SITE_CONFIG.supportEmail}
                  </a>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: CONTACT INFORMATION */}
        <section className="mt-16 mb-12 scroll-mt-32">
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6 text-[#1D1D1F] border-l-4 border-black pl-4">
            Contact Information
          </h2>
          <div className="bg-[#F5F5F7] p-8 md:p-10 rounded-3xl border border-[#1D1D1F]/5 space-y-6">
            <p className="text-base md:text-lg text-[#1D1D1F]/80">
              Questions regarding international freight, customs clearance, sample dispatch, or returns should be directed to our logistics desk at{' '}
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold text-black underline underline-offset-2">
                {SITE_CONFIG.supportEmail}
              </a>.
            </p>
            <div className="pt-6 border-t border-[#1D1D1F]/10 space-y-3">
              <p className="font-black text-[#1D1D1F] text-2xl tracking-tight">{SITE_CONFIG.legalName}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-[#1D1D1F]/60">
                OEM Athletic Apparel &amp; Sportswear Manufacturer
              </p>
              <div className="text-[#1D1D1F]/80 text-sm md:text-base space-y-1">
                <p>{SITE_CONFIG.address}</p>
                <p>Manufacturing Facility: HR SPORTS LAHORE, Green Building, Block B New Chauburji Park, Multan Road, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="pt-4 flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 text-sm md:text-base">
                <p>
                  <strong>Phone / WhatsApp:</strong> <span className="font-mono font-medium">{SITE_CONFIG.phone}</span>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-black font-medium underline underline-offset-2">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
        </>
        )}

        <div className="mt-20 text-xs text-[#86868B] border-t border-[#1D1D1F]/10 pt-8 text-center uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
