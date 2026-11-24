import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || searchParams.get('path');
    const filename = searchParams.get('filename') || key?.split('/').pop() || 'document';

    if (!key) {
      return NextResponse.json({ error: 'Storage key or path is required' }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: 'Empty file received from storage' }, { status: 404 });
    }

    const byteArray = await response.Body.transformToByteArray();
    const contentType = response.ContentType || 'application/octet-stream';

    return new NextResponse(Buffer.from(byteArray), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': byteArray.length.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (err: any) {
    console.error('[R2 Storage Stream Error in Factory Dashboard]:', err);
    if (err.name === 'NoSuchKey') {
      return NextResponse.json({ error: 'File not found in Cloudflare R2' }, { status: 404 });
    }
    return NextResponse.json(
      { error: err?.message || 'Failed to retrieve file from storage' },
      { status: 500 }
    );
  }
}
