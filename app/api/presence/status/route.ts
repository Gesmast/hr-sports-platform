import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getFactoryWorkingHoursStatus() {
  // Factory operates Monday - Saturday, 9:00 AM - 8:00 PM Pakistan Standard Time (PKT, UTC+5)
  const now = new Date();
  const pktString = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
  const pktDate = new Date(pktString);

  const dayOfWeek = pktDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = pktDate.getHours();
  const minutes = pktDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const openMinutes = 9 * 60; // 9:00 AM
  const closeMinutes = 20 * 60; // 8:00 PM

  const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 6;
  const isWorkingHours = totalMinutes >= openMinutes && totalMinutes < closeMinutes;
  const isOpen = isWorkingDay && isWorkingHours;

  let message = 'Factory Closed';
  if (isOpen) {
    message = 'Factory Open (9 AM - 8 PM)';
  } else if (!isWorkingDay) {
    message = 'Factory opens Monday at 9:00 AM PKT';
  } else if (totalMinutes < openMinutes) {
    message = 'Factory opens today at 9:00 AM PKT';
  } else {
    message = 'Factory closed for today (opens tomorrow at 9:00 AM PKT)';
  }

  return {
    isOpen,
    dayOfWeek,
    hours,
    minutes,
    message,
    schedule: 'Mon - Sat: 9:00 AM - 8:00 PM PKT',
    pktCurrentTime: pktString,
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Query staff presence from Supabase RPC
    const { data, error } = await supabase.rpc('get_staff_presence_summary');

    const factory = getFactoryWorkingHoursStatus();

    if (error || !data) {
      return NextResponse.json({
        accounts: { online: false, last_seen: null },
        designer: { online: false, last_seen: null },
        factory,
      });
    }

    return NextResponse.json({
      accounts: data.accounts || { online: false, last_seen: null },
      designer: data.designer || { online: false, last_seen: null },
      factory,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch presence' },
      { status: 500 }
    );
  }
}
