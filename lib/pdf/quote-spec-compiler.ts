import jsPDF from 'jspdf';
import { QuoteSchemaType, GarmentSpecType, LogoPlacementType } from '@/lib/schemas/quote';
import { SIZE_CHART_PRESETS, DEFAULT_SIZES_ORDER } from './size-charts';
import { generateIndividualizedSummary, generateUniformSummary } from './roster-compiler';


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

  // Build garments array with backward-compatibility fallback
  let garments: GarmentSpecType[] = quoteData.garments && quoteData.garments.length > 0
    ? quoteData.garments
    : [
        {
          garment_type: (quoteData.garmentType && quoteData.garmentType.toLowerCase().includes('trouser')) ? 'bottom' : 'top',
          type_name: quoteData.garmentType || 'Sublimation T-Shirt',
          colour_mode: 'sublimation',
          colour_value: quoteData.primaryColor ? `Sublimation (${quoteData.primaryColor})` : 'Sublimation',
          fabric_name: quoteData.materialVariant || 'SAP Cream Fabric',
          fabric_gsm: 160,
          collar_type: 'Collar',
          button_type: 'Kaaj Buttons',
          sleeve_length: 'Half Sleeves',
          panel_piping: '-',
          logo_application: ['Sublimation'],
          font_name: '-',
          logo_placements: [],
          sizing: {
            mode: quoteData.order_type || 'uniform',
            qty_by_size: {},
          },
        },
      ];

  // Client Meta Fields
  const clientName = safeVal(quoteData.companyName);
  const orderBy = safeVal(quoteData.order_by || quoteData.contactEmail?.split('@')[0] || 'FACTORY DIRECT');
  const designer = safeVal(quoteData.designer || '-');
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
    doc.text('DESIGNER :', col3X, margin + 6.5);
    doc.setTextColor('#FFFFFF');
    doc.text(designer, col3X + 22, margin + 6.5);

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
      ? 'CLIENT TECH PACK'
      : quoteData.design?.brief?.style_themes?.length
      ? `STUDIO BRIEF (${quoteData.design.brief.style_themes[0].toUpperCase()})`
      : 'STUDIO DESIGN BRIEF';

    const specRows: SpecRow[] = isBottom
      ? [
          { label: 'BOTTOM TYPE', value: safeVal(garment.type_name) },
          { label: 'DESIGN SOURCE', value: designSourceText },
          { label: 'COLOUR', value: safeVal(garment.colour_value) },
          { label: 'FABRIC TYPE', value: safeVal(garment.fabric_name) },
          { label: 'PANEL & PIPING TYPE', value: safeVal(garment.panel_piping) },
          { label: 'LOGOS / LOGO SIZE', value: garment.logo_application?.length ? garment.logo_application.join(', ').toUpperCase() : safeVal(garment.colour_mode) },
          { label: 'LENGTH & BOTTOM', value: safeVal(garment.cuff_type) },
          { label: 'FLY', value: safeVal(garment.fly_type) },
          { label: 'POCKET', value: safeVal(garment.pocket_type) },
        ]
      : [
          { label: 'TOP TYPE', value: safeVal(garment.type_name) },
          { label: 'DESIGN SOURCE', value: designSourceText },
          { label: 'COLOUR', value: safeVal(garment.colour_value) },
          { label: 'FABRIC', value: safeVal(garment.fabric_name) },
          { label: 'COLLAR TYPE', value: safeVal(garment.collar_type) },
          { label: 'BUTTON TYPE', value: safeVal(garment.button_type) },
          { label: 'SLEEVE LENGTH', value: safeVal(garment.sleeve_length) },
          { label: 'PANEL & PIPING TYPE', value: safeVal(garment.panel_piping) },
          { label: 'FONT NAME', value: safeVal(garment.font_name) },
          { label: 'LOGOS', value: garment.logo_application?.length ? garment.logo_application.join(', ').toUpperCase() : 'SUBLIMATION' },
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
      if (f.startsWith('data:image') || /\.(png|jpg|jpeg|svg|webp)/i.test(f)) {
        if (!imageFiles.includes(f)) imageFiles.push(f);
      }
    });

    const isPdfUpload = uploadedFiles.some(
      (f) => f.startsWith('data:application/pdf') || /\.pdf/i.test(f)
    ) || (quoteData.designFiles || []).some(
      (df) => df.extension.toLowerCase().includes('pdf') || df.fileName.toLowerCase().includes('pdf')
    );
    const pdfFileName = (quoteData.designFiles || []).find(
      (df) => df.extension.toLowerCase().includes('pdf') || df.fileName.toLowerCase().includes('pdf')
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
          (f) => f.startsWith('data:application/pdf') || /\.pdf/i.test(f) || f.startsWith('http')
        )) || (quoteData.designFiles || []).find(
          (df) => df.storageUrl || df.previewUrl
        )?.storageUrl || (quoteData.designFiles || []).find(
          (df) => df.storageUrl || df.previewUrl
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

    if (quoteData.order_type === 'individualized' && !isBottom) {
      // Section Header in Bold Red (matching OMTEX sample)
      const sleeveTitle = garment.sleeve_length ? garment.sleeve_length.toUpperCase() : 'HALF SLEEVE';
      const typeTitle = garment.type_name ? garment.type_name.toUpperCase() : 'T-SHIRTS';
      const breakdownTitle = `${sleeveTitle} ${typeTitle} SIZES (EACH PLAYER 2 QTY)`;

      const summary = generateIndividualizedSummary(
        quoteData.roster || [],
        quoteData.blanks_by_size || {},
        breakdownTitle,
        sizePreset.sizes.map((s) => s.size)
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(colRedText);
      doc.text(summary.title, visualX + visualW / 2, breakdownY, { align: 'center' });

      // Breakdown Lines in Bold Blue
      let lineY = breakdownY + 5;
      doc.setFontSize(7.2);
      doc.setTextColor(colBlueText);

      summary.lines.forEach((line) => {
        // Highlight blank portions or wrap neatly
        const wrapped = doc.splitTextToSize(line, visualW - 10);
        wrapped.forEach((wLine: string) => {
          doc.text(wLine, visualX + visualW / 2, lineY, { align: 'center' });
          lineY += 4.2;
        });
      });

      // Total Quantity in Bold Red
      doc.setFontSize(9.5);
      doc.setTextColor(colRedText);
      doc.text(`TOTAL ${summary.totalQty} QTY`, visualX + visualW / 2, lineY + 1.5, { align: 'center' });
    } else {
      // Uniform Sizing (or Bottom Trouser breakdown matching sample page 2)
      const garmentTitle = isBottom
        ? `TROUSER SIZES (${sizePreset.label.includes('MEN') ? "MEN'S" : sizePreset.label})`
        : `${garment.type_name.toUpperCase()} SIZES`;

      const qtyBySize = garment.sizing?.qty_by_size || {};
      const summary = generateUniformSummary(
        qtyBySize,
        garmentTitle,
        sizePreset.sizes.map((s) => s.size)
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(colBlueText);
      doc.text(summary.title, visualX + visualW / 2, breakdownY, { align: 'center' });

      let lineY = breakdownY + 5.5;
      doc.setFontSize(8.5);

      if (summary.lines.length > 0) {
        summary.lines.forEach((line) => {
          doc.text(line, visualX + visualW / 2, lineY, { align: 'center' });
          lineY += 4.5;
        });
      } else {
        // Fallback if no specific size map
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor('#64748B');
        doc.text(`ORDER VOLUME: ${quoteData.volumeMOQ || 30} UNITS (STANDARD RATIO S-2XL)`, visualX + visualW / 2, lineY, { align: 'center' });
        lineY += 5;
      }

      // Total Quantity in Bold Blue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colBlueText);
      const totalCount = summary.totalQty > 0 ? summary.totalQty : (quoteData.volumeMOQ || 30);
      doc.text(`TOTAL ${totalCount} QTY`, visualX + visualW / 2, lineY + 2, { align: 'center' });
    }
  }

  return doc;
}
