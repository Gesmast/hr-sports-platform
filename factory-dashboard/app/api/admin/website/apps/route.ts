import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  category: 'Social' | 'Chat' | 'Marketing' | 'Trust' | 'Developer';
  installed: boolean;
  icon: string;
  description: string;
  features: string[];
  settings: Record<string, any>;
}

const DEFAULT_APPS: AppItem[] = [
  {
    id: 'facebook_community',
    name: 'Facebook & MacBook Showcase',
    tagline: 'Interactive SociableKit feed inside MacBook Pro mockup',
    category: 'Social',
    installed: true,
    icon: 'Share2',
    description:
      'Showcase your official Facebook Page community posts directly inside an interactive MacBook mockup with live video reels, customer comments, and follow links.',
    features: [
      'Interactive MacBook screen with webcam notch',
      'SociableKit dynamic post auto-syncing',
      'Follow button with verified follower count',
      'Fully responsive aspect ratio 736/590',
    ],
    settings: {
      facebookUrl: 'https://www.facebook.com/thehrsports',
      embedId: '25727583',
      eyebrow: 'Official Community',
      heading: 'Stay connected with us.',
      accent: 'Follow our journey.',
      followerText: '12.4K+ Active Sports Clubs & Apparel Buyers',
    },
  },
  {
    id: 'whatsapp_concierge',
    name: 'WhatsApp 24/7 Floating Concierge',
    tagline: 'One-click direct WhatsApp chat bubble for B2B RFQs',
    category: 'Chat',
    installed: true,
    icon: 'MessageCircle',
    description:
      'Pint-sized high-converting WhatsApp chat button pinned to the bottom-right corner of the storefront for instant quote questions and tech pack submissions.',
    features: [
      'Pre-filled message template for custom quotes',
      'Custom phone number with international country code',
      'Zero impact on page load speed',
      'Works seamlessly on mobile and desktop',
    ],
    settings: {
      enabled: true,
      phoneNumber: '+923000000000',
      buttonText: 'Chat on WhatsApp',
      greetingMessage: 'Hi HR Sports! I want to inquire about custom sportswear manufacturing.',
    },
  },
  {
    id: 'meta_pixel',
    name: 'Meta Pixel & Conversion API',
    tagline: 'Track quotation funnel and optimize Facebook ads',
    category: 'Marketing',
    installed: false,
    icon: 'Activity',
    description:
      'Track PageView, ViewContent (Apparel categories), and QuoteSubmission conversion events for high-ROI Meta remarketing.',
    features: [
      'Tracks quote form submission conversions',
      'Supports standard Meta Pixel ID',
      'Automatic GDPR consent compatibility',
    ],
    settings: {
      pixelId: '',
    },
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics 4 (GA4)',
    tagline: 'Enterprise B2B visitor journey and quote conversion tracking',
    category: 'Marketing',
    installed: false,
    icon: 'BarChart3',
    description:
      'Track international traffic from UK, USA, Europe, and Australia, identifying which styles and sports drive the highest engagement.',
    features: [
      'Seamless GA4 Measurement ID integration',
      'Tracks 3D mockup interaction clicks',
      'Tracks PDF spec sheet downloads',
    ],
    settings: {
      measurementId: '',
    },
  },
  {
    id: 'trustpilot_reviews',
    name: 'Trustpilot & Verified Reviews',
    tagline: 'Display authentic athletic director and club president stars',
    category: 'Trust',
    installed: false,
    icon: 'Star',
    description:
      'Display verified sports club reviews, star ratings, and athletic testimonials directly in the storefront to build buyer trust.',
    features: [
      '5-star customer review rating badge',
      'Customizable testimonial slider',
      'Club name and country flags',
    ],
    settings: {
      businessUnitId: '',
      minRating: '4',
    },
  },
  {
    id: 'custom_embed',
    name: 'Custom HTML / JS Embed Block',
    tagline: 'Inject any 3rd-party widget, script, or lead form',
    category: 'Developer',
    installed: true,
    icon: 'Code',
    description:
      'Add custom widgets, Google Maps, Jotform/Typeform intake sheets, or custom live chat widgets anywhere on any page.',
    features: [
      'Raw HTML & script tag execution',
      'Custom section padding and alignment',
      'Isolated sandbox rendering',
    ],
    settings: {
      snippet: '',
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const sb = getAdminClient();
    const { data, error } = await sb
      .from('hrsg_settings')
      .select('value')
      .eq('key', 'website_installed_apps')
      .maybeSingle();

    if (error || !data || !data.value) {
      return NextResponse.json({ success: true, apps: DEFAULT_APPS });
    }

    try {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      return NextResponse.json({ success: true, apps: parsed });
    } catch {
      return NextResponse.json({ success: true, apps: DEFAULT_APPS });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appId, action, settings } = body;

    const sb = getAdminClient();
    const { data } = await sb
      .from('hrsg_settings')
      .select('value')
      .eq('key', 'website_installed_apps')
      .maybeSingle();

    let currentApps: AppItem[] = DEFAULT_APPS;
    if (data && data.value) {
      try {
        currentApps = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      } catch {}
    }

    currentApps = currentApps.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          installed: action === 'install' ? true : action === 'uninstall' ? false : app.installed,
          settings: settings ? { ...app.settings, ...settings } : app.settings,
        };
      }
      return app;
    });

    await sb.from('hrsg_settings').upsert({
      key: 'website_installed_apps',
      value: JSON.stringify(currentApps),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, apps: currentApps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
