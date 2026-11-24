import { FAQItem } from '@/types';
import { MOQ_LABEL, MOQ_UNITS, SITE_CONFIG } from '@/lib/constants';

export const faqs: FAQItem[] = [
  // ── ORDERING & MOQ ──
  {
    id: 'faq-moq',
    category: 'ordering',
    question: `What is your Minimum Order Quantity (MOQ) per style or design?`,
    answer: `Our standard factory minimum is strictly ${MOQ_LABEL}. You are welcome to split this volume across different standard adult and youth sizes (e.g. S, M, L, XL, 2XL) at zero extra fee. This allows emerging brands, tournament organizers, and sports clubs to test new custom collections without holding excessive inventory.`,
    keywords: ['moq', 'minimum order', 'minimums', 'smallest order', 'how many pieces', 'batch size', 'pieces', 'small quantity', 'start order'],
    tags: ['MOQ', 'Batch Sizing', 'Size Breakdown'],
  },
  {
    id: 'faq-sample-policy',
    category: 'ordering',
    question: 'Can we order a physical pre-production sample before committing to bulk manufacturing?',
    answer: 'Yes, absolutely. We strongly advocate for sample signoff. Once your tech pack or design specifications are finalized, our sample room cuts, sublimates, and stitches a single full-spec physical master prototype within 3–5 business days and dispatches it via DHL/FedEx Express. Bulk rollouts never begin without your explicit physical or digital approval.',
    keywords: ['sample', 'prototype', 'test piece', 'proof', 'mockup', 'fitting', 'pre-production', 'spec sample', 'touch and feel', 'quality check'],
    tags: ['Samples', 'Prototyping', 'Approval'],
  },
  {
    id: 'faq-private-label',
    category: 'ordering',
    question: 'Do you provide full private label, OEM branding, and custom retail packaging?',
    answer: 'Yes. Every order includes complete private label execution: heat-transfer neck labels, custom woven damask tags, custom barcode hangtags, laser-engraved buttons/zipper pulls, and individual branded biodegradable polybags with custom size stickers ready for direct retail or 3PL warehouse intake.',
    keywords: ['private label', 'branding', 'tags', 'labels', 'neck label', 'polybag', 'barcode', 'packaging', 'retail ready', 'hangtags', 'zipper pulls'],
    tags: ['Private Label', 'OEM Branding', 'Packaging'],
  },
  {
    id: 'faq-custom-trims',
    category: 'ordering',
    question: 'Can we customize trims, zippers, silicon grippers, and collar drawcords?',
    answer: 'Absolutely. We offer complete custom OEM hardware engineering including custom-molded silicone sleeve grippers, branded waterproof SBS/YKK reverse zippers, jacquard elastic waistbands, laser-engraved metal aglets, and custom woven neck taping with your brand slogan.',
    keywords: ['trims', 'zipper', 'drawcord', 'gripper', 'silicone', 'hardware', 'custom waistband', 'elastic', 'ykk', 'aglets'],
    tags: ['Custom Trims', 'Hardware', 'Accessories'],
  },

  // ── PRODUCTION & QUALITY ──
  {
    id: 'faq-turnaround-time',
    category: 'production',
    question: 'What is your standard production lead time across different volume brackets?',
    answer: `For standard batch orders (30 to 500 units), factory production completes in 10–12 business days following sample approval. For medium volumes (500 to 2,500 units), lead time is approximately 14–18 business days. For industrial contract runs exceeding 10,000 units, scheduled staggered drop deliveries or ocean container shipments are coordinated to your specific inventory timeline.`,
    keywords: ['turnaround', 'lead time', 'production time', 'how long', 'timeline', 'speed', 'schedule', 'batch time', 'delivery duration'],
    tags: ['Lead Times', 'Production Schedule', 'Speed'],
  },
  {
    id: 'faq-rush-orders',
    category: 'production',
    question: 'Do you accept rush or expedited manufacturing orders for tournaments?',
    answer: 'Yes. We maintain emergency reserve production capacity for urgent tournament dates, playoff launches, and sudden corporate sponsor activations. Rush orders can be manufactured in as little as 6–8 business days with priority DHL Express door-to-door air freight.',
    keywords: ['rush', 'urgent', 'expedited', 'emergency', 'fast track', 'tournament deadline', 'quick turnaround', 'speed order'],
    tags: ['Rush Orders', 'Priority Lane', 'Urgent Delivery'],
  },
  {
    id: 'faq-fabric-selection',
    category: 'production',
    question: 'What performance fabrics and textile blends do you manufacture?',
    answer: 'We mill and stock a comprehensive range of high-performance technical textiles including AeroVent™ 145 GSM Micro-Mesh, DuraFit™ 180 GSM High-Tenacity Interlock, PowerFlex™ 240 GSM Polyamide-Elastane Compression, Vanguard™ 210 GSM Cotton-Coolmax Technical Piqué, StormTech™ 290 GSM Micro-Grid Fleece, and OceanThread™ GRS-certified 100% recycled polyester. Custom GSM weights and antibacterial/UPF 50+ finishes are available upon request.',
    keywords: ['fabric', 'materials', 'cloth', 'mesh', 'polyester', 'spandex', 'gsm', 'breathable', 'interlock', 'recycled', 'moisture wicking', 'compression'],
    tags: ['Fabrics', 'Materials', 'GSM Weights'],
  },
  {
    id: 'faq-quality-assurance',
    category: 'production',
    question: 'What is your Quality Assurance (QA) and inspection protocol?',
    answer: 'We operate under ISO 9001 and AQL 1.0/2.5 international standards. Our quality inspection spans 4 critical gates: 1) Raw yarn and knit tensile testing, 2) Post-sublimation color fastness and Delta-E spectrophotometer verification, 3) In-line stitch tension and seam-strength inspection, and 4) Final dimensional measurement check and needle-detector clearance before polybag packaging.',
    keywords: ['quality', 'qa', 'inspection', 'aql', 'testing', 'seam strength', 'standards', 'stitching quality', 'iso 9001', 'needle detector'],
    tags: ['Quality Assurance', 'AQL Standards', 'Testing'],
  },
  {
    id: 'faq-durability-wash',
    category: 'production',
    question: 'What durability and wash resistance standards do your sublimated sports uniforms meet?',
    answer: 'Our sublimation dyes are molecularly bonded into synthetic polymer fibers at 210°C under high hydraulic pressure. This guarantees zero cracking, zero flaking, and zero peeling for the life of the garment. In laboratory testing, our dye-sublimated graphics maintain Grade 4–5 ISO 105-C06 color fastness across 100+ commercial washing cycles at 40°C.',
    keywords: ['wash', 'durability', 'fade', 'peeling', 'cracking', 'color fastness', 'laundry', 'shrinkage', 'wear and tear', 'lifespan'],
    tags: ['Durability', 'Colorfastness', 'Washing'],
  },

  // ── DESIGN & SPECS ──
  {
    id: 'faq-design-formats',
    category: 'design',
    question: 'What design file formats and 3D assets do you accept for custom manufacturing?',
    answer: 'We accept flat vector and tech pack files in .PDF, .AI (Adobe Illustrator with converted outlines), .EPS, and high-resolution .SVG formats (up to 100MB). For 3D digital apparel files, we natively support .GLB, .GLTF, .OBJ, .FBX, .STL, and proprietary CAD files including CLO 3D (.ZPRJ) and Browzwear (.BW/.LOT) up to 250MB. If you do not have production-ready vector files, our in-house pattern and CAD engineers can translate your sketches or brand guides into complete manufacturing tech packs.',
    keywords: ['design files', 'vector', 'pdf', 'ai', 'illustrator', 'svg', 'eps', 'clo3d', 'browzwear', '3d apparel', 'tech pack', 'cad'],
    tags: ['Design Files', 'Tech Packs', '3D Apparel'],
  },
  {
    id: 'faq-pantone-color',
    category: 'design',
    question: 'How do you ensure exact Pantone color matching for sublimated sportswear?',
    answer: 'We calibrate our Japanese digital sublimation printers using X-Rite spectrophotometers and standard Pantone Matching System (PMS) formulas. Prior to bulk sublimation, we print high-density color test swatches on your exact chosen fabric blend to guarantee 100% hue, saturation, and contrast fidelity under indoor and outdoor sports lighting.',
    keywords: ['pantone', 'color matching', 'pms', 'shades', 'hue', 'spectrophotometer', 'exact color', 'hex code', 'color swatch'],
    tags: ['Pantone', 'Color Fidelity', 'Sublimation'],
  },
  {
    id: 'faq-nda-ip',
    category: 'design',
    question: 'How do you protect our brand designs, proprietary patterns, and intellectual property?',
    answer: 'We treat intellectual property with ironclad confidentiality. We execute mutual Non-Disclosure Agreements (NDAs) prior to receiving proprietary tech packs. Your custom patterns, gradient artwork, and brand files are archived in secure isolated vaults and are never shared, displayed, or repurposed for any third-party client.',
    keywords: ['nda', 'non disclosure', 'intellectual property', 'ip', 'copyright', 'trademark', 'stolen designs', 'confidential', 'secret', 'protection'],
    tags: ['Intellectual Property', 'NDAs', 'Confidentiality'],
  },

  // ── SHIPPING & LOGISTICS ──
  {
    id: 'faq-shipping-destinations',
    category: 'shipping',
    question: 'Which countries and global markets do you ship to?',
    answer: `We ship door-to-door worldwide with direct expedited logistics gateways into the United States, United Kingdom, Australia, Canada, Germany, France, Netherlands, Ireland, and over ${SITE_CONFIG.countriesExported} other countries globally. We provide full DDP (Delivered Duty Paid), DAP, FOB, and CIF shipping options with automated end-to-end tracking.`,
    keywords: ['shipping countries', 'worldwide delivery', 'export', 'usa', 'uk', 'europe', 'australia', 'canada', 'international freight', 'destinations'],
    tags: ['Global Shipping', 'Worldwide Delivery', 'Air Express'],
  },
  {
    id: 'faq-shipping-transit-times',
    category: 'shipping',
    question: 'What are your door-to-door transit times for air express and ocean freight?',
    answer: `International Air Express via DHL Express, FedEx Priority, and UPS Worldwide typically delivers in ${SITE_CONFIG.worldwideExpressDeliveryDays} business days door-to-door across North America, Europe, the UK, Australia, and GCC. For commercial sea freight consignments (1,000+ units), typical port-to-port transit is 25–35 days depending on destination terminal.`,
    keywords: ['transit time', 'delivery speed', 'how fast to ship', 'air express', 'dhl', 'fedex', 'ups', 'ocean freight', 'container', 'tracking'],
    tags: ['Transit Times', 'Air Freight', 'Ocean Cargo'],
  },
  {
    id: 'faq-ddp-customs',
    category: 'shipping',
    question: 'How does DDP (Delivered Duty Paid) shipping work and who handles import duties?',
    answer: 'Under our DDP (Delivered Duty Paid) service for the US, UK, EU, Canada, and Australia, HR Sports arranges and prepays all customs clearance procedures, border tariffs, and import duties. The quoted shipping rate is 100% comprehensive with zero surprise courier handling invoices upon cargo arrival.',
    keywords: ['ddp', 'customs', 'duty', 'duties', 'taxes', 'tariffs', 'vat', 'import fees', 'clearance', 'delivered duty paid', 'border fees'],
    tags: ['DDP Service', 'Customs Clearance', 'Tariffs & Taxes'],
  },
  {
    id: 'faq-shipping-damage',
    category: 'shipping',
    question: 'What happens if a consignment is damaged or lost during international transit?',
    answer: 'All outbound shipments are fully covered by comprehensive commercial transit insurance. In the rare event of carton puncture, water exposure, or courier loss, mark the delivery exception on the courier receipt and notify us within 48 hours. We handle carrier claims directly and immediately expedite priority factory remakes at zero cost.',
    keywords: ['damaged box', 'lost package', 'broken in transit', 'courier damage', 'wet carton', 'missing carton', 'transit insurance', 'claim'],
    tags: ['Transit Insurance', 'Damaged Shipments', 'Courier Claims'],
  },

  // ── POLICIES & LEGAL (PRIVACY, RETURNS, TERMS) ──
  {
    id: 'faq-return-remake-policy',
    category: 'policies',
    question: 'What is your return, remake, and defect replacement policy for custom garments?',
    answer: 'Under our 100% Quality & Fit Guarantee, if any manufactured apparel deviates from your approved sample or contains sewing, sizing, or sublimation defects, notify us within 14 business days of delivery. Upon video/photographic verification, we promptly initiate a complete factory remake at zero charge or issue an agreed commercial credit. Because all items are custom-manufactured to client specifications, returns for change-of-mind are not permitted.',
    keywords: ['returns', 'refund', 'refunds', 'remake', 'defective', 'replacement', 'money back', 'guarantee', 'exchange', 'faulty clothes', 'wrong size', 'dispute'],
    tags: ['Return Policy', 'Remake Guarantee', 'Defect Resolution'],
  },
  {
    id: 'faq-order-cancellation-changes',
    category: 'policies',
    question: 'Can we modify or cancel an order once the 50% production deposit is paid?',
    answer: 'You may freely adjust sizing breakdowns, roster names, or aesthetic details during the pre-production sample stage prior to final bulk sign-off. Once the physical prototype is signed off and bulk fabric knitting or sublimation begins, orders cannot be canceled as custom raw materials have been committed. Any authorized cancellation prior to mass cutting will refund uncommitted funds less actual sample and setup costs.',
    keywords: ['cancel order', 'cancellation', 'modify order', 'change sizes', 'edit order', 'cancel deposit', 'refund deposit', 'change roster'],
    tags: ['Cancellations', 'Order Modifications', 'Deposit Terms'],
  },
  {
    id: 'faq-privacy-data-security',
    category: 'policies',
    question: 'How do you safeguard client business data, vector artwork, and portal account details?',
    answer: 'In full compliance with international GDPR and data security standards, all client records, CAD designs, and correspondence are protected under TLS 1.3 encryption and isolated server environments. We never sell, lease, or monetize client data with third-party brokers. Your tech packs and vector files remain strictly private within our engineering firewall.',
    keywords: ['privacy', 'privacy policy', 'gdpr', 'data protection', 'security', 'confidentiality', 'passwords', 'encryption', 'artwork security'],
    tags: ['Privacy Policy', 'Data Protection', 'GDPR Compliance'],
  },
  {
    id: 'faq-terms-contract-acceptance',
    category: 'policies',
    question: 'What legal terms govern our manufacturing purchase order and quotation acceptance?',
    answer: 'Our manufacturing agreements are governed by international commercial trade law. Quotation acceptance occurs upon client written approval of the proforma invoice and receipt of the 50% commencement deposit. The approved physical or digital sample serves as the binding quality benchmark (Golden Sample) for the entire bulk production run.',
    keywords: ['terms of service', 'contract', 'purchase order', 'commercial agreement', 'proforma invoice', 'golden sample', 'legal terms'],
    tags: ['Terms of Service', 'Commercial Agreement', 'Contract Terms'],
  },

  // ── PAYMENT & TERMS ──
  {
    id: 'faq-payment-terms',
    category: 'payment',
    question: 'What payment methods, milestone schedules, and currencies do you accept?',
    answer: 'Standard commercial terms are 50% deposit upon sample approval to initiate bulk knitting/sublimation, and the remaining 50% balance upon final factory QA inspection and video sign-off prior to dispatch. We accept International Bank Wire (SWIFT / T/T), Corporate Credit Cards, Wise Business, and commercial Letters of Credit (L/C) in USD, EUR, GBP, and AUD.',
    keywords: ['payment', 'payment methods', 'bank wire', 'swift', 'wire transfer', 'credit card', 'wise', 'deposit', 'milestone', 'currencies', 'invoicing'],
    tags: ['Payment Methods', 'Milestones', 'Bank Wire'],
  },
  {
    id: 'faq-commercial-invoices',
    category: 'payment',
    question: 'Do you provide formal commercial proforma invoices and HS code customs documentation?',
    answer: 'Yes. Every consignment is accompanied by official stamped commercial invoices, packing lists with net/gross weights, Certificate of Origin (upon request), and compliant 6-digit Harmonized System (HS) textile export codes (e.g. 6109, 6112) for swift customs clearance.',
    keywords: ['invoice', 'proforma', 'hs code', 'packing list', 'certificate of origin', 'customs documentation', 'receipt', 'tax invoice'],
    tags: ['Commercial Invoice', 'HS Codes', 'Export Documentation'],
  },
];
