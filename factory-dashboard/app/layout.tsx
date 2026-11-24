import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { LanguageProvider } from '@/lib/i18n/context';
import { RoleProvider } from '@/lib/auth/role-context';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'HR Sports Garment — Factory Operations Dashboard',
  description: 'Enterprise Manufacturing & Operations Portal for HR Sports',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="bg-bg text-ink h-full antialiased flex flex-col selection:bg-ink selection:text-surface overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <RoleProvider>
              <AppShell>{children}</AppShell>
            </RoleProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
