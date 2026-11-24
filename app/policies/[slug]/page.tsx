import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // Dynamic on-demand updates

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('policies')
      .select('title')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (data?.title) {
      return {
        title: `${data.title} | ${SITE_CONFIG.name}`,
        description: `Official legal documentation and terms for ${data.title} at ${SITE_CONFIG.legalName}.`,
      };
    }
  } catch (err) {}

  return {
    title: `Policy | ${SITE_CONFIG.name}`,
  };
}

export default async function DynamicPolicyPage({ params }: Props) {
  const { slug } = await params;
  let policy: { title: string; contentUpdatedAt: string; content: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('policies')
      .select(`
        title,
        content_updated_at,
        policy_versions (
          version_number,
          content
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (data && data.policy_versions && data.policy_versions.length > 0) {
      const sorted = [...data.policy_versions].sort((a: any, b: any) => b.version_number - a.version_number);
      policy = {
        title: data.title,
        contentUpdatedAt: data.content_updated_at,
        content: sorted[0]?.content || '',
      };
    }
  } catch (err) {
    console.error('Error fetching dynamic policy:', err);
  }

  if (!policy) {
    notFound();
  }

  const lastUpdatedDisplay = policy.contentUpdatedAt
    ? new Date(policy.contentUpdatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'February 26, 2026';

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] selection:bg-black selection:text-white">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-black/10 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-black/50">
            <Shield className="w-3.5 h-3.5 text-black" />
            <span>Legal Documentation</span>
          </div>
        </div>
      </div>

      <div className="container py-16 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-12 border-b-4 border-[#1D1D1F] pb-6">
          {policy.title}
        </h1>

        <section className="mb-12">
          <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono mb-8 border-l-2 border-black pl-4">
            Last Updated: {lastUpdatedDisplay}
          </div>
        </section>

        <hr className="border-[#1D1D1F]/10 mb-12" />

        <div
          className="space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />

        <div className="mt-20 text-xs text-[#86868B] border-t border-[#1D1D1F]/10 pt-8 text-center uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
