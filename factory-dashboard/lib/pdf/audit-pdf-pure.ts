/**
 * Pure Zero-Dependency PDF Generator for Factory Performance Audits
 * Compliant with PDF-1.4 standard.
 * Zero external packages, zero Webpack/core-js bundle issues, 100% reliable.
 */

export interface AuditPdfOptions {
  period: string;
  staffName?: string;
  role?: string;
  score?: number;
  reportText: string;
}

export function buildAuditPdfBuffer(options: AuditPdfOptions): Buffer {
  const { period, staffName, role, score, reportText } = options;

  // Split report into wrapped lines (max ~75 chars per line)
  const rawLines = (reportText || '').split('\n');
  const formattedLines: { text: string; isHeader: boolean; isBullet: boolean; isDirective: boolean }[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push({ text: '', isHeader: false, isBullet: false, isDirective: false });
      continue;
    }

    const isHeader =
      trimmed.startsWith('1.') ||
      trimmed.startsWith('2.') ||
      trimmed.startsWith('3.') ||
      trimmed.startsWith('4.') ||
      trimmed.startsWith('STAFF MEMBER:');

    const isDirective = trimmed.includes('DIRECT OWNER ACTION') || trimmed.includes('DIRECTIVES FOR HAFEEZ BHAI');
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');

    // Wrap long lines
    const maxChars = 75;
    if (trimmed.length > maxChars && !isHeader) {
      const words = trimmed.split(' ');
      let currentLine = '';
      for (const w of words) {
        if ((currentLine + ' ' + w).trim().length > maxChars) {
          formattedLines.push({ text: currentLine.trim(), isHeader, isBullet, isDirective });
          currentLine = '  ' + w;
        } else {
          currentLine = (currentLine + ' ' + w).trim();
        }
      }
      if (currentLine) {
        formattedLines.push({ text: currentLine.trim(), isHeader, isBullet, isDirective });
      }
    } else {
      formattedLines.push({ text: trimmed, isHeader, isBullet, isDirective });
    }
  }

  // Construct PDF Objects
  const linesPerPage = 42;
  const pages: (typeof formattedLines)[] = [];
  for (let i = 0; i < formattedLines.length; i += linesPerPage) {
    pages.push(formattedLines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([]);

  const totalPages = pages.length;
  const objects: string[] = [];

  // obj 1: Catalog
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');

  // obj 2: Pages container (to be filled)
  // obj 3: Font Helvetica
  // obj 4: Font Helvetica-Bold
  // obj 5: Font Courier

  const pageObjIds: number[] = [];
  let currentObjId = 6;

  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const contentObjId = currentObjId;
    const pageObjId = currentObjId + 1;
    pageObjIds.push(pageObjId);
    currentObjId += 2;
  }

  // Now construct objects array
  const pdfObjects: { id: number; content: string }[] = [];

  // 1: Catalog
  pdfObjects.push({ id: 1, content: '<< /Type /Catalog /Pages 2 0 R >>' });

  // 2: Pages
  const kidsStr = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  pdfObjects.push({
    id: 2,
    content: `<< /Type /Pages /Kids [${kidsStr}] /Count ${totalPages} >>`,
  });

  // 3: Font Helvetica
  pdfObjects.push({
    id: 3,
    content: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  });

  // 4: Font Helvetica-Bold
  pdfObjects.push({
    id: 4,
    content: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  });

  // 5: Font Courier-Bold
  pdfObjects.push({
    id: 5,
    content: '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>',
  });

  // Pages & Contents
  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const pageLines = pages[pIdx];
    const pageNumber = pIdx + 1;
    const contentId = 6 + pIdx * 2;
    const pageId = contentId + 1;

    // Stream operations (PDF PostScript commands)
    let stream = '';

    // Header Dark Banner (Rectangle: 0, 750 to 595, 842)
    stream += 'q\n';
    stream += '0.06 0.09 0.16 rg\n'; // Slate 900
    stream += '0 760 595 82 re f\n';

    // Header Text
    stream += '1 1 1 rg\n'; // White text
    stream += 'BT\n/F2 16 Tf\n40 805 Td\n(HR SPORTS LAHORE) Tj\nET\n';

    stream += '0.58 0.64 0.72 rg\n'; // Slate 400
    stream += 'BT\n/F1 8.5 Tf\n40 790 Td\n(EXECUTIVE CONFIDENTIAL PERFORMANCE DOSSIER) Tj\nET\n';

    stream += '1 1 1 rg\n';
    stream += `BT\n/F2 9 Tf\n420 805 Td\n(PERIOD: ${escapePdf(period.toUpperCase())}) Tj\nET\n`;

    stream += '0.58 0.64 0.72 rg\n';
    const dateStr = new Date().toLocaleDateString('en-GB');
    stream += `BT\n/F1 8 Tf\n420 790 Td\n(DATE: ${escapePdf(dateStr)}) Tj\nET\n`;

    // Staff Info Sub-banner (Page 1 only)
    let startY = 720;
    if (pageNumber === 1 && staffName) {
      stream += '0.94 0.96 0.98 rg\n'; // Light slate bg
      stream += '40 705 515 36 re f\n';
      stream += '0.89 0.91 0.94 RG\n0.8 w\n40 705 515 36 re s\n';

      stream += '0.06 0.09 0.16 rg\n';
      stream += `BT\n/F2 13 Tf\n50 724 Td\n(${escapePdf(staffName.toUpperCase())}) Tj\nET\n`;

      stream += '0.28 0.33 0.41 rg\n';
      stream += `BT\n/F1 9.5 Tf\n50 712 Td\n(Role: ${escapePdf(role || 'Designer')}) Tj\nET\n`;

      if (score !== undefined) {
        if (score >= 92) {
          stream += '0.06 0.65 0.38 rg\n'; // Emerald
        } else {
          stream += '0.85 0.47 0.02 rg\n'; // Amber
        }
        stream += `BT\n/F2 14 Tf\n440 718 Td\n(SCORE: ${score}%) Tj\nET\n`;
      }

      startY = 680;
    }

    // Stream lines of text
    let currentY = startY;
    for (const l of pageLines) {
      if (!l.text) {
        currentY -= 8;
        continue;
      }

      if (l.isHeader) {
        currentY -= 4;
        if (l.isDirective) {
          stream += '0.11 0.31 0.85 rg\n'; // Cobalt
        } else if (l.text.includes('FAILED') || l.text.includes('DEFICIENCIES')) {
          stream += '0.73 0.11 0.11 rg\n'; // Red
        } else if (l.text.includes('RIGHT') || l.text.includes('ACCOMPLISHMENTS')) {
          stream += '0.08 0.50 0.24 rg\n'; // Green
        } else {
          stream += '0.06 0.09 0.16 rg\n';
        }
        stream += `BT\n/F2 10.5 Tf\n40 ${currentY} Td\n(${escapePdf(l.text)}) Tj\nET\n`;
        currentY -= 14;
      } else if (l.isBullet) {
        stream += '0.15 0.20 0.28 rg\n';
        stream += `BT\n/F1 9 Tf\n46 ${currentY} Td\n(${escapePdf(l.text)}) Tj\nET\n`;
        currentY -= 12;
      } else {
        stream += '0.20 0.25 0.33 rg\n';
        stream += `BT\n/F1 9 Tf\n40 ${currentY} Td\n(${escapePdf(l.text)}) Tj\nET\n`;
        currentY -= 12;
      }
    }

    // Footer Text
    stream += '0.58 0.64 0.72 rg\n';
    stream += `BT\n/F1 7.5 Tf\n180 25 Td\n(HR Sports Factory Systems - Green Building, Multan Road, Lahore - Page ${pageNumber} of ${totalPages}) Tj\nET\n`;
    stream += 'Q\n';

    // Push Content Object
    pdfObjects.push({
      id: contentId,
      content: `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`,
    });

    // Push Page Object
    pdfObjects.push({
      id: pageId,
      content: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>`,
    });
  }

  // Construct PDF Document Buffer
  let pdf = '%PDF-1.4\n';
  const xrefOffsets: number[] = [0];

  for (const obj of pdfObjects) {
    xrefOffsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${pdfObjects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= pdfObjects.length; i++) {
    const offsetStr = String(xrefOffsets[i]).padStart(10, '0');
    pdf += `${offsetStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${pdfObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

function escapePdf(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' '); // Keep safe ASCII for WinAnsi
}
