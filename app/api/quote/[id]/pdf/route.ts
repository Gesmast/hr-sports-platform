import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find inquiry from db by referenceNumber or id
    const inquiry = (db as any).inquiries?.find(
      (inq: any) => inq.id === id || inq.referenceNumber === id
    );

    if (!inquiry) {
      return NextResponse.json(
        { error: `Quote inquiry with ID ${id} not found.` },
        { status: 404 }
      );
    }

    const doc = await generateQuoteSpecPdf(inquiry.payload || inquiry, inquiry.referenceNumber || id);
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="HR-SPORTS-SPEC-${inquiry.referenceNumber || id}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('PDF Generation Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate PDF spec sheet' },
      { status: 500 }
    );
  }
}
