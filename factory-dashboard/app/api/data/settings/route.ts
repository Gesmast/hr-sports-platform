import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const sb = getAdminClient();
    const { data, error } = await sb
      .from('hrsg_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const settingsMap: Record<string, any> = {};
    (data || []).forEach((row: { key: string; value: any }) => {
      try {
        settingsMap[row.key] = typeof row.value === 'string' && (row.value.startsWith('{') || row.value.startsWith('['))
          ? JSON.parse(row.value)
          : row.value;
      } catch {
        settingsMap[row.key] = row.value;
      }
    });

    return NextResponse.json({
      success: true,
      settings: {
        support_email_recipient: settingsMap.support_email_recipient || 'support@thehrsports.com',
        order_stage_notification_rules: settingsMap.order_stage_notification_rules || {
          cutting: { enabled: true, title: 'Fabric Cutting Underway', desc: 'Fabric has been inspected and precision-cut.' },
          printing: { enabled: true, title: 'Printing & Embroidery', desc: 'Custom graphics and embroidery are being applied.' },
          stitching: { enabled: true, title: 'Assembly & Stitching', desc: 'Panels are being assembled and stitched.' },
          qc: { enabled: true, title: 'Quality Inspection', desc: 'Garments are undergoing rigorous seam and print QC.' },
          dispatch: { enabled: true, title: 'Dispatched & Shipped', desc: 'Order packed and handed over to courier.' },
        },
      },
    });
  } catch (err: any) {
    console.error('Unexpected error in settings GET:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { support_email_recipient, order_stage_notification_rules } = body;
    const sb = getAdminClient();

    const updates = [];

    if (support_email_recipient !== undefined) {
      const emailVal = String(support_email_recipient).trim().toLowerCase();
      if (!emailVal || !emailVal.includes('@')) {
        return NextResponse.json({ success: false, error: 'Invalid support email address.' }, { status: 400 });
      }

      updates.push(
        sb.from('hrsg_settings').upsert({
          key: 'support_email_recipient',
          value: emailVal,
          updated_at: new Date().toISOString(),
        })
      );
    }

    if (order_stage_notification_rules !== undefined) {
      const jsonVal = typeof order_stage_notification_rules === 'string'
        ? order_stage_notification_rules
        : JSON.stringify(order_stage_notification_rules);

      updates.push(
        sb.from('hrsg_settings').upsert({
          key: 'order_stage_notification_rules',
          value: jsonVal,
          updated_at: new Date().toISOString(),
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err: any) {
    console.error('Unexpected error in settings PATCH:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
