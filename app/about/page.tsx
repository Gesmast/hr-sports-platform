import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowLeft, Sparkles, Factory, ArrowRight, ShieldCheck, Globe, Users } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: `About Us | ${SITE_CONFIG.name}`,
  description: `Learn about ${SITE_CONFIG.name} — our 18-year industrial sportswear OEM heritage, advanced digital sublimation machinery, and export operations in Lahore, Pakistan.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070708] text-[#F5F5F7] selection:bg-white selection:text-black">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Industrial OEM Facility</span>
          </div>
        </div>
      </div>

      {/* Main Content Hero */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center space-y-10">
        
        {/* Coming Soon Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono tracking-widest uppercase text-white/90">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Detailed Factory Experience & Heritage</span>
        </div>

        {/* Big Bold Coming Soon Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
            Coming Soon
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#F5F5F7]/70 max-w-3xl mx-auto leading-relaxed">
            We are curating an in-depth interactive journey through our <strong className="text-white font-semibold">18-year manufacturing legacy</strong>, 
            facility infrastructure, laser-cutting floors, and sustainable fabric mills in Lahore.
          </p>
        </div>

        {/* Stats Strip Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white">{SITE_CONFIG.yearsInOperation}+</div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/50 mt-1">Years Operating</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white">{SITE_CONFIG.annualGarmentsProduced}</div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/50 mt-1">Annual Capacity</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white">{SITE_CONFIG.countriesExported}+</div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/50 mt-1">Export Markets</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-3xl sm:text-4xl font-black text-white">15 Units</div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/50 mt-1">Accessible MOQ</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/request-a-quote">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold px-8">
              Request a Production Quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-medium px-8">
              Contact Factory Desk
            </Button>
          </Link>
          <Link href="/faq">
            <Button size="lg" variant="ghost" className="text-white/70 hover:text-white font-medium">
              Browse FAQs
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
