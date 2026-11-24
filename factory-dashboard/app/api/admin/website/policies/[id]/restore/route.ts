import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { versionId, updatedBy } = body;

    if (!versionId) {
      return NextResponse.json({ error: 'versionId is required' }, { status: 400 });
    }

    // 1. Fetch version
    const { data: targetVersion, error: verErr } = await supabaseAdmin
      .from('policy_versions')
      .select('*')
      .eq('id', versionId)
      .eq('policy_id', id)
      .single();

    if (verErr || !targetVersion) {
      return NextResponse.json({ error: 'Target policy version not found' }, { status: 404 });
    }

    // 2. Fetch current versions count to assign new version number
    const { data: allVersions } = await supabaseAdmin
      .from('policy_versions')
      .select('version_number')
      .eq('policy_id', id);

    const maxVer = (allVersions || []).reduce((m: number, v: any) => Math.max(m, v.version_number || 0), 0);
    const newVersionNumber = maxVer + 1;
    const now = new Date().toISOString();

    // 3. Insert newly restored version as active tip
    await supabaseAdmin.from('policy_versions').insert({
      policy_id: id,
      version_number: newVersionNumber,
      content: targetVersion.content,
      content_hash: targetVersion.content_hash,
      change_summary: `Restored from Version v${targetVersion.version_number}`,
      created_by: updatedBy || null,
      created_at: now,
    });

    // 4. Update policy record
    const { data: updatedPolicy, error: polErr } = await supabaseAdmin
      .from('policies')
      .update({
        content_hash: targetVersion.content_hash,
        content_updated_at: now,
        updated_at: now,
        updated_by: updatedBy || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (polErr) {
      return NextResponse.json({ error: polErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully restored Version v${targetVersion.version_number} (now active as v${newVersionNumber})`,
      policy: updatedPolicy,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
