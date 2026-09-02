import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/schemas/newsletter';
import { db } from '@/lib/db';
import { emailService } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = newsletterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid corporate email address',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const result = await db.addSubscriber(email);

    if (!result.alreadySubscribed) {
      await emailService.sendNewsletterWelcome(email);
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed: result.alreadySubscribed,
      message: result.alreadySubscribed
        ? 'You are already registered for HR Sports textile updates.'
        : 'Thank you for subscribing to HR Sports Textile Intelligence.',
    });
  } catch (error: any) {
    console.error('Error handling /api/newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process newsletter subscription' },
      { status: 500 }
    );
  }
}
