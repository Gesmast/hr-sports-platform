import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slotKey = (formData.get('slotKey') as string) || 'general';
    const uploadType = (formData.get('uploadType') as string) || 'video'; // 'video' | 'poster' | 'policy_image'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const mimeType = file.type;
    const fileName = file.name;
    const fileSize = file.size;

    // Validate video uploads
    if (uploadType === 'video') {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedVideoTypes.includes(mimeType) && !fileName.match(/\.(mp4|webm|mov)$/i)) {
        return NextResponse.json(
          { error: 'Invalid video format. Please upload MP4, WebM, or QuickTime MOV files.' },
          { status: 400 }
        );
      }

      // 120MB max file size
      if (fileSize > 120 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Video file size exceeds maximum 120MB limit.' },
          { status: 400 }
        );
      }
    }

    // Validate image uploads (poster or policy image)
    if (uploadType === 'poster' || uploadType === 'policy_image') {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedImageTypes.includes(mimeType) && !fileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return NextResponse.json(
          { error: 'Invalid image format. Please upload JPG, PNG, or WebP.' },
          { status: 400 }
        );
      }
      if (fileSize > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image file size exceeds maximum 15MB limit.' },
          { status: 400 }
        );
      }
    }

    // Build unique R2 storage key
    const timestamp = Date.now();
    const safeSlot = slotKey.replace(/[^a-zA-Z0-9_-]/g, '_');
    const extension = fileName.split('.').pop()?.toLowerCase() || (uploadType === 'video' ? 'mp4' : 'jpg');
    
    let storageKey = '';
    if (uploadType === 'video') {
      storageKey = `website/videos/${safeSlot}-${timestamp}.${extension}`;
    } else if (uploadType === 'poster') {
      storageKey = `website/posters/${safeSlot}-${timestamp}.${extension}`;
    } else {
      storageKey = `website/policies/images/${safeSlot}-${timestamp}.${extension}`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await uploadBufferToR2(storageKey, buffer, mimeType);

    if (!uploadRes.success || !uploadRes.url) {
      return NextResponse.json(
        { error: uploadRes.error || 'Cloudflare R2 upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      key: storageKey,
      url: uploadRes.url,
      metadata: {
        fileName,
        fileSize,
        mimeType,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Website Upload Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Unexpected server error during upload' },
      { status: 500 }
    );
  }
}
