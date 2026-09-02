import { FAQItem } from '@/types';
import { MOQ_LABEL, MOQ_UNITS } from '@/lib/constants';

export const faqs: FAQItem[] = [
  {
    id: 'faq-moq',
    category: 'ordering',
    question: `What is your Minimum Order Quantity (MOQ) per style or design?`,
    answer: `Our standard factory minimum is strictly ${MOQ_LABEL}. You are welcome to split this volume across different standard adult and youth sizes (e.g. S, M, L, XL, 2XL) at zero extra fee. This allows emerging brands, tournament organizers, and sports clubs to test new custom collections without holding excessive inventory.`,
  },
  {
    id: 'faq-sample-policy',
    category: 'ordering',
    question: 'Can we order a physical pre-production sample before committing to bulk manufacturing?',
    answer: 'Yes, absolutely. We strongly advocate for sample signoff. Once your tech pack or design specifications are finalized, our sample room cuts, sublimates, and stitches a single full-spec physical master prototype within 3–5 business days and dispatches it via DHL/FedEx Express. Bulk rollouts never begin without your explicit physical or digital approval.',
  },
  {
    id: 'faq-turnaround-time',
    category: 'production',
    question: 'What is your standard production lead time across different volume brackets?',
    answer: `For standard batch orders (30 to 500 units), factory production completes in 10–12 business days following sample approval. For medium volumes (500 to 2,500 units), lead time is approximately 14–18 business days. For industrial contract runs exceeding 10,000 units, scheduled staggered drop deliveries or ocean container shipments are coordinated to your specific inventory timeline.`,
  },
  {
    id: 'faq-design-formats',
    category: 'design',
    question: 'What design file formats and 3D assets do you accept for custom manufacturing?',
    answer: 'We accept flat vector and tech pack files in .PDF, .AI (Adobe Illustrator with converted outlines), .EPS, and high-resolution .SVG formats (up to 100MB). For 3D digital apparel files, we natively support .GLB, .GLTF, .OBJ, .FBX, .STL, and proprietary CAD files including CLO 3D (.ZPRJ) and Browzwear (.BW/.LOT) up to 250MB. If you do not have production-ready vector files, our in-house pattern and CAD engineers can translate your sketches or brand guides into complete manufacturing tech packs.',
  },
  {
    id: 'faq-fabric-selection',
    category: 'production',
    question: 'What performance fabrics and textile blends do you manufacture?',
    answer: 'We mill and stock a comprehensive range of high-performance technical textiles including AeroVent™ 145 GSM Micro-Mesh, DuraFit™ 180 GSM High-Tenacity Interlock, PowerFlex™ 240 GSM Polyamide-Elastane Compression, Vanguard™ 210 GSM Cotton-Coolmax Technical Piqué, StormTech™ 290 GSM Micro-Grid Fleece, and OceanThread™ GRS-certified 100% recycled polyester. Custom GSM weights and antibacterial/UPF 50+ finishes are available upon request.',
  },
  {
    id: 'faq-private-label',
    category: 'ordering',
    question: 'Do you provide full private label, OEM branding, and custom retail packaging?',
    answer: 'Yes. Every order includes complete private label execution: heat-transfer neck labels, custom woven damask tags, custom barcode hangtags, laser-engraved buttons/zipper pulls, and individual branded biodegradable polybags with custom size stickers ready for direct retail or 3PL warehouse intake.',
  },
  {
    id: 'faq-shipping-destinations',
    category: 'shipping',
    question: 'Which countries and global markets do you ship to?',
    answer: 'We ship door-to-door worldwide with direct expedited logistics gateways into the United States, United Kingdom, Australia, Canada, Germany, France, Netherlands, Ireland, and over 42 other countries globally. We provide full DDP (Delivered Duty Paid), DAP, FOB, and CIF shipping options with automated end-to-end tracking.',
  },
  {
    id: 'faq-quality-assurance',
    category: 'production',
    question: 'What is your Quality Assurance (QA) and inspection protocol?',
    answer: 'We operate under ISO 9001 and AQL 1.0/2.5 international standards. Our quality inspection spans 4 critical gates: 1) Raw yarn and knit tensile testing, 2) Post-sublimation color fastness and Delta-E spectrophotometer verification, 3) In-line stitch tension and seam-strength inspection, and 4) Final dimensional measurement check and needle-detector clearance before polybag packaging.',
  },
  {
    id: 'faq-payment-terms',
    category: 'payment',
    question: 'What payment methods and commercial terms do you support?',
    answer: 'For standard OEM production orders, terms are 50% deposit upon sample approval and commencement of bulk production, with the remaining 50% balance due upon completion and quality sign-off prior to dispatch. We accept International Bank Wire Transfer (T/T, SWIFT), Corporate Credit Cards, Wise Business, and Escrow / Letter of Credit (L/C) for large enterprise contract volumes.',
  },
  {
    id: 'faq-nda-ip',
    category: 'design',
    question: 'How do you protect our brand designs, proprietary patterns, and intellectual property?',
    answer: 'We treat intellectual property with ironclad confidentiality. We execute mutual Non-Disclosure Agreements (NDAs) prior to receiving proprietary tech packs. Your custom patterns, gradient artwork, and brand files are archived in secure isolated vaults and are never shared, displayed, or repurposed for any third-party client.',
  },
];
