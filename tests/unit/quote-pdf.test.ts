import { describe, it, expect } from 'vitest';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';
import { QuoteSchemaType } from '@/lib/schemas/quote';

describe('Factory Spec Sheet PDF Compiler', () => {
  it('generates a valid jsPDF document instance from intake data', async () => {
    const mockQuote: QuoteSchemaType = {
      order_by: 'John Doe',
      companyName: 'Apex Athletic Global',
      country: 'US',
      contactEmail: 'sourcing@apex.com',
      contactPhone: '+1 (555) 234-5678',
      lookingFor: 'Custom Sportswear',
      sport: 'Basketball',
      uniform_type: '',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      size_chart_standard: 'mens_export',
      targetDeliveryDate: 'Standard Production (30–45 Days)',
      volumeMOQ: 250,
      garmentType: 'Heavyweight Pullover Hoodie',
      materialVariant: 'Mesh - One-tuck mesh',
      fabric_family: 'Mesh',
      fabric_type: 'One-tuck mesh',
      sizeBreakdown: 'S: 50, M: 100, L: 75, XL: 25',
      uploadMode: 'design-help',
      designNotes: 'Matte black hoodie with white sleeve trims, high-density embroidered left chest badge.',
      primaryColor: '#111111',
      accentColor: '#F5F5F0',
      customLogoPlacement: 'Left Chest',
      designFiles: [
        {
          fileName: 'brand_crest_vector.ai',
          sizeBytes: 4.5 * 1024 * 1024,
          kind: 'flat',
          extension: '.ai',
        },
      ],
    };

    const doc = await generateQuoteSpecPdf(mockQuote, 'HRS-2026-99881');
    expect(doc).toBeDefined();

    const outputBuffer = doc.output('arraybuffer');
    expect(outputBuffer.byteLength).toBeGreaterThan(1000);
  });

  it('renders a 2-page OMTEX spec sheet for Top and Bottom garments matching Bahrain sample', async () => {
    const bahrainQuote: QuoteSchemaType = {
      order_by: 'AZIM',
      companyName: 'NIRAJ',
      country: 'BH',
      contactEmail: 'niraj@bahraincricket.com',
      contactPhone: '+973 1700 0000',
      designer: 'JIGAR',
      order_date: '01 / 07 / 2026',
      dispatch_date: '00 / 07 / 2026',
      team_country_name: 'BEHRAIN',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      uniform_type: '',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      size_chart_standard: 'mens_export',
      targetDeliveryDate: 'Standard Production (30–45 Days)',
      volumeMOQ: 75,
      garmentType: 'Sublimation T-Shirt',
      materialVariant: 'Mesh - One-tuck mesh',
      fabric_family: 'Mesh',
      fabric_type: 'One-tuck mesh',
      uploadMode: 'design-help',
      designNotes: 'Sublimation cricket kit with Bahrain national crest and player roster.',
      garments: [
        {
          garment_type: 'top',
          type_name: 'Sublimation T-Shirts',
          colour_mode: 'sublimation',
          colour_value: 'Sublimation',
          fabric_name: 'SAP Cream Fabric',
          fabric_gsm: 160,
          collar_type: 'Collar',
          button_type: 'Kaaj Buttons',
          sleeve_length: 'Half Sleeves',
          panel_piping: '-',
          font_name: '-',
          logo_application: ['Sublimation'],
          logo_placements: [
            { slot: 'left_chest', image_url: null, height_in: 3, width_in: 2.5 },
            { slot: 'left_shoulder_top', image_url: null, flag_auto: true },
          ],
        },
        {
          garment_type: 'bottom',
          type_name: 'Cut-N-Sew Trousers',
          colour_mode: 'solid',
          colour_value: 'Cream',
          fabric_name: 'Kings Cream Fabric',
          panel_piping: '-',
          logo_application: ['Stickers'],
          cuff_type: 'As Per Pattern',
          fly_type: '-',
          pocket_type: 'Cross Pocket',
          sizing: {
            mode: 'uniform',
            qty_by_size: { M: 4, L: 7, XL: 11, '2XL': 3 },
          },
          logo_placements: [
            { slot: 'left_pocket', image_url: null, height_in: 3 },
            { slot: 'right_pocket', image_url: null, width_in: 2.5 },
          ],
        },
      ],
      roster: [
        { player_name: 'Vedanta', number: '21', size: 'M', qty: 2 },
        { player_name: 'Afzal', number: '804', size: 'L', qty: 2 },
        { player_name: 'Gautham', number: '23', size: 'XL', qty: 2 },
        { player_name: 'Hembo', number: '', size: 'XL', qty: 2, role_note: 'Technical Manager' },
      ],
      blanks_by_size: { S: 3, M: 3, L: 3, XL: 3 },
    };

    const doc = await generateQuoteSpecPdf(bahrainQuote, 'OMTEX-BAH-001');
    expect(doc).toBeDefined();
    // Verify document has 2 pages
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('renders visual PDF representation for client_provided design files and structured brief for requested_from_team', async () => {
    // 1. client_provided with PDF tech-pack
    const clientProvidedQuote: QuoteSchemaType = {
      order_by: 'Customer Rep',
      companyName: 'Bahrain Cricket Federation',
      country: 'BH',
      contactEmail: 'orders@bahraincricket.com',
      contactPhone: '+973 1700 0000',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      uniform_type: '',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      size_chart_standard: 'mens_export',
      fabric_family: 'Mesh',
      fabric_type: 'One-tuck mesh',
      targetDeliveryDate: '15 / 08 / 2026',
      volumeMOQ: 50,
      garmentType: 'Sublimation T-Shirt',
      materialVariant: 'Mesh - One-tuck mesh',
      uploadMode: 'file',
      designFiles: [{ fileName: 'bahrain-national-kit.pdf', sizeBytes: 50000, kind: 'flat', extension: '.pdf' }],
      design: {
        source: 'client_provided',
        uploaded_files: ['data:application/pdf;base64,mock'],
      },
      garments: [{
        garment_type: 'top',
        type_name: 'Sublimation T-Shirts',
        colour_mode: 'sublimation',
        colour_value: 'Cream',
        fabric_name: 'SAP Cream Fabric',
        logo_application: ['Sublimation'],
        logo_placements: [{ slot: 'left_chest', height_in: 3, width_in: 2.5 }],
      }],
    };
    const doc1 = await generateQuoteSpecPdf(clientProvidedQuote, 'HRS-PDF-001');
    expect(doc1).toBeDefined();
    expect(doc1.getNumberOfPages()).toBe(1);

    // 2. requested_from_team with structured design brief
    const requestedQuote: QuoteSchemaType = {
      order_by: 'Customer Rep',
      companyName: 'Bahrain Cricket Federation',
      country: 'BH',
      contactEmail: 'orders@bahraincricket.com',
      contactPhone: '+973 1700 0000',
      lookingFor: 'Custom Sportswear',
      sport: 'Cricket',
      uniform_type: '',
      kit_selection: 'full_kit',
      order_type: 'individualized',
      size_chart_standard: 'mens_export',
      fabric_family: 'Mesh',
      fabric_type: 'One-tuck mesh',
      targetDeliveryDate: '15 / 08 / 2026',
      volumeMOQ: 50,
      garmentType: 'Sublimation T-Shirt',
      materialVariant: 'Mesh - One-tuck mesh',
      uploadMode: 'design-help',
      designNotes: 'Please create complete 3-view kit design for Bahrain national team.',
      design: {
        source: 'requested_from_team',
        uploaded_files: [],
        brief: {
          primary_colors: ['#FAF6EA', '#FFFFFF'],
          secondary_colors: ['#CE1126', '#EAB308'],
          style_themes: ['Bold & Aggressive', 'Modern / Minimal'],
          print_coverage: 'full_sublimation',
          reference_brand: 'Bahrain National Cricket',
          text_elements: ['Team/Club Name on Front', 'Player Name & Number'],
          graphic_elements: ['Country Flag', 'Club Crest/Badge'],
          elements_to_avoid: 'No heavy gradients on the collar',
          brand_guidelines_file: 'data:application/pdf;base64,guidelines',
          inspiration_images: [],
          additional_notes: 'White raglan sleeves with cream body and yellow piping.',
        },
      },
      garments: [{
        garment_type: 'top',
        type_name: 'Sublimation T-Shirts',
        colour_mode: 'sublimation',
        colour_value: 'Cream',
        fabric_name: 'SAP Cream Fabric',
        logo_application: ['Sublimation'],
        logo_placements: [{ slot: 'left_chest', height_in: 3, width_in: 2.5 }],
      }],
    };
    const doc2 = await generateQuoteSpecPdf(requestedQuote, 'HRS-BRIEF-002');
    expect(doc2).toBeDefined();
    expect(doc2.getNumberOfPages()).toBe(1);
  });
});
