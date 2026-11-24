'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Shield, User, LogOut, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { SITE_CONFIG } from '@/lib/constants';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string }[];
  onOpenSignIn: () => void;
  session: any;
  currentHash?: string;
  onHashClick?: (hash: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navLinks,
  onOpenSignIn,
  session,
  currentHash = '',
  onHashClick,
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const checkIsActive = (href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      return (
        (pathname === '/' && currentHash === hash) ||
        (href === '/#styles' && (pathname.startsWith('/styles') || pathname.startsWith('/custom-sportswear') || pathname.startsWith('/uniforms')))
      );
    }
    return (
      pathname === href ||
      (href !== '/' && !href.startsWith('/#') && pathname.startsWith(href))
    );
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex flex-col justify-start">
      <div className="bg-white border-b border-border p-6 shadow-2xl animate-in slide-in-from-top duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-border-light">
          <div className="font-extrabold text-lg text-ink">MENU</div>
          <button
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-muted px-2 py-1 border-hairline border-border rounded-sm"
          >
            Close ✕
          </button>
        </div>

        <nav className="py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = checkIsActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => {
                  if (link.href.startsWith('/#')) {
                    onHashClick?.(link.href.replace('/', ''));
                  } else {
                    onHashClick?.('');
                  }
                  onClose();
                }}
                className={cn(
                  'flex items-center justify-between p-3 rounded-base text-sm font-semibold tracking-wide border-hairline transition-colors',
                  isActive
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-transparent border-transparent text-zinc-600 hover:text-black hover:bg-zinc-100'
                )}
              >
                <span>{link.label}</span>
                <ArrowRight className={cn('w-4 h-4', isActive ? 'text-white' : 'text-muted')} />
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border-light space-y-3">
          {session ? (
            <div className="space-y-2">
              <Link href="/portal" onClick={onClose} className="block">
                <Button variant="secondary" size="md" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" />
                  Client Portal ({session.user?.name || 'Dashboard'})
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-muted"
                onClick={async () => {
                  onClose();
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login" onClick={onClose} className="block">
              <Button
                variant="outline"
                size="md"
                className="w-full gap-2 justify-center"
              >
                <User className="w-4 h-4" />
                Log In / Sign Up
              </Button>
            </Link>
          )}

          <Link href="/request-a-quote" onClick={onClose} className="block">
            <Button variant="primary" size="lg" className="w-full">
              Request a Quote
            </Button>
          </Link>
        </div>

        <div className="pt-3 border-t border-border-light flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 font-mono">
          <Link href="/shipping-and-returns" onClick={onClose} className="hover:text-black">
            Shipping &amp; Returns
          </Link>
          <Link href="/terms-of-service" onClick={onClose} className="hover:text-black">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" onClick={onClose} className="hover:text-black">
            Privacy Policy
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-border-light text-[11px] font-mono text-muted space-y-1.5">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{SITE_CONFIG.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>{SITE_CONFIG.email}</span>
          </div>
          <div className="text-[10px] text-zinc-500 pt-1 leading-tight">
            {SITE_CONFIG.address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
