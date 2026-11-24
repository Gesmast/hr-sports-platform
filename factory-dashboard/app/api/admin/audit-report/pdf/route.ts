import { NextRequest, NextResponse } from 'next/server';
import { buildAuditPdfBuffer } from '@/lib/pdf/audit-pdf-pure';

export async function POST(req: NextRequest) {
  try {
    const { period, staffName, role, score, reportText } = await req.json();

    const pdfBuffer = buildAuditPdfBuffer({
      period: period || 'today',
      staffName,
      role,
      score,
      reportText: reportText || '',
    });

    const safeName = staffName ? `HR-Audit-${staffName}` : 'HR-Factory-Audit-Dossier';

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}-${period || 'today'}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('Audit PDF Generation Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate audit PDF' },
      { status: 500 }
    );
  }
}
