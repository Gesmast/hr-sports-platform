import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function computeContentHash(content: string): string {
  const normalized = content.trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: policy, error } = await supabaseAdmin
      .from('policies')
      .select(`
        id,
        slug,
        title,
        status,
        content_hash,
        content_updated_at,
        created_at,
        updated_at,
        updated_by,
        policy_versions (
          id,
          version_number,
          content,
          content_hash,
          change_summary,
          created_at,
          created_by
        )
      `)
      .eq('id', id)
      .single();

    if (error || !policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const versions = policy.policy_versions || [];
    const sortedVersions = [...versions].sort((a: any, b: any) => b.version_number - a.version_number);
    const latestVersion = sortedVersions[0] || null;

    return NextResponse.json({
      policy: {
        id: policy.id,
        slug: policy.slug,
        title: policy.title,
        status: policy.status,
        contentHash: policy.content_hash,
        contentUpdatedAt: policy.content_updated_at,
        updatedAt: policy.updated_at,
        currentContent: latestVersion?.content || '',
        versionCount: versions.length,
        versions: sortedVersions,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, status, changeSummary, updatedBy } = body;

    // 1. Fetch current policy
    const { data: currentPolicy, error: fetchErr } = await supabaseAdmin
      .from('policies')
      .select(`
        id,
        title,
        status,
        content_hash,
        content_updated_at,
        policy_versions (
          version_number
        )
      `)
      .eq('id', id)
      .single();

    if (fetchErr || !currentPolicy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updates: Record<string, any> = {
      updated_at: now,
    };
    if (title !== undefined) updates.title = title.trim();
    if (status !== undefined) updates.status = status;
    if (updatedBy !== undefined) updates.updated_by = updatedBy;

    // Check if content was provided
    let contentUpdated = false;
    let newVersionNumber = 1;

    if (content !== undefined && typeof content === 'string') {
      const newHash = computeContentHash(content);
      const isContentIdentical = currentPolicy.content_hash === newHash;

      if (!isContentIdentical) {
        contentUpdated = true;
        const currentVersions = currentPolicy.policy_versions || [];
        const maxVersion = currentVersions.reduce(
          (max: number, v: any) => Math.max(max, v.version_number || 0),
          0
        );
        newVersionNumber = maxVersion + 1;

        // Insert new version row
        const { error: verErr } = await supabaseAdmin.from('policy_versions').insert({
          policy_id: id,
          version_number: newVersionNumber,
          content: content,
          content_hash: newHash,
          change_summary: changeSummary || `Revision v${newVersionNumber}`,
          created_by: updatedBy || null,
          created_at: now,
        });

        if (verErr) {
          return NextResponse.json({ error: verErr.message }, { status: 500 });
        }

        // Only update content_updated_at when content has genuinely changed!
        updates.content_hash = newHash;
        updates.content_updated_at = now;
      }
    }

    // Update policies row
    const { data: updatedPolicy, error: updateErr } = await supabaseAdmin
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contentUpdated,
      newVersionNumber: contentUpdated ? newVersionNumber : null,
      message: contentUpdated
        ? `Policy updated to v${newVersionNumber}. 'Last Updated' timestamp refreshed.`
        : 'Saved. No textual changes detected; original "Last Updated" date preserved.',
      policy: updatedPolicy,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('policies')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Policy archived successfully',
      policy: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
