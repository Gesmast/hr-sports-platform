'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowUp, ArrowUpRight, Phone, Sparkles, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { TheHRSportsBanner } from '@/components/shared/TheHRSportsBanner';
import { SITE_CONFIG } from '@/lib/constants';

export const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Footer reveal transforms: card slides down uncovering the crisp footer
  const cardY = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '108%']);

  const [email, setEmail] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  // Live Factory Time (PKT, UTC+5 Lahore)
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setTime(formatter.format(new Date()));
      } catch {
        setTime('PKT 12:00 PM');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTermsChecked) {
      setTermsError(true);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed successfully!');
        setEmail('');
        setIsTermsChecked(false);
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative h-[125vh] sm:h-[145vh] md:h-[200vh] w-full select-none">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        
        {/* ── BOTTOM LAYER: The Real Footer (revealed underneath, 100% crisp without overlay) ── */}
        <footer
          className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8 md:p-10 lg:p-12 text-[#F5F5F7] bg-black overflow-y-auto"
        >
          {/* Top Section: Distributed Across the Screen */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-5 sm:gap-8 lg:gap-12 pb-5 sm:pb-8 border-b border-white/10">
            
            {/* Left Column: Enlarged Zoomed Logo, Tagline, Newsletter */}
            <div className="space-y-5 shrink-0 max-w-xl">
              
              {/* Enlarged Zoomed Logo + Tagline */}
              <div className="flex items-center gap-4 sm:gap-5">
                <Link href="/" className="inline-block shrink-0">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.18)] hover:scale-105 transition-transform duration-300">
                    <Logo className="w-full h-auto text-black scale-135" />
                  </div>
                </Link>
                <div className="whitespace-nowrap">
                  <span className="text-base sm:text-xl font-black uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#F5F5F7] whitespace-nowrap block">
                    &ldquo;Your trust, our success&rdquo;
                  </span>
                </div>
              </div>

              {/* Compact Newsletter Subscription */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#F5F5F7]/60 whitespace-nowrap">
                  Join the HR Sports Network:
                </p>
                <form onSubmit={handleSubscribe} className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR WORK EMAIL"
                        required
                        className={`w-full h-9 px-4 bg-white/10 backdrop-blur-md border border-white/20 text-[#F5F5F7] placeholder-white/40 font-bold uppercase tracking-wider text-[11px] focus:outline-none focus:border-white focus:bg-white/15 transition-all rounded-full ${
                          termsError ? 'border-red-400' : ''
                        }`}
                      />
                      {termsError && (
                        <div className="absolute -bottom-4 left-3 flex items-center gap-1 text-red-400">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                            Please accept terms to subscribe
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="h-9 px-5 bg-white text-black font-extrabold uppercase tracking-widest text-[11px] rounded-full hover:bg-white/90 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'JOINING...' : 'SUBSCRIBE'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="footer-terms"
                      checked={isTermsChecked}
                      onChange={(e) => {
                        setIsTermsChecked(e.target.checked);
                        if (e.target.checked) setTermsError(false);
                      }}
                      className="w-3 h-3 rounded-xs accent-white bg-white/10 border-white/30 cursor-pointer"
                    />
                    <label htmlFor="footer-terms" className="text-[10px] text-[#F5F5F7]/50 font-mono tracking-wide cursor-pointer select-none">
                      I accept the{' '}
                      <Link href="/terms-of-service" className="text-white underline hover:text-white/90">
                        Terms of Service
                      </Link>
                      .
                    </label>
                  </div>
                </form>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{message}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                    <AlertCircle className="w-4 h-4" />
                    <span>{message}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Quick Direct Contact Options */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono text-white/50 group-hover:text-black/60 uppercase tracking-widest">
                    Direct Email
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-black">
                    {SITE_CONFIG.email}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  SITE_CONFIG.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366] text-white hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.15)]"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <WhatsAppOfficialIcon className="w-4 h-4 fill-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">
                    Direct Production Chat
                  </span>
                  <span className="text-xs font-bold text-white">
                    Chat on WhatsApp
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-white/60 group-hover:text-black" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono text-white/50 group-hover:text-black/60 uppercase tracking-widest">
                    Voice Calling
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-black">
                    {SITE_CONFIG.phone}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>

          {/* Middle Section: Collapsible Dropdowns on Mobile (< md), 4 Wide Columns on Desktop (>= md) */}
          <div className="py-4 sm:py-6 border-b border-white/10 text-xs">
            {/* ── MOBILE ACCORDION DROPDOWNS (md:hidden) — Drastically reduces footer height on phone ── */}
            <div className="md:hidden space-y-2">
              {/* Dropdown 1: Navigation */}
              <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleDropdown('nav')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/10 transition"
                >
                  <span>Navigation</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      openDropdown === 'nav' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'nav' && (
                  <ul className="px-4 pb-3.5 pt-1 flex flex-col gap-2.5 border-t border-white/10">
                    <li><KotaLink href="/">Home</KotaLink></li>
                    <li><KotaLink href="/about">About &amp; Factory</KotaLink></li>
                    <li><KotaLink href="/projects">Case Studies</KotaLink></li>
                    <li><KotaLink href="/faq">FAQ</KotaLink></li>
                    <li><KotaLink href="/contact">Contact Us</KotaLink></li>
                    <li><KotaLink href="/request-a-quote">Request a Quote</KotaLink></li>
                  </ul>
                )}
              </div>

              {/* Dropdown 2: Apparel */}
              <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleDropdown('apparel')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/10 transition"
                >
                  <span>Apparel (8 Categories)</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      openDropdown === 'apparel' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'apparel' && (
                  <ul className="px-4 pb-3.5 pt-1 grid grid-cols-2 gap-2 border-t border-white/10">
                    <li><KotaLink href="/custom-sportswear/cricket">Cricket</KotaLink></li>
                    <li><KotaLink href="/custom-sportswear/football">Football</KotaLink></li>
                    <li><KotaLink href="/custom-sportswear/basketball">Basketball</KotaLink></li>
                    <li><KotaLink href="/custom-sportswear/gym-activewear">Gym &amp; Active</KotaLink></li>
                    <li><KotaLink href="/custom-sportswear/hockey">Hockey</KotaLink></li>
                    <li><KotaLink href="/uniforms/corporate-uniforms">Corporate</KotaLink></li>
                    <li><KotaLink href="/uniforms/security-uniforms">Security</KotaLink></li>
                    <li><KotaLink href="/uniforms/promotional-uniforms">Promotional</KotaLink></li>
                  </ul>
                )}
              </div>

              {/* Dropdown 3: Legal */}
              <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleDropdown('legal')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/10 transition"
                >
                  <span>Legal &amp; Policy</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      openDropdown === 'legal' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'legal' && (
                  <ul className="px-4 pb-3.5 pt-1 flex flex-col gap-2.5 border-t border-white/10">
                    <li><KotaLink href="/shipping-and-returns">Shipping &amp; Returns</KotaLink></li>
                    <li><KotaLink href="/terms-of-service">Terms of Service</KotaLink></li>
                    <li><KotaLink href="/privacy-policy">Privacy Policy</KotaLink></li>
                  </ul>
                )}
              </div>

              {/* Dropdown 4: Socials */}
              <div className="border border-white/15 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleDropdown('socials')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/10 transition"
                >
                  <span>Connect With Us</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      openDropdown === 'socials' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'socials' && (
                  <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
                    <SocialIcons />
                  </div>
                )}
              </div>
            </div>

            {/* ── DESKTOP 4-COLUMN GRID (hidden md:grid) ── */}
            <div className="hidden md:grid md:grid-cols-4 gap-8">
              {/* Column 1: Navigation */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#F5F5F7] uppercase tracking-[0.2em] pb-1 border-b border-white/10 whitespace-nowrap">
                  Navigation
                </h4>
                <ul className="flex flex-col gap-2">
                  <li><KotaLink href="/">Home</KotaLink></li>
                  <li><KotaLink href="/about">About &amp; Factory</KotaLink></li>
                  <li><KotaLink href="/projects">Case Studies</KotaLink></li>
                  <li><KotaLink href="/faq">FAQ</KotaLink></li>
                  <li><KotaLink href="/contact">Contact Us</KotaLink></li>
                  <li><KotaLink href="/request-a-quote">Request a Quote</KotaLink></li>
                </ul>
              </div>

              {/* Column 2: Apparel (Custom Sportswear & Uniforms) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#F5F5F7] uppercase tracking-[0.2em] pb-1 border-b border-white/10 whitespace-nowrap">
                  Apparel
                </h4>
                <ul className="flex flex-col gap-1.5">
                  <li><KotaLink href="/custom-sportswear/cricket">Cricket</KotaLink></li>
                  <li><KotaLink href="/custom-sportswear/football">Football / Soccer</KotaLink></li>
                  <li><KotaLink href="/custom-sportswear/basketball">Basketball</KotaLink></li>
                  <li><KotaLink href="/custom-sportswear/gym-activewear">Gym &amp; Activewear</KotaLink></li>
                  <li><KotaLink href="/custom-sportswear/hockey">Hockey</KotaLink></li>
                  <li><KotaLink href="/uniforms/corporate-uniforms">Corporate Uniforms</KotaLink></li>
                  <li><KotaLink href="/uniforms/security-uniforms">Security Uniforms</KotaLink></li>
                  <li><KotaLink href="/uniforms/promotional-uniforms">Promotional Uniforms</KotaLink></li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#F5F5F7] uppercase tracking-[0.2em] pb-1 border-b border-white/10 whitespace-nowrap">
                  Legal
                </h4>
                <ul className="flex flex-col gap-2">
                  <li><KotaLink href="/shipping-and-returns">Shipping &amp; Returns</KotaLink></li>
                  <li><KotaLink href="/terms-of-service">Terms of Service</KotaLink></li>
                  <li><KotaLink href="/privacy-policy">Privacy Policy</KotaLink></li>
                </ul>
              </div>

              {/* Column 4: Socials */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#F5F5F7] uppercase tracking-[0.2em] pb-1 border-b border-white/10 whitespace-nowrap">
                  Socials
                </h4>
                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <SocialIcons />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Lahore Timezone + Back to Top Glass Pill */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Timezone / Lahore Status & Copyright */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-xs text-[#F5F5F7]/60">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-[#F5F5F7] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PKT (GMT+5) Lahore, Pakistan</span>
                {time && <span className="text-white font-semibold">· {time}</span>}
              </div>
              <span className="text-white/30 hidden md:inline">•</span>
              <span className="text-[#F5F5F7]/50 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase whitespace-nowrap">
                © {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
              </span>
            </div>

            {/* Glassmorphic Back to Top Button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#F5F5F7] text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="text-[11px] opacity-80 group-hover:opacity-100 transition-opacity">
                Back to top
              </span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </div>
            </button>

          </div>

        </footer>

        {/* ── TOP LAYER: Brand Banner Scrolldown Card (Stretches edge-to-edge on mobile & tablet) ──── */}
        <motion.div
          style={{ y: cardY }}
          className="absolute inset-x-1 sm:inset-x-3 md:inset-6 top-2 sm:top-3 md:top-6 bottom-2 sm:bottom-3 md:bottom-6 z-10 flex flex-col justify-between items-center rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-white text-black p-3 sm:p-6 md:p-12 shadow-xl border border-black/10 overflow-hidden"
        >
          {/* Top spacer */}
          <div className="w-full h-1 sm:h-2 md:h-6" />

          {/* Main text in the middle: Stretches edge-to-edge across mobile & tablet */}
          <div className="w-full flex-1 flex items-center justify-center px-0 sm:px-2 md:px-6">
            <TheHRSportsBanner className="w-full max-w-[1450px]" color="#000000" />
          </div>

          {/* Scroll to reveal footer pill */}
          <div className="pb-1 sm:pb-3 md:pb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-black text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
              <span>Scroll to reveal footer</span>
              <span className="animate-bounce font-mono">↓</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// Kota-Style Monospaced Glowing Hover Nav Link
function KotaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-[#F5F5F7]/70 hover:text-white transition-all duration-200 font-mono font-normal tracking-wide"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white group-hover:scale-125 transition-all duration-200 shrink-0" />
      <span className="group-hover:translate-x-1 transition-transform duration-200">
        {children}
      </span>
    </Link>
  );
}

// Social Media Icons with Authentic Brand Colors
function SocialIcons() {
  return (
    <>
      {/* Facebook */}
      <a
        href="https://www.facebook.com/thehrsports" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#1877F2] hover:bg-[#1877F2]/20 hover:scale-110 transition-all duration-300 group shadow-sm"
      >
        <svg className="w-4 h-4 fill-[#1877F2] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/thehrsports.co/" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#E1306C] hover:bg-[#E1306C]/20 hover:scale-110 transition-all duration-300 group shadow-sm"
      >
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="igFooterGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <path fill="url(#igFooterGradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>

      {/* WhatsApp Official Logo */}
      <a
        href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          SITE_CONFIG.whatsappDefaultMessage
        )}`}
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/20 hover:scale-110 transition-all duration-300 group shadow-sm"
      >
        <WhatsAppOfficialIcon className="w-4 h-4 fill-[#25D366] transition-transform duration-300 group-hover:scale-110" />
      </a>
    </>
  );
}

// Official WhatsApp Vector Icon
function WhatsAppOfficialIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export default Footer;
