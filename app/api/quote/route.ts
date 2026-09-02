import { NextRequest, NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/schemas/quote';
import { db } from '@/lib/db';
import { emailService } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Server-Side Zod Validation
    const validation = quoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = validation.data;

    // 2. Persist in database / store
    const inquiry = await db.saveQuoteInquiry(payload);

    // 3. Dispatch Transactional Emails
    const [clientEmailRes, adminEmailRes] = await Promise.allSettled([
      emailService.sendQuoteConfirmation(payload, inquiry.referenceNumber),
      emailService.sendAdminNotification(payload, inquiry.referenceNumber),
    ]);

    return NextResponse.json(
      {
        success: true,
        referenceId: inquiry.referenceNumber,
        inquiryId: inquiry.id,
        message: 'Inquiry processed and logged successfully in factory queue.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error handling /api/quote:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while processing quote intake',
      },
      { status: 500 }
    );
  }
}
