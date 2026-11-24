import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Inquiry ID required', { status: 400 });
    }

    const adminClient = createAdminClient();

    // Query inquiry by ID or reference_id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const query = adminClient
      .from('inquiries')
      .select('*');

    const { data: inquiry, error } = isUuid
      ? await query.eq('id', id).maybeSingle()
      : await query.eq('reference_id', id).maybeSingle();

    if (error || !inquiry) {
      return new NextResponse('Inquiry not found', { status: 404 });
    }

    // Build payload for PDF generator
    const payload = inquiry.inquiry_metadata || {
      garmentType: inquiry.garment_type,
      volumeMOQ: inquiry.quantity,
      fabric_type: inquiry.fabric_spec,
      materialVariant: inquiry.fabric_spec,
      designNotes: inquiry.custom_spec_notes,
      contactEmail: inquiry.contact_email,
    };

    const doc = await generateQuoteSpecPdf(payload, inquiry.reference_id);
    const pdfArrayBuffer = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Specification-${inquiry.reference_id}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('Error generating specification PDF:', err);
    return new NextResponse(err?.message || 'Failed to generate PDF', { status: 500 });
  }
}
