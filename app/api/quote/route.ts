import { NextRequest, NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/schemas/quote';
import { db } from '@/lib/db';
import { emailService } from '@/lib/resend';
import { uploadBase64ToR2, uploadBufferToR2, getNextInquiryNumber } from '@/lib/r2';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';
import { formatInquiryCode } from '@/lib/utils';

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
    const inquiry = await db.saveQuoteInquiry({
      ...payload,
      inquiry_code: inquiryCode,
      r2_folder: `${inquiryCode}/`,
      r2_files: r2UploadedFiles,
    } as any);

    // 5. Dispatch Transactional Emails
    const [clientEmailRes, adminEmailRes] = await Promise.allSettled([
      emailService.sendQuoteConfirmation(payload, inquiryCode),
      emailService.sendAdminNotification(payload, inquiryCode),
    ]);

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

