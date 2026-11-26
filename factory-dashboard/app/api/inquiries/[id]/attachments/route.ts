import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToR2 } from '@/lib/r2';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const senderId = formData.get('senderId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `inquiries/${inquiryId}/${Date.now()}-${safeName}`;

    const uploadRes = await uploadBufferToR2(storagePath, buffer, file.type || 'application/octet-stream');

    if (!uploadRes.success) {
      return NextResponse.json({ error: uploadRes.error || 'Failed to upload to storage' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: attachmentRecord, error: dbErr } = await supabase
      .from('inquiry_attachments')
      .insert({
        inquiry_id: inquiryId,
        file_name: file.name,
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/octet-stream',
        uploaded_by: senderId || null,
        file_category: file.type.startsWith('image/') ? 'design_mockup' : 'tech_pack',
      })
      .select()
      .single();

    if (dbErr) {
      console.error('Database attachment record error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      attachment: attachmentRecord || {
        file_name: file.name,
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.type,
      },
      url: `/api/storage/r2?key=${encodeURIComponent(storagePath)}`,
    });
  } catch (err: any) {
    console.error('Attachment upload error in factory dashboard:', err);
    return NextResponse.json({ error: err?.message || 'Server error uploading file' }, { status: 500 });
  }
}
