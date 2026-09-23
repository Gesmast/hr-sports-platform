import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuoteSchemaType, GarmentSpecType, LogoPlacementType } from '@/lib/schemas/quote';
import { SIZE_CHART_PRESETS, DEFAULT_SIZES_ORDER } from './size-charts';
import { generateIndividualizedSummary, generateUniformSummary } from './roster-compiler';
import { parseRosterExcel } from '@/lib/excel/parseRosterExcel';


/**
 * Compiles factory order and garment specifications into an OMTEX-style
 * industrial technical spec sheet PDF (A4 Landscape).
 * Loops over garments array stamping out one block/page per garment.
 */
export async function generateQuoteSpecPdf(
  quoteData: QuoteSchemaType,
  referenceId: string
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 8;

  // Helper safe uppercase string with fallback "-"
  const safeVal = (val?: string | number | null): string => {
    if (val === undefined || val === null) return '-';
    const s = String(val).trim();
    return s.length > 0 ? s.toUpperCase() : '-';
  };

  // Determine standard size chart preset
  const chartPresetKey = quoteData.size_chart_standard || 'mens_export';
  const sizePreset = SIZE_CHART_PRESETS[chartPresetKey] || SIZE_CHART_PRESETS.mens_export;

  // Extract or parse roster rows from uploaded Excel
  let roster = quoteData.roster && quoteData.roster.length > 0
    ? quoteData.roster
    : quoteData.roster_excel_file
    ? parseRosterExcel(quoteData.roster_excel_file)
    : [];

  // Build garments array with backward-compatibility fallback
  const fullFabricName = quoteData.fabric_family && quoteData.fabric_type
    ? `${quoteData.fabric_family} - ${quoteData.fabric_type}`
    : (quoteData.fabric_family || quoteData.materialVariant || 'Custom Performance Fabric');

  let garments: GarmentSpecType[] = quoteData.garments && quoteData.garments.length > 0
    ? quoteData.garments
    : [];

  if (garments.length === 0) {
    const isUniform = quoteData.lookingFor === 'Uniform';
    const isMerch = quoteData.lookingFor === 'Merch';

    const topName = isUniform
      ? `${quoteData.uniform_type || 'Uniform'} Top${quoteData.shirt_type ? ` (${quoteData.shirt_type})` : ''}`
      : isMerch
      ? `Merch Top / Tee${quoteData.shirt_type ? ` (${quoteData.shirt_type})` : ''}`
      : `${quoteData.sport || 'Custom'} Jersey${quoteData.shirt_type ? ` (${quoteData.shirt_type})` : ''}`;

    const bottomName = isUniform
      ? `${quoteData.uniform_type || 'Uniform'} Trouser${quoteData.trouser_method ? ` (${quoteData.trouser_method})` : ''}`
      : isMerch
      ? `Merch Bottom${quoteData.trouser_method ? ` (${quoteData.trouser_method})` : ''}`
      : `${quoteData.sport || 'Custom'} Trouser / Shorts${quoteData.trouser_method ? ` (${quoteData.trouser_method})` : ''}`;

    const topGarment: GarmentSpecType = {
      garment_type: 'top',
      type_name: topName,
      shirt_type: quoteData.shirt_type,
      neck_style: quoteData.neck_style,
      collar_type: quoteData.neck_style || 'Round Neck',
      arm_style: quoteData.arm_style,
      sleeve_length: quoteData.arm_style || 'Half Sleeves',
      colour_mode: quoteData.shirt_type?.toLowerCase().includes('sublimation') ? 'sublimation' : 'solid',
      colour_value: quoteData.shirt_type || 'Custom Sublimation',
      fabric_name: fullFabricName,
      fabric_family: quoteData.fabric_family,
      fabric_type: quoteData.fabric_type,
      panel_piping: '-',
      button_type: quoteData.neck_style?.includes('Polo') ? 'Kaaj Buttons' : quoteData.neck_style?.includes('zip') ? 'Zipper' : 'None',
      logo_application: [quoteData.has_logo === 'yes' ? 'Client Logo' : 'No Logo'],
      logo_placements: [],
      sizing: {
        mode: quoteData.order_type === 'individualized' ? 'individualized' : 'uniform',
        qty_by_size: quoteData.blanks_by_size || {},
      },
    };

    const bottomGarment: GarmentSpecType = {
      garment_type: 'bottom',
      type_name: bottomName,
      trouser_method: quoteData.trouser_method,
      trouser_cut_sew_method: quoteData.trouser_cut_sew_method,
      pocket_design: quoteData.pocket_design,
      pocket_type: quoteData.pocket_design || 'Standard Pocket',
      trouser_cargo_pockets: quoteData.trouser_cargo_pockets,
      has_back_pockets: quoteData.has_back_pockets,
      back_pocket_type: quoteData.back_pocket_type,
      colour_mode: quoteData.trouser_method === 'Sublimation' ? 'sublimation' : 'solid',
      colour_value: quoteData.trouser_method || 'Cut & Sew',
      fabric_name: fullFabricName,
      fabric_family: quoteData.fabric_family,
      fabric_type: quoteData.fabric_type,
      panel_piping: quoteData.trouser_method === 'Cut & Sew' ? quoteData.trouser_cut_sew_method || '-' : '-',
      logo_application: [quoteData.has_logo === 'yes' ? 'Client Logo' : 'No Logo'],
      logo_placements: [],
      sizing: {
        mode: quoteData.order_type === 'individualized' ? 'individualized' : 'uniform',
        qty_by_size: quoteData.blanks_by_size || {},
      },
    };

    if (quoteData.kit_selection === 'shirt_only') {
      garments = [topGarment];
    } else if (quoteData.kit_selection === 'trouser_only') {
      garments = [bottomGarment];
    } else {
      garments = [topGarment, bottomGarment];
    }
  }

  // Client Meta Fields
  const clientName = safeVal(quoteData.companyName);
  const orderBy = safeVal(quoteData.order_by || quoteData.contactEmail?.split('@')[0] || 'FACTORY DIRECT');
  const inquiryNumber = safeVal(referenceId);
  const orderDate = quoteData.order_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ');
  const dispatchDate = quoteData.dispatch_date || quoteData.targetDeliveryDate || 'AS AGREED';
  const displayHeading = safeVal(quoteData.team_country_name || quoteData.companyName || 'ATHLETIC SPEC');

  // Palette Constants
  const colSlateDark = '#4A5568';
  const colSlateMed = '#718096';
  const colSlateHeader = '#5A6B7C';
  const colGoldLabel = '#F6E05E';
  const colBlueText = '#1E40AF';
  const colRedText = '#DC2626';
  const colBorder = '#CBD5E1';
  const colBgLight = '#F8FAFC';
  const colTableAlt = '#F1F5F9';

  // Render each garment on a separate Landscape A4 page
  for (let gIdx = 0; gIdx < garments.length; gIdx++) {
    if (gIdx > 0) {
      doc.addPage('a4', 'landscape');
    }

    const garment = garments[gIdx];
    const isBottom = garment.garment_type === 'bottom' || garment.type_name.toLowerCase().includes('trouser') || garment.type_name.toLowerCase().includes('pant') || garment.type_name.toLowerCase().includes('short');

    // =========================================================================
    // ZONE 1: TOP HEADER STRIP (Height: ~18mm)
    // =========================================================================
    // Main Dark Header Banner
    doc.setFillColor(colSlateHeader);
    doc.rect(margin, margin, pageWidth - margin * 2, 16, 'F');

    // Brand Badge on Left
    doc.setFillColor('#FFFFFF');
    doc.roundedRect(margin + 2, margin + 2, 28, 12, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#0F172A');
    doc.text('HR SPORTS', margin + 16, margin + 7.5, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor('#64748B');
    doc.text('OEM SPEC SHEET', margin + 16, margin + 11.5, { align: 'center' });

    // Client Name, Order By, Designer
    const col1X = margin + 35;
    const col2X = margin + 120;
    const col3X = margin + 195;

    // Row 1: Client / Order By / Designer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colGoldLabel);
    doc.text('CLIENT NAME :', col1X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(clientName, col1X + 26, margin + 6.5);

    doc.setTextColor(colGoldLabel);
    doc.text('ORDER BY :', col2X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(orderBy, col2X + 20, margin + 6.5);

    doc.setTextColor(colGoldLabel);
    doc.text('INQUIRY NO :', col3X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(inquiryNumber, col3X + 24, margin + 6.5);

    // Row 2: Order Date & Dispatch Date
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#E2E8F0');
    doc.text('ORDER DATE       :', col1X, margin + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#FFFFFF');
    doc.text(orderDate, col1X + 26, margin + 12.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colRedText);
    doc.text('DISPATCH DATE :', col2X, margin + 12.5);
    doc.setTextColor(colRedText);
    doc.text(dispatchDate, col2X + 26, margin + 12.5);

    // =========================================================================
    // ZONE 2: SIZE CHART HEADER BAR (Right of top area)
    // =========================================================================
    const sizeBarX = margin + 105;
    const sizeBarY = margin + 18;
    const sizeBarW = pageWidth - margin - sizeBarX;
    const sizeCellW = sizeBarW / 9; // 1 title cell + 8 size cells

    // Title Cell
    doc.setFillColor(colSlateDark);
    doc.rect(sizeBarX, sizeBarY, sizeCellW, 9, 'F');
    doc.setDrawColor('#FFFFFF');
    doc.setLineWidth(0.2);
    doc.rect(sizeBarX, sizeBarY, sizeCellW, 9, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(isBottom ? 'BOTTOM SIZE' : 'TOP SIZE', sizeBarX + sizeCellW / 2, sizeBarY + 3.5, { align: 'center' });
    doc.setTextColor(colGoldLabel);
    doc.setFontSize(5.5);
    doc.text(sizePreset.label, sizeBarX + sizeCellW / 2, sizeBarY + 7, { align: 'center' });

    // 8 Size Columns
    const sizes = sizePreset.sizes.slice(0, 8);
    sizes.forEach((entry, idx) => {
      const curX = sizeBarX + sizeCellW * (idx + 1);

      // Top Row: Size Label (XS, S, M...)
      doc.setFillColor(colSlateDark);
      doc.rect(curX, sizeBarY, sizeCellW, 4.5, 'F');
      doc.rect(curX, sizeBarY, sizeCellW, 4.5, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor('#FFFFFF');
      doc.text(entry.size, curX + sizeCellW / 2, sizeBarY + 3.2, { align: 'center' });

      // Bottom Row: Measurement Value (36, 38...)
      const val = isBottom ? String(entry.bottomValue) : String(entry.topValue);
      doc.setFillColor('#FFFFFF');
      doc.rect(curX, sizeBarY + 4.5, sizeCellW, 4.5, 'F');
      doc.rect(curX, sizeBarY + 4.5, sizeCellW, 4.5, 'S');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor('#0F172A');
      doc.text(val, curX + sizeCellW / 2, sizeBarY + 7.8, { align: 'center' });
    });

    // =========================================================================
    // ZONE 3: SPECIFICATION TABLE (Left Column, Top Portion)
    // =========================================================================
    const leftColW = 98;
    let specTableY = margin + 18;

    // Spec Table Header Banner
    doc.setFillColor(colSlateHeader);
    doc.rect(margin, specTableY, leftColW, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor('#FFFFFF');
    const specTitle = isBottom ? 'BOTTOM GARMENT SPECIFICATION' : 'TOP GARMENT SPECIFICATION';
    doc.text(specTitle, margin + leftColW / 2, specTableY + 4, { align: 'center' });

    specTableY += 5.5;

    // Specs list based on garment category
    interface SpecRow {
      label: string;
      value: string;
    }

    const designSourceText = quoteData.design?.source === 'client_provided'
      ? 'CLIENT TECH PACK / DESIGN'
      : 'REQUESTED FROM HR TEAM';

    const logoSpecText = quoteData.has_logo === 'yes' ? 'CLIENT LOGO PROVIDED' : 'NO LOGO';
    const logoPlacementText = quoteData.logo_placement_note ? safeVal(quoteData.logo_placement_note) : (quoteData.has_logo === 'yes' ? 'AS SPECIFIED' : 'NONE');

    const specRows: SpecRow[] = isBottom
      ? [
          { label: 'BOTTOM TYPE', value: safeVal(garment.type_name) },
          { label: 'MANUFACTURING', value: safeVal(garment.trouser_method || quoteData.trouser_method) },
          ...((garment.trouser_method === 'Cut & Sew' || quoteData.trouser_method === 'Cut & Sew')
            ? [{ label: 'CUT & SEW METHOD', value: safeVal(garment.trouser_cut_sew_method || quoteData.trouser_cut_sew_method) }]
            : []),
          { label: 'POCKET DESIGN', value: safeVal(garment.pocket_design || quoteData.pocket_design) },
          ...(quoteData.lookingFor === 'Uniform' && (garment.trouser_cargo_pockets || quoteData.trouser_cargo_pockets)
            ? [{ label: 'UNIFORM POCKETS', value: safeVal(garment.trouser_cargo_pockets || quoteData.trouser_cargo_pockets) }]
            : []),
          ...(quoteData.lookingFor === 'Uniform' && (garment.has_back_pockets || quoteData.has_back_pockets)
            ? [{ label: 'BACK POCKETS', value: garment.has_back_pockets === 'Yes' || quoteData.has_back_pockets === 'Yes' ? `YES (${safeVal(garment.back_pocket_type || quoteData.back_pocket_type)})` : 'NO' }]
            : []),
          { label: 'FABRIC', value: safeVal(garment.fabric_name || fullFabricName) },
          { label: 'LOGO SPEC', value: logoSpecText },
          { label: 'LOGO PLACEMENT', value: logoPlacementText },
          { label: 'DESIGN SOURCE', value: designSourceText },
        ]
      : [
          { label: 'TOP TYPE', value: safeVal(garment.shirt_type || garment.type_name || quoteData.shirt_type) },
          { label: 'NECK STYLE', value: safeVal(garment.neck_style || quoteData.neck_style || garment.collar_type) },
          { label: 'ARM STYLE', value: safeVal(garment.arm_style || quoteData.arm_style || garment.sleeve_length) },
          { label: 'FABRIC', value: safeVal(garment.fabric_name || fullFabricName) },
          { label: 'BUTTON / ZIP', value: safeVal(garment.button_type) },
          { label: 'LOGO SPEC', value: logoSpecText },
          { label: 'LOGO PLACEMENT', value: logoPlacementText },
          { label: 'DESIGN SOURCE', value: designSourceText },
        ];

    const rowH = 4.8;
    specRows.forEach((row, rIdx) => {
      const curY = specTableY + rIdx * rowH;
      doc.setFillColor(rIdx % 2 === 0 ? '#FFFFFF' : colTableAlt);
      doc.rect(margin, curY, leftColW, rowH, 'F');
      doc.setDrawColor(colBorder);
      doc.setLineWidth(0.15);
      doc.rect(margin, curY, leftColW, rowH, 'S');

      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(colSlateDark);
      doc.text(row.label, margin + 2.5, curY + 3.3);

      // Colon
      doc.text(':', margin + 36, curY + 3.3);

      // Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(row.value === '-' ? '#94A3B8' : '#0F172A');
      doc.text(row.value, margin + 39, curY + 3.3);
    });

    const specTableBottomY = specTableY + specRows.length * rowH;

    // =========================================================================
    // ZONE 4: LOGO POSITION & SIZES GRID (Left Column, Bottom Portion)
    // =========================================================================
    let logoGridY = specTableBottomY + 3;

    // Logo Grid Header Banner
    doc.setFillColor(colSlateHeader);
    doc.rect(margin, logoGridY, leftColW, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor('#FFFFFF');
    doc.text('LOGO POSITION & SIZES', margin + leftColW / 2, logoGridY + 3.6, { align: 'center' });

    logoGridY += 5;

    // Define standard placement slots
    const topSlots = [
      { id: 'left_chest', label: 'LEFT CHEST' },
      { id: 'right_chest', label: 'RIGHT CHEST' },
      { id: 'stomach', label: 'STOMACH' },
      { id: 'left_shoulder_top', label: 'LEFT SHOULDER TOP' },
      { id: 'right_shoulder_top', label: 'RIGHT SHOULDER TOP' },
      { id: 'back_below_neck', label: 'BACK (BELOW NECK)' },
      { id: 'left_shoulder_bottom', label: 'LEFT SHOULDER BOTTOM' },
      { id: 'right_shoulder_bottom', label: 'RIGHT SHOULDER BOTTOM' },
      { id: 'back_above_name_no', label: 'BACK (ABOVE NAME / NO)' },
      { id: 'back_name', label: 'BACK NAME' },
      { id: 'back_number', label: 'BACK NUMBER' },
      { id: 'back_below_name_no', label: 'BACK (BELOW NAME / NO)' },
    ];

    const bottomSlots = [
      { id: 'left_pocket', label: 'LEFT POCKET' },
      { id: 'right_pocket', label: 'RIGHT POCKET' },
      { id: 'left_side', label: 'LEFT SIDE' },
      { id: 'right_side', label: 'RIGHT SIDE' },
      { id: 'back_left_side', label: 'BACK LEFT SIDE' },
      { id: 'back_right_side', label: 'BACK RIGHT SIDE' },
    ];

    const slotsToRender = isBottom ? bottomSlots : topSlots;
    const cols = isBottom ? 2 : 3;
    const rows = Math.ceil(slotsToRender.length / cols);
    const boxW = leftColW / cols;
    const remainingH = pageHeight - margin - logoGridY;
    const boxH = Math.min(26, remainingH / rows);

    slotsToRender.forEach((slotInfo, sIdx) => {
      const c = sIdx % cols;
      const r = Math.floor(sIdx / cols);
      const bX = margin + c * boxW;
      const bY = logoGridY + r * boxH;

      // Box outline & background
      doc.setFillColor(colBgLight);
      doc.rect(bX, bY, boxW, boxH, 'F');
      doc.setDrawColor(colBorder);
      doc.setLineWidth(0.15);
      doc.rect(bX, bY, boxW, boxH, 'S');

      // Slot Title Bar inside box
      doc.setFillColor('#EDF2F7');
      doc.rect(bX, bY, boxW, 3.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.8);
      doc.setTextColor(colSlateDark);
      doc.text(slotInfo.label, bX + boxW / 2, bY + 2.5, { align: 'center' });

      // Find logo placement data if present
      const placement = garment.logo_placements?.find(
        (lp) => lp.slot.toLowerCase() === slotInfo.id.toLowerCase()
      );

      // Handle Image Rendering or Text Preview
      if (placement?.image_url && placement.image_url.startsWith('data:image')) {
        try {
          const imgPadding = 1.5;
          const maxImgW = boxW - imgPadding * 2;
          const maxImgH = boxH - 7.5;
          doc.addImage(
            placement.image_url,
            'PNG',
            bX + imgPadding,
            bY + 3.8,
            maxImgW,
            maxImgH,
            undefined,
            'FAST'
          );
        } catch (e) {
          // If rendering image fails, fallback to clean box
        }

        // Print dimension text below the image if provided
        if (placement?.height_in || placement?.width_in) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(4.8);
          doc.setTextColor('#334155');
          const dimText = `H ${placement.height_in || '-'}"   W ${placement.width_in || '-'}"`;
          doc.text(dimText, bX + boxW / 2, bY + boxH - 1.2, { align: 'center' });
        }
      } else if (slotInfo.id === 'back_name' && quoteData.order_type === 'individualized') {
        // Sample player name preview
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor('#0F172A');
        doc.text(quoteData.roster?.[0]?.player_name || 'MUKHIA', bX + boxW / 2, bY + boxH / 2 + 1, { align: 'center' });
        if (placement?.height_in || placement?.width_in) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(4.8);
          doc.setTextColor('#64748B');
          doc.text(`H ${placement.height_in || '-'}"   W ${placement.width_in || '-'}"`, bX + boxW / 2, bY + boxH - 1.2, { align: 'center' });
        }
      } else if (slotInfo.id === 'back_number' && quoteData.order_type === 'individualized') {
        // Sample player number preview
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(colBlueText);
        doc.text(quoteData.roster?.[0]?.number || '18', bX + boxW / 2, bY + boxH / 2 + 2, { align: 'center' });
        if (placement?.height_in || placement?.width_in) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(4.8);
          doc.setTextColor('#64748B');
          doc.text(`H ${placement.height_in || '-'}"   W ${placement.width_in || '-'}"`, bX + boxW / 2, bY + boxH - 1.2, { align: 'center' });
        }
      } else {
        // Blank slot indication with optional dimensions
        if (placement?.height_in || placement?.width_in) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(5);
          doc.setTextColor('#64748B');
          const dimText = `H ${placement.height_in || '-'}"   W ${placement.width_in || '-'}"`;
          doc.text(dimText, bX + boxW / 2, bY + boxH - 2, { align: 'center' });
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor('#94A3B8');
          doc.text('-', bX + boxW / 2, bY + boxH / 2 + 2, { align: 'center' });
        }
      }
    });

    // =========================================================================
    // ZONE 5: BIG VISUAL & BREAKDOWN BLOCK (Right 2/3 Area)
    // =========================================================================
    const visualX = margin + 105;
    const visualW = pageWidth - margin - visualX;
    const visualY = margin + 30;

    // Big Team / Country Heading (e.g. "BEHRAIN")
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor('#0F172A');
    doc.text(displayHeading, visualX + visualW / 2, visualY + 4, { align: 'center' });

    // Mockup / Design Source Visual Area
    const mockupAreaY = visualY + 8;
    const mockupAreaH = 70;

    const isClientProvided = quoteData.design?.source === 'client_provided';
    const uploadedFiles = quoteData.design?.uploaded_files || [];
    const frontMockup = garment.mockups?.front;
    const backMockup = garment.mockups?.back;

    // Collect all uploaded design image files
    const imageFiles: string[] = [];
    if (frontMockup && frontMockup.startsWith('data:image')) imageFiles.push(frontMockup);
    if (backMockup && backMockup.startsWith('data:image')) imageFiles.push(backMockup);
    uploadedFiles.forEach((f) => {
      if (typeof f === 'string' && (f.startsWith('data:image') || /\.(png|jpg|jpeg|svg|webp)/i.test(f))) {
        if (!imageFiles.includes(f)) imageFiles.push(f);
      }
    });
    (quoteData.designFiles || []).forEach((df: any) => {
      const url = typeof df === 'string' ? df : (df?.previewUrl || df?.storageUrl || '');
      if (url && (url.startsWith('data:image') || /\.(png|jpg|jpeg|svg|webp)/i.test(url))) {
        if (!imageFiles.includes(url)) imageFiles.push(url);
      }
    });

    const isPdfUpload = uploadedFiles.some(
      (f) => typeof f === 'string' && (f.startsWith('data:application/pdf') || /\.pdf/i.test(f))
    ) || (quoteData.designFiles || []).some(
      (df: any) => typeof df === 'string'
        ? (df.startsWith('data:application/pdf') || /\.pdf/i.test(df))
        : (df && typeof df === 'object' && ((df.extension && String(df.extension).toLowerCase().includes('pdf')) || (df.fileName && String(df.fileName).toLowerCase().includes('pdf'))))
    );
    const pdfFileName = (quoteData.designFiles || []).find(
      (df: any) => typeof df === 'object' && df && ((df.extension && String(df.extension).toLowerCase().includes('pdf')) || (df.fileName && String(df.fileName).toLowerCase().includes('pdf')))
    )?.fileName || 'client-master-techpack.pdf';

    if (isClientProvided) {
      // =======================================================================
      // BRANCH A: USER HAS PROVIDED A DESIGN
      // =======================================================================
      if (imageFiles.length > 0) {
        // Render uploaded client design image(s) directly
        const count = Math.min(imageFiles.length, 3);
        const spacing = 3;
        const imgW = (visualW - spacing * (count + 1)) / count;
        const imgH = mockupAreaH - 4;

        imageFiles.slice(0, count).forEach((imgData, i) => {
          const curX = visualX + spacing + i * (imgW + spacing);
          doc.setFillColor('#FFFFFF');
          doc.setDrawColor('#CBD5E1');
          doc.setLineWidth(0.3);
          doc.roundedRect(curX, mockupAreaY + 2, imgW, imgH, 1.5, 1.5, 'FD');

          try {
            doc.addImage(imgData, 'PNG', curX + 1.5, mockupAreaY + 3.5, imgW - 3, imgH - 3, undefined, 'FAST');
          } catch (e) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6);
            doc.setTextColor('#64748B');
            doc.text('[CLIENT DESIGN IMAGE ATTACHED]', curX + imgW / 2, mockupAreaY + imgH / 2, { align: 'center' });
          }
        });
      } else if (isPdfUpload) {
        // Render PDF tech-pack format with forward instruction & clickable download link
        doc.setFillColor('#F8FAFC');
        doc.setDrawColor('#DC2626');
        doc.setLineWidth(0.5);
        doc.roundedRect(visualX + 2, mockupAreaY, visualW - 4, mockupAreaH, 2, 2, 'FD');

        // Red PDF Header Banner
        doc.setFillColor('#DC2626');
        doc.rect(visualX + 2, mockupAreaY, visualW - 4, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor('#FFFFFF');
        doc.text('CLIENT HAS ATTACHED A PDF DESIGN FILE', visualX + visualW / 2, mockupAreaY + 4.8, { align: 'center' });

        // Instruction Text prominently displayed
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor('#0F172A');
        doc.text('Client has attached a PDF for this order.', visualX + visualW / 2, mockupAreaY + 15, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor('#DC2626');
        doc.text('Forward the PDF to the factory / CAD design team for pattern setup & sublimation plotting.', visualX + visualW / 2, mockupAreaY + 21, { align: 'center' });

        // File Details Box
        const fileBoxW = 120;
        const fileBoxH = 13;
        const fileBoxX = visualX + (visualW - fileBoxW) / 2;
        const fileBoxY = mockupAreaY + 25;
        doc.setFillColor('#FFFFFF');
        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.roundedRect(fileBoxX, fileBoxY, fileBoxW, fileBoxH, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor('#0F172A');
        doc.text(`Attached File: ${pdfFileName}`, fileBoxX + fileBoxW / 2, fileBoxY + 5.2, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor('#64748B');
        doc.text('Master Vector Document (.pdf) • Embedded with Inquiry Order Record', fileBoxX + fileBoxW / 2, fileBoxY + 9.8, { align: 'center' });

        // Clickable Download Link / Button in the generated PDF
        const btnW = 96;
        const btnH = 9.5;
        const btnX = visualX + (visualW - btnW) / 2;
        const btnY = mockupAreaY + 42;

        const pdfDownloadUrl = (uploadedFiles.find(
          (f) => typeof f === 'string' && (f.startsWith('data:application/pdf') || /\.pdf/i.test(f) || f.startsWith('http'))
        )) || (quoteData.designFiles || []).find(
          (df: any) => typeof df === 'object' && df && (df.storageUrl || df.previewUrl)
        )?.storageUrl || (quoteData.designFiles || []).find(
          (df: any) => typeof df === 'object' && df && (df.storageUrl || df.previewUrl)
        )?.previewUrl || '';

        const downloadUrl = pdfDownloadUrl || `mailto:${quoteData.contactEmail}?subject=Client%20PDF%20Tech%20Pack%20${referenceId}`;

        doc.setFillColor('#1D4ED8');
        doc.roundedRect(btnX, btnY, btnW, btnH, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor('#FFFFFF');
        doc.text('CLICK HERE TO DOWNLOAD / OPEN ATTACHED PDF', btnX + btnW / 2, btnY + 6.2, { align: 'center' });

        // Attach interactive PDF link annotation
        try {
          doc.link(btnX, btnY, btnW, btnH, { url: downloadUrl });
        } catch (e) {
          // Link fallback
        }

        // Subtext
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor('#64748B');
        doc.text('(Clicking the button above opens or downloads the attached client PDF)', visualX + visualW / 2, mockupAreaY + 55.5, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor('#475569');
        doc.text('Action: Factory CAD team to reconcile attached PDF vector art with chosen collar, sleeves, and panel piping.', visualX + visualW / 2, mockupAreaY + mockupAreaH - 4.5, { align: 'center' });
      } else {
        // Pending client design frame
        doc.setFillColor('#F8FAFC');
        doc.setDrawColor('#CBD5E1');
        doc.setLineWidth(0.3);
        doc.roundedRect(visualX + 2, mockupAreaY, visualW - 4, mockupAreaH, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor('#0F172A');
        doc.text('CLIENT-PROVIDED DESIGN SPECIFICATION', visualX + visualW / 2, mockupAreaY + mockupAreaH / 2 - 2, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor('#64748B');
        doc.text('Design pack file attached with inquiry order. Design team to composite logos onto client canvas.', visualX + visualW / 2, mockupAreaY + mockupAreaH / 2 + 5, { align: 'center' });
      }
    } else {
      // =======================================================================
      // BRANCH B: "CUSTOMER HAS ASKED TO CREATE A DESIGN FOR THEM"
      // =======================================================================
      const brief = quoteData.design?.brief;

      // Background Card
      doc.setFillColor('#F8FAFC');
      doc.setDrawColor('#94A3B8');
      doc.setLineWidth(0.4);
      doc.roundedRect(visualX + 2, mockupAreaY, visualW - 4, mockupAreaH, 2, 2, 'FD');

      // Prominent Header Banner
      doc.setFillColor('#0F172A');
      doc.rect(visualX + 2, mockupAreaY, visualW - 4, 6.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor('#FFFFFF');
      doc.text(
        'CUSTOMER HAS ASKED TO CREATE A DESIGN FOR THEM',
        visualX + visualW / 2,
        mockupAreaY + 4.5,
        { align: 'center' }
      );

      // Two-column layout for brief details
      const col1X = visualX + 6;
      const col1W = 84;
      const col2X = visualX + 94;
      const col2W = visualW - 100;
      let curY = mockupAreaY + 11.5;
      const lineSpacing = 5.2;

      const renderBriefLine = (label: string, value: string, x: number, y: number, maxW: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor('#475569');
        doc.text(label.toUpperCase() + ':', x, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.2);
        doc.setTextColor('#0F172A');
        const labelW = doc.getTextWidth(label.toUpperCase() + ':') + 2;
        const valLines = doc.splitTextToSize(value || '-', maxW - labelW);
        doc.text(valLines[0] || '-', x + labelW, y);
      };

      // 1. Primary Colors
      const primColors = brief?.primary_colors?.length ? brief.primary_colors : [quoteData.primaryColor || '#FAF6EA'];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor('#475569');
      doc.text('PRIMARY COLOR(S):', col1X, curY);
      let sX = col1X + 27;
      primColors.slice(0, 4).forEach((hex) => {
        doc.setFillColor(hex);
        doc.setDrawColor('#475569');
        doc.setLineWidth(0.2);
        doc.rect(sX, curY - 3, 4.8, 3.2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor('#0F172A');
        doc.text(hex, sX + 5.8, curY - 0.5);
        sX += 18;
      });

      // 2. Secondary Colors
      curY += lineSpacing;
      const secColors = brief?.secondary_colors?.length ? brief.secondary_colors : [quoteData.accentColor || '#FFFFFF'];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor('#475569');
      doc.text('ACCENT COLOR(S):', col1X, curY);
      sX = col1X + 27;
      secColors.slice(0, 4).forEach((hex) => {
        doc.setFillColor(hex);
        doc.setDrawColor('#475569');
        doc.setLineWidth(0.2);
        doc.rect(sX, curY - 3, 4.8, 3.2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor('#0F172A');
        doc.text(hex, sX + 5.8, curY - 0.5);
        sX += 18;
      });

      // 3. Design Style / Theme
      curY += lineSpacing;
      const themeStr = brief?.style_themes?.length ? brief.style_themes.join(', ') : 'Bold & Aggressive';
      renderBriefLine('DESIGN THEME', themeStr, col1X, curY, col1W);

      // 4. Print Coverage
      curY += lineSpacing;
      const covStr = brief?.print_coverage === 'full_sublimation'
        ? 'Full Sublimation (All-Over Print / Graphics)'
        : brief?.print_coverage === 'solid_base_accent'
        ? 'Solid Base Color + Accent Graphics'
        : brief?.print_coverage === 'solid_only'
        ? 'Solid Color Only (Logos/Text, No Pattern)'
        : 'Full Sublimation';
      renderBriefLine('PRINT COVERAGE', covStr, col1X, curY, col1W);

      // 5. Reference Brand
      curY += lineSpacing;
      renderBriefLine('REFERENCE BRAND', brief?.reference_brand || '-', col1X, curY, col1W);

      // 6. Elements to Avoid
      curY += lineSpacing;
      renderBriefLine('ELEMENTS TO AVOID', brief?.elements_to_avoid || '-', col1X, curY, col1W);

      // Column 2
      let c2Y = mockupAreaY + 11.5;

      // 7. Text Elements
      const txtStr = brief?.text_elements?.length ? brief.text_elements.join(', ') : '-';
      renderBriefLine('TEXT ELEMENTS', txtStr, col2X, c2Y, col2W);

      // 8. Graphic Elements
      c2Y += lineSpacing;
      const gfxStr = brief?.graphic_elements?.length ? brief.graphic_elements.join(', ') : '-';
      renderBriefLine('GRAPHIC ELEMENTS', gfxStr, col2X, c2Y, col2W);

      // 9. Brand Guidelines
      c2Y += lineSpacing;
      const bgStr = brief?.brand_guidelines_file ? 'Attached with Order Tech Pack' : 'None';
      renderBriefLine('BRAND GUIDELINES', bgStr, col2X, c2Y, col2W);

      // 10. Inspiration Images Attached
      c2Y += lineSpacing;
      const inspCount = brief?.inspiration_images?.length || 0;
      renderBriefLine('INSPIRATION IMAGES', inspCount > 0 ? `${inspCount} Reference Image(s) Attached` : 'None', col2X, c2Y, col2W);

      // 11. Additional Notes
      c2Y += lineSpacing;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor('#475569');
      doc.text('DESIGN STUDIO NOTES:', col2X, c2Y);

      const notesStr = brief?.additional_notes || quoteData.designNotes || 'Create complete factory mockup according to sports technical guidelines.';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor('#0F172A');
      const noteLines = doc.splitTextToSize(notesStr, col2W);
      doc.text(noteLines.slice(0, 4), col2X, c2Y + 4);
    }

    // =========================================================================
    // SIZING & BREAKDOWN TEXT BLOCK (Below Mockups)
    // =========================================================================
    const breakdownY = mockupAreaY + mockupAreaH + 4;

    if (quoteData.order_type === 'individualized') {
      const typeTitle = isBottom ? 'BOTTOM GARMENT' : 'TOP GARMENT';
      const breakdownTitle = `${typeTitle} - PLAYER NAMES & NUMBERS BREAKDOWN`;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(colRedText);
      doc.text(breakdownTitle, visualX + visualW / 2, breakdownY, { align: 'center' });

      let lineY = breakdownY + 5;
      doc.setFontSize(7.5);
      doc.setTextColor(colBlueText);

      if (roster && roster.length > 0) {
        const mappedRoster = roster.map((p: any) => ({
          ...p,
          size: isBottom ? (p.bottom_size || p.size || 'M') : (p.top_size || p.size || 'M'),
        }));

        const summary = generateIndividualizedSummary(
          mappedRoster,
          quoteData.blanks_by_size || {},
          breakdownTitle,
          sizePreset.sizes.map((s) => s.size)
        );

        const maxLines = Math.min(summary.lines.length, 3);
        summary.lines.slice(0, maxLines).forEach((line) => {
          const wrapped = doc.splitTextToSize(line, visualW - 10);
          wrapped.slice(0, 1).forEach((wLine: string) => {
            doc.text(wLine, visualX + visualW / 2, lineY, { align: 'center' });
            lineY += 4;
          });
        });

        if (summary.lines.length > 3) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor('#64748B');
          doc.text(`+ ${summary.lines.length - 3} more sizes (see full Player Manifest on Page ${garments.length + 1})`, visualX + visualW / 2, lineY, { align: 'center' });
          lineY += 4;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(colRedText);
        const total = summary.totalQty || quoteData.volumeMOQ || 50;
        doc.text(`TOTAL ${total} PIECES (MOQ: 50)`, visualX + visualW / 2, lineY + 1, { align: 'center' });
      } else {
        const excelName = quoteData.roster_excel_file_name || 'Player_Names_&_Numbers.xlsx';
        doc.text(`Completed Player Excel Sheet Attached: ${excelName}`, visualX + visualW / 2, lineY, { align: 'center' });
        lineY += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor('#475569');
        doc.text('Production will map each player jersey & bottom according to the uploaded spreadsheet.', visualX + visualW / 2, lineY, { align: 'center' });
        lineY += 4.5;

        // Total Quantity in Bold Red
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(colRedText);
        doc.text(`TOTAL ${quoteData.volumeMOQ || 50} PIECES (MOQ: 50)`, visualX + visualW / 2, lineY + 1.5, { align: 'center' });
      }
    } else {
      const garmentTitle = isBottom
        ? `TROUSER / BOTTOM SIZES (${sizePreset.label.includes('MEN') ? "MEN'S" : sizePreset.label})`
        : `${garment.type_name.toUpperCase()} SIZES`;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(colBlueText);
      doc.text(garmentTitle, visualX + visualW / 2, breakdownY, { align: 'center' });

      let lineY = breakdownY + 5.5;
      doc.setFontSize(8.5);

      const blanks = quoteData.blanks_by_size || garment.sizing?.qty_by_size || {};
      const activeSizes = Object.entries(blanks).filter(([_, qty]) => Number(qty) > 0);

      if (activeSizes.length > 0) {
        const sizeStr = activeSizes.map(([sz, qty]) => `${sz}: ${qty} PCS`).join('   •   ');
        doc.setTextColor('#0F172A');
        doc.text(sizeStr, visualX + visualW / 2, lineY, { align: 'center' });
        lineY += 5;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor('#64748B');
        doc.text(`ORDER VOLUME: ${quoteData.volumeMOQ || 50} PIECES (STANDARD RATIO XS-2XL)`, visualX + visualW / 2, lineY, { align: 'center' });
        lineY += 5;
      }

      // Total Quantity in Bold Blue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colBlueText);
      const totalCount = activeSizes.reduce((acc, [_, qty]) => acc + Number(qty), 0) || (quoteData.volumeMOQ || 50);
      doc.text(`TOTAL ${totalCount} PIECES`, visualX + visualW / 2, lineY + 2, { align: 'center' });
    }
  }

  // =========================================================================
  // DEDICATED PAGE: PLAYER ROSTER & CUSTOMIZATION MANIFEST TABLE
  // =========================================================================
  if (quoteData.order_type === 'individualized' && roster && roster.length > 0) {
    doc.addPage('a4', 'landscape');

    // Header Strip (matching dark banner)
    doc.setFillColor(colSlateHeader);
    doc.rect(margin, margin, pageWidth - margin * 2, 16, 'F');

    // Brand Badge
    doc.setFillColor('#FFFFFF');
    doc.roundedRect(margin + 2, margin + 2, 28, 12, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#0F172A');
    doc.text('HR SPORTS', margin + 16, margin + 7.5, { align: 'center' });
    doc.setFontSize(5.5);
    doc.setTextColor('#64748B');
    doc.text('ROSTER MANIFEST', margin + 16, margin + 11.5, { align: 'center' });

    // Client, Order, Inquiry #
    const col1X = margin + 35;
    const col2X = margin + 120;
    const col3X = margin + 195;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colGoldLabel);
    doc.text('CLIENT NAME :', col1X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(clientName, col1X + 26, margin + 6.5);

    doc.setTextColor(colGoldLabel);
    doc.text('ORDER BY :', col2X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(orderBy, col2X + 20, margin + 6.5);

    doc.setTextColor(colGoldLabel);
    doc.text('INQUIRY NO :', col3X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(inquiryNumber, col3X + 24, margin + 6.5);

    doc.setFontSize(8);
    doc.setTextColor('#E2E8F0');
    doc.text('SOURCE FILE       :', col1X, margin + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#FFFFFF');
    doc.text(quoteData.roster_excel_file_name || 'Imported from Excel', col1X + 26, margin + 12.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colGoldLabel);
    doc.text('TOTAL PLAYERS :', col2X, margin + 12.5);
    doc.setTextColor('#FFFFFF');
    doc.text(`${roster.length} PLAYERS`, col2X + 26, margin + 12.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colRedText);
    doc.text('DISPATCH DATE :', col3X, margin + 12.5);
    doc.setTextColor(colRedText);
    doc.text(dispatchDate, col3X + 26, margin + 12.5);

    // Title text above table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor('#0F172A');
    doc.text('PLAYER NAMES, NUMBERS & SIZE SPECIFICATIONS', margin, margin + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#64748B');
    doc.text('Imported directly from client Excel sheet. Factory cutting floor & sublimation plotting must strictly follow this manifest.', margin, margin + 29);

    const tableBody = roster.map((p: any, idx: number) => [
      String(p.serial_number || (idx + 1)),
      String(p.player_name || '-').toUpperCase(),
      String(p.number || '-'),
      String(p.top_size || p.size || '-').toUpperCase(),
      String(p.bottom_size || '-').toUpperCase(),
      String(p.qty || 1),
    ]);

    const autoTableFn = (autoTable as any).default || autoTable;
    autoTableFn(doc, {
      startY: margin + 32,
      margin: { left: margin, right: margin, bottom: margin },
      head: [['SR #', 'JERSEY NAME', 'JERSEY NUMBER', 'TOP SIZE', 'BOTTOM SIZE', 'QTY']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [107, 15, 43],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [15, 23, 42],
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 18, halign: 'center' },
        1: { cellWidth: 80, halign: 'left', fontStyle: 'bold' },
        2: { cellWidth: 35, halign: 'center', fontStyle: 'bold', textColor: [30, 64, 175] },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 35, halign: 'center' },
        5: { halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });
  }

  return doc;
}
