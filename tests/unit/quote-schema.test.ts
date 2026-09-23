import { describe, it, expect } from 'vitest';
import { quoteSchema, designFileSchema } from '@/lib/schemas/quote';
import { MOQ_UNITS } from '@/lib/constants';

describe('Quote Validation Schema', () => {
  it(`enforces minimum order quantity of ${MOQ_UNITS} pieces`, () => {
    const invalidData = {
      companyName: 'Apex Athletic Co.',
      contactEmail: 'procurement@apex.com',
      targetDeliveryDate: 'Within 30 Days',
      volumeMOQ: 10, // Below MOQ_UNITS (15)
      garmentType: 'Pro Performance Jersey',
      materialVariant: 'AeroVent™ Performance Micro-Mesh',
      uploadMode: 'design-help',
      designNotes: 'Need 10 custom jerseys for testing.',
    };

    const result = quoteSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('volumeMOQ'));
      expect(issue).toBeDefined();
    }
  });

  it(`accepts valid quote payloads meeting or exceeding ${MOQ_UNITS} units`, () => {
    const validData = {
      order_by: 'John Doe',
      companyName: 'Apex Athletic Co.',
      contactEmail: 'procurement@apex.com',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      targetDeliveryDate: 'Within 30 Days',
      volumeMOQ: MOQ_UNITS,
      garmentType: 'Pro Performance Jersey',
      materialVariant: 'AeroVent™ Performance Micro-Mesh',
      uploadMode: 'design-help',
      designNotes: 'Please prepare sample with red/black colorway.',
    };

    const result = quoteSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates 100MB max limit for flat tech-pack files', () => {
    const oversizedFlatFile = {
      fileName: 'techpack_huge.pdf',
      sizeBytes: 105 * 1024 * 1024, // 105 MB
      kind: 'flat' as const,
      extension: '.pdf',
    };

    const result = designFileSchema.safeParse(oversizedFlatFile);
    expect(result.success).toBe(false);
  });

  it('validates 250MB max limit for 3D garment files', () => {
    const valid3DFile = {
      fileName: 'jersey_sample.glb',
      sizeBytes: 150 * 1024 * 1024, // 150 MB (Under 250MB)
      kind: '3d' as const,
      extension: '.glb',
    };

    const result = designFileSchema.safeParse(valid3DFile);
    expect(result.success).toBe(true);
  });

  it('rejects unsupported file extensions', () => {
    const invalidFile = {
      fileName: 'script.exe',
      sizeBytes: 1024 * 1024,
      kind: 'flat' as const,
      extension: '.exe',
    };

    const result = designFileSchema.safeParse(invalidFile);
    expect(result.success).toBe(false);
  });

  it('validates structured design source for both client_provided and requested_from_team', () => {
    // 1. client_provided
    const clientProvidedData = {
      order_by: 'Ali Raza',
      companyName: 'Bahrain Cricket Federation',
      contactEmail: 'orders@bahraincricket.com',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      targetDeliveryDate: '15 / 08 / 2026',
      volumeMOQ: 50,
      garmentType: 'Sublimation T-Shirt',
      materialVariant: 'SAP Cream Fabric',
      uploadMode: 'file' as const,
      designFiles: [{ fileName: 'techpack.pdf', sizeBytes: 5000, kind: 'flat' as const, extension: '.pdf' }],
      design: {
        source: 'client_provided' as const,
        uploaded_files: ['data:image/png;base64,mock'],
      },
    };
    const clientResult = quoteSchema.safeParse(clientProvidedData);
    expect(clientResult.success).toBe(true);

    // 2. requested_from_team with structured brief
    const requestedData = {
      order_by: 'Ali Raza',
      companyName: 'Bahrain Cricket Federation',
      contactEmail: 'orders@bahraincricket.com',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      targetDeliveryDate: '15 / 08 / 2026',
      volumeMOQ: 50,
      garmentType: 'Sublimation T-Shirt',
      materialVariant: 'SAP Cream Fabric',
      uploadMode: 'design-help' as const,
      designNotes: 'Please create complete 3-view kit design for Bahrain national team.',
      design: {
        source: 'requested_from_team' as const,
        uploaded_files: [],
        brief: {
          primary_colors: ['#FAF6EA'],
          secondary_colors: ['#FFFFFF'],
          style_themes: ['Bold & Aggressive', 'Modern / Minimal'],
          print_coverage: 'full_sublimation' as const,
          reference_brand: 'Bahrain National Cricket',
          text_elements: ['Team/Club Name on Front', 'Player Name & Number'],
          graphic_elements: ['Country Flag', 'Club Crest/Badge'],
          elements_to_avoid: 'No heavy gradients on the collar',
          brand_guidelines_file: null,
          inspiration_images: [],
          additional_notes: 'White raglan sleeves with cream body and yellow piping.',
        },
      },
    };
    const teamResult = quoteSchema.safeParse(requestedData);
    expect(teamResult.success).toBe(true);
  });
});
