import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const defaultAnnouncementProps = {
  enabled: true,
  animation: 'marquee' as const,
  speed: 5,
  pauseOnHover: true,
  height: 'normal' as const,
  textSize: 'xs' as const,
  customTextSize: 12,
  paddingVertical: 'normal' as const,
  customPadding: 8,
  backgroundColor: '#0A0A0A',
  textColor: '#FFFFFF',
  badgeBgColor: 'rgba(255, 255, 255, 0.2)',
  badgeTextColor: '#FFFFFF',
  badge: 'FACTORY DIRECT',
  text: 'Custom Sports Apparel OEM Manufacturer — 24h Formal Quotation, 3D Mockups & Global Shipping',
  linkText: 'Request Quote →',
  linkUrl: '/#styles',
  badge2: '3D CAD PROOFS',
  text2: 'Free 3D Digital Mockup with every Club, School & Brand Inquiry',
  linkText2: 'Upload Specs →',
  linkUrl2: '/#styles',
  badge3: 'WORLDWIDE COURIER',
  text3: 'Fast 7-Day Express Dispatch to UK, USA, Europe & Australia',
  linkText3: 'Check Shipping →',
  linkUrl3: '/shipping-and-returns',
  dismissible: false,
};

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        success: true,
        announcementBar: defaultAnnouncementProps,
        isFallback: true,
      });
    }

    const sb = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await sb
      .from('hrsg_settings')
      .select('value, updated_at')
      .eq('key', 'website_theme_home')
      .maybeSingle();

    if (error || !data || !data.value) {
      return NextResponse.json({
        success: true,
        announcementBar: defaultAnnouncementProps,
        isDefault: true,
      });
    }

    let parsed: any = null;
    try {
      parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    } catch {
      return NextResponse.json({
        success: true,
        announcementBar: defaultAnnouncementProps,
        isDefault: true,
      });
    }

    // Find the AnnouncementBar item in the Puck content array and normalize Hero, HowWeWork & ClientReviews defaults
    let announcementProps = defaultAnnouncementProps;
    if (parsed && Array.isArray(parsed.content)) {
      parsed.content = parsed.content.map((item: any) => {
        if (item && (item.type === 'HeroSection' || item.type === 'Hero')) {
          item.props = {
            ...item.props,
            heroVideo1: item.props?.heroVideo1 || '/hero-section-videos/new-video-1.mp4',
            heroVideo2: item.props?.heroVideo2 || '/hero-section-videos/hero-video-2.mp4',
            heroVideo3: item.props?.heroVideo3 || '/hero-section-videos/hero-video-3.mp4',
            aspectRatio: item.props?.aspectRatio || '9/16',
            videoHeight: item.props?.videoHeight || 'medium',
            videoFit: item.props?.videoFit || 'cover',
            videoZoom: item.props?.videoZoom || '1.0',
            borderRadius: item.props?.borderRadius || 'large',
            overlayDarkness: item.props?.overlayDarkness || 'subtle',
          };
        } else if (item && item.type === 'HowWeWork') {
          item.props = {
            title: 'How We Work.',
            subtitle: 'Six transparent manufacturing stations from digital CAD mockups to global dispatch.',
            stage1Title: 'Design.',
            stage1Description: 'Our in-house designers create your custom designs and mockups according to your exact needs. Send us a sketch, a photo, or an idea—we build full 2D and 3D visual mockups and production-ready vector patterns.',
            stage1Video: '/process-videos/design-1.mp4',
            stage2Title: 'Precision Hand Cutting.',
            stage2Description: 'Every panel is cut 100% by hand by master pattern cutters using high-precision shears. No laser burning and no melted edges, preserving the full natural stretch, softness, and grain alignment of performance fabrics.',
            stage2Video: '/process-videos/cutting-1.mp4',
            stage3Title: 'Sublimation Printing.',
            stage3Description: 'Custom artwork, sponsor logos, and vibrant colors are molecularly infused directly into technical fibers using high-heat thermal presses. Zero cracking, zero peeling, and permanent wash-fast durability.',
            stage3Video: '/process-videos/printing-1.mp4',
            stage3Video2: '/process-videos/printing-2.mp4',
            stage4Title: 'Stitching & Assembly.',
            stage4Description: 'Cut panels are assembled using 4-needle flatlock and heavy-duty athletic overlock machines. Seams lie completely flush against the skin to eliminate friction and withstand high-stress game movement.',
            stage4Video: '/process-videos/stitching-1.mp4',
            stage5Title: 'Quality Check & Global Shipping.',
            stage5Description: 'Every piece is hand-inspected for measurements and stitch integrity, steam-pressed, custom tagged with your woven brand labels and polybags, and dispatched worldwide via tracked express air freight.',
            stage5Video: '/process-videos/packing-1.mp4',
            stage5Video2: '/process-videos/packing-2.mp4',
            ...item.props,
          };
        } else if (item && (item.type === 'AnnouncementBar' || item.type === 'LiveAnnouncementBar')) {
          item.props = {
            textSize: 'xs',
            customTextSize: 12,
            paddingVertical: 'normal',
            customPadding: 8,
            ...item.props,
          };
        } else if (item && item.type === 'ClientReviews') {
          item.props = {
            heading: 'What clients say.',
            subheading: 'In their own words.',
            review1Name: 'Marcus Vance',
            review1Company: 'Vance Grappling Co. · USA',
            review1Text: 'The seam strength and flatlock stitching on our rashguards are exceptional. Tested over hundreds of hours on the mats with zero unraveling. True direct factory quality.',
            review1Initials: 'MV',
            review2Name: 'Liam O’Connor',
            review2Company: 'Dublin Athletic Club · Ireland',
            review2Text: 'We bypassed the middleman and worked directly with HR Sports. Sublimation colors matched our Pantone codes 1:1, and direct pricing cut our kit costs by 30%.',
            review2Initials: 'LO',
            review3Name: 'Callum Davies',
            review3Company: 'AeroCycle Apparel · Australia',
            review3Text: 'Their pattern team turned our sketches into factory CAD files in 48 hours. The sample arrived in Sydney in 6 days and went straight to full production.',
            review3Initials: 'CD',
            review4Name: 'Sophie Dubois',
            review4Company: 'Nordic Sprint Lab · France',
            review4Text: 'Hand cutting makes a world of difference compared to laser. No stiff melted edges, and the natural stretch of the technical polyester remains fully intact.',
            review4Initials: 'SD',
            ...item.props,
          };
        }
        return item;
      });

      const barItem = parsed.content.find(
        (item: any) => item.type === 'AnnouncementBar' || item.type === 'LiveAnnouncementBar'
      );
      if (barItem && barItem.props) {
        announcementProps = {
          ...defaultAnnouncementProps,
          ...barItem.props,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      announcementBar: announcementProps,
      updatedAt: data.updated_at,
    });
  } catch (err: any) {
    console.error('Failed to get public website theme:', err);
    return NextResponse.json({
      success: true,
      announcementBar: defaultAnnouncementProps,
      fallbackError: err.message,
    });
  }
}
