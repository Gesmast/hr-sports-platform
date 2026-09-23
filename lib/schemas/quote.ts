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
  // Detailed Manufacturing Specifications
  shirt_type: z.string().nullable().optional(),
  neck_style: z.string().nullable().optional(),
  arm_style: z.string().nullable().optional(),
  trouser_method: z.string().nullable().optional(),
  trouser_cut_sew_method: z.string().nullable().optional(),
  pocket_design: z.string().nullable().optional(),
  trouser_cargo_pockets: z.string().nullable().optional(),
  has_back_pockets: z.string().nullable().optional(),
  back_pocket_type: z.string().nullable().optional(),
  // Two-Level Fabric Specifications
  fabric_family: z.string().nullable().optional(),
  fabric_type: z.string().nullable().optional(),
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
    .max(100, 'Company name too long')
    .optional()
    .default(''),
  contactEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  contactPhone: z
    .string()
    .trim()
    .optional()
    .default(''),
  targetDeliveryDate: z
    .string()
    .optional()
    .default(''),
  // Enhanced OMTEX meta fields
  order_by: z
    .string({ required_error: 'Your name is required' })
    .trim()
    .min(1, 'Your name is required')
    .default('Valued Client'),
  designer: z.string().optional(),
  order_date: z.string().optional(),
  dispatch_date: z.string().optional(),
  team_country_name: z.string().optional(),
  country: z.string().optional().default('PK'),
  lookingFor: z.string().optional().default(''),
  sport: z.string().optional().default(''),
  uniform_type: z.string().optional().default(''),
  inquiry_code: z.string().optional(),
});

export const stepOneSchema = stepOneBaseSchema.extend({
  order_by: z.string().trim().min(1, 'Your name is required'),
  lookingFor: z.string().min(1, 'Please select what you are looking for'),
  country: z.string().optional().default('PK'),
}).superRefine((data, ctx) => {
  if (data.lookingFor === 'Custom Sportswear' && (!data.sport || data.sport === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a sport',
      path: ['sport'],
    });
  }
  if (data.lookingFor === 'Uniform' && (!data.uniform_type || data.uniform_type === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a type of uniform',
      path: ['uniform_type'],
    });
  }
});

export const stepTwoBaseSchema = z.object({
  volumeMOQ: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val)),
    z.number({ required_error: `Minimum order quantity is ${MOQ_UNITS} pieces`, invalid_type_error: 'Quantity must be a number' })
      .int('Quantity must be an integer')
      .min(MOQ_UNITS, `Minimum order quantity is ${MOQ_UNITS} pieces`)
  ),
  garmentType: z
    .string()
    .optional()
    .default('Performance Apparel'),
  materialVariant: z
    .string()
    .optional()
    .default('Custom Fabric'),
  sizeBreakdown: z
    .string()
    .optional(),
  // Enhanced Order Type & Multi-garment fields
  kit_selection: z.string().optional(),
  shirt_type: z.string().optional(),
  neck_style: z.string().optional(),
  arm_style: z.string().optional(),
  trouser_method: z.string().optional(),
  trouser_cut_sew_method: z.string().optional(),
  pocket_design: z.string().optional(),
  trouser_cargo_pockets: z.string().optional(),
  has_back_pockets: z.string().optional(),
  back_pocket_type: z.string().optional(),
  fabric_family: z.string().optional(),
  fabric_type: z.string().optional(),
  order_type: z.string().optional(),
  size_chart_standard: z.enum(['mens_export', 'womens_export', 'youth', 'unisex']).default('mens_export'),
  garments: z.array(garmentSpecSchema).optional(),
  roster: z.array(playerRosterRowSchema).optional(),
  blanks_by_size: z.record(z.string(), z.number()).optional(),
  roster_excel_file: z.string().nullable().optional(),
  roster_excel_file_name: z.string().nullable().optional(),
});

export const stepTwoSchema = stepTwoBaseSchema.superRefine((data, ctx) => {
  if (!data.kit_selection || data.kit_selection.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select items',
      path: ['kit_selection'],
    });
  }
  if (!data.order_type || data.order_type.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select order customization',
      path: ['order_type'],
    });
  }
  if (!data.volumeMOQ || isNaN(Number(data.volumeMOQ)) || Number(data.volumeMOQ) < MOQ_UNITS) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Minimum order quantity is ${MOQ_UNITS} pieces`,
      path: ['volumeMOQ'],
    });
  }
  if (data.order_type === 'individualized') {
    if (!data.roster_excel_file || data.roster_excel_file.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload the completed player Excel sheet (.xlsx / .xls)',
        path: ['roster_excel_file'],
      });
    }
  }
  if (!data.fabric_family || data.fabric_family.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a fabric family',
      path: ['fabric_family'],
    });
  } else if (!data.fabric_type || data.fabric_type.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a fabric type',
      path: ['fabric_type'],
    });
  }
});

export const stepThreeBaseSchema = z.object({
  uploadMode: z.enum(['file', 'design-help']),
  has_logo: z.enum(['yes', 'no']).optional(),
  logo_files: z.array(z.string()).optional(),
  logo_placement_note: z.string().optional(),
  designFiles: z.array(z.union([designFileSchema, z.string(), z.record(z.any()), z.any()])).optional(),
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
  if (data.has_logo === 'yes') {
    if (!data.logo_files || data.logo_files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload at least one logo file',
        path: ['logo_files'],
      });
    }
  }

  if (data.uploadMode === 'file' || data.design?.source === 'client_provided') {
    const hasFiles = (data.designFiles && data.designFiles.length > 0) || (data.design?.uploaded_files && data.design.uploaded_files.length > 0);
    if (!hasFiles) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please attach at least one design file or artwork (.pdf/.ai/.eps/.png/.jpg/.psd)',
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
  country: stepOneBaseSchema.shape.country,
  lookingFor: stepOneBaseSchema.shape.lookingFor,
  sport: stepOneBaseSchema.shape.sport,
  uniform_type: stepOneBaseSchema.shape.uniform_type,
  inquiry_code: stepOneBaseSchema.shape.inquiry_code,

  // Section 2: Order Type & Specifications
  kit_selection: stepTwoBaseSchema.shape.kit_selection,
  shirt_type: stepTwoBaseSchema.shape.shirt_type,
  neck_style: stepTwoBaseSchema.shape.neck_style,
  arm_style: stepTwoBaseSchema.shape.arm_style,
  trouser_method: stepTwoBaseSchema.shape.trouser_method,
  trouser_cut_sew_method: stepTwoBaseSchema.shape.trouser_cut_sew_method,
  pocket_design: stepTwoBaseSchema.shape.pocket_design,
  trouser_cargo_pockets: stepTwoBaseSchema.shape.trouser_cargo_pockets,
  has_back_pockets: stepTwoBaseSchema.shape.has_back_pockets,
  back_pocket_type: stepTwoBaseSchema.shape.back_pocket_type,
  fabric_family: stepTwoBaseSchema.shape.fabric_family,
  fabric_type: stepTwoBaseSchema.shape.fabric_type,
  order_type: stepTwoBaseSchema.shape.order_type,
  size_chart_standard: stepTwoBaseSchema.shape.size_chart_standard,
  volumeMOQ: stepTwoBaseSchema.shape.volumeMOQ,
  garmentType: stepTwoBaseSchema.shape.garmentType,
  materialVariant: stepTwoBaseSchema.shape.materialVariant,
  sizeBreakdown: stepTwoBaseSchema.shape.sizeBreakdown,
  garments: stepTwoBaseSchema.shape.garments,
  roster: stepTwoBaseSchema.shape.roster,
  blanks_by_size: stepTwoBaseSchema.shape.blanks_by_size,
  roster_excel_file: stepTwoBaseSchema.shape.roster_excel_file,
  roster_excel_file_name: stepTwoBaseSchema.shape.roster_excel_file_name,

  // Section 3: Design & Tech Assets
  uploadMode: stepThreeBaseSchema.shape.uploadMode,
  has_logo: stepThreeBaseSchema.shape.has_logo,
  logo_files: stepThreeBaseSchema.shape.logo_files,
  logo_placement_note: stepThreeBaseSchema.shape.logo_placement_note,
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
  if (data.lookingFor === 'Custom Sportswear' && (!data.sport || data.sport === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a sport',
      path: ['sport'],
    });
  }
  if (data.lookingFor === 'Uniform' && (!data.uniform_type || data.uniform_type === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a type of uniform',
      path: ['uniform_type'],
    });
  }

  // Section 2: MOQ check
  if (!data.volumeMOQ || isNaN(Number(data.volumeMOQ)) || Number(data.volumeMOQ) < MOQ_UNITS) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Minimum order quantity is ${MOQ_UNITS} pieces`,
      path: ['volumeMOQ'],
    });
  }

  // Section 2: Individualized player Excel file check
  if (data.order_type === 'individualized') {
    if (!data.roster_excel_file || data.roster_excel_file.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload the completed player Excel sheet (.xlsx / .xls)',
        path: ['roster_excel_file'],
      });
    }
  }

  // Section 3: Logo check (if user chooses "Yes, I have a logo", logo file upload is REQUIRED)
  if (data.has_logo === 'yes') {
    if (!data.logo_files || data.logo_files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload at least one logo file',
        path: ['logo_files'],
      });
    }
  }

  // Section 3: Design check (if user chooses "I have a design", design file upload is REQUIRED)
  if (data.uploadMode === 'file' || data.design?.source === 'client_provided') {
    const hasFiles = (data.designFiles && data.designFiles.length > 0) ||
                    (data.design?.uploaded_files && data.design.uploaded_files.length > 0);
    if (!hasFiles) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload at least one design file or artwork',
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
