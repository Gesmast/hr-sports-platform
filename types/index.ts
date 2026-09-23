/**
 * Type definitions for HR Sports Platform
 */

export interface Material {
  id: string;
  name: string;
  category: 'performance-mesh' | 'interlock' | 'compression' | 'fleece' | 'poly-spandex' | 'eco-recycled' | 'cotton-blend' | 'nylon-spandex';
  blendComposition: string;
  gsmWeight: number; // e.g. 160, 220, 280
  stretchRating: string; // e.g. '4-way stretch (25%)'
  moistureWickingRating: string; // e.g. 'QuickDry Grade 4.8/5'
  breathabilityIndex: string; // e.g. 'Airflow 380 L/m²/s'
  useCases: string[];
  description: string;
}

export type GenderOption = 'Men' | 'Women' | 'Unisex' | 'Youth';

export interface ProductMaterialOption {
  id: string;
  name: string;
  blend: string;
  gsm: number;
  description: string;
  bestFor: string;
  badge?: string;
}

export interface StyleProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  genders: GenderOption[];
  materials: ProductMaterialOption[];
  features?: string[];
  moq?: number;
}

export interface StyleCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  featuredProducts: string[];
  products: StyleProduct[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'international-leagues' | 'corporate-kits' | 'school-uniforms' | 'activewear';
  categoryLabel: string;
  client: string;
  year: number;
  fabricsUsed: string[];
  productionVolume: string; // e.g. '4,500 Units'
  durationWeeks: string; // e.g. '3.5 Weeks'
  thumbnailUrl: string;
  gallery: string[];
  summary: string;
  challenge: string;
  solution: string;
  specs: {
    label: string;
    value: string;
  }[];
  testimonial?: ProjectTestimonial;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Executive' | 'Textile Engineering' | 'Pattern & 3D CAD' | 'Production Logistics' | 'Quality Control';
  photoUrl: string;
  bio: string;
  experienceYears: number;
}

export interface CountryComparisonRow {
  label: string;
  hrSports: string;
  localRetail: string;
}

export interface CountryHeroStats {
  moq: string;
  productionDays: string;
  shippingDays: string;
  happyClients?: string;
  dutyAdvantage?: string;
}

export interface Country {
  slug: string;
  name: string;
  flagIcon: string;
  isWorldwide?: boolean;
  heroStats: CountryHeroStats;
  headline: string;
  subcopy: string;
  localizedWhyUs: {
    title: string;
    description: string;
  }[];
  comparisonRows: CountryComparisonRow[];
  testimonial?: ProjectTestimonial;
}

export interface FAQItem {
  id: string;
  category: 'ordering' | 'design' | 'production' | 'shipping' | 'payment';
  question: string;
  answer: string;
}

export interface DesignFile {
  fileName: string;
  sizeBytes: number;
  kind: 'flat' | '3d';
  extension: string;
  storageUrl?: string;
  previewUrl?: string;
}

export interface QuoteInquiryPayload {
  companyName?: string;
  order_by?: string;
  contactEmail: string;
  contactPhone?: string;
  targetDeliveryDate: string;
  volumeMOQ: number;
  garmentType: string;
  materialVariant: string;
  sizeBreakdown?: string;
  uploadMode: 'file' | 'design-help';
  designFiles?: DesignFile[];
  designNotes?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  message: string;
}

export type OrderStage = 'received' | 'sample_approved' | 'in_production' | 'quality_check' | 'shipped';

export interface OrderDocument {
  id: string;
  name: string;
  type: 'invoice' | 'techpack' | 'qc_cert' | 'shipping_bol';
  size: string;
  date: string;
  downloadUrl: string;
}

export interface PortalOrder {
  id: string;
  referenceNumber: string;
  clientEmail: string;
  companyName: string;
  garmentType: string;
  quantity: number;
  material: string;
  stage: OrderStage;
  submittedDate: string;
  estimatedDeliveryDate: string;
  carrier?: string;
  trackingNumber?: string;
  sampleStatus: 'Pending Design' | 'Sample Dispatched' | 'Sample Approved' | 'Waived by Client';
  productionProgressPercent: number;
  documents: OrderDocument[];
}
