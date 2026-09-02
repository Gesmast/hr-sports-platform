import { z } from 'zod';
import {
  MOQ_UNITS,
  MOQ_LABEL,
  MAX_FLAT_FILE_SIZE_BYTES,
  MAX_3D_FILE_SIZE_BYTES,
  ALLOWED_FLAT_EXTENSIONS,
  ALLOWED_3D_EXTENSIONS,
} from '@/lib/constants';

export const designFileSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  sizeBytes: z.number().positive('File size must be positive'),
  kind: z.enum(['flat', '3d']),
  extension: z.string().min(1, 'Extension is required'),
  storageUrl: z.string().optional(),
  previewUrl: z.string().optional(),
}).superRefine((file, ctx) => {
  const ext = file.extension.toLowerCase().startsWith('.') 
    ? file.extension.toLowerCase() 
    : `.${file.extension.toLowerCase()}`;

  if (file.kind === 'flat') {
    const isAllowed = ALLOWED_FLAT_EXTENSIONS.includes(ext as any);
    if (!isAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unsupported vector/flat format (${ext}). Allowed: ${ALLOWED_FLAT_EXTENSIONS.join(', ')}`,
        path: ['extension'],
      });
    }
    if (file.sizeBytes > MAX_FLAT_FILE_SIZE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Flat tech pack exceeds 100MB limit (${(file.sizeBytes / (1024 * 1024)).toFixed(1)}MB)`,
        path: ['sizeBytes'],
      });
    }
  } else if (file.kind === '3d') {
    const isAllowed = ALLOWED_3D_EXTENSIONS.includes(ext as any);
    if (!isAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unsupported 3D CAD format (${ext}). Allowed: ${ALLOWED_3D_EXTENSIONS.join(', ')}`,
        path: ['extension'],
      });
    }
    if (file.sizeBytes > MAX_3D_FILE_SIZE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `3D garment file exceeds 250MB limit (${(file.sizeBytes / (1024 * 1024)).toFixed(1)}MB)`,
        path: ['sizeBytes'],
      });
    }
  }
});

// Logo Placement Slot Schema
export const logoPlacementSchema = z.object({
  slot: z.string(),
  image_url: z.string().nullable().optional(),
  height_in: z.number().nullable().optional(),
  width_in: z.number().nullable().optional(),
  placement_note: z.string().nullable().optional(),
  flag_auto: z.boolean().optional(),
});

// Individualized Player Roster Row Schema
export const playerRosterRowSchema = z.object({
  id: z.string().optional(),
  player_name: z.string().min(1, 'Player name is required'),
  number: z.string().default(''),
  size: z.string().min(1, 'Size is required'),
  qty: z.number().int().min(1).default(2),
  role_note: z.string().nullable().optional(),
});

// Structured Design Brief Schema (Branch B: "requested_from_team")
export const designBriefSchema = z.object({
  primary_colors: z.array(z.string()).default([]),
  secondary_colors: z.array(z.string()).default([]),
  style_themes: z.array(z.string()).default([]),
  print_coverage: z.enum(['full_sublimation', 'solid_base_accent', 'solid_only']).default('full_sublimation'),
  reference_brand: z.string().nullable().optional(),
  text_elements: z.array(z.string()).default([]),
  graphic_elements: z.array(z.string()).default([]),
  elements_to_avoid: z.string().nullable().optional(),
  brand_guidelines_file: z.string().nullable().optional(),
  inspiration_images: z.array(z.string()).default([]),
  additional_notes: z.string().nullable().optional(),
});

// Design Source & Assets Schema
export const designSourceSchema = z.object({
  source: z.enum(['client_provided', 'requested_from_team']).default('requested_from_team'),
  uploaded_files: z.array(z.string()).default([]),
  brief: designBriefSchema.optional(),
});

// Individual Garment Spec (Top, Bottom, Outerwear, etc.)
export const garmentSpecSchema = z.object({
  id: z.string().optional(),
  garment_type: z.enum(['top', 'bottom', 'outerwear', 'headwear', 'accessory']),
  type_name: z.string().min(1, 'Garment type name is required'),
  colour_mode: z.enum(['sublimation', 'solid', 'two_tone', 'heather', 'colour_block']).default('sublimation'),
  colour_value: z.string().default('Sublimation'),
  fabric_name: z.string().min(1, 'Fabric is required'),
  fabric_gsm: z.number().optional(),
  collar_type: z.string().nullable().optional(),
  button_type: z.string().nullable().optional(),
  sleeve_length: z.string().nullable().optional(),
  fly_type: z.string().nullable().optional(),
  pocket_type: z.string().nullable().optional(),
  cuff_type: z.string().nullable().optional(),
  panel_piping: z.string().nullable().optional(),
  logo_application: z.array(z.string()).default([]),
  font_name: z.string().nullable().optional(),
  mockups: z.object({
    front: z.string().nullable().optional(),
    side: z.string().nullable().optional(),
    back: z.string().nullable().optional(),
  }).optional(),
  logo_placements: z.array(logoPlacementSchema).default([]),
  sizing: z.object({
    mode: z.enum(['uniform', 'individualized']).default('uniform'),
    qty_by_size: z.record(z.string(), z.number()).default({}),
  }).optional(),
});

export const stepOneBaseSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, 'Company or organization name must be at least 2 characters')
    .max(100, 'Company name too long'),
  contactEmail: z
    .string()
    .trim()
    .email('Please provide a valid corporate email address'),
  contactPhone: z
    .string()
    .trim()
    .optional(),
  targetDeliveryDate: z
    .string()
    .min(1, 'Target delivery date or turnaround timeframe is required'),
  // Enhanced OMTEX meta fields
  order_by: z.string().optional(),
  designer: z.string().optional(),
  order_date: z.string().optional(),
  dispatch_date: z.string().optional(),
  team_country_name: z.string().optional(),
  sport: z.string().optional(),
});

export const stepOneSchema = stepOneBaseSchema;

export const stepTwoBaseSchema = z.object({
  volumeMOQ: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(MOQ_UNITS, `Minimum order quantity is ${MOQ_LABEL}`),
  garmentType: z
    .string()
    .min(1, 'Please select a garment or apparel category'),
  materialVariant: z
    .string()
    .min(1, 'Please specify your target fabric or material blend'),
  sizeBreakdown: z
    .string()
    .optional(),
  // Enhanced Order Type & Multi-garment fields
  order_type: z.enum(['uniform', 'individualized']).default('uniform'),
  size_chart_standard: z.enum(['mens_export', 'womens_export', 'youth', 'unisex']).default('mens_export'),
  garments: z.array(garmentSpecSchema).optional(),
  roster: z.array(playerRosterRowSchema).optional(),
  blanks_by_size: z.record(z.string(), z.number()).optional(),
});

export const stepTwoSchema = stepTwoBaseSchema;

export const stepThreeBaseSchema = z.object({
  uploadMode: z.enum(['file', 'design-help']),
  designFiles: z.array(designFileSchema).optional(),
  designNotes: z.string().max(3000, 'Notes must be within 3,000 characters').optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  customSilhouette: z.string().optional(),
  customLogoPlacement: z.string().optional(),
  generatedPreviewFrontUrl: z.string().optional(),
  generatedPreviewBackUrl: z.string().optional(),
  // Structured Design Source & Brief
  design: designSourceSchema.optional(),
});

export const stepThreeSchema = stepThreeBaseSchema.superRefine((data, ctx) => {
  if (data.uploadMode === 'design-help') {
    if (!data.designNotes || data.designNotes.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide design instructions or tech requirements (minimum 5 characters)',
        path: ['designNotes'],
      });
    }
  } else if (data.uploadMode === 'file') {
    if (!data.designFiles || data.designFiles.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please attach at least one tech pack (.pdf/.ai/.eps) or 3D garment file (.glb/.obj/.zprj)',
        path: ['designFiles'],
      });
    }
  }
});

export const quoteSchema = z.object({
  // Base Client Meta
  companyName: stepOneBaseSchema.shape.companyName,
  contactEmail: stepOneBaseSchema.shape.contactEmail,
  contactPhone: stepOneBaseSchema.shape.contactPhone,
  targetDeliveryDate: stepOneBaseSchema.shape.targetDeliveryDate,
  order_by: stepOneBaseSchema.shape.order_by,
  designer: stepOneBaseSchema.shape.designer,
  order_date: stepOneBaseSchema.shape.order_date,
  dispatch_date: stepOneBaseSchema.shape.dispatch_date,
  team_country_name: stepOneBaseSchema.shape.team_country_name,
  sport: stepOneBaseSchema.shape.sport,

  // Section 2: Order Type & Specifications
  order_type: stepTwoBaseSchema.shape.order_type,
  size_chart_standard: stepTwoBaseSchema.shape.size_chart_standard,
  volumeMOQ: stepTwoBaseSchema.shape.volumeMOQ,
  garmentType: stepTwoBaseSchema.shape.garmentType,
  materialVariant: stepTwoBaseSchema.shape.materialVariant,
  sizeBreakdown: stepTwoBaseSchema.shape.sizeBreakdown,
  garments: stepTwoBaseSchema.shape.garments,
  roster: stepTwoBaseSchema.shape.roster,
  blanks_by_size: stepTwoBaseSchema.shape.blanks_by_size,

  // Section 3: Design & Tech Assets
  uploadMode: stepThreeBaseSchema.shape.uploadMode,
  designFiles: stepThreeBaseSchema.shape.designFiles,
  designNotes: stepThreeBaseSchema.shape.designNotes,
  primaryColor: stepThreeBaseSchema.shape.primaryColor,
  accentColor: stepThreeBaseSchema.shape.accentColor,
  customSilhouette: stepThreeBaseSchema.shape.customSilhouette,
  customLogoPlacement: stepThreeBaseSchema.shape.customLogoPlacement,
  generatedPreviewFrontUrl: stepThreeBaseSchema.shape.generatedPreviewFrontUrl,
  generatedPreviewBackUrl: stepThreeBaseSchema.shape.generatedPreviewBackUrl,
  design: designSourceSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.uploadMode === 'design-help') {
    if (!data.designNotes || data.designNotes.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide design instructions or tech requirements (minimum 5 characters)',
        path: ['designNotes'],
      });
    }
  } else if (data.uploadMode === 'file') {
    if (!data.designFiles || data.designFiles.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please attach at least one tech pack (.pdf/.ai/.eps) or 3D garment file',
        path: ['designFiles'],
      });
    }
  }
});

export type StepOneData = z.infer<typeof stepOneSchema>;
export type StepTwoData = z.infer<typeof stepTwoSchema>;
export type StepThreeData = z.infer<typeof stepThreeSchema>;
export type QuoteSchemaType = z.infer<typeof quoteSchema>;
export type GarmentSpecType = z.infer<typeof garmentSpecSchema>;
export type LogoPlacementType = z.infer<typeof logoPlacementSchema>;
export type PlayerRosterRowType = z.infer<typeof playerRosterRowSchema>;
export type DesignBriefType = z.infer<typeof designBriefSchema>;
export type DesignSourceType = z.infer<typeof designSourceSchema>;
