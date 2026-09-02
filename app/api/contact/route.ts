import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas/contact';
import { db } from '@/lib/db';
import { emailService } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = contactSchema.safeParse(body);
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
    const entry = await db.saveContactMessage(payload);

    await emailService.sendContactMessageNotification(payload);

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: 'Your inquiry has been received. Our team will get back to you within 24 hours.',
    });
  } catch (error: any) {
    console.error('Error handling /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
