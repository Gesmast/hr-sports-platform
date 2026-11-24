import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { defaultThemeData } from '@/lib/theme/puck-config';

export const dynamic = 'force-dynamic';

// Per-page default theme structures matching the live website
const PAGE_TEMPLATES: Record<string, any> = {
  home: defaultThemeData,
  // ── APPAREL SUBCATEGORY TEMPLATES (Accessed via Header Apparel Dropdown) ──
  'cat-cricket': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-cricket',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'CRICKET KITS',
          text: 'Custom Cricket Whites, T20 Sublimated Matchwear & Training Trackpants — 15 Pcs MOQ',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=cricket',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-cricket',
          categoryName: 'Cricket',
          tagline: 'Matchday Whites, Colored T20 Kits & Training Gear',
          description: 'Professional grade cricket uniforms engineered with moisture-wicking AeroVent™ pinhole mesh, UV 50+ sun protection, and reinforced stretch panels for high-intensity bowling and batting.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-cricket',
          columns: 3,
          showMaterials: true,
          moqNotice: '15 pieces minimum • Physical pre-production sample approval before batch cutting',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'cricket-cta',
          headlineTop: "LET'S",
          headlineBottom: 'TALK?',
          speechBubble: 'Custom cricket uniforms.',
          subtitle: 'Send us your team colors, player rosters, or sponsor artwork. We build 3D CAD mockups in 24 hours.',
          primaryButtonText: 'Request cricket quote',
          primaryButtonLink: '/request-a-quote?category=cricket',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Cricket' } },
  },
  'cat-football': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-football',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'SOCCER & FOOTBALL',
          text: 'Pro Matchday Jerseys, Ergonomic Shorts & Training Tracksuits — 1200 DPI Sublimation',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=football',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-football',
          categoryName: 'Football / Soccer',
          tagline: 'Pro Matchday & Tournament Kits',
          description: 'High-definition 1200 DPI sublimated kits, FA-compliant pro matchday jerseys, breathable shorts, and technical training drill tracksuits.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-football',
          columns: 3,
          showMaterials: true,
          moqNotice: '15 pieces minimum • Physical pre-production sample approval before batch cutting',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'football-cta',
          headlineTop: "LET'S",
          headlineBottom: 'TALK?',
          speechBubble: 'Pro soccer kits.',
          subtitle: 'From grassroots youth clubs to pro academies, we manufacture durable sublimation match kits.',
          primaryButtonText: 'Request soccer quote',
          primaryButtonLink: '/request-a-quote?category=football',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Football / Soccer' } },
  },
  'cat-basketball': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-basketball',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'BASKETBALL',
          text: 'Game Jerseys, Open-Hole Mesh Shorts & Warmup Shooting Shirts — Pro Articulation',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=basketball',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-basketball',
          categoryName: 'Basketball',
          tagline: 'Game Jerseys & Open-Hole Mesh Shorts',
          description: 'Tournament-ready basketball uniforms crafted from double-knit ProDura™ poly, reversible match singlets, and heavyweight open-hole mesh shorts with deep pockets.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-basketball',
          columns: 3,
          showMaterials: true,
          moqNotice: '15 pieces minimum • Physical pre-production sample approval before batch cutting',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'basketball-cta',
          headlineTop: "LET'S",
          headlineBottom: 'TALK?',
          speechBubble: 'Court-ready apparel.',
          subtitle: 'Submit your roster names, numbers, and colorway codes for full 3D mockups.',
          primaryButtonText: 'Request basketball quote',
          primaryButtonLink: '/request-a-quote?category=basketball',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Basketball' } },
  },
  'cat-gym': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-gym',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'ACTIVEWEAR',
          text: 'Four-Way Stretch Compression Tops, Squat-Proof Leggings & Aesthetic Gym Tanks',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=gym-activewear',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-gym',
          categoryName: 'Gym & Activewear',
          tagline: 'Seamless & Aesthetic Performance Apparel',
          description: 'High-elastane interlock fabrics, moisture management finishes, flatlock seam chafe protection, and squat-tested non-sheer pro leggings for commercial fitness brands.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-gym',
          columns: 3,
          showMaterials: true,
          moqNotice: '30 pieces minimum • Sample approval before batch cutting',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'gym-cta',
          headlineTop: "BUILD",
          headlineBottom: 'YOUR BRAND',
          speechBubble: 'Private label fitness apparel.',
          subtitle: 'Launch your private label activewear line with custom care labels, silicone branding, and retail hangtags.',
          primaryButtonText: 'Request activewear quote',
          primaryButtonLink: '/request-a-quote?category=gym-activewear',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Gym & Activewear' } },
  },
  'cat-hockey': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-hockey',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'HOCKEY KITS',
          text: 'Heavyweight Sublimated Hockey Sweaters, Shells & Field Uniforms — Cut-Resistant Reinforcement',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=hockey',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-hockey',
          categoryName: 'Hockey',
          tagline: 'Pro Sublimated Ice & Field Hockey Kits',
          description: 'Heavyweight snag-resistant poly knitted fabrics, reinforced elbow articulation, fight-strap attachment, and breathable mesh inserts.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-hockey',
          columns: 3,
          showMaterials: true,
          moqNotice: '15 pieces minimum • Physical pre-production sample approval before batch cutting',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'hockey-cta',
          headlineTop: "LET'S",
          headlineBottom: 'TALK?',
          speechBubble: 'Pro hockey uniforms.',
          subtitle: 'Custom jerseys for pro leagues, collegiate tournaments, and junior associations.',
          primaryButtonText: 'Request hockey quote',
          primaryButtonLink: '/request-a-quote?category=hockey',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Hockey' } },
  },
  'cat-corporate': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-corporate',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'CORPORATE WORKWEAR',
          text: 'Executive Tech Polos, Embroidered Corporate Softshells & Hospitality Uniforms',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=corporate-uniforms',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-corporate',
          categoryName: 'Corporate Uniforms',
          tagline: 'Executive Tech Polos & Corporate Workwear',
          description: 'Wrinkle-resistant technical pique polos, custom embroidered blazers, softshell jackets, and hospitality uniforms tailored for company teams.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-corporate',
          columns: 3,
          showMaterials: true,
          moqNotice: '30 pieces minimum • Embroidery swatch sign-off before production',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'corporate-cta',
          headlineTop: "OUTFIT",
          headlineBottom: 'YOUR TEAM',
          speechBubble: 'Executive corporate uniforms.',
          subtitle: 'Consistent Pantone-matched company branding across all employee shirts, jackets, and accessories.',
          primaryButtonText: 'Request corporate quote',
          primaryButtonLink: '/request-a-quote?category=corporate-uniforms',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Corporate Uniforms' } },
  },
  'cat-security': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-security',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'SECURITY & TACTICAL',
          text: 'Ripstop Tactical Cargo Pants, Patrol Shirts, High-Visibility Vests & Security Uniforms',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=security-uniforms',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-security',
          categoryName: 'Security Uniforms',
          tagline: 'Tactical Cargo, Ripstop Patrol Shirts & Vests',
          description: 'Reinforced 65/35 poly-cotton ripstop fabrics, Teflon stain-repellent finish, badge holder tabs, epaulets, and heavy-duty triple-stitched seams.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-security',
          columns: 3,
          showMaterials: true,
          moqNotice: '30 pieces minimum • Sample sign-off before batch production',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'security-cta',
          headlineTop: "TACTICAL",
          headlineBottom: 'PRECISION',
          speechBubble: 'Industrial tactical gear.',
          subtitle: 'Engineered for durability on the frontline. Custom patrol uniform contracts available.',
          primaryButtonText: 'Request tactical quote',
          primaryButtonLink: '/request-a-quote?category=security-uniforms',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Security Uniforms' } },
  },
  'cat-promotional': {
    content: [
      {
        type: 'AnnouncementBar',
        props: {
          id: 'announcement-bar-promotional',
          enabled: true,
          animation: 'marquee',
          speed: 5,
          backgroundColor: '#0A0A0A',
          textColor: '#FFFFFF',
          badge: 'PROMOTIONAL APPAREL',
          text: 'High-Volume Event Tees, Exhibition Polos, Custom Caps & Branded Merchandise',
          linkText: 'Request Priority Tech Pack →',
          linkUrl: '/request-a-quote?category=promotional-uniforms',
          dismissible: false,
        },
      },
      {
        type: 'CategoryHeader',
        props: {
          id: 'category-header-promotional',
          categoryName: 'Promotional Uniforms',
          tagline: 'Event Crew Tees, Exhibition Polos & Caps',
          description: 'Cost-effective high-volume combed cotton t-shirts, silk-screen and DTF printed event merchandise, embroidered 6-panel caps, and staff uniforms.',
          badgeText: 'Coming Soon',
          showBadge: true,
        },
      },
      {
        type: 'CategoryProductGrid',
        props: {
          id: 'category-grid-promotional',
          columns: 3,
          showMaterials: true,
          moqNotice: '50 pieces minimum • Fast 7–10 days production for major corporate events',
          quoteButtonText: 'Request Priority Quote',
        },
      },
      {
        type: 'HomeCta',
        props: {
          id: 'promotional-cta',
          headlineTop: "HIGH VOLUME",
          headlineBottom: 'EVENTS',
          speechBubble: 'Event & crew merchandise.',
          subtitle: 'Direct factory pricing on bulk exhibition uniforms, marathon t-shirts, and staff merchandise.',
          primaryButtonText: 'Request event quote',
          primaryButtonLink: '/request-a-quote?category=promotional-uniforms',
          secondaryButtonText: 'Explore other styles',
          secondaryButtonLink: '/#styles',
        },
      },
    ],
    root: { props: { title: 'Apparel: Promotional Uniforms' } },
  },
};

function normalizeThemeData(themeData: any, pageId: string) {
  if (!themeData || !Array.isArray(themeData.content)) return themeData;
  if (pageId === 'home') {
    // Ensure HeaderNav section exists right below AnnouncementBar if missing
    const hasHeaderNav = themeData.content.some((item: any) => item?.type === 'HeaderNav' || item?.type === 'LiveHeaderNav');
    if (!hasHeaderNav) {
      const barIndex = themeData.content.findIndex((item: any) => item?.type === 'AnnouncementBar' || item?.type === 'LiveAnnouncementBar');
      const headerItem = {
        type: 'HeaderNav',
        props: {
          id: 'header-nav-1',
          stickyMode: 'scroll-up',
          quoteButtonText: 'Request a Quote',
          quoteButtonLink: '/request-a-quote',
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
          contactAddress: 'Green Building, Block B New Chauburji Park, Multan Road, Lahore, 54000, Pakistan',
          contactHours: 'Mon to Saturday 9 am to 10 pm',
          contactPhone: '+92 313 8484511',
          contactEmail: 'sales@thehrsports.com',
        },
      };
      if (barIndex !== -1) {
        themeData.content.splice(barIndex + 1, 0, headerItem);
      } else {
        themeData.content.unshift(headerItem);
      }
    }

    themeData.content = themeData.content.map((item: any) => {
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
      } else if (item && (item.type === 'HeaderNav' || item.type === 'LiveHeaderNav')) {
        item.props = {
          stickyMode: 'scroll-up',
          quoteButtonText: 'Request a Quote',
          quoteButtonLink: '/request-a-quote',
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
          contactAddress: 'Green Building, Block B New Chauburji Park, Multan Road, Lahore, 54000, Pakistan',
          contactHours: 'Mon to Saturday 9 am to 10 pm',
          contactPhone: '+92 313 8484511',
          contactEmail: 'sales@thehrsports.com',
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
  }
  return themeData;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('page') || 'home';
    const isReset = searchParams.get('reset') === 'true';
    const wantHistory = searchParams.get('history') === 'true';

    const storageKey = `website_theme_${pageId}`;
    const draftKey = `website_theme_${pageId}_draft`;
    const historyKey = `website_theme_${pageId}_history`;
    const fallbackTemplate = normalizeThemeData(PAGE_TEMPLATES[pageId] || defaultThemeData, pageId);

    const sb = getAdminClient();

    // Return version history if requested
    if (wantHistory) {
      const { data: histData } = await sb
        .from('hrsg_settings')
        .select('value')
        .eq('key', historyKey)
        .maybeSingle();

      let historyList = [];
      try {
        if (histData?.value) {
          historyList = typeof histData.value === 'string' ? JSON.parse(histData.value) : histData.value;
        }
      } catch {}
      return NextResponse.json({ success: true, history: historyList });
    }

    // If reset requested, overwrite in Supabase with clean default and return it immediately
    if (isReset) {
      const now = new Date().toISOString();
      await sb.from('hrsg_settings').upsert({
        key: storageKey,
        value: JSON.stringify(fallbackTemplate),
        updated_at: now,
      });
      await sb.from('hrsg_settings').upsert({
        key: draftKey,
        value: JSON.stringify(fallbackTemplate),
        updated_at: now,
      });
      return NextResponse.json({
        success: true,
        data: fallbackTemplate,
        isReset: true,
        updatedAt: now,
      });
    }

    // Load working draft first if available
    const { data: draftData } = await sb
      .from('hrsg_settings')
      .select('value, updated_at')
      .eq('key', draftKey)
      .maybeSingle();

    if (draftData?.value) {
      try {
        const parsed = typeof draftData.value === 'string' ? JSON.parse(draftData.value) : draftData.value;
        return NextResponse.json({
          success: true,
          data: normalizeThemeData(parsed, pageId),
          updatedAt: draftData.updated_at,
          isDraft: true,
        });
      } catch {}
    }

    // Fallback to live published key
    const { data, error } = await sb
      .from('hrsg_settings')
      .select('value, updated_at')
      .eq('key', storageKey)
      .maybeSingle();

    if (error || !data || !data.value) {
      return NextResponse.json({ success: true, data: fallbackTemplate, isDefault: true });
    }

    try {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      return NextResponse.json({
        success: true,
        data: normalizeThemeData(parsed, pageId),
        updatedAt: data.updated_at,
      });
    } catch {
      return NextResponse.json({ success: true, data: fallbackTemplate, isDefault: true });
    }
  } catch (err: any) {
    console.error('Failed to get website theme:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, page = 'home', publish = false, rollbackId } = body;

    const storageKey = `website_theme_${page}`;
    const draftKey = `website_theme_${page}_draft`;
    const historyKey = `website_theme_${page}_history`;
    const sb = getAdminClient();

    // 1. Handle Version Rollback
    if (rollbackId) {
      const { data: histData } = await sb
        .from('hrsg_settings')
        .select('value')
        .eq('key', historyKey)
        .maybeSingle();

      let historyList: any[] = [];
      try {
        if (histData?.value) {
          historyList = typeof histData.value === 'string' ? JSON.parse(histData.value) : histData.value;
        }
      } catch {}

      const targetRevision = historyList.find((rev: any) => rev.id === rollbackId);
      if (!targetRevision || !targetRevision.data) {
        return NextResponse.json({ success: false, error: 'Revision not found' }, { status: 404 });
      }

      const restoredData = targetRevision.data;
      const now = new Date().toISOString();

      await sb.from('hrsg_settings').upsert({
        key: draftKey,
        value: JSON.stringify(restoredData),
        updated_at: now,
      });

      historyList.unshift({
        id: `rev_${Date.now()}`,
        timestamp: now,
        status: 'rollback',
        note: `Restored to revision from ${new Date(targetRevision.timestamp).toLocaleTimeString()}`,
        data: restoredData,
      });

      await sb.from('hrsg_settings').upsert({
        key: historyKey,
        value: JSON.stringify(historyList.slice(0, 20)),
        updated_at: now,
      });

      return NextResponse.json({
        success: true,
        data: restoredData,
        message: 'Successfully restored to selected revision.',
      });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'No theme data provided' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const jsonStr = JSON.stringify(data);

    // 2. Always save to draft
    await sb.from('hrsg_settings').upsert({
      key: draftKey,
      value: jsonStr,
      updated_at: now,
    });

    // 3. If publishing live, save to main live key and trigger Next.js cache revalidation
    if (publish) {
      const { error } = await sb.from('hrsg_settings').upsert({
        key: storageKey,
        value: jsonStr,
        updated_at: now,
      });

      if (error) {
        console.error('Failed to publish theme data:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Webhook call to Next.js storefront revalidatePath
      try {
        const targetPath = page === 'home' ? '/' : `/${page}`;
        const revalUrl = `http://localhost:3000/api/revalidate?secret=hrsports_theme_revalidate_2026&path=${targetPath}`;
        await fetch(revalUrl, { method: 'POST' });
      } catch (revalErr) {
        console.warn('[Theme Publish] Storefront revalidation webhook ping failed:', revalErr);
      }
    }

    // 4. Record in Version History (keep last 20 revisions)
    try {
      const { data: histData } = await sb
        .from('hrsg_settings')
        .select('value')
        .eq('key', historyKey)
        .maybeSingle();

      let historyList: any[] = [];
      if (histData?.value) {
        try {
          historyList = typeof histData.value === 'string' ? JSON.parse(histData.value) : histData.value;
        } catch {}
      }

      historyList.unshift({
        id: `rev_${Date.now()}`,
        timestamp: now,
        status: publish ? 'published' : 'draft',
        data,
      });

      await sb.from('hrsg_settings').upsert({
        key: historyKey,
        value: JSON.stringify(historyList.slice(0, 20)),
        updated_at: now,
      });
    } catch (histErr) {
      console.warn('History append error:', histErr);
    }

    return NextResponse.json({
      success: true,
      message: publish
        ? `Theme for ${page.toUpperCase()} published live! Storefront cache purged instantly.`
        : `Theme draft for ${page.toUpperCase()} saved. You can publish live when ready.`,
    });
  } catch (err: any) {
    console.error('Failed to save website theme:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
