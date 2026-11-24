import { NextResponse } from 'next/server';
import { getRealDesignRequests, getRealInquiries } from '@/lib/supabase/data';

export async function GET() {
  const [designRes, inqRes] = await Promise.all([
    getRealDesignRequests(500),
    getRealInquiries(100),
  ]);

  return NextResponse.json({
    requests: designRes.requests,
    inquiries: inqRes.inquiries,
    pendingList: designRes.pendingList,
    pendingCount: designRes.pendingCount + inqRes.activeCount,
    totalCount: designRes.totalCount + inqRes.count,
    count: designRes.totalCount,
    totalLeads: designRes.totalCount + inqRes.count,
  });
}
