import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 Client configured using the S3-compatible API.
 * S3 SDK v3 requires region: 'auto' for Cloudflare R2.
 */
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});


export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'hr-sports-inquiries';

export interface R2UploadResult {
  success: boolean;
  key: string;
  url?: string;
  error?: string;
}

/**
 * Uploads raw Buffer to Cloudflare R2 under specific key (folder/filename).
 */
export async function uploadBufferToR2(
  key: string,
  buffer: Buffer,
  contentType = 'application/octet-stream'
): Promise<R2UploadResult> {
  try {
    const bucket = R2_BUCKET_NAME;
    if (!bucket) {
      throw new Error('R2_BUCKET_NAME is not configured');
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const url = publicBase ? `${publicBase.replace(/\/$/, '')}/${key}` : undefined;

    return {
      success: true,
      key,
      url,
    };
  } catch (err: any) {
    console.error(`[R2 Upload Error] Failed to upload ${key}:`, err);
    return {
      success: false,
      key,
      error: err?.message || 'Unknown R2 upload error',
    };
  }
}

/**
 * Uploads a base64 DataURL (e.g. data:application/vnd.openxmlformats-officedocument...;base64,...)
 * to Cloudflare R2 under specific key.
 */
export async function uploadBase64ToR2(
  key: string,
  dataUrl: string,
  fallbackContentType = 'application/octet-stream'
): Promise<R2UploadResult> {
  try {
    let contentType = fallbackContentType;
    let base64Data = dataUrl;

    if (dataUrl.includes(';base64,')) {
      const parts = dataUrl.split(';base64,');
      const match = parts[0].match(/:(.*?)$/);
      if (match && match[1]) {
        contentType = match[1];
      }
      base64Data = parts[1];
    }

    const buffer = Buffer.from(base64Data, 'base64');
    return await uploadBufferToR2(key, buffer, contentType);
  } catch (err: any) {
    console.error(`[R2 Base64 Upload Error] Failed to upload ${key}:`, err);
    return {
      success: false,
      key,
      error: err?.message || 'Unknown Base64 decoding/upload error',
    };
  }
}

/**
 * Scans the R2 bucket to determine the next sequential inquiry code for a specific country,
 * starting from 1 (e.g. "PAK-00001", "USA-00001").
 * Looks at common prefixes (folders) matching {COUNTRY}-{5digits}.
 */
export async function getNextInquiryNumber(country = 'PK'): Promise<string> {
  const { getCountryAlpha3, formatInquiryCode } = await import('@/lib/utils');
  const c3 = getCountryAlpha3(country);

  try {
    const bucket = R2_BUCKET_NAME;
    if (!bucket) {
      return formatInquiryCode(c3, 1);
    }

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${c3}-`,
      Delimiter: '/',
      MaxKeys: 1000,
    });

    const res = await r2Client.send(command);
    let highestNum = 0;

    const regex = new RegExp(`^${c3}-(\\d{5})$`, 'i');

    if (res.CommonPrefixes) {
      for (const prefixObj of res.CommonPrefixes) {
        const folder = prefixObj.Prefix?.replace(/\/$/, '') || '';
        const match = folder.match(regex);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > highestNum) {
            highestNum = num;
          }
        }
      }
    }

    const nextNum = highestNum + 1;
    return formatInquiryCode(c3, nextNum);
  } catch (err) {
    console.error('[R2 getNextInquiryNumber Warning]:', err);
    return formatInquiryCode(c3, 1);
  }
}


