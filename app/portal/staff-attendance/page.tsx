import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StaffAttendanceClient } from './StaffAttendanceClient';

export const metadata = {
  title: 'Staff & Attendance Roster — HR Sports Production Control',
  description: 'Live presence, attendance logs, and factory operating schedule for company staff.',
};

export default async function StaffAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/portal/staff-attendance');
  }

  // Check role: Only Owner, Hassan, Hafeez, or authorized executive management can view
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'owner' && profile.department !== 'Executive Management')) {
    redirect('/portal');
  }

  const { date: selectedDate } = await searchParams;
  const targetDate = selectedDate || new Date().toISOString().slice(0, 10);

  // Fetch staff attendance summary via RPC
  const { data: attendanceData, error } = await supabase.rpc('owner_get_staff_attendance', {
    p_date: targetDate,
  });

  return (
    <StaffAttendanceClient
      initialDate={targetDate}
      initialData={attendanceData || { date: targetDate, staff: [], logs: [] }}
      ownerName={profile.full_name || 'Owner'}
    />
  );
}
