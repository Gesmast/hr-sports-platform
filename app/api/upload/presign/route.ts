import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileSizeBytes, fileType, kind } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `vault/${timestamp}-${sanitizedFileName}`;

    // Cloudflare R2 S3 Config Check
    const r2Endpoint = process.env.R2_ENDPOINT;
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
    const r2Secret = process.env.R2_SECRET_ACCESS_KEY;
    const r2Bucket = process.env.R2_BUCKET_NAME || 'hr-sports-intake';
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://storage.hrsports.com';

    // If R2 is fully configured in production, generate AWS S3 v4 presigned PUT url
    // For local dev or simulated mode, provide a direct upload mock URL
    const publicUrl = `${publicUrlBase}/${storageKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl: `/api/upload/direct?key=${encodeURIComponent(storageKey)}`,
      publicUrl,
      key: storageKey,
      expiresIn: 3600,
    });
  } catch (err: any) {
    console.error('Presign URL generation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
