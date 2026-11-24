'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { platformEmails } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// -------------------------------------------------------------
// 1. Profile Actions
// -------------------------------------------------------------
export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const isGoogle = user.app_metadata?.provider === 'google' || 
                   user.identities?.some((id: any) => id.provider === 'google') || 
                   Boolean((user.user_metadata as any)?.iss?.includes('google'));

  const googleAvatar = (user.user_metadata as any)?.avatar_url || (user.user_metadata as any)?.picture || null;
  const avatarUrl = profile?.avatar_url || googleAvatar || null;

  return {
    ...profile,
    email: profile?.email || user.email,
    authEmail: user.email,
    isGoogle,
    provider: isGoogle ? 'google' : 'email',
    avatar_url: avatarUrl,
    googleAvatar,
  };
}

export async function updateUserAvatar(avatarUrl: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Also sync with auth user_metadata
  await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl }
  });

  revalidatePath('/portal', 'layout');
  revalidatePath('/portal/profile');
  return { success: true };
}

export async function changePasswordInPortal(formData: FormData): Promise<ActionResponse> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New passwords do not match.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // If current password provided, verify it first
  if (currentPassword && user.email) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      return { success: false, error: 'Current password is incorrect.' };
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

export async function sendPasswordResetFromPortal(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { success: false, error: 'Unauthorized or missing email.' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateUserProfile(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const fullName = formData.get('fullName') as string;
  const companyName = formData.get('companyName') as string;
  const phone = formData.get('phone') as string;
  const street = formData.get('street') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postalCode = formData.get('postalCode') as string;
  const country = formData.get('country') as string;

  const shippingAddress = {
    street: street || '',
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',
    country: country || '',
  };

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      company_name: companyName,
      phone,
      shipping_address: shippingAddress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/portal/profile');
  return { success: true };
}

// -------------------------------------------------------------
// 2. Inquiries Actions
// -------------------------------------------------------------
export async function getUserInquiries() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { currentInquiries: [], pastInquiries: [] };

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      quotes:quotes(
        id,
        quote_number,
        version,
        unit_price,
        moq,
        lead_time,
        valid_until,
        status,
        terms_notes,
        created_at,
        price_tiers:quote_price_tiers(*)
      ),
      attachments:inquiry_attachments(*),
      messages:inquiry_messages(id)
    `)
    .order('created_at', { ascending: false });

  if (error || !inquiries) return { currentInquiries: [], pastInquiries: [] };

  const now = new Date();

  // Categorize inquiries based on status and 7-day inactivity rule
  const currentInquiries: any[] = [];
  const pastInquiries: any[] = [];

  for (const inquiry of inquiries) {
    const activeQuote = inquiry.quotes?.find((q: any) => q.status === 'active');
    const isQuoteExpired = activeQuote && new Date(activeQuote.valid_until) < now;

    // Inactivity check: if company sent a quote and user hasn't acted in 7 days
    const lastActivity = new Date(inquiry.last_activity_at || inquiry.created_at);
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    const isPast =
      inquiry.status === 'converted' ||
      inquiry.status === 'past_inactive' ||
      inquiry.status === 'expired' ||
      isQuoteExpired ||
      (inquiry.status === 'quoted' && daysSinceActivity > 7);

    if (isPast) {
      pastInquiries.push({ ...inquiry, isQuoteExpired });
    } else {
      currentInquiries.push({ ...inquiry, isQuoteExpired });
    }
  }

  return { currentInquiries, pastInquiries };
}

export async function getInquiryDetails(inquiryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      quotes:quotes(
        id,
        quote_number,
        version,
        unit_price,
        moq,
        lead_time,
        valid_until,
        status,
        terms_notes,
        created_at,
        price_tiers:quote_price_tiers(*)
      ),
      attachments:inquiry_attachments(*),
      messages:inquiry_messages(
        id,
        sender_id,
        sender_type,
        message_content,
        created_at,
        attachments,
        is_read,
        read_at,
        read_by_role,
        sender:profiles!inquiry_messages_sender_id_fkey(full_name, company_name)
      )
    `)
    .eq('id', inquiryId)
    .single();

  if (error || !inquiry) {
    if (error) console.error('getInquiryDetails error:', error.message, error.hint);
    return null;
  }

  // Strictly only the assigned Designer ('usman') or Accounts ('umair') triggers read receipt (Blue Tick)
  // The Owner ('owner' - reviewer) and Operations Coordinator ('hamza') do NOT trigger the blue tick.
  const { data: viewerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (viewerProfile && (viewerProfile.role === 'usman' || viewerProfile.role === 'umair')) {
    await supabase.rpc('mark_inquiry_messages_read', {
      p_inquiry_id: inquiryId,
      p_staff_id: user.id,
      p_role: viewerProfile.role,
    });
  }

  // Sort messages chronologically
  if (inquiry.messages) {
    inquiry.messages.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  // Sort quotes by version descending (latest first)
  if (inquiry.quotes) {
    inquiry.quotes.sort((a: any, b: any) => b.version - a.version);
  }

  return inquiry;
}

export async function sendInquiryMessage(
  inquiryId: string,
  content: string,
  attachments: any[] = []
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  if (!content.trim() && (!attachments || attachments.length === 0)) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  const { error: msgErr } = await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiryId,
    sender_id: user.id,
    sender_type: 'client',
    message_content: content.trim(),
    attachments: attachments || [],
  });

  if (msgErr) return { success: false, error: msgErr.message };

  // Update inquiry last activity timestamp
  await supabase
    .from('inquiries')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', inquiryId);

  // Dispatch in-dashboard notifications for staff (no emails to staff)
  try {
    const adminClient = createAdminClient();
    const { data: inq } = await adminClient
      .from('inquiries')
      .select('reference_id, client_party, club_name, assigned_designer_id')
      .eq('id', inquiryId)
      .maybeSingle();

    const { data: senderProfile } = await adminClient
      .from('profiles')
      .select('full_name, company_name')
      .eq('id', user.id)
      .maybeSingle();

    const clientName = senderProfile?.full_name || inq?.client_party || 'Customer';
    const company = senderProfile?.company_name || inq?.club_name || 'Client';
    const ref = inq?.reference_id || 'INQ';

    const notifs = [];

    if (inq?.assigned_designer_id) {
      // 1. Direct notification to the assigned CAD designer
      notifs.push({
        target_role: 'usman',
        target_user_id: inq.assigned_designer_id,
        event_type: 'client_message',
        inquiry_id: inquiryId,
        request_no: ref,
        customer_name: clientName,
        company_name: company,
        title: `1 new message from ${clientName}`,
        message: `Client replied on Inquiry #${ref} (${company}): "${content.trim().slice(0, 75)}${content.trim().length > 75 ? '...' : ''}"`,
        is_urgent: false,
      });
    } else {
      // 2. Unassigned inquiry: Coordinator receives triage notice
      notifs.push({
        target_role: 'hamza',
        event_type: 'client_message',
        inquiry_id: inquiryId,
        request_no: ref,
        customer_name: clientName,
        company_name: company,
        title: `Client Reply on Unassigned Inquiry #${ref}`,
        message: `Client ${clientName} (${company}) sent a message on Inquiry #${ref}. No designer assigned yet.`,
        is_urgent: true,
      });
    }

    if (notifs.length > 0) {
      await adminClient.from('notifications').insert(notifs);
    }

    await adminClient.from('notifications').insert(notifs);
  } catch (notifErr) {
    console.error('Failed to dispatch client message notification:', notifErr);
  }

  revalidatePath(`/portal/inquiries/${inquiryId}`);
  return { success: true };
}

export async function uploadInquiryAttachment(
  inquiryId: string,
  attachment: {
    fileName: string;
    fileType: string;
    fileSize?: number;
    storagePath?: string;
    fileCategory?: string;
    base64Data?: string;
  }
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const adminClient = createAdminClient();
  const { data: inq } = await adminClient
    .from('inquiries')
    .select('reference_id')
    .eq('id', inquiryId)
    .single();

  const ref = inq?.reference_id || 'DOC';
  const safeName = attachment.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = attachment.storagePath || `${ref}/${Date.now()}_${safeName}`;

  if (attachment.base64Data) {
    const { uploadBase64ToR2 } = await import('@/lib/r2');
    const r2Res = await uploadBase64ToR2(storagePath, attachment.base64Data, attachment.fileType);
    if (!r2Res.success) {
      return { success: false, error: r2Res.error || 'Failed to upload to Cloudflare R2' };
    }
  }

  const attachmentRecord = {
    inquiry_id: inquiryId,
    uploaded_by: user.id,
    file_name: attachment.fileName,
    file_type: attachment.fileType,
    file_size: attachment.fileSize || null,
    storage_path: storagePath,
    storage_bucket: 'hr-sports-inquiries',
    file_category: attachment.fileCategory || 'tech_pack',
  };

  const { data: insertedRecord, error } = await adminClient
    .from('inquiry_attachments')
    .insert(attachmentRecord)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Update inquiry last activity timestamp
  await adminClient
    .from('inquiries')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', inquiryId);

  revalidatePath(`/portal/inquiries/${inquiryId}`);
  return { success: true, data: insertedRecord || attachmentRecord };
}

export async function reviseInquiry(
  inquiryId: string,
  revised: {
    quantity: number;
    fabricSpec?: string;
    customSpecNotes?: string;
    garmentType?: string;
  }
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch current inquiry details
  const { data: currentInq } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', inquiryId)
    .single();

  if (!currentInq) return { success: false, error: 'Inquiry not found' };

  // 1. Mark existing active quotes as 'superseded'
  await supabase
    .from('quotes')
    .update({ status: 'superseded' })
    .eq('inquiry_id', inquiryId)
    .eq('status', 'active');

  const updatedMetadata = {
    ...(currentInq.inquiry_metadata || {}),
    fabric_type: revised.fabricSpec || currentInq.fabric_spec,
    volumeMOQ: revised.quantity,
    client_spec_changed: true,
    under_review: true,
    client_spec_change_time: new Date().toISOString(),
    client_spec_change_summary: `Quantity: ${revised.quantity} units, Fabric: ${revised.fabricSpec || 'Custom'}${revised.customSpecNotes ? `, Notes: ${revised.customSpecNotes}` : ''}`,
  };

  // 2. Update inquiry specifications and set status to 'pending' (pending quotation to accounts)
  const { error: inqErr } = await supabase
    .from('inquiries')
    .update({
      quantity: revised.quantity,
      fabric_spec: revised.fabricSpec || currentInq.fabric_spec,
      garment_type: revised.garmentType || currentInq.garment_type,
      custom_spec_notes: revised.customSpecNotes || currentInq.custom_spec_notes,
      status: 'pending',
      inquiry_metadata: updatedMetadata,
      last_activity_at: new Date().toISOString(),
      last_customer_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', inquiryId);

  if (inqErr) return { success: false, error: inqErr.message };

  // 3. Insert system audit notice into thread
  await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiryId,
    sender_id: user.id,
    sender_type: 'client',
    message_content: `[CHANGES UNDER REVIEW] Revised requirements submitted by client: Quantity: ${revised.quantity} units${
      revised.fabricSpec ? `, Fabric: ${revised.fabricSpec}` : ''
    }${revised.customSpecNotes ? `, Notes: ${revised.customSpecNotes}` : ''}. Pending quotation from Accounts.`,
  });

  // 4. Trigger company dashboard notifications for Account & Designer
  try {
    const adminClient = createAdminClient();
    await adminClient.from('notifications').insert([
      {
        target_role: 'accounts',
        target_user_id: currentInq.assigned_accounts_id || null,
        event_type: 'client_spec_changed',
        inquiry_id: inquiryId,
        request_no: currentInq.reference_id,
        message: `Client requested quote revision for ${currentInq.reference_id}: ${currentInq.garment_type} (${revised.quantity} units, ${revised.fabricSpec || 'Custom'}). Commercial quote pending from Account.`,
        is_urgent: true,
      },
      {
        target_role: 'designer',
        target_user_id: currentInq.assigned_designer_id || null,
        event_type: 'client_spec_changed',
        inquiry_id: inquiryId,
        request_no: currentInq.reference_id,
        message: `Client updated specifications for ${currentInq.reference_id}: ${currentInq.garment_type} (${revised.quantity} units, ${revised.fabricSpec || 'Custom Blend'}). Reviewed by Designer.`,
        is_urgent: false,
      }
    ]);
  } catch (notifErr) {
    console.error('Account & Designer notification dispatch error:', notifErr);
  }

  revalidatePath(`/portal/inquiries/${inquiryId}`);
  revalidatePath('/portal/inquiries');
  return { success: true };
}

// -------------------------------------------------------------
// 3. Shared Inquiry to Order Conversion Action
// Designed to be called by both client portal and company portal
// -------------------------------------------------------------
export async function convertInquiryToOrder(
  inquiryId: string,
  quoteId: string,
  convertedByRole: 'client' | 'company' = 'client'
): Promise<ActionResponse<{ orderId: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Fetch inquiry and quote
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('*, profile:profiles(*)')
    .eq('id', inquiryId)
    .single();

  if (!inquiry) return { success: false, error: 'Inquiry not found.' };

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, price_tiers:quote_price_tiers(*)')
    .eq('id', quoteId)
    .single();

  if (!quote) return { success: false, error: 'Quote not found.' };

  // Check validity
  if (new Date(quote.valid_until) < new Date() && convertedByRole === 'client') {
    return { success: false, error: 'This quote has expired. Please request an updated quote.' };
  }

  // 2. Generate unique order number (e.g. ORD-2026-XXXXX)
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `ORD-2026-${randomSuffix}`;

  // 3. Calculate unit price based on tier if applicable
  let applicableUnitPrice = Number(quote.unit_price);
  if (quote.price_tiers && quote.price_tiers.length > 0) {
    const qty = inquiry.quantity;
    const matchingTier = quote.price_tiers.find(
      (t: any) => qty >= t.min_quantity && (!t.max_quantity || qty <= t.max_quantity)
    );
    if (matchingTier) {
      applicableUnitPrice = Number(matchingTier.unit_price);
    }
  }

  const totalAmount = applicableUnitPrice * Number(inquiry.quantity);

  // Default shipping address from profile or placeholder
  const shippingAddress = inquiry.profile?.shipping_address || {
    street: 'Pending Address Confirmation',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  };

  // 4. Create Order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: inquiry.user_id,
      inquiry_id: inquiry.id,
      quote_id: quote.id,
      order_status: 'in_production',
      total_quantity: inquiry.quantity,
      unit_price: applicableUnitPrice,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      spec_summary: {
        garment_type: inquiry.garment_type,
        fabric_spec: inquiry.fabric_spec,
        custom_spec_notes: inquiry.custom_spec_notes,
        lead_time: quote.lead_time,
        moq: quote.moq,
        terms_notes: quote.terms_notes,
      },
      pdf_url: inquiry.pdf_url,
    })
    .select()
    .single();

  if (orderErr || !order) {
    return { success: false, error: orderErr?.message || 'Failed to create order.' };
  }

  // 5. Populate the 5 process tracking stages (matching homepage direct factory protocol)
  const nowStr = new Date().toISOString();
  const stagesToInsert = [
    {
      order_id: order.id,
      stage_index: 1,
      stage_key: 'order_confirmed',
      stage_name: 'Order Confirmed & CAD Pattern Grading',
      status: 'complete',
      reached_at: nowStr,
      notes: 'Commercial specification signed off. 3D CAD pattern graded to size chart specifications.',
      images: [],
    },
    {
      order_id: order.id,
      stage_index: 2,
      stage_key: 'fabric_cutting',
      stage_name: 'Fabric Sourcing & Laser Cutting',
      status: 'in_progress',
      reached_at: nowStr,
      notes: 'Performance fabric lots inspected for GSM & stretch recovery. CNC laser cutting underway.',
      images: [],
    },
    {
      order_id: order.id,
      stage_index: 3,
      stage_key: 'printing_assembly',
      stage_name: 'Sublimation Printing & Flatlock Assembly',
      status: 'pending',
      notes: 'High-density 1200 DPI sublimation printing and 6-needle flatlock seam stitching.',
      images: [],
    },
    {
      order_id: order.id,
      stage_index: 4,
      stage_key: 'quality_packing',
      stage_name: 'AQL 1.0 Quality Check & Export Packing',
      status: 'pending',
      notes: 'Individual polybagging, barcode verification, and reinforced master carton sealing.',
      images: [],
    },
    {
      order_id: order.id,
      stage_index: 5,
      stage_key: 'shipped',
      stage_name: 'Dispatched & International Delivery',
      status: 'pending',
      notes: 'Dispatched via express air freight with end-to-end tracking.',
      images: [],
    },
  ];

  await supabase.from('order_tracking_stages').insert(stagesToInsert);

  // 6. Update Quote status to accepted & Inquiry to converted
  await supabase.from('quotes').update({ status: 'accepted' }).eq('id', quote.id);
  await supabase
    .from('inquiries')
    .update({
      status: 'converted',
      last_activity_at: nowStr,
      updated_at: nowStr,
    })
    .eq('id', inquiry.id);

  // 7. Add thread notice
  await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiry.id,
    sender_id: user.id,
    sender_type: 'client',
    message_content: `[ORDER CREATED] Converted to Factory Production Order #${orderNumber} at $${applicableUnitPrice.toFixed(2)}/unit (Total: $${totalAmount.toFixed(2)}). Production stages initiated.`,
  });

  // 8. Trigger customer order confirmation email from order@thehrsports.com
  try {
    const customerEmail = (inquiry as any).contact_email || user.email;
    const customerName = (inquiry as any).client_party || 'Customer';
    if (customerEmail) {
      await platformEmails.sendOrderCreated({
        to: customerEmail,
        clientName: customerName,
        orderNumber,
        productName: inquiry.garment_type || 'Custom Apparel',
        totalQuantity: Number(inquiry.quantity) || 0,
        totalAmount: `$${totalAmount.toFixed(2)}`,
      });
    }
  } catch (emailErr) {
    console.error('Order creation email dispatch error:', emailErr);
  }

  // 9. Insert in-dashboard notifications for staff (No price leaks to mubasher/floor!)
  try {
    const adminClient = createAdminClient();
    await adminClient.from('notifications').insert([
      {
        target_role: 'owner',
        event_type: 'order_created',
        inquiry_id: inquiry.id,
        request_no: inquiry.reference_id,
        customer_name: (inquiry as any).client_party || 'Customer',
        company_name: (inquiry as any).club_name || 'HR Sports',
        title: `New Production Order #${orderNumber}`,
        message: `Inquiry #${inquiry.reference_id} converted to Order #${orderNumber} (${inquiry.garment_type}, ${inquiry.quantity} pcs, Total: $${totalAmount.toFixed(2)}).`,
        is_urgent: true,
      },
      {
        target_role: 'hamza',
        event_type: 'order_created',
        inquiry_id: inquiry.id,
        request_no: inquiry.reference_id,
        customer_name: (inquiry as any).client_party || 'Customer',
        company_name: (inquiry as any).club_name || 'HR Sports',
        title: `New Production Order #${orderNumber}`,
        message: `Inquiry #${inquiry.reference_id} converted to Order #${orderNumber} (${inquiry.garment_type}, ${inquiry.quantity} pcs). Scheduled for production allotment.`,
        is_urgent: true,
      },
      {
        target_role: 'umair',
        event_type: 'order_created',
        inquiry_id: inquiry.id,
        request_no: inquiry.reference_id,
        customer_name: (inquiry as any).client_party || 'Customer',
        company_name: (inquiry as any).club_name || 'HR Sports',
        title: `New Commercial Order #${orderNumber}`,
        message: `Order #${orderNumber} confirmed at $${applicableUnitPrice.toFixed(2)}/unit (Total: $${totalAmount.toFixed(2)}). Commercial billing ready.`,
        is_urgent: true,
      },
      {
        target_role: 'mubasher',
        event_type: 'order_created',
        inquiry_id: inquiry.id,
        request_no: inquiry.reference_id,
        customer_name: (inquiry as any).client_party || 'Customer',
        company_name: (inquiry as any).club_name || 'HR Sports',
        title: `Job Ready: Order #${orderNumber}`,
        message: `Production Order #${orderNumber} released to manufacturing floor (${inquiry.garment_type}, ${inquiry.quantity} pcs).`,
        is_urgent: false,
      },
    ]);
  } catch (notifErr) {
    console.error('Order creation in-dashboard notification dispatch error:', notifErr);
  }

  revalidatePath('/portal');
  revalidatePath('/portal/orders');
  revalidatePath('/portal/inquiries');
  revalidatePath(`/portal/inquiries/${inquiryId}`);

  return { success: true, data: { orderId: order.id } };
}

// -------------------------------------------------------------
// 4. Orders Actions
// -------------------------------------------------------------
export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      tracking_stages:order_tracking_stages(*)
    `)
    .order('created_at', { ascending: false });

  if (error || !orders) return [];

  // Sort tracking stages by stage_index
  orders.forEach((o: any) => {
    if (o.tracking_stages) {
      o.tracking_stages.sort((a: any, b: any) => a.stage_index - b.stage_index);
    }
  });

  return orders;
}

export async function getOrderDetails(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      inquiry:inquiries(reference_id, garment_type),
      quote:quotes(quote_number, lead_time),
      tracking_stages:order_tracking_stages(*)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) return null;

  if (order.tracking_stages) {
    order.tracking_stages.sort((a: any, b: any) => a.stage_index - b.stage_index);
  }

  return order;
}

