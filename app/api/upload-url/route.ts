import { NextRequest, NextResponse } from 'next/server';
import {
  MAX_FLAT_FILE_SIZE_BYTES,
  MAX_3D_FILE_SIZE_BYTES,
  ALLOWED_FLAT_EXTENSIONS,
  ALLOWED_3D_EXTENSIONS,
} from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, sizeBytes, kind } = body;

    if (!fileName || !sizeBytes || !kind) {
      return NextResponse.json(
        { error: 'Missing required parameters: fileName, sizeBytes, kind' },
        { status: 400 }
      );
    }

    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // Verify format & limits
    if (kind === 'flat') {
      if (!ALLOWED_FLAT_EXTENSIONS.includes(ext as any)) {
        return NextResponse.json(
          { error: `File format ${ext} is not allowed for flat tech packs` },
          { status: 400 }
        );
      }
      if (sizeBytes > MAX_FLAT_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Flat file exceeds 100MB limit (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB)` },
          { status: 400 }
        );
      }
    } else if (kind === '3d') {
      if (!ALLOWED_3D_EXTENSIONS.includes(ext as any)) {
        return NextResponse.json(
          { error: `File format ${ext} is not supported for 3D garment files` },
          { status: 400 }
        );
      }
      if (sizeBytes > MAX_3D_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `3D file exceeds 250MB limit (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB)` },
          { status: 400 }
        );
      }
    }

    const uniqueKey = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fileName}`;
    const mockStorageUrl = `https://storage.hrsports.com/vault/${uniqueKey}`;

    // Return direct upload target endpoint / presigned signature
    return NextResponse.json({
      success: true,
      uploadUrl: `/api/upload-handler?key=${encodeURIComponent(uniqueKey)}`,
      storageUrl: mockStorageUrl,
      fileKey: uniqueKey,
      headers: {
        'x-amz-acl': 'private',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
