import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PortalShell } from '@/components/portal/PortalShell';
import { StaffPresenceTracker } from '@/components/portal/StaffPresenceTracker';

export const metadata: Metadata = {
  title: 'Client Production Portal — HR Sports OEM',
  description: 'Manage custom sports apparel manufacturing inquiries, review formal factory quotes, and track orders across 5 production stages.',
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: any = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  const isGoogle = user?.app_metadata?.provider === 'google' || 
                   user?.identities?.some((id: any) => id.provider === 'google') || 
                   Boolean((user?.user_metadata as any)?.iss?.includes('google'));

  const googleAvatar = (user?.user_metadata as any)?.avatar_url || (user?.user_metadata as any)?.picture || null;
  const avatarUrl = profile?.avatar_url || googleAvatar || null;
  const companyName = profile?.company_name || (user?.user_metadata as any)?.company_name || 'Apex Sports Syndicate';
  const fullName = profile?.full_name || (user?.user_metadata as any)?.full_name || (user?.user_metadata as any)?.name || 'Client';
  const userEmail = profile?.email || user?.email || 'client@demo.com';

  return (
    <>
      <StaffPresenceTracker userId={user?.id} userRole={profile?.role} />
      <PortalShell
        companyName={companyName}
        userEmail={userEmail}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isGoogle={isGoogle}
        userRole={profile?.role}
      >
        {children}
      </PortalShell>
    </>
  );
}
