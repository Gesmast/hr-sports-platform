import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

// Dedicated Buckets:
// 1. Inquiries Bucket (customer quote uploads, raw specs)
export const R2_INQUIRIES_BUCKET = process.env.R2_BUCKET_NAME || 'hr-sports-inquiries';
export const R2_BUCKET_NAME = R2_INQUIRIES_BUCKET;

// 2. Orders Bucket (confirmed production jobs, station photos, QC proof, final packing photos)
export const R2_ORDERS_BUCKET = process.env.R2_ORDERS_BUCKET_NAME || 'hr-sports-orders';

export interface R2UploadResult {
  success: boolean;
  key: string;
  url?: string;
  error?: string;
}

/**
 * Standard Order Storage Structure:
 * Each order has its own organized directory inside the R2 'orders' bucket:
 *
 * orders/
 *   └── JOB-00270/
 *       ├── cad/          (Vector mockups, CDR, AI, tech-pack PDF)
 *       ├── cutting/      (Optional fabric cutting photo proof)
 *       ├── printing/     (Optional sublimation print photo proof)
 *       ├── heat-press/   (Optional transfer photo proof)
 *       ├── stitching/    (Optional tailoring line photo proof)
 *       ├── qc/           (Quality inspection proof & defect snapshots)
 *       ├── packing/      (Carton & polybag final packing photos)
 *       └── dispatch/     (Air waybill / shipping label picture)
 */
export function buildOrderStorageKey(
  jobNo: number | string,
  stageFolder: 'cad' | 'cutting' | 'printing' | 'heat-press' | 'stitching' | 'qc' | 'packing' | 'dispatch' | 'general',
  filename: string
): string {
  const formattedJob = String(jobNo).padStart(5, '0');
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  return `JOB-${formattedJob}/${stageFolder}/${timestamp}_${cleanFilename}`;
}

/**
 * Uploads raw Buffer to Cloudflare R2 under specific key inside the requested bucket.
 */
export async function uploadBufferToR2(
  key: string,
  buffer: Buffer,
  contentType = 'application/octet-stream',
  bucketName = R2_ORDERS_BUCKET
): Promise<R2UploadResult> {
  try {
    const bucket = bucketName;
    if (!bucket) {
      throw new Error('R2 Bucket is not configured');
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const url = publicBase
      ? `${publicBase.replace(/\/$/, '')}/${key}`
      : `/api/storage/r2?key=${encodeURIComponent(key)}&bucket=${encodeURIComponent(bucketName)}`;

    return {
      success: true,
      key,
      url,
    };
  } catch (err: any) {
    console.error(`[R2 Upload Error] Failed to upload ${key} to ${bucketName}:`, err);
    return {
      success: false,
      key: '',
      error: err?.message || 'Upload failed',
    };
  }
}

/**
 * Uploads a base64 DataURL (from camera snapshot or file upload) directly to the Order folder in R2.
 */
export async function uploadOrderFileToR2(
  jobNo: number | string,
  stage: 'cad' | 'cutting' | 'printing' | 'heat-press' | 'stitching' | 'qc' | 'packing' | 'dispatch' | 'general',
  filename: string,
  dataUrlOrBuffer: string | Buffer,
  contentTypeFallback = 'image/jpeg'
): Promise<R2UploadResult> {
  const key = buildOrderStorageKey(jobNo, stage, filename);

  if (Buffer.isBuffer(dataUrlOrBuffer)) {
    return uploadBufferToR2(key, dataUrlOrBuffer, contentTypeFallback, R2_ORDERS_BUCKET);
  }

  let contentType = contentTypeFallback;
  let base64Data = dataUrlOrBuffer;

  if (dataUrlOrBuffer.includes(';base64,')) {
    const parts = dataUrlOrBuffer.split(';base64,');
    const match = parts[0].match(/:(.*?)$/);
    if (match && match[1]) {
      contentType = match[1];
    }
    base64Data = parts[1];
  }

  const buffer = Buffer.from(base64Data, 'base64');
  return uploadBufferToR2(key, buffer, contentType, R2_ORDERS_BUCKET);
}
