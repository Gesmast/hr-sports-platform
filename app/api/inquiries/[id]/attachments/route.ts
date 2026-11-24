import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { uploadBufferToR2 } from '@/lib/r2';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';
// Allow larger payloads up to 30MB without Next.js streaming timeout
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userNote = (formData.get('note') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 30MB limit' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch inquiry reference ID
    const { data: inq, error: inqErr } = await adminClient
      .from('inquiries')
      .select('reference_id')
      .eq('id', inquiryId)
      .single();

    if (inqErr || !inq) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    const ref = inq.reference_id || 'DOC';
    const ext = file.name.split('.').pop() || '';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${ref}/${Date.now()}_${safeName}`;

    // Categorize file
    let category = 'other';
    const lowerExt = ext.toLowerCase();
    if (['pdf'].includes(lowerExt)) category = 'tech_pack';
    else if (['ai', 'eps', 'svg', 'psd'].includes(lowerExt)) category = 'vector_artwork';
    else if (['xlsx', 'xls', 'csv'].includes(lowerExt)) category = 'spec_sheet';
    else if (['png', 'jpg', 'jpeg', 'webp'].includes(lowerExt)) category = 'inspiration_image';

    // Fast direct binary upload to Cloudflare R2 (0ms base64 serialization)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const r2Res = await uploadBufferToR2(storagePath, buffer, file.type || 'application/octet-stream');
    if (!r2Res.success) {
      return NextResponse.json({ error: r2Res.error || 'Failed to upload to Cloudflare R2' }, { status: 500 });
    }

    const attachmentRecord = {
      inquiry_id: inquiryId,
      uploaded_by: user.id,
      file_name: file.name,
      file_type: file.type || ext,
      file_size: file.size,
      storage_path: storagePath,
      storage_bucket: 'hr-sports-inquiries',
      file_category: category,
    };

    // Insert into inquiry_attachments and inquiry_messages in parallel
    const [attInsert, msgInsert] = await Promise.all([
      adminClient.from('inquiry_attachments').insert(attachmentRecord).select().single(),
      adminClient.from('inquiry_messages').insert({
        inquiry_id: inquiryId,
        sender_id: user.id,
        sender_type: 'client',
        message_content: userNote.trim() || `[ATTACHMENT] Uploaded file: ${file.name}`,
        attachments: [attachmentRecord],
      }).select().single(),
      adminClient
        .from('inquiries')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', inquiryId),
    ]);

    if (attInsert.error) {
      console.error('[Attachment DB error]:', attInsert.error);
    }

    revalidatePath(`/portal/inquiries/${inquiryId}`);

    return NextResponse.json({
      success: true,
      attachment: attInsert.data || attachmentRecord,
      message: msgInsert.data,
    });
  } catch (err: any) {
    console.error('[Direct Attachment Upload Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal upload error' },
      { status: 500 }
    );
  }
}
