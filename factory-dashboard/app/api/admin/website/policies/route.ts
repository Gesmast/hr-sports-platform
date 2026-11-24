import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function computeContentHash(content: string): string {
  // Normalize whitespace and HTML formatting noise
  const normalized = content.trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function GET(req: NextRequest) {
  try {
    const { data: policies, error } = await supabaseAdmin
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
          created_at
        )
      `)
      .order('title', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format output with latest version content & count
    const formatted = (policies || []).map((pol: any) => {
      const versions = pol.policy_versions || [];
      const sortedVersions = [...versions].sort((a: any, b: any) => b.version_number - a.version_number);
      const latestVersion = sortedVersions[0] || null;

      return {
        id: pol.id,
        slug: pol.slug,
        title: pol.title,
        status: pol.status,
        contentHash: pol.content_hash,
        contentUpdatedAt: pol.content_updated_at,
        updatedAt: pol.updated_at,
        versionCount: versions.length,
        currentContent: latestVersion?.content || '',
        versions: sortedVersions,
      };
    });

    return NextResponse.json({ policies: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, title, content, status = 'active', changeSummary = 'Initial policy creation', updatedBy } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'slug, title, and content are required' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');
    const hash = computeContentHash(content);
    const now = new Date().toISOString();

    // 1. Insert into policies
    const { data: policy, error: policyErr } = await supabaseAdmin
      .from('policies')
      .insert({
        slug: cleanSlug,
        title: title.trim(),
        status,
        content_hash: hash,
        content_updated_at: now,
        created_at: now,
        updated_at: now,
        updated_by: updatedBy || null,
      })
      .select()
      .single();

    if (policyErr) {
      return NextResponse.json({ error: policyErr.message }, { status: 500 });
    }

    // 2. Insert version 1
    const { error: versionErr } = await supabaseAdmin.from('policy_versions').insert({
      policy_id: policy.id,
      version_number: 1,
      content,
      content_hash: hash,
      change_summary: changeSummary,
      created_by: updatedBy || null,
      created_at: now,
    });

    if (versionErr) {
      return NextResponse.json({ error: versionErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      policy: {
        ...policy,
        currentContent: content,
        versionCount: 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
