'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  User, 
  LogOut, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Truck,
  FileText,
  Shield,
  Factory,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { Logo } from '@/components/shared/Logo';
import { MobileNav } from './MobileNav';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/auth';
import { SITE_CONFIG } from '@/lib/constants';

type DropdownType = 'apparel' | 'about' | 'contact' | null;

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [isInFooter, setIsInFooter] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Live editable state from Theme Editor / Supabase
  const [navConfig, setNavConfig] = useState<any>({
    col1Heading: 'Custom Sportswear',
    col1Badge: 'Coming Soon',
    sportswear1Title: 'Cricket',
    sportswear1Desc: 'Matchday whites, T20 color kits & gear',
    sportswear1Link: '/custom-sportswear/cricket',
    sportswear2Title: 'Football / Soccer',
    sportswear2Desc: 'Match jerseys, shorts & drill kits',
    sportswear2Link: '/custom-sportswear/football',
    sportswear3Title: 'Basketball',
    sportswear3Desc: 'Game jerseys & open-hole mesh shorts',
    sportswear3Link: '/custom-sportswear/basketball',
    sportswear4Title: 'Gym & Activewear',
    sportswear4Desc: 'Compression tops, leggings & tanks',
    sportswear4Link: '/custom-sportswear/gym-activewear',
    sportswear5Title: 'Hockey',
    sportswear5Desc: 'Pro sublimated ice & field hockey kits',
    sportswear5Link: '/custom-sportswear/hockey',

    col2Heading: 'Uniforms',
    col2Badge: 'Coming Soon',
    uniform1Title: 'Corporate Uniforms',
    uniform1Desc: 'Executive tech polos & corporate workwear',
    uniform1Link: '/uniforms/corporate-uniforms',
    uniform2Title: 'Security Uniforms',
    uniform2Desc: 'Ripstop patrol shirts, tactical cargo & vests',
    uniform2Link: '/uniforms/security-uniforms',
    uniform3Title: 'Promotional Uniforms',
    uniform3Desc: 'Event crew tees, exhibition polos & caps',
    uniform3Link: '/uniforms/promotional-uniforms',

    apparelPromoHeading: 'Custom Sports Clothes',
    apparelPromoSub: 'Send us your idea or design. We make a physical sample for you to check before starting your batch.',
    apparelPromoButtonText: 'See All Styles',
    apparelPromoButtonLink: '/#styles',
  });

  const [isEditorPinned, setIsEditorPinned] = useState(false);

  // Listen for live theme editor postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PUCK_PREVIEW_UPDATE') {
        const content = event.data.data?.content;
        if (Array.isArray(content)) {
          const headerItem = content.find((item: any) => item.type === 'HeaderNav' || item.type === 'LiveHeaderNav');
          if (headerItem?.props) {
            setNavConfig((prev: any) => ({ ...prev, ...headerItem.props }));
          }
        }
      } else if (event.data?.type === 'PUCK_BLOCK_HIGHLIGHT') {
        // When user clicks 'Header Navigation & Dropdowns' in the left sidebar, keep Apparel mega-dropdown open & sticky!
        if (event.data.componentType === 'HeaderNav' || event.data.componentType === 'LiveHeaderNav') {
          setIsEditorPinned(true);
          setActiveDropdown('apparel');
        } else {
          setIsEditorPinned(false);
          setActiveDropdown(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
          setProfile(data);
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
          setProfile(data);
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Check if user has scrolled near or into footer
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 0) {
          setIsInFooter(true);
        } else {
          setIsInFooter(false);
        }
      } else {
        const scrollBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
        setIsInFooter(scrollBottom < window.innerHeight * 0.7);
      }

      if (pathname === '/') {
        const heroBtn = document.getElementById('hero-quote-button');
        if (heroBtn) {
          const rect = heroBtn.getBoundingClientRect();
          setHasScrolledPastHero(rect.bottom < 80);
        } else {
          setHasScrolledPastHero(window.scrollY > 280);
        }
      } else {
        setHasScrolledPastHero(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Dropdown hover handlers with fast, responsive closing
  const handleMouseEnter = (type: DropdownType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    if (isEditorPinned) return; // Keep sticky while editing in Theme Editor
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 80);
  };

  // Close dropdown on Escape or clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditorPinned(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showQuoteButton = pathname !== '/' || hasScrolledPastHero;

  // Navigation links: Dropdown menus together, FAQ at the right-most
  const navLinks = [
    { label: 'Apparel', href: '/#styles', hasDropdown: true, type: 'apparel' as DropdownType },
    { label: 'About', href: '/about', hasDropdown: true, type: 'about' as DropdownType },
    { label: 'Contact', href: '/contact', hasDropdown: true, type: 'contact' as DropdownType },
    { label: 'FAQ', href: '/faq', hasDropdown: false },
  ];

  const isPortal = pathname?.startsWith('/portal');

  return (
    <>
      <div 
        className={cn(
          isPortal
            ? "relative z-30 w-full"
            : cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled ? "pt-2 sm:pt-3 px-3 sm:px-6 lg:px-8 pointer-events-none" : "pt-0 px-0",
                isInFooter && "opacity-0 pointer-events-none -translate-y-full"
              )
        )}
        onMouseLeave={handleMouseLeave}
      >
        <header
          onMouseLeave={handleMouseLeave}
          className={cn(
            'w-full transition-all duration-300 ease-in-out pointer-events-auto',
            isPortal
              ? 'bg-white text-black py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 shadow-2xs'
              : isScrolled
                ? 'max-w-7xl mx-auto bg-white/80 text-black backdrop-blur-2xl border border-zinc-200/90 rounded-2xl sm:rounded-full shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12)] py-1.5 sm:py-2 px-4 sm:px-6'
                : 'bg-white/80 text-black backdrop-blur-md py-3.5 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/50'
          )}
        >
          <div className={cn(
            "relative flex items-center justify-between w-full",
            (!isScrolled || isPortal) && "max-w-7xl mx-auto"
          )}>
            
            {/* Left: Logo Only */}
            <div className="flex items-center shrink-0">
              <Link
                href="/"
                onMouseEnter={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setActiveDropdown(null);
                }}
                className={cn(
                  "group relative bg-white border border-zinc-200/90 rounded-xl sm:rounded-2xl shadow-[0_6px_20px_-4px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_25px_-4px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 z-40 select-none flex items-center justify-center shrink-0 transition-all duration-200",
                  isPortal
                    ? "p-1.5 sm:p-2 my-0"
                    : isScrolled
                      ? "p-1.5 sm:p-2 -my-2.5 sm:-my-3.5"
                      : "p-2 sm:p-2.5 -mb-4 sm:-mb-5"
                )}
                title="HR SPORTS"
              >
                <Logo 
                  className={cn(
                    "w-auto text-black group-hover:scale-105 transition-all duration-200",
                    isPortal || isScrolled ? "h-9 sm:h-10 md:h-11" : "h-10 sm:h-12 md:h-14"
                  )} 
                />
              </Link>
            </div>

            {/* Center: Navigation Links Exactly Centered in Header (Google Sans) */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const isCurrent = link.hasDropdown 
                  ? activeDropdown === link.type 
                  : pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      onMouseEnter={() => handleMouseEnter(link.type || null)}
                      className="relative"
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm font-google-sans font-bold transition-all duration-150 rounded-full px-3.5 py-1.5 inline-flex items-center gap-1.5 cursor-pointer',
                          isCurrent
                            ? 'bg-black text-white font-bold shadow-xs'
                            : 'text-black hover:bg-zinc-100/90'
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 transition-transform duration-200 stroke-[2.5]',
                            isCurrent ? 'rotate-180 text-white' : 'text-black'
                          )}
                        />
                      </Link>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setActiveDropdown(null);
                    }}
                    className={cn(
                      'text-sm font-google-sans font-bold transition-all duration-150 rounded-full px-3.5 py-1.5',
                      isCurrent
                        ? 'bg-black text-white font-bold shadow-xs'
                        : 'text-black hover:bg-zinc-100/90'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Log In / Sign Up + Quote Button */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {user ? (
                <div 
                  className="relative hidden sm:block"
                  onMouseEnter={() => {
                    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setActiveDropdown(null);
                    setIsAccountDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                    accountTimeoutRef.current = setTimeout(() => {
                      setIsAccountDropdownOpen(false);
                    }, 150);
                  }}
                >
                  {/* Account Icon Button (Click to go to /portal, Hover opens auto dropdown) */}
                  <Link 
                    href="/portal"
                    className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-black hover:scale-105 transition shadow-xs group cursor-pointer bg-white"
                    title={`${profile?.full_name || user.email} - Account Dashboard`}
                  >
                    {profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                      <img
                        src={profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                        alt="Account"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-zinc-200 text-black font-mono font-black flex items-center justify-center text-xs">
                        {(profile?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                  </Link>

                  {/* Auto Dropdown on Hover: Account Dashboard / Log Out */}
                  <AnimatePresence>
                    {isAccountDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-black rounded-2xl shadow-2xl p-2 z-50 text-black select-none"
                      >
                        {/* Header: User Email & Name */}
                        <div className="px-3 py-2 border-b-2 border-black mb-1.5 bg-zinc-50 rounded-xl">
                          <div className="font-black text-xs text-black truncate">
                            {profile?.full_name || profile?.company_name || 'Client Account'}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-600 truncate font-bold mt-0.5">
                            {user.email}
                          </div>
                        </div>

                        {/* Dropdown Menu Items */}
                        <div className="space-y-0.5">
                          <Link
                            href="/portal"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-black transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-black shrink-0" />
                            <span>Account Dashboard</span>
                          </Link>

                          <Link
                            href="/portal/inquiries"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-black transition"
                          >
                            <MessageSquareText className="w-4 h-4 text-black shrink-0" />
                            <span>Inquiries & Quotes</span>
                          </Link>

                          <Link
                            href="/portal/orders"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-black transition"
                          >
                            <Package className="w-4 h-4 text-black shrink-0" />
                            <span>Orders & Tracking</span>
                          </Link>

                          <Link
                            href="/portal/profile"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-black transition"
                          >
                            <Settings className="w-4 h-4 text-black shrink-0" />
                            <span>Account Settings</span>
                          </Link>
                        </div>

                        <div className="border-t-2 border-black my-1.5" />

                        {/* Log Out Button */}
                        <form action={signOut}>
                          <button
                            type="submit"
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-400 transition cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                            <span>Log out</span>
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  onMouseEnter={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setActiveDropdown(null);
                  }}
                  className="hidden sm:flex text-xs font-google-sans uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full text-black hover:bg-zinc-100/90 transition-colors items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  Log In / Sign Up
                </Link>
              )}

              {/* Request a Quote Button - Floats into header when scrolled past hero */}
              <AnimatePresence>
                {showQuoteButton && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setActiveDropdown(null);
                    }}
                  >
                    <Link href="/request-a-quote">
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5 bg-black text-white hover:bg-zinc-800 font-google-sans font-bold"
                      >
                        <span className="hidden sm:inline">Request a Quote</span>
                        <span className="sm:hidden">Quote</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="border border-zinc-200 text-black hover:bg-zinc-100 rounded-full transition-colors md:hidden p-2"
                aria-label="Toggle navigation menu"
              >
                {isMobileNavOpen ? (
                  <X className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* Attached Mega Dropdown - Floats OVER the background (Absolute Overlay)    */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full left-0 w-full px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-4 pointer-events-auto z-50"
            >
              <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-3xl border border-zinc-200/90 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.12)] text-black p-6 sm:p-8 overflow-hidden">
                
                {/* ---------------- CONTACT DROPDOWN CONTENT ---------------- */}
                {activeDropdown === 'contact' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Col 1: Factory & Office */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                        Factory & Office
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors">
                          <MapPin className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-black">HR Sports</p>
                            <p className="text-zinc-600 text-xs mt-0.5 leading-relaxed">
                              {SITE_CONFIG.address}
                            </p>
                            <p className="text-zinc-500 text-[11px] mt-1 font-mono">
                              Where we make all our clothing
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors">
                          <Clock className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-black">Factory Hours</p>
                            <p className="text-zinc-800 text-xs mt-0.5 font-medium">
                              Mon to Saturday 9 am to 10 pm
                            </p>
                            <p className="text-zinc-500 text-[11px] mt-0.5 font-mono">
                              Our team is on the factory floor
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Get in Touch */}
                    <div className="lg:col-span-4 space-y-4 border-t lg:border-t-0 lg:border-l border-zinc-200 lg:pl-8 pt-4 lg:pt-0">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                        Get in Touch
                      </div>

                      <div className="space-y-3.5 text-sm">
                        <div className="p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors">
                          <p className="text-xs font-mono uppercase text-zinc-500">Email Us</p>
                          <a
                            href={`mailto:${SITE_CONFIG.email}`}
                            className="text-black hover:text-zinc-700 font-semibold transition-colors flex items-center gap-1.5 mt-0.5"
                          >
                            <Mail className="w-3.5 h-3.5 text-zinc-500" />
                            {SITE_CONFIG.email}
                          </a>
                          <p className="text-[11px] text-zinc-500 mt-0.5">We reply within one day</p>
                        </div>

                        <div className="p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors">
                          <p className="text-xs font-mono uppercase text-zinc-500">Phone Call</p>
                          <a
                            href={`tel:${SITE_CONFIG.phone}`}
                            className="text-black hover:text-zinc-700 font-semibold transition-colors flex items-center gap-1.5 mt-0.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            {SITE_CONFIG.phone}
                          </a>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Give us a quick call</p>
                        </div>

                        <div className="p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors">
                          <p className="text-xs font-mono uppercase text-zinc-500">WhatsApp</p>
                          <a
                            href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-2 mt-0.5"
                          >
                            <svg 
                              viewBox="0 0 24 24" 
                              className="w-4 h-4 fill-[#25D366] shrink-0" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25a8.214 8.214 0 01-4.223-1.168l-.303-.18-3.048.854.814-2.97-.198-.316A8.214 8.214 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25z" />
                            </svg>
                            {SITE_CONFIG.whatsappNumber}
                          </a>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Fast chat & quick questions</p>
                        </div>
                      </div>
                    </div>

                    {/* Col 3: Direct Action Card */}
                    <div className="lg:col-span-4 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/90 p-5 sm:p-6 flex flex-col justify-between relative group">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-black tracking-tight">
                          Talk to Us Directly
                        </h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          Have questions about clothes, fabrics, or samples? Drop us a message anytime.
                        </p>
                      </div>

                      <div className="pt-6 space-y-2">
                        <Link href="/contact" onClick={() => setActiveDropdown(null)}>
                          <Button variant="primary" size="sm" className="w-full justify-center gap-2 font-bold shadow-md bg-black text-white hover:bg-zinc-800">
                            <span>Send a Message</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <p className="text-[10px] text-zinc-500 text-center font-mono">
                          30 pieces minimum • Sample first
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ---------------- ABOUT DROPDOWN CONTENT ---------------- */}
                {activeDropdown === 'about' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Col 1: About & Factory */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
                        Company &amp; Factory
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/about"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <Factory className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>About Us &amp; Factory</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              18+ years of OEM precision manufacturing in Sialkot
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/projects"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <Sparkles className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>Client Case Studies</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Real custom apparel productions &amp; client deliveries
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/faq"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <Info className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>Frequently Asked Questions</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              MOQ, sample process, payment terms, and lead times
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Col 2: Policies & Legal Terms */}
                    <div className="lg:col-span-4 space-y-3 border-t lg:border-t-0 lg:border-l border-zinc-200 lg:pl-8 pt-4 lg:pt-0">
                      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
                        Policies &amp; Legal
                      </div>
                      <div className="space-y-2">
                        <Link
                          href="/shipping-and-returns"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <Truck className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>Shipping &amp; Returns</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Air express 3–6 days, DDP freight, and quality terms
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/terms-of-service"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <FileText className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>Terms of Service</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Commercial agreement, tech pack NDA &amp; governance
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/privacy-policy"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                            <Shield className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm flex items-center justify-between">
                              <span>Privacy Policy</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Data protection &amp; client design confidentiality
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Col 3: Direct Feature Card */}
                    <div className="lg:col-span-4 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/90 p-5 sm:p-6 flex flex-col justify-between relative group">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-700 bg-white px-2.5 py-1 rounded-full border border-zinc-200">
                          <Shield className="w-3 h-3 text-black" />
                          Certified OEM Factory
                        </div>
                        <h4 className="text-xl font-bold text-black tracking-tight pt-1">
                          Precision Manufacturing
                        </h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          Direct-to-factory custom sportswear manufacturing. 100% pre-production sample approval before bulk cutting and sublimation.
                        </p>
                      </div>

                      <div className="pt-6 space-y-2">
                        <Link href="/about" onClick={() => setActiveDropdown(null)}>
                          <Button variant="primary" size="sm" className="w-full justify-center gap-2 font-bold shadow-md bg-black text-white hover:bg-zinc-800">
                            <span>Discover Our Factory</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <p className="text-[10px] text-zinc-500 text-center font-mono">
                          15 pieces MOQ • Worldwide DDP shipping
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ---------------- APPAREL DROPDOWN CONTENT ---------------- */}
                {activeDropdown === 'apparel' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-4xl mx-auto py-2">
                    
                    {/* Col 1: Custom Sportswear */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
                        <span>{navConfig.col1Heading || 'Custom Sportswear'}</span>
                        {navConfig.col1Badge && (
                          <span className="text-[9px] font-black bg-black text-white px-1.5 py-0.5 rounded">{navConfig.col1Badge}</span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Link 
                          href={navConfig.sportswear1Link || "/custom-sportswear/cricket"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.sportswear1Title || 'Cricket'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.sportswear1Desc || 'Matchday whites, T20 color kits & gear'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.sportswear2Link || "/custom-sportswear/football"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.sportswear2Title || 'Football / Soccer'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.sportswear2Desc || 'Match jerseys, shorts & drill kits'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.sportswear3Link || "/custom-sportswear/basketball"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.sportswear3Title || 'Basketball'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.sportswear3Desc || 'Game jerseys & open-hole mesh shorts'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.sportswear4Link || "/custom-sportswear/gym-activewear"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.sportswear4Title || 'Gym & Activewear'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.sportswear4Desc || 'Compression tops, leggings & tanks'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.sportswear5Link || "/custom-sportswear/hockey"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.sportswear5Title || 'Hockey'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.sportswear5Desc || 'Pro sublimated ice & field hockey kits'}
                          </p>
                        </Link>
                      </div>
                    </div>

                    {/* Col 2: Uniforms */}
                    <div className="space-y-3 border-t md:border-t-0 md:border-l border-zinc-200 md:pl-8 pt-4 md:pt-0">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
                        <span>{navConfig.col2Heading || 'Uniforms'}</span>
                        {navConfig.col2Badge && (
                          <span className="text-[9px] font-black bg-black text-white px-1.5 py-0.5 rounded">{navConfig.col2Badge}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link 
                          href={navConfig.uniform1Link || "/uniforms/corporate-uniforms"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.uniform1Title || 'Corporate Uniforms'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.uniform1Desc || 'Executive tech polos & corporate workwear'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.uniform2Link || "/uniforms/security-uniforms"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.uniform2Title || 'Security Uniforms'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.uniform2Desc || 'Ripstop patrol shirts, tactical cargo & vests'}
                          </p>
                        </Link>

                        <Link 
                          href={navConfig.uniform3Link || "/uniforms/promotional-uniforms"} 
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors group"
                        >
                          <p className="font-semibold text-black group-hover:text-zinc-800 text-sm">
                            {navConfig.uniform3Title || 'Promotional Uniforms'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {navConfig.uniform3Desc || 'Event crew tees, exhibition polos & caps'}
                          </p>
                        </Link>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navLinks={[
          { label: 'Apparel', href: '/#styles' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'FAQ', href: '/faq' },
        ]}
        onOpenSignIn={() => setIsMobileNavOpen(false)}
        session={user}
      />
    </>
  );
};

export default Header;
