import { NextRequest, NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/schemas/quote';
import { db } from '@/lib/db';
import { platformEmails, EmailAttachment } from '@/lib/email';
import { uploadBase64ToR2, uploadBufferToR2, getNextInquiryNumber, getPresignedDownloadUrl } from '@/lib/r2';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';
import { formatInquiryCode } from '@/lib/utils';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Strict Server-Side Zod Validation
    const validation = quoteSchema.safeParse(body);
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

    // 2. Determine the inquiry code (e.g. PAK-00001)
    const clientCode = payload.inquiry_code;
    const isValidCode = clientCode && /^[A-Z]{3}-\d{5}$/i.test(clientCode);
    const countryParam = payload.country || payload.team_country_name || 'PK';
    const inquiryCode = isValidCode ? clientCode.toUpperCase() : await getNextInquiryNumber(countryParam);

    const r2UploadedFiles: Record<string, string> = {};

    // 3. Process R2 Folder Uploads: hr-sports-inquiries/{inquiryCode}/...
    try {
      // (a) Player Customization Excel Sheet (from Step 2)
      if (payload.roster_excel_file) {
        const rawFileName = payload.roster_excel_file_name || 'roster.xlsx';
        const sanitizedFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const excelKey = `${inquiryCode}/${sanitizedFileName}`;
        
        const res = await uploadBase64ToR2(
          excelKey,
          payload.roster_excel_file,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        if (res.success) {
          r2UploadedFiles['roster_excel'] = excelKey;
        }
      }

      // (b) Step 3: Design Files (Branch A: Completed Mockup / Tech Pack)
      if (payload.design?.uploaded_files && payload.design.uploaded_files.length > 0) {
        for (let i = 0; i < payload.design.uploaded_files.length; i++) {
          const fileData = payload.design.uploaded_files[i];
          if (fileData) {
            const key = `${inquiryCode}/designs/design_pack_${i + 1}`;
            const res = await uploadBase64ToR2(key, fileData);
            if (res.success) {
              r2UploadedFiles[`design_${i + 1}`] = key;
            }
          }
        }
      }

      // (c) Step 3: Brand Guidelines File (Branch B)
      if (payload.design?.brief?.brand_guidelines_file) {
        const key = `${inquiryCode}/brief/brand_guidelines`;
        const res = await uploadBase64ToR2(key, payload.design.brief.brand_guidelines_file);
        if (res.success) {
          r2UploadedFiles['brand_guidelines'] = key;
        }
      }

      // (d) Step 3: Inspiration Images (Branch B)
      if (payload.design?.brief?.inspiration_images && payload.design.brief.inspiration_images.length > 0) {
        for (let i = 0; i < payload.design.brief.inspiration_images.length; i++) {
          const imgData = payload.design.brief.inspiration_images[i];
          if (imgData) {
            const key = `${inquiryCode}/brief/inspiration_${i + 1}.jpg`;
            const res = await uploadBase64ToR2(key, imgData, 'image/jpeg');
            if (res.success) {
              r2UploadedFiles[`inspiration_${i + 1}`] = key;
            }
          }
        }
      }

      // (e) Step 3: Garment Logo Placements
      if (payload.garments && payload.garments.length > 0) {
        for (const [gIdx, garment] of payload.garments.entries()) {
          if (garment.logo_placements && garment.logo_placements.length > 0) {
            for (const placement of garment.logo_placements) {
              if (placement.image_url && placement.image_url.startsWith('data:')) {
                const safeSlot = (placement.slot || 'slot').replace(/[^a-zA-Z0-9_-]/g, '_');
                const key = `${inquiryCode}/logos/garment_${gIdx + 1}_${safeSlot}.png`;
                const res = await uploadBase64ToR2(key, placement.image_url, 'image/png');
                if (res.success) {
                  r2UploadedFiles[`logo_${gIdx + 1}_${safeSlot}`] = key;
                }
              }
            }
          }
        }
      }

      // (f) Auto-generate Technical Spec Sheet PDF and upload to R2
      try {
        const doc = await generateQuoteSpecPdf(payload, inquiryCode);
        const pdfArrayBuffer = doc.output('arraybuffer');
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        const pdfKey = `${inquiryCode}/specification-${inquiryCode}.pdf`;
        const pdfRes = await uploadBufferToR2(pdfKey, pdfBuffer, 'application/pdf');
        if (pdfRes.success) {
          r2UploadedFiles['specification_pdf'] = pdfKey;
        }
      } catch (pdfErr) {
        console.error('[PDF Generation/Upload Warning]:', pdfErr);
      }
    } catch (r2Err) {
      console.error('[R2 Storage Pipeline Warning]:', r2Err);
      // Non-blocking so inquiry logging is not interrupted if credentials are in sandbox
    }

    // 4. Persist in database with 8-digit inquiry code and R2 file records
    let supabaseInquiryId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const adminClient = createAdminClient();

      let targetUserId = user?.id || null;
      if (!targetUserId && payload.contactEmail) {
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('email', payload.contactEmail)
          .maybeSingle();
        if (profile) targetUserId = profile.id;
      }

      const pdfUrl = r2UploadedFiles['specification_pdf']
        ? `${process.env.R2_ENDPOINT || ''}/${r2UploadedFiles['specification_pdf']}`
        : null;

      const { data: insertedInquiry } = await adminClient
        .from('inquiries')
        .insert({
          reference_id: inquiryCode,
          user_id: targetUserId,
          contact_email: payload.contactEmail,
          garment_type: payload.garmentType || payload.uniform_type || payload.sport || 'Custom Garment Spec',
          quantity: payload.volumeMOQ || 100,
          fabric_spec: payload.fabric_type || payload.fabric_family || payload.materialVariant || '',
          target_price: (payload as any).targetPrice ? Number((payload as any).targetPrice) : null,
          custom_spec_notes: payload.designNotes || payload.logo_placement_note || '',
          status: 'pending',
          pdf_url: pdfUrl,
          inquiry_metadata: payload,
        })
        .select()
        .single();

      if (insertedInquiry) {
        supabaseInquiryId = insertedInquiry.id;

        if (targetUserId && Object.keys(r2UploadedFiles).length > 0) {
          const attachmentsToInsert: any[] = [];
          for (const [key, path] of Object.entries(r2UploadedFiles)) {
            attachmentsToInsert.push({
              inquiry_id: insertedInquiry.id,
              uploaded_by: targetUserId,
              file_name: path.split('/').pop() || key,
              file_type: key.includes('pdf') ? 'application/pdf' : key.includes('excel') ? 'application/vnd.ms-excel' : 'image/png',
              storage_path: path,
              storage_bucket: 'hr-sports-inquiries',
              file_category: key.includes('pdf') ? 'spec_sheet' : key.includes('excel') ? 'spec_sheet' : 'tech_pack',
            });
          }
          await adminClient.from('inquiry_attachments').insert(attachmentsToInsert);
        }
      }
    } catch (supaErr) {
      console.error('[Supabase Inquiry Persist Warning]:', supaErr);
    }

    const inquiry = await db.saveQuoteInquiry({
      ...payload,
      inquiry_code: inquiryCode,
      r2_folder: `${inquiryCode}/`,
      r2_files: r2UploadedFiles,
    } as any);

    // 5. Build Attachments / Expiring Cloudflare R2 Links for Customer Confirmation
    const clientAttachments: EmailAttachment[] = [];
    const expiringFileLinks: Array<{ name: string; url: string; sizeMb: string }> = [];

    let totalSizeBytes = 0;
    if (payload.designFiles && Array.isArray(payload.designFiles)) {
      for (const f of payload.designFiles) {
        totalSizeBytes += f.sizeBytes || 0;
      }
    }

    const SAFE_ATTACHMENT_LIMIT = 15 * 1024 * 1024; // 15 MB
    for (const [key, path] of Object.entries(r2UploadedFiles)) {
      const fileName = path.split('/').pop() || `${key}.pdf`;
      if (totalSizeBytes > 0 && totalSizeBytes <= SAFE_ATTACHMENT_LIMIT) {
        // Can be attached directly or downloaded via signed link
      }
      try {
        const presignedUrl = await getPresignedDownloadUrl(path, 7 * 86400); // 7-day secure link
        if (presignedUrl) {
          expiringFileLinks.push({
            name: fileName,
            url: presignedUrl,
            sizeMb: 'Attached',
          });
        }
      } catch (presignErr) {
        console.warn('[R2 Presign Warning]:', presignErr);
      }
    }

    // 6. Send Customer Inquiry Confirmation (Sender: inquiry@thehrsports.com, No-Reply)
    try {
      await platformEmails.sendInquiryConfirmation({
        referenceId: inquiryCode,
        clientName: payload.companyName || payload.order_by || 'Valued Customer',
        contactEmail: payload.contactEmail,
        garmentType: payload.garmentType || payload.uniform_type || 'Custom Garment Spec',
        quantity: Number(payload.volumeMOQ) || 100,
        fabricSpec: payload.fabric_type || payload.materialVariant || 'Standard Technical Fabric',
        targetDate: payload.targetDeliveryDate,
        attachedFilesCount: Object.keys(r2UploadedFiles).length,
        expiringFileLinks: expiringFileLinks.length > 0 ? expiringFileLinks : undefined,
      }, clientAttachments.length > 0 ? clientAttachments : undefined);
    } catch (emailErr) {
      console.error('[Inquiry Email Error]:', emailErr);
    }

    // 7. In-Dashboard Realtime Notifications for Factory Staff (Replaces Admin Email per Change 6)
    try {
      const adminClient = createAdminClient();
      const customerName = payload.companyName || payload.order_by || 'Customer';
      const notificationTitle = `New B2B Inquiry #${inquiryCode}`;
      const notificationMsg = `${customerName} submitted a new inquiry for ${payload.volumeMOQ || 100} units of ${payload.garmentType || 'custom apparel'}.`;

      // Notify Owner and Operations Coordinator in dashboard
      await adminClient.from('notifications').insert([
        {
          target_role: 'owner',
          event_type: 'inquiry_created',
          title: notificationTitle,
          message: notificationMsg,
          customer_name: customerName,
          company_name: payload.companyName || null,
          inquiry_id: supabaseInquiryId || null,
          request_no: inquiryCode,
          is_urgent: false,
        },
        {
          target_role: 'hamza',
          event_type: 'inquiry_created',
          title: notificationTitle,
          message: notificationMsg,
          customer_name: customerName,
          company_name: payload.companyName || null,
          inquiry_id: supabaseInquiryId || null,
          request_no: inquiryCode,
          is_urgent: false,
        },
      ]);
    } catch (notifErr) {
      console.warn('[Dashboard Notification Error]:', notifErr);
    }

    return NextResponse.json(
      {
        success: true,
        referenceId: inquiryCode,
        inquiryId: inquiry.id,
        r2Folder: `${inquiryCode}/`,
        r2Files: r2UploadedFiles,
        message: `Inquiry processed and logged successfully. R2 folder created: ${inquiryCode}/`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error handling /api/quote:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while processing quote intake',
      },
      { status: 500 }
    );
  }
}

