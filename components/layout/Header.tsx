'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Shield, ArrowUpRight, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { SignInModal } from '@/components/auth/SignInModal';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
    }

    const handleHash = () => {
      setCurrentHash(window.location.hash);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Auto-detect active section on homepage scroll
      if (window.location.pathname === '/') {
        const faqEl = document.getElementById('faq');
        const aboutEl = document.getElementById('about');
        const stylesEl = document.getElementById('styles');

        if (faqEl && faqEl.getBoundingClientRect().top <= 300) {
          setCurrentHash('#faq');
        } else if (aboutEl && aboutEl.getBoundingClientRect().top <= 300) {
          setCurrentHash('#about');
        } else if (stylesEl && stylesEl.getBoundingClientRect().top <= 300) {
          setCurrentHash('#styles');
        } else {
          setCurrentHash('');
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const navLinks = [
    { label: 'Apparel', href: '/#styles' },
    { label: 'Why HR Sports', href: '/#about' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const checkIsActive = (href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      return (
        (pathname === '/' && currentHash === hash) ||
        (href === '/#styles' && pathname.startsWith('/styles'))
      );
    }
    return (
      pathname === href ||
      (href !== '/' && !href.startsWith('/#') && pathname.startsWith(href))
    );
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 ease-in-out',
          isScrolled
            ? 'pt-3 px-3 sm:px-6 lg:px-8 pointer-events-none'
            : 'bg-white border-b border-hairline border-border-light py-3'
        )}
      >
        <div
          className={cn(
            'relative mx-auto flex items-center justify-between transition-all duration-300 ease-in-out pointer-events-auto',
            isScrolled
              ? 'max-w-6xl xl:max-w-7xl bg-white/95 backdrop-blur-md border-2 border-burgundy rounded-base shadow-xl py-2 px-4 sm:px-8 min-h-[55px]'
              : 'max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[58px]'
          )}
        >
          {/* Left: Navigation (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className={cn(
                'text-ink border-hairline border-border rounded-base hover:bg-surface transition-colors md:hidden',
                isScrolled ? 'p-1.5' : 'p-2'
              )}
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      if (link.href.startsWith('/#')) {
                        setCurrentHash(link.href.replace('/', ''));
                      } else {
                        setCurrentHash('');
                      }
                    }}
                    className={cn(
                      'text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 rounded-base',
                      isScrolled ? 'px-3.5 py-1.5 text-xs' : 'px-3.5 py-1.5',
                      isActive
                        ? 'bg-burgundy text-white font-bold shadow-xs'
                        : 'text-muted hover:text-ink hover:bg-surface'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <Link href="/" className="group flex items-center select-none">
              <Image
                src="/logo.png"
                alt="HR SPORTS"
                width={192}
                height={66}
                className={cn(
                  'w-auto object-contain transition-all duration-300 group-hover:scale-105',
                  isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-[58px]'
                )}
                priority
              />
            </Link>
          </div>

          {/* Right: Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/portal">
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Portal ({session.user?.name?.split(' ')[0] || 'Client'})
                  </Button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  title="Sign Out"
                  className="p-2 text-muted hover:text-ink hover:bg-surface rounded-base border-hairline border-border-light transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="hidden sm:flex text-xs font-mono uppercase tracking-wider font-semibold text-muted hover:text-ink px-3 py-2 transition-colors items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Sign Up / Login
              </button>
            )}

            <Link href="/request-a-quote">
              <Button variant="primary" size="sm" className="gap-1.5">
                <span className="hidden sm:inline">Request Quote</span>
                <span className="sm:hidden">Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navLinks={navLinks}
        currentHash={currentHash}
        onHashClick={setCurrentHash}
        onOpenSignIn={() => {
          setIsMobileNavOpen(false);
          setIsSignInOpen(true);
        }}
        session={session}
      />

      {/* Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onOpenSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onOpenSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </>
  );
};

export default Header;
