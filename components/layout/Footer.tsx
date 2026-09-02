'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, Globe, ShieldCheck, Factory, Cpu } from 'lucide-react';
import { countries } from '@/data/countries';
import { SITE_CONFIG, MOQ_LABEL } from '@/lib/constants';
import { newsletterSchema } from '@/lib/schemas/newsletter';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      setStatus('error');
      setMessage('Please enter a valid corporate email address.');
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
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-ink text-white border-t border-hairline border-zinc-800 mt-auto">
      {/* Top Banner / Newsletter */}
      <div className="border-b border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                Textile Intelligence Briefing
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Stay Ahead of Fabric & Supply Chain Shifts
              </h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-lg">
                Receive monthly OEM industry reports covering yarn market trends, sublimation techniques, and international freight rate forecasts.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border-hairline border-zinc-700 text-white rounded-base pl-10 pr-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-white text-ink font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-base hover:bg-surface active:translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {message}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-xs text-rose-400 mt-2 font-medium">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white text-ink flex items-center justify-center font-extrabold text-xs tracking-tighter rounded-base">
                HR
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                HR SPORTS
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Industrial-scale OEM clothing and sportswear manufacturer. Delivering precision dye-sublimated match kits, activewear, compression gear, and corporate uniforms direct to global brands.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-400 space-y-1.5 border-t border-zinc-800">
              <p>• {MOQ_LABEL}</p>
              <p>• 24-Hour Commercial Quote SLA</p>
              <p>• 100% Pre-Production Sample Approval</p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About & Factory
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Client Case Studies
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/request-a-quote" className="hover:text-white transition-colors">
                  Request Production Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Markets We Serve (SEO Landing Pages) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Markets We Serve
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-zinc-400">
              {countries.map((country) => (
                <li key={country.slug}>
                  <Link
                    href={`/manufacturers/${country.slug}`}
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{country.flagIcon}</span>
                    <span className="group-hover:underline">{country.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quality & Compliance */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Quality Compliance
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="p-2.5 bg-zinc-900/80 border-hairline border-zinc-800 rounded-base">
                <p className="font-semibold text-zinc-200">ISO 9001:2015</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Certified Quality Management Systems</p>
              </div>
              <div className="p-2.5 bg-zinc-900/80 border-hairline border-zinc-800 rounded-base">
                <p className="font-semibold text-zinc-200">OEKO-TEX® Standard 100</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Zero Harmful Substances & Safe Inks</p>
              </div>
              <div className="p-2.5 bg-zinc-900/80 border-hairline border-zinc-800 rounded-base">
                <p className="font-semibold text-zinc-200">AQL 1.0 / 2.5 Protocol</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Rigorous 4-Stage In-Line Quality Gates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Direct DDP Air & Ocean Freight</span>
            <span>Non-Disclosure Protected (NDA)</span>
            <span>24/7 Logistics Tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
