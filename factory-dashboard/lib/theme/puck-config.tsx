import React from 'react';
import type { Config, Data } from '@puckeditor/core';
import { MediaUploadField } from './MediaUploadField';
import { ShopifyColorPicker } from './ShopifyColorPicker';
import {
  LiveAnnouncementBar,
  AnnouncementBarProps,
  LiveHeroSection,
  HeroSectionProps,
  LiveTrustedByStrip,
  TrustedByStripProps,
  LiveHowWeWork,
  HowWeWorkProps,
  LiveShipWorldwideGrid,
  ShipWorldwideGridProps,
  LiveClientReviews,
  ClientReviewsProps,
  LiveSocialFollowApp,
  SocialFollowAppProps,
  LiveHomeCta,
  HomeCtaProps,
  LiveWhatsAppConciergeApp,
  WhatsAppConciergeAppProps,
  LiveRichTextSection,
  RichTextSectionProps,
  LiveChooseYourStyle,
  ChooseYourStyleProps,
  LiveWhyChooseHRSports,
  WhyChooseHRSportsProps,
  LiveCapabilityGrid,
  CapabilityGridProps,
  LiveHomeFAQSection,
  HomeFAQSectionProps,
  LiveCoreValues,
  CoreValuesProps,
  LiveVisionMission,
  VisionMissionProps,
  LiveLocalRetailComparisonTable,
  LocalRetailComparisonTableProps,
  LiveTheHRSportsBanner,
  TheHRSportsBannerProps,
  LiveVideoSection,
  VideoSectionProps,
  LiveHeaderNav,
  HeaderNavProps,
  LiveCategoryHeader,
  CategoryHeaderProps,
  LiveCategoryProductGrid,
  CategoryProductGridProps,
} from './components';

export type ThemeComponentProps = {
  AnnouncementBar: AnnouncementBarProps;
  HeaderNav: HeaderNavProps;
  CategoryHeader: CategoryHeaderProps;
  CategoryProductGrid: CategoryProductGridProps;
  HeroSection: HeroSectionProps;
  TrustedByStrip: TrustedByStripProps;
  TheHRSportsBanner: TheHRSportsBannerProps;
  VideoSection: VideoSectionProps;
  ChooseYourStyle: ChooseYourStyleProps;
  HowWeWork: HowWeWorkProps;
  WhyChooseHRSports: WhyChooseHRSportsProps;
  CapabilityGrid: CapabilityGridProps;
  ShipWorldwideGrid: ShipWorldwideGridProps;
  ClientReviews: ClientReviewsProps;
  LocalRetailComparisonTable: LocalRetailComparisonTableProps;
  CoreValues: CoreValuesProps;
  VisionMission: VisionMissionProps;
  HomeFAQSection: HomeFAQSectionProps;
  HomeCta: HomeCtaProps;
  SocialFollowApp: SocialFollowAppProps;
  WhatsAppConciergeApp: WhatsAppConciergeAppProps;
  RichTextSection: RichTextSectionProps;
};

export const themeConfig: Config<ThemeComponentProps> = {
  categories: {
    header: {
      title: 'Header & Banners',
      components: ['AnnouncementBar', 'HeaderNav', 'TrustedByStrip', 'TheHRSportsBanner'],
    },
    hero: {
      title: 'Hero & Storefront',
      components: ['HeroSection'],
    },
    media: {
      title: 'Video & Media Banners',
      components: ['VideoSection'],
    },
    apparel: {
      title: 'Apparel & Catalog',
      components: ['ChooseYourStyle', 'CategoryHeader', 'CategoryProductGrid'],
    },
    production: {
      title: 'Manufacturing & Process',
      components: ['HowWeWork', 'WhyChooseHRSports', 'CapabilityGrid', 'ShipWorldwideGrid'],
    },
    proof: {
      title: 'Reviews & Proof',
      components: ['ClientReviews', 'LocalRetailComparisonTable'],
    },
    company: {
      title: 'Company & Heritage',
      components: ['CoreValues', 'VisionMission'],
    },
    faq: {
      title: 'FAQ & Help',
      components: ['HomeFAQSection'],
    },
    conversion: {
      title: 'Conversion & Quotation',
      components: ['HomeCta', 'RichTextSection'],
    },
    social: {
      title: 'Social & Support',
      components: ['SocialFollowApp', 'WhatsAppConciergeApp'],
    },
  },
  components: {
    /* 1. ANNOUNCEMENT BAR (Shopify-Style Dynamic Animation Fields & Color Picker) */
    AnnouncementBar: {
      label: 'Announcement Bar',
      resolveFields: (data: any, { fields }: any) => {
        const anim = data.props?.animation || 'marquee';

        const dynamicFields: any = {
          enabled: fields.enabled,
          animation: fields.animation,
          paddingVertical: fields.paddingVertical,
        };

        // Only show customPadding when 'custom' is selected
        if (data.props?.paddingVertical === 'custom') {
          dynamicFields.customPadding = fields.customPadding;
        }

        dynamicFields.textSize = fields.textSize;

        // Only show customTextSize when 'custom' is selected
        if (data.props?.textSize === 'custom') {
          dynamicFields.customTextSize = fields.customTextSize;
        }

        dynamicFields.backgroundColor = fields.backgroundColor;
        dynamicFields.textColor = fields.textColor;
        dynamicFields.badgeBgColor = fields.badgeBgColor;
        dynamicFields.badgeTextColor = fields.badgeTextColor;
        dynamicFields.dismissible = fields.dismissible;

        if (anim === 'marquee') {
          dynamicFields.speed = {
            ...fields.speed,
            label: 'Marquee Scroll Speed (seconds)',
          };
          dynamicFields.pauseOnHover = fields.pauseOnHover;
          dynamicFields.slideCount = fields.slideCount;

          // Slide 1 is always visible
          dynamicFields.badge = fields.badge;
          dynamicFields.text = fields.text;
          dynamicFields.linkText = fields.linkText;
          dynamicFields.linkUrl = fields.linkUrl;

          // Slide 2 fields (shown if slideCount is 2 or 3)
          const sCount = Number(data.props?.slideCount) || 3;
          if (sCount >= 2) {
            dynamicFields.badge2 = fields.badge2;
            dynamicFields.text2 = fields.text2;
            dynamicFields.linkText2 = fields.linkText2;
            dynamicFields.linkUrl2 = fields.linkUrl2;
          }

          // Slide 3 fields (shown if slideCount is 3)
          if (sCount >= 3) {
            dynamicFields.badge3 = fields.badge3;
            dynamicFields.text3 = fields.text3;
            dynamicFields.linkText3 = fields.linkText3;
            dynamicFields.linkUrl3 = fields.linkUrl3;
          }
        } else if (anim === 'slide' || anim === 'vertical-flip' || anim === 'crossfade') {
          dynamicFields.speed = {
            ...fields.speed,
            label: 'Slide Auto-Advance Interval (seconds)',
          };
          dynamicFields.pauseOnHover = fields.pauseOnHover;
          dynamicFields.slideCount = fields.slideCount;

          // Slide 1 is always visible
          dynamicFields.badge = fields.badge;
          dynamicFields.text = fields.text;
          dynamicFields.linkText = fields.linkText;
          dynamicFields.linkUrl = fields.linkUrl;

          // Slide 2 fields (shown if slideCount is 2 or 3)
          const sCount = Number(data.props?.slideCount) || 3;
          if (sCount >= 2) {
            dynamicFields.badge2 = fields.badge2;
            dynamicFields.text2 = fields.text2;
            dynamicFields.linkText2 = fields.linkText2;
            dynamicFields.linkUrl2 = fields.linkUrl2;
          }

          // Slide 3 fields (shown if slideCount is 3)
          if (sCount >= 3) {
            dynamicFields.badge3 = fields.badge3;
            dynamicFields.text3 = fields.text3;
            dynamicFields.linkText3 = fields.linkText3;
            dynamicFields.linkUrl3 = fields.linkUrl3;
          }
        } else {
          // 'static' or 'pulse' - Single static banner: no speed, no pause, no multi-slides!
          dynamicFields.badge = fields.badge;
          dynamicFields.text = fields.text;
          dynamicFields.linkText = fields.linkText;
          dynamicFields.linkUrl = fields.linkUrl;
        }

        return dynamicFields;
      },
      fields: {
        enabled: {
          type: 'radio',
          label: 'Bar Visibility',
          options: [
            { label: 'Active', value: true },
            { label: 'Hidden', value: false },
          ],
        },
        animation: {
          type: 'select',
          label: 'Animation Style',
          options: [
            { label: 'Continuous Marquee Ticker (Infinite Scroll)', value: 'marquee' },
            { label: 'Slide Carousel (Horizontal Flip with Controls)', value: 'slide' },
            { label: 'Smooth Crossfade (Soft Opacity)', value: 'crossfade' },
            { label: 'Vertical Rolling Board (Flip Up/Down)', value: 'vertical-flip' },
            { label: 'Pulsing Badge Attention Dot', value: 'pulse' },
            { label: 'Static Minimalist Bar', value: 'static' },
          ],
        },
        speed: { type: 'number', label: 'Speed / Auto-Rotate Interval (seconds)' },
        pauseOnHover: {
          type: 'radio',
          label: 'Pause on Mouse Hover',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        /* Vertical Padding & Spacing (Shopify Dawn Pattern) */
        paddingVertical: {
          type: 'select',
          label: 'Vertical Padding Preset',
          options: [
            { label: 'Normal (8px - 10px)', value: 'normal' },
            { label: 'Compact (4px - 6px)', value: 'compact' },
            { label: 'Spacious (14px - 16px)', value: 'spacious' },
            { label: 'Custom Pixel Value', value: 'custom' },
          ],
        },
        customPadding: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block">
                Custom Padding (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name={name}
                value={value !== undefined && value !== null ? String(value) : ''}
                placeholder="e.g. 8"
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  onChange(cleaned === '' ? undefined : parseInt(cleaned, 10));
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
              />
            </div>
          ),
        },

        /* Typography & Custom Text Sizing (Shopify Dawn Pattern) */
        textSize: {
          type: 'select',
          label: 'Text Font Size Preset',
          options: [
            { label: 'Small (11px / Compact)', value: 'xs' },
            { label: 'Medium (13px / Standard)', value: 'sm' },
            { label: 'Large (15px / Prominent)', value: 'base' },
            { label: 'Custom Pixel Value', value: 'custom' },
          ],
        },
        customTextSize: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold block">
                Custom Font Size (px)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name={name}
                value={value !== undefined && value !== null ? String(value) : ''}
                placeholder="e.g. 12"
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  onChange(cleaned === '' ? undefined : parseInt(cleaned, 10));
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
              />
            </div>
          ),
        },

        /* Integrated Shopify-Style Visual Color Pickers */
        backgroundColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Background Tone"
              value={value || '#0A0A0A'}
              defaultValue="#0A0A0A"
              onChange={onChange}
            />
          ),
        },
        textColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Text Tone"
              value={value || '#FFFFFF'}
              defaultValue="#FFFFFF"
              onChange={onChange}
            />
          ),
        },
        badgeBgColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Badge Pill Background"
              value={value || 'rgba(255, 255, 255, 0.2)'}
              defaultValue="rgba(255, 255, 255, 0.2)"
              onChange={onChange}
            />
          ),
        },
        badgeTextColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Badge Text Color"
              value={value || '#FFFFFF'}
              defaultValue="#FFFFFF"
              onChange={onChange}
            />
          ),
        },
        dismissible: {
          type: 'radio',
          label: 'Dismissible (Show Close Button)',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },

        /* Slide Count Control */
        slideCount: {
          type: 'select',
          label: 'Number of Active Announcements / Slides',
          options: [
            { label: '1 Announcement (Single Message)', value: 1 },
            { label: '2 Announcements', value: 2 },
            { label: '3 Announcements', value: 3 },
          ],
        },

        /* Slide 1 - Primary Announcement */
        badge: { type: 'text', label: 'Slide 1: Eyebrow Tag / Badge' },
        text: { type: 'textarea', label: 'Slide 1: Announcement Headline' },
        linkText: { type: 'text', label: 'Slide 1: CTA Label' },
        linkUrl: { type: 'text', label: 'Slide 1: CTA Link URL' },

        /* Slide 2 - Optional Second Announcement */
        badge2: { type: 'text', label: 'Slide 2: Eyebrow Tag / Badge (Optional)' },
        text2: { type: 'textarea', label: 'Slide 2: Announcement Headline (Optional)' },
        linkText2: { type: 'text', label: 'Slide 2: CTA Label' },
        linkUrl2: { type: 'text', label: 'Slide 2: CTA Link URL' },

        /* Slide 3 - Optional Third Announcement */
        badge3: { type: 'text', label: 'Slide 3: Eyebrow Tag / Badge (Optional)' },
        text3: { type: 'textarea', label: 'Slide 3: Announcement Headline (Optional)' },
        linkText3: { type: 'text', label: 'Slide 3: CTA Label' },
        linkUrl3: { type: 'text', label: 'Slide 3: CTA Link URL' },
      },
      defaultProps: {
        enabled: true,
        animation: 'marquee',
        speed: 5,
        pauseOnHover: true,
        height: 'normal',
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
        slideCount: 3,
      },
      render: (props) => <LiveAnnouncementBar {...props} />,
    },

    /* HEADER NAVIGATION & MEGA DROPDOWN (Shopify Dawn Style) */
    HeaderNav: {
      label: 'Header Navigation & Dropdowns',
      fields: {
        stickyMode: {
          type: 'select',
          label: 'Sticky Header Behavior',
          options: [
            { label: 'Sticky on Scroll Up', value: 'scroll-up' },
            { label: 'Always Sticky', value: 'always' },
            { label: 'Static / Not Sticky', value: 'none' },
          ],
        },
        quoteButtonText: { type: 'text', label: 'Quote Button Label' },
        quoteButtonLink: { type: 'text', label: 'Quote Button Destination' },

        /* ── Apparel Dropdown Column 1: Custom Sportswear ── */
        col1Heading: { type: 'text', label: 'Column 1 Heading (e.g. Custom Sportswear)' },
        col1Badge: { type: 'text', label: 'Column 1 Badge (e.g. Coming Soon)' },

        sportswear1Title: { type: 'text', label: 'Sportswear Item 1: Title' },
        sportswear1Desc: { type: 'text', label: 'Sportswear Item 1: Subtitle' },
        sportswear1Link: { type: 'text', label: 'Sportswear Item 1: Link' },

        sportswear2Title: { type: 'text', label: 'Sportswear Item 2: Title' },
        sportswear2Desc: { type: 'text', label: 'Sportswear Item 2: Subtitle' },
        sportswear2Link: { type: 'text', label: 'Sportswear Item 2: Link' },

        sportswear3Title: { type: 'text', label: 'Sportswear Item 3: Title' },
        sportswear3Desc: { type: 'text', label: 'Sportswear Item 3: Subtitle' },
        sportswear3Link: { type: 'text', label: 'Sportswear Item 3: Link' },

        sportswear4Title: { type: 'text', label: 'Sportswear Item 4: Title' },
        sportswear4Desc: { type: 'text', label: 'Sportswear Item 4: Subtitle' },
        sportswear4Link: { type: 'text', label: 'Sportswear Item 4: Link' },

        sportswear5Title: { type: 'text', label: 'Sportswear Item 5: Title' },
        sportswear5Desc: { type: 'text', label: 'Sportswear Item 5: Subtitle' },
        sportswear5Link: { type: 'text', label: 'Sportswear Item 5: Link' },

        /* ── Apparel Dropdown Column 2: Uniforms ── */
        col2Heading: { type: 'text', label: 'Column 2 Heading (e.g. Uniforms)' },
        col2Badge: { type: 'text', label: 'Column 2 Badge (e.g. Coming Soon)' },

        uniform1Title: { type: 'text', label: 'Uniform Item 1: Title' },
        uniform1Desc: { type: 'text', label: 'Uniform Item 1: Subtitle' },
        uniform1Link: { type: 'text', label: 'Uniform Item 1: Link' },

        uniform2Title: { type: 'text', label: 'Uniform Item 2: Title' },
        uniform2Desc: { type: 'text', label: 'Uniform Item 2: Subtitle' },
        uniform2Link: { type: 'text', label: 'Uniform Item 2: Link' },

        uniform3Title: { type: 'text', label: 'Uniform Item 3: Title' },
        uniform3Desc: { type: 'text', label: 'Uniform Item 3: Subtitle' },
        uniform3Link: { type: 'text', label: 'Uniform Item 3: Link' },

        /* ── Contact Dropdown Details ── */
        contactAddress: { type: 'text', label: 'Factory Address' },
        contactHours: { type: 'text', label: 'Factory Hours' },
        contactPhone: { type: 'text', label: 'Contact Phone Number' },
        contactEmail: { type: 'text', label: 'Contact Email' },
      },
      defaultProps: {
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

        contactAddress: 'Small Industrial Estate, Shahabpura Road, Sialkot 51310, Punjab, Pakistan',
        contactHours: 'Mon to Saturday 9 am to 10 pm',
        contactPhone: '+92 300 0000000',
        contactEmail: 'sales@thehrsports.com',
      },
      render: (props) => <LiveHeaderNav {...props} />,
    },

    /* 2. HERO SECTION */
    HeroSection: {
      label: 'Hero Section (Headline & Reel)',
      fields: {
        headline1: { type: 'text', label: 'Headline Line 1' },
        headline2: { type: 'text', label: 'Headline Line 2' },
        headline3: { type: 'text', label: 'Headline Line 3 (Gray)' },
        subheading: { type: 'text', label: 'Sub-heading (Lead Pitch)' },
        description: { type: 'textarea', label: 'Detailed Description' },
        buttonText: { type: 'text', label: 'Primary Button Text' },
        buttonLink: { type: 'text', label: 'Primary Button Link' },

        /* Typography & Button Color Pickers (Shopify-Style) */
        headlineColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Headline Font Color"
              value={value || '#0A0A0A'}
              defaultValue="#0A0A0A"
              onChange={onChange}
            />
          ),
        },
        subheadingColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Sub-heading Font Color"
              value={value || '#52525B'}
              defaultValue="#52525B"
              onChange={onChange}
            />
          ),
        },
        buttonBgColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Primary Button Background Color"
              value={value || '#0A0A0A'}
              defaultValue="#0A0A0A"
              onChange={onChange}
            />
          ),
        },
        buttonTextColor: {
          type: 'custom',
          render: ({ value, onChange }: any) => (
            <ShopifyColorPicker
              label="Primary Button Text Color"
              value={value || '#FFFFFF'}
              defaultValue="#FFFFFF"
              onChange={onChange}
            />
          ),
        },

        /* Video Media Uploaders (Cloudflare R2) */
        heroVideo1: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value || '/hero-section-videos/new-video-1.mp4'}
              onChange={onChange}
              mediaType="video"
              label="Hero Reel Video 1 (First in reel)"
              slotKey="hero_reel_1"
            />
          ),
        },
        heroVideo2: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value || '/hero-section-videos/hero-video-2.mp4'}
              onChange={onChange}
              mediaType="video"
              label="Hero Reel Video 2 (Second in reel)"
              slotKey="hero_reel_2"
            />
          ),
        },
        heroVideo3: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value || '/hero-section-videos/hero-video-3.mp4'}
              onChange={onChange}
              mediaType="video"
              label="Hero Reel Video 3 (Third in reel)"
              slotKey="hero_reel_3"
            />
          ),
        },
        posterImage: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value}
              onChange={onChange}
              mediaType="image"
              label="Video Cover / Poster Image (Optional)"
              slotKey="hero_poster"
            />
          ),
        },

        /* Shopify-style Aspect Ratio & Sizing Controls */
        aspectRatio: {
          type: 'select',
          label: 'Video Card Aspect Ratio',
          options: [
            { label: '9:16 — Vertical Mobile / Reel (Default)', value: '9/16' },
            { label: '16:9 — Widescreen Landscape', value: '16/9' },
            { label: '4:3 — Classic TV', value: '4/3' },
            { label: '1:1 — Square Box', value: '1/1' },
            { label: 'Auto — Adapt to Screen Height', value: 'auto' },
          ],
        },
        videoHeight: {
          type: 'select',
          label: 'Video Max Height',
          options: [
            { label: 'Standard (640px)', value: 'medium' },
            { label: 'Compact (420px)', value: 'small' },
            { label: 'Large Hero (740px)', value: 'large' },
            { label: 'Full Screen Viewport', value: 'fullscreen' },
          ],
        },
        videoFit: {
          type: 'radio',
          label: 'Video Fill / Fit Mode',
          options: [
            { label: 'Cover (Fill & Crop edges)', value: 'cover' },
            { label: 'Contain (Show entire video)', value: 'contain' },
          ],
        },
        videoZoom: {
          type: 'select',
          label: 'Video Zoom Level',
          options: [
            { label: '100% — Normal', value: '1.0' },
            { label: '110% — Slight Zoom', value: '1.1' },
            { label: '120% — Focused Zoom', value: '1.2' },
            { label: '130% — Dramatic Crop', value: '1.3' },
          ],
        },
        borderRadius: {
          type: 'select',
          label: 'Corner Rounding (Border Radius)',
          options: [
            { label: 'Curved Modern (36px)', value: 'large' },
            { label: 'Slight Curve (16px)', value: 'medium' },
            { label: 'Sharp Rectangular (0px)', value: 'none' },
            { label: 'Pill / Capsule', value: 'full' },
          ],
        },
        overlayDarkness: {
          type: 'select',
          label: 'Dark Vignette / Shadow Overlay',
          options: [
            { label: 'Subtle Vignette (Default)', value: 'subtle' },
            { label: 'No Overlay (Pure Video)', value: 'none' },
            { label: 'Medium Shadow (30%)', value: 'medium' },
            { label: 'Deep Cinematic Contrast (60%)', value: 'deep' },
          ],
        },
      },
      defaultProps: {
        headline1: 'YOUR DESIGN.',
        headline2: 'OUR FACTORY.',
        headline3: 'DELIVERED.',
        subheading: 'Have a design in mind? Let’s make it production ready.',
        description:
          'From team kits to performance wear and corporate apparel, we turn your designs into finished products, starting from as little as 30 pieces with high quality sublimation and 24 hour quotes.',
        buttonText: 'Request a Quote',
        buttonLink: '/request-a-quote',
        heroVideo1: '/hero-section-videos/new-video-1.mp4',
        heroVideo2: '/hero-section-videos/hero-video-2.mp4',
        heroVideo3: '/hero-section-videos/hero-video-3.mp4',
        aspectRatio: '9/16',
        videoHeight: 'medium',
        videoFit: 'cover',
        videoZoom: '1.0',
        borderRadius: 'large',
        overlayDarkness: 'subtle',
      },
      render: (props) => <LiveHeroSection {...props} />,
    },

    /* 3. TRUSTED BY STRIP */
    TrustedByStrip: {
      label: 'Partner Logo Marquee Strip',
      fields: {
        heading: { type: 'text', label: 'Strip Heading' },
      },
      defaultProps: {
        heading: 'TRUSTED BY SPORTS CLUBS, SCHOOLS & ATHLETIC BRANDS WORLDWIDE',
      },
      render: (props) => <LiveTrustedByStrip {...props} />,
    },

    /* 4. THE HR SPORTS BANNER */
    TheHRSportsBanner: {
      label: 'Brand Statement Banner',
      fields: {
        badge: { type: 'text', label: 'Badge' },
        title: { type: 'text', label: 'Title Statement' },
        ctaText: { type: 'text', label: 'Action Text' },
        ctaLink: { type: 'text', label: 'Action Link' },
      },
      defaultProps: {
        badge: 'DIRECT FROM SIALKOT, PAKISTAN',
        title: 'Crafting World-Class Custom Sports Apparel Since 2008',
        ctaText: 'Explore Categories →',
        ctaLink: '/#styles',
      },
      render: (props) => <LiveTheHRSportsBanner {...props} />,
    },

    /* 5. CHOOSE YOUR STYLE */
    ChooseYourStyle: {
      label: 'Choose Your Style (Categories Grid)',
      fields: {
        badge: { type: 'text', label: 'Eyebrow Tag' },
        title: { type: 'text', label: 'Heading' },
        subtitle: { type: 'textarea', label: 'Subtitle Description' },
      },
      defaultProps: {
        badge: 'CUSTOM APPAREL CATALOG',
        title: 'Apparel Categories & Teamwear Kits',
        subtitle: 'Choose a category to start customizing with our 3D mockup generator, tech pack spec builder, and 24-hour formal quotation.',
      },
      render: (props) => <LiveChooseYourStyle {...props} />,
    },

    /* STYLE CATEGORY HEADER (Shopify Collection Banner) */
    CategoryHeader: {
      label: 'Category Header & Tagline',
      fields: {
        categoryName: { type: 'text', label: 'Category / Sport Name' },
        tagline: { type: 'text', label: 'Tagline' },
        description: { type: 'textarea', label: 'Category Description' },
        badgeText: { type: 'text', label: 'Status Badge Text' },
        showBadge: {
          type: 'radio',
          label: 'Show Status Badge',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      defaultProps: {
        categoryName: 'Cricket',
        tagline: 'Matchday Whites, Colored T20 Kits & Training Gear',
        description: 'Professional grade cricket uniforms engineered with moisture-wicking AeroVent™ pinhole mesh, UV 50+ sun protection, and reinforced stretch panels for high-intensity bowling and batting.',
        badgeText: 'Coming Soon',
        showBadge: true,
      },
      render: (props) => <LiveCategoryHeader {...props} />,
    },

    /* STYLE CATEGORY PRODUCT GRID (Shopify Collection Product Grid) */
    CategoryProductGrid: {
      label: 'Category Products & Tech Packs Grid',
      fields: {
        columns: {
          type: 'select',
          label: 'Grid Columns',
          options: [
            { label: '3 Columns (Standard)', value: 3 },
            { label: '2 Columns (Wide)', value: 2 },
          ],
        },
        showMaterials: {
          type: 'radio',
          label: 'Show Fabric Specifications (GSM & Tech)',
          options: [
            { label: 'Show', value: true },
            { label: 'Hide', value: false },
          ],
        },
        moqNotice: { type: 'text', label: 'MOQ & Sampling Policy Notice' },
        quoteButtonText: { type: 'text', label: 'Product Card CTA Text' },
      },
      defaultProps: {
        columns: 3,
        showMaterials: true,
        moqNotice: '15–30 pieces minimum • Physical pre-production sample approval before batch cutting',
        quoteButtonText: 'Request Priority Quote',
      },
      render: (props) => <LiveCategoryProductGrid {...props} />,
    },

    /* 6. HOW WE WORK (Each Station Video & Text Fully Editable) */
    HowWeWork: {
      label: 'How We Work (5 Production Stations & Videos)',
      fields: {
        title: { type: 'text', label: 'Section Heading' },
        subtitle: { type: 'textarea', label: 'Section Subtitle' },

        /* Station 1: Design */
        stage1Title: { type: 'text', label: 'Station 01: Heading' },
        stage1Description: { type: 'textarea', label: 'Station 01: Description below Video' },
        stage1Video: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name || 'stage1Video'}
              label="Station 01 Video URL"
              value={value || '/process-videos/design-1.mp4'}
              onChange={onChange}
              mediaType="video"
            />
          ),
        },

        /* Station 2: Precision Hand Cutting */
        stage2Title: { type: 'text', label: 'Station 02: Heading' },
        stage2Description: { type: 'textarea', label: 'Station 02: Description below Video' },
        stage2Video: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name || 'stage2Video'}
              label="Station 02 Video URL"
              value={value || '/process-videos/cutting-1.mp4'}
              onChange={onChange}
              mediaType="video"
            />
          ),
        },

        /* Station 3: Sublimation Printing */
        stage3Title: { type: 'text', label: 'Station 03: Heading' },
        stage3Description: { type: 'textarea', label: 'Station 03: Description below Video' },
        stage3Video: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name || 'stage3Video'}
              label="Station 03 Video URL"
              value={value || '/process-videos/printing-1.mp4'}
              onChange={onChange}
              mediaType="video"
            />
          ),
        },

        /* Station 4: Stitching & Assembly */
        stage4Title: { type: 'text', label: 'Station 04: Heading' },
        stage4Description: { type: 'textarea', label: 'Station 04: Description below Video' },
        stage4Video: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name || 'stage4Video'}
              label="Station 04 Video URL"
              value={value || '/process-videos/stitching-1.mp4'}
              onChange={onChange}
              mediaType="video"
            />
          ),
        },

        /* Station 5: Quality Check & Global Shipping */
        stage5Title: { type: 'text', label: 'Station 05: Heading' },
        stage5Description: { type: 'textarea', label: 'Station 05: Description below Video' },
        stage5Video: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name || 'stage5Video'}
              label="Station 05 Video URL"
              value={value || '/process-videos/packing-1.mp4'}
              onChange={onChange}
              mediaType="video"
            />
          ),
        },
      },
      defaultProps: {
        title: 'The journey of every garment we make.',
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
        stage4Title: 'Stitching & Assembly.',
        stage4Description: 'Cut panels are assembled using 4-needle flatlock and heavy-duty athletic overlock machines. Seams lie completely flush against the skin to eliminate friction and withstand high-stress game movement.',
        stage4Video: '/process-videos/stitching-1.mp4',
        stage5Title: 'Quality Check & Global Shipping.',
        stage5Description: 'Every piece is hand-inspected for measurements and stitch integrity, steam-pressed, custom tagged with your woven brand labels and polybags, and dispatched worldwide via tracked express air freight.',
        stage5Video: '/process-videos/packing-1.mp4',
      },
      render: (props) => <LiveHowWeWork {...props} />,
    },

    /* 7. WHY CHOOSE HR SPORTS */
    WhyChooseHRSports: {
      label: 'Why Choose HR Sports (6 Pillars)',
      fields: {
        title: { type: 'text', label: 'Section Heading' },
        subtitle: { type: 'textarea', label: 'Section Subtitle' },
      },
      defaultProps: {
        title: 'Why Sports Brands & Clubs Partner Directly With Our Factory Floor',
        subtitle: 'Zero middlemen, direct factory-floor transparency, and uncompromising textile engineering.',
      },
      render: (props) => <LiveWhyChooseHRSports {...props} />,
    },

    /* 8. CAPABILITY GRID */
    CapabilityGrid: {
      label: 'Capability & Machinery Stats Grid',
      fields: {
        heading: { type: 'text', label: 'Section Heading' },
        subheading: { type: 'textarea', label: 'Section Subtitle' },
      },
      defaultProps: {
        heading: 'Industrial Manufacturing Capacity & Infrastructure',
        subheading: 'Our Sialkot production facility spans automated laser cutting, high-volume thermal sublimation presses, and specialized activewear stitching lines.',
      },
      render: (props) => <LiveCapabilityGrid {...props} />,
    },

    /* 9. SHIP WORLDWIDE GRID */
    ShipWorldwideGrid: {
      label: 'We Ship Everywhere (Global Grid)',
      fields: {
        heading: { type: 'text', label: 'Main Heading' },
        subheading: { type: 'textarea', label: 'Subheading Description' },
      },
      defaultProps: {
        heading: 'We Ship Everywhere.',
        subheading: 'Custom sportswear, made for you and delivered straight to your door with fast, tracked delivery.',
      },
      render: (props) => <LiveShipWorldwideGrid {...props} />,
    },

    /* 10. CLIENT REVIEWS (All 6 Client Cards & Reviews Editable) */
    ClientReviews: {
      label: 'Client Testimonials Carousel (6 Cards)',
      fields: {
        heading: { type: 'text', label: 'Primary Heading' },
        subheading: { type: 'text', label: 'Subtitle Accent' },

        /* Card 1 */
        review1Name: { type: 'text', label: 'Card 01: Client Name' },
        review1Company: { type: 'text', label: 'Card 01: Company / Role / Country' },
        review1Text: { type: 'textarea', label: 'Card 01: Testimonial Quote' },

        /* Card 2 */
        review2Name: { type: 'text', label: 'Card 02: Client Name' },
        review2Company: { type: 'text', label: 'Card 02: Company / Role / Country' },
        review2Text: { type: 'textarea', label: 'Card 02: Testimonial Quote' },

        /* Card 3 */
        review3Name: { type: 'text', label: 'Card 03: Client Name' },
        review3Company: { type: 'text', label: 'Card 03: Company / Role / Country' },
        review3Text: { type: 'textarea', label: 'Card 03: Testimonial Quote' },

        /* Card 4 */
        review4Name: { type: 'text', label: 'Card 04: Client Name' },
        review4Company: { type: 'text', label: 'Card 04: Company / Role / Country' },
        review4Text: { type: 'textarea', label: 'Card 04: Testimonial Quote' },

        /* Card 5 */
        review5Name: { type: 'text', label: 'Card 05: Client Name' },
        review5Company: { type: 'text', label: 'Card 05: Company / Role / Country' },
        review5Text: { type: 'textarea', label: 'Card 05: Testimonial Quote' },

        /* Card 6 */
        review6Name: { type: 'text', label: 'Card 06: Client Name' },
        review6Company: { type: 'text', label: 'Card 06: Company / Role / Country' },
        review6Text: { type: 'textarea', label: 'Card 06: Testimonial Quote' },
      },
      defaultProps: {
        heading: 'What clients say.',
        subheading: 'In their own words.',
        review1Name: 'Marcus Vance',
        review1Company: 'Vance Grappling Co. · USA',
        review1Text: 'The seam strength and flatlock stitching on our rashguards are exceptional. Tested over hundreds of hours on the mats with zero unraveling. True direct factory quality.',
        review2Name: 'Liam O’Connor',
        review2Company: 'Dublin Athletic Club · Ireland',
        review2Text: 'We bypassed the middleman and worked directly with HR Sports. Sublimation colors matched our Pantone codes 1:1, and direct pricing cut our kit costs by 30%.',
        review3Name: 'Callum Davies',
        review3Company: 'AeroCycle Apparel · Australia',
        review3Text: 'Their pattern team turned our sketches into factory CAD files in 48 hours. The sample arrived in Sydney in 6 days and went straight to full production.',
        review4Name: 'Sophie Dubois',
        review4Company: 'Nordic Sprint Lab · France',
        review4Text: 'Hand cutting makes a world of difference compared to laser. No stiff melted edges, and the natural stretch of the technical polyester remains fully intact.',
        review5Name: 'Jonas Lindqvist',
        review5Company: 'Apex Teamwear · Sweden',
        review5Text: 'Every carton arrived perfectly sorted, moisture-sealed, and tagged with our custom woven labels. Zero size errors across 1,800 team kits.',
        review6Name: 'Tariq Al-Mansoor',
        review6Company: 'Gulf Sports Federation · UAE',
        review6Text: 'Reliable dispatch is everything for tournament deadlines. HR Sports delivered 2,500 custom sublimated kits a full week ahead of our kickoff.',
      },
      render: (props) => <LiveClientReviews {...props} />,
    },

    /* 11. LOCAL RETAIL COMPARISON TABLE */
    LocalRetailComparisonTable: {
      label: 'Factory vs. Retail Comparison Table',
      fields: {
        countryName: { type: 'text', label: 'Country / Region' },
        title: { type: 'text', label: 'Table Heading' },
      },
      defaultProps: {
        countryName: 'International',
        title: 'Direct Factory Floor vs. Traditional Domestic Resellers',
      },
      render: (props) => <LiveLocalRetailComparisonTable {...props} />,
    },

    /* 12. CORE VALUES */
    CoreValues: {
      label: 'Core Values & Manufacturing Standards',
      fields: {
        title: { type: 'text', label: 'Heading' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
      },
      defaultProps: {
        title: 'Our Four Core Manufacturing Pillars',
        subtitle: 'Engineered for zero defects, complete IP confidentiality, and reliable delivery schedules.',
      },
      render: (props) => <LiveCoreValues {...props} />,
    },

    /* 13. VISION & MISSION */
    VisionMission: {
      label: 'Vision & Mission Split Section',
      fields: {
        visionTitle: { type: 'text', label: 'Vision Heading' },
        visionDesc: { type: 'textarea', label: 'Vision Body' },
        missionTitle: { type: 'text', label: 'Mission Heading' },
        missionDesc: { type: 'textarea', label: 'Mission Body' },
      },
      defaultProps: {
        visionTitle: 'Democratizing Tier-1 OEM Manufacturing For High-Growth Brands',
        visionDesc: 'To eliminate the traditional barriers of high minimum order quantities and multi-tiered broker markups, empowering sporting federations, independent athletic apparel founders, and corporate organizations with direct factory-floor access.',
        missionTitle: 'Precision Industrial Execution With Complete Honesty',
        missionDesc: 'To manufacture every jersey, rashguard, and teamwear garment with meticulous technical precision, using verified sustainable fibers and on-time international dispatch.',
      },
      render: (props) => <LiveVisionMission {...props} />,
    },

    /* 14. HOME FAQ SECTION */
    HomeFAQSection: {
      label: 'Frequently Asked Questions',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        subheading: { type: 'textarea', label: 'Subtitle' },
      },
      defaultProps: {
        heading: 'Frequently Asked Questions.',
        subheading: 'Everything you need to know about our minimum order quantities (30 pcs), physical sample approvals, tech pack intake, and worldwide DDP air freight delivery.',
      },
      render: (props) => <LiveHomeFAQSection {...props} />,
    },

    /* 15. HOME CTA */
    HomeCta: {
      label: 'Home CTA (Let’s Talk?)',
      fields: {
        headlineTop: { type: 'text', label: 'Top Headline' },
        headlineBottom: { type: 'text', label: 'Bottom Headline' },
        speechBubble: { type: 'text', label: 'Speech Bubble Text' },
        subtitle: { type: 'textarea', label: 'Pitch Subtitle' },
        primaryButtonText: { type: 'text', label: 'Primary Button Label' },
        primaryButtonLink: { type: 'text', label: 'Primary Button Link' },
        secondaryButtonText: { type: 'text', label: 'Secondary Button Label' },
        secondaryButtonLink: { type: 'text', label: 'Secondary Button Link' },
      },
      defaultProps: {
        headlineTop: "LET'S",
        headlineBottom: 'TALK?',
        speechBubble: "Got a design? Let's build.",
        subtitle:
          'Got a sketch, an Instagram reference, or a complete tech pack? Send it over. We review your specifications, suggest athletic fabrics, and deliver an exact factory quote in 24 hours.',
        primaryButtonText: 'Request a quote',
        primaryButtonLink: '/request-a-quote',
        secondaryButtonText: 'Contact our team',
        secondaryButtonLink: '/contact',
      },
      render: (props) => <LiveHomeCta {...props} />,
    },

    /* 16. FACEBOOK COMMUNITY & MACBOOK */
    SocialFollowApp: {
      label: 'Facebook Community Showcase',
      fields: {
        enabled: {
          type: 'radio',
          label: 'App Status',
          options: [
            { label: 'Active', value: true },
            { label: 'Disabled', value: false },
          ],
        },
        eyebrow: { type: 'text', label: 'Eyebrow Tag' },
        heading: { type: 'text', label: 'Main Headline' },
        accent: { type: 'text', label: 'Sub-heading Accent' },
        facebookUrl: { type: 'text', label: 'Facebook Page URL' },
        embedId: { type: 'text', label: 'SociableKit Feed Embed ID' },
        followerText: { type: 'text', label: 'Follower Proof Tagline' },
      },
      defaultProps: {
        enabled: true,
        eyebrow: 'Official Community',
        heading: 'Stay connected with us.',
        accent: 'Follow our journey.',
        facebookUrl: 'https://www.facebook.com/thehrsports',
        embedId: '25727583',
        followerText: '12.4K+ Active Sports Clubs & Apparel Buyers',
      },
      render: (props) => <LiveSocialFollowApp {...props} />,
    },

    /* 17. WHATSAPP CONCIERGE */
    WhatsAppConciergeApp: {
      label: 'WhatsApp Concierge Float',
      fields: {
        enabled: {
          type: 'radio',
          label: 'App Status',
          options: [
            { label: 'Active', value: true },
            { label: 'Disabled', value: false },
          ],
        },
        phoneNumber: { type: 'text', label: 'WhatsApp Phone Number' },
        greetingMessage: { type: 'textarea', label: 'Pre-filled WhatsApp Message' },
        buttonText: { type: 'text', label: 'Floating Button Label' },
      },
      defaultProps: {
        enabled: false,
        phoneNumber: '+923000000000',
        greetingMessage: 'Hi HR Sports! I want to inquire about custom sportswear manufacturing.',
        buttonText: 'Chat on WhatsApp',
      },
      render: (props) => <LiveWhatsAppConciergeApp {...props} />,
    },

    /* 18. GENERAL RICH TEXT BLOCK */
    RichTextSection: {
      label: 'General Rich Text Block',
      fields: {
        heading: { type: 'text', label: 'Block Heading' },
        body: { type: 'textarea', label: 'Paragraph Content' },
        align: {
          type: 'radio',
          label: 'Text Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        background: {
          type: 'select',
          label: 'Card Background',
          options: [
            { label: 'Clean White', value: 'white' },
            { label: 'Light Neutral Gray', value: 'gray' },
            { label: 'Deep Charcoal / Dark', value: 'dark' },
          ],
        },
      },
      defaultProps: {
        heading: 'Factory Direct Manufacturing Specifications',
        body: 'HR Sports is an established sporting goods and apparel factory based in Sialkot, Pakistan. We specialize in performance technical wear, custom sublimation, and OEM exports to sports clubs globally.',
        align: 'center',
        background: 'white',
      },
      render: (props) => <LiveRichTextSection {...props} />,
    },

    /* 19. SHOPIFY-STYLE MODULAR VIDEO SECTION */
    VideoSection: {
      label: 'Video Banner / Player',
      fields: {
        sourceType: {
          type: 'radio',
          label: 'Video Source',
          options: [
            { label: 'Direct MP4 / CDN File', value: 'mp4' },
            { label: 'YouTube / Vimeo Link', value: 'youtube' },
          ],
        },
        videoUrl: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value}
              onChange={onChange}
              mediaType="video"
              label="Desktop Video (Cloudflare R2)"
              slotKey="video_section"
            />
          ),
        },
        mobileVideoUrl: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value}
              onChange={onChange}
              mediaType="video"
              label="Mobile Vertical Video (Cloudflare R2)"
              slotKey="video_section_mobile"
            />
          ),
        },
        posterUrl: {
          type: 'custom',
          render: ({ name, value, onChange }: any) => (
            <MediaUploadField
              name={name}
              value={value}
              onChange={onChange}
              mediaType="image"
              label="Cover Poster Image (Cloudflare R2)"
              slotKey="video_poster"
            />
          ),
        },
        containerWidth: {
          type: 'select',
          label: 'Container Width',
          options: [
            { label: 'Full Width (100vw Edge-to-Edge)', value: 'full' },
            { label: 'Page Width (Centered Max-Width)', value: 'page' },
          ],
        },
        sizingMode: {
          type: 'radio',
          label: 'Sizing Mode',
          options: [
            { label: 'Aspect Ratio (Standard Video Player)', value: 'aspect' },
            { label: 'Hero Banner (Fixed Responsive Height)', value: 'hero' },
          ],
        },
        aspectRatio: {
          type: 'select',
          label: 'Aspect Ratio (Aspect Ratio Mode)',
          options: [
            { label: '16/9 Widescreen (Landscape)', value: '16/9' },
            { label: '9/16 Vertical (Reels / TikTok)', value: '9/16' },
            { label: '1/1 Square', value: '1/1' },
            { label: '4/3 Standard', value: '4/3' },
          ],
        },
        desktopHeight: {
          type: 'select',
          label: 'Desktop Height (Hero Mode)',
          options: [
            { label: 'Small (400px)', value: '400px' },
            { label: 'Medium (500px)', value: '500px' },
            { label: 'Large (600px)', value: '600px' },
            { label: 'Large Viewport (80vh)', value: '80vh' },
            { label: 'Full Screen (100vh)', value: '100vh' },
          ],
        },
        mobileHeight: {
          type: 'select',
          label: 'Mobile Height (Hero Mode)',
          options: [
            { label: 'Compact (300px)', value: '300px' },
            { label: 'Medium (400px)', value: '400px' },
            { label: 'Tall (500px)', value: '500px' },
            { label: 'Full Mobile Viewport (70vh)', value: '70vh' },
          ],
        },
        borderRadius: {
          type: 'select',
          label: 'Corner Radius',
          options: [
            { label: 'Square (0px)', value: '0px' },
            { label: 'Rounded (12px)', value: '12px' },
            { label: 'Extra Rounded (24px)', value: '24px' },
            { label: 'Pill Radius (32px)', value: '32px' },
          ],
        },
        autoplay: {
          type: 'radio',
          label: 'Autoplay Video',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        loop: {
          type: 'radio',
          label: 'Loop Video Playback',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        muted: {
          type: 'radio',
          label: 'Muted (Required for Browser Autoplay)',
          options: [
            { label: 'Yes (Recommended)', value: true },
            { label: 'No', value: false },
          ],
        },
        controls: {
          type: 'radio',
          label: 'Show Video Controls',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        overlayOpacity: {
          type: 'number',
          label: 'Dark Overlay Opacity (0 to 0.8)',
          min: 0,
          max: 0.8,
          step: 0.05,
        },
        heading: {
          type: 'text',
          label: 'Optional Overlay Heading',
        },
        subheading: {
          type: 'textarea',
          label: 'Optional Overlay Subtitle',
        },
        buttonText: {
          type: 'text',
          label: 'CTA Button Text',
        },
        buttonLink: {
          type: 'text',
          label: 'CTA Button Link',
        },
      },
      defaultProps: {
        sourceType: 'mp4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80',
        containerWidth: 'page',
        sizingMode: 'aspect',
        aspectRatio: '16/9',
        desktopHeight: '600px',
        mobileHeight: '500px',
        borderRadius: '12px',
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
        overlayOpacity: 0.25,
        heading: 'Engineered In Sialkot. Delivered Worldwide.',
        subheading: 'High-performance athletic apparel manufactured directly from raw yarn to finished garments.',
        buttonText: 'Request Factory Quote',
        buttonLink: '/request-a-quote',
      },
      render: (props) => <LiveVideoSection {...props} />,
    },
  },
  root: {
    render: ({ children }) => (
      <div className="min-h-screen bg-bg text-ink flex flex-col font-sans antialiased selection:bg-ink selection:text-surface">
        <StorefrontHeaderPreview />
        <main className="flex-1 w-full bg-surface">
          {children}
        </main>
        <StorefrontFooterPreview />
      </div>
    ),
  },
};

/* ─────────────────────────────────────────────────────────────
   STOREFRONT HEADER & FOOTER PREVIEW FACADES (True Shopify Visual Fidelity)
   ───────────────────────────────────────────────────────────── */
export function StorefrontHeaderPreview() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-black/95 backdrop-blur-md px-4 sm:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs">
            HR
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-ink">HR SPORTS</div>
            <div className="text-[9px] font-mono tracking-wider text-muted uppercase">Factory Direct Sialkot</div>
          </div>
        </div>

        {/* Navigation Links Facade */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-ink/80">
          <span className="hover:text-ink cursor-default">Apparel & Kits</span>
          <span className="hover:text-ink cursor-default">OEM Manufacturing</span>
          <span className="hover:text-ink cursor-default">About Us</span>
          <span className="hover:text-ink cursor-default">FAQ</span>
          <span className="hover:text-ink cursor-default">Contact</span>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-ink text-xs font-mono font-bold">
            Client Portal
          </div>
          <div className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-xs">
            Request a Quote
          </div>
        </div>
      </div>
    </header>
  );
}

export function StorefrontFooterPreview() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-white border-t border-zinc-800 pt-12 pb-8 px-4 sm:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Custom Apparel</h4>
            <div className="space-y-1.5 text-zinc-300">
              <div>Soccer & Rugby Kits</div>
              <div>Basketball Uniforms</div>
              <div>Compression Wear</div>
              <div>Training Hoodies</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Manufacturing</h4>
            <div className="space-y-1.5 text-zinc-300">
              <div>Sublimation Lab</div>
              <div>Cut & Sew Assembly</div>
              <div>Quality Inspection</div>
              <div>Global Air Cargo</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Company & Policies</h4>
            <div className="space-y-1.5 text-zinc-300">
              <div>Our Factory Heritage</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Shipping & Delivery</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Factory HQ</h4>
            <div className="space-y-1.5 text-zinc-300">
              <div>Sialkot Industrial Zone, Pakistan</div>
              <div>export@thehrsports.com</div>
              <div>24-Hour Quotation Turnaround</div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
          <span>&copy; {new Date().getFullYear()} HR SPORTS MANUFACTURING (PVT) LTD. ALL RIGHTS RESERVED.</span>
          <span>SIALKOT &bull; LAHORE &bull; WORLDWIDE AIR FREIGHT</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   DEFAULT THEME DATA (Seeded to match the live website 100%)
   ───────────────────────────────────────────────────────────── */
export const defaultThemeData: Data<ThemeComponentProps> = {
  content: [
    {
      type: 'AnnouncementBar',
      props: {
        id: 'announcement-bar-1',
        enabled: true,
        animation: 'marquee',
        speed: 5,
        pauseOnHover: true,
        height: 'normal',
        textSize: 'xs',
        customTextSize: 12,
        paddingVertical: 'normal',
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
        slideCount: 3,
      },
    },
    {
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
        contactAddress: 'Small Industrial Estate, Shahabpura Road, Sialkot 51310, Punjab, Pakistan',
        contactHours: 'Mon to Saturday 9 am to 10 pm',
        contactPhone: '+92 300 0000000',
        contactEmail: 'sales@thehrsports.com',
      },
    },
    {
      type: 'HeroSection',
      props: {
        id: 'hero-section-1',
        headline1: 'YOUR DESIGN.',
        headline2: 'OUR FACTORY.',
        headline3: 'DELIVERED.',
        subheading: 'Have a design in mind? Let’s make it production ready.',
        description:
          'From team kits to performance wear and corporate apparel, we turn your designs into finished products, starting from as little as 30 pieces with high quality sublimation and 24 hour quotes.',
        buttonText: 'Request a Quote',
        buttonLink: '/request-a-quote',
        heroVideo1: '/hero-section-videos/new-video-1.mp4',
        heroVideo2: '/hero-section-videos/hero-video-2.mp4',
        heroVideo3: '/hero-section-videos/hero-video-3.mp4',
        aspectRatio: '9/16',
        videoHeight: 'medium',
        videoFit: 'cover',
        videoZoom: '1.0',
        borderRadius: 'large',
        overlayDarkness: 'subtle',
      },
    },
    {
      type: 'TrustedByStrip',
      props: {
        id: 'trusted-by-1',
        heading: 'TRUSTED BY SPORTS CLUBS, SCHOOLS & ATHLETIC BRANDS WORLDWIDE',
      },
    },
    {
      type: 'HowWeWork',
      props: {
        id: 'how-we-work-1',
        title: 'How We Work.',
        subtitle:
          'Six transparent manufacturing stations from digital CAD mockups to global dispatch.',
        stage1Title: 'Design.',
        stage1Description: 'Our in-house designers create your custom designs and mockups according to your exact needs. Send us a sketch, a photo, or an idea—we build full 2D and 3D visual mockups and production-ready vector patterns.',
        stage1Video: '/process-videos/design-1.mp4',
        stage2Title: 'Precision Hand Cutting.',
        stage2Description: 'Every panel is cut 100% by hand by master pattern cutters using high-precision shears. No laser burning and no melted edges, preserving the full natural stretch, softness, and grain alignment of performance fabrics.',
        stage2Video: '/process-videos/cutting-1.mp4',
        stage3Title: 'Sublimation Printing.',
        stage3Description: 'Custom artwork, sponsor logos, and vibrant colors are molecularly infused directly into technical fibers using high-heat thermal presses. Zero cracking, zero peeling, and permanent wash-fast durability.',
        stage3Video: '/process-videos/printing-1.mp4',
        stage4Title: 'Stitching & Assembly.',
        stage4Description: 'Cut panels are assembled using 4-needle flatlock and heavy-duty athletic overlock machines. Seams lie completely flush against the skin to eliminate friction and withstand high-stress game movement.',
        stage4Video: '/process-videos/stitching-1.mp4',
        stage5Title: 'Quality Check & Global Shipping.',
        stage5Description: 'Every piece is hand-inspected for measurements and stitch integrity, steam-pressed, custom tagged with your woven brand labels and polybags, and dispatched worldwide via tracked express air freight.',
        stage5Video: '/process-videos/packing-1.mp4',
      },
    },
    {
      type: 'ShipWorldwideGrid',
      props: {
        id: 'worldwide-1',
        heading: 'We Ship Everywhere.',
        subheading:
          'Custom sportswear, made for you and delivered straight to your door with fast, tracked delivery.',
      },
    },
    {
      type: 'ClientReviews',
      props: {
        id: 'reviews-1',
        heading: 'What clients say.',
        subheading: 'In their own words.',
        review1Name: 'Marcus Vance',
        review1Company: 'Vance Athletics &bull; United Kingdom',
        review1Text: 'The stitch tension and seam durability on our customized rugby kits surpassed European retail quality. Zero loose threads after a full season of contact play.',
        review2Name: 'Elena Rostova',
        review2Company: 'Nordic Velocity Club &bull; Sweden',
        review2Text: 'Color vibrance on the technical cycling jerseys is phenomenal. Sublimation inks didn’t fade or bleed even after 40+ industrial washes.',
        review3Name: 'David K. O’Connor',
        review3Company: 'All-State Prep League &bull; USA',
        review3Text: 'Turnaround speed from CAD tech pack to door delivery in Ohio took just 11 days. The pre-production sample matched bulk 1-to-1.',
        review4Name: 'Tariq Al-Mansoor',
        review4Company: 'Desert Hawks FC &bull; UAE',
        review4Text: 'Custom breathable pinhole mesh kept our players cool under 42°C heat. Truly elite level performance engineering.',
        review5Name: 'Liam Chen',
        review5Company: 'Pacific Coast Rowing &bull; Canada',
        review5Text: 'Finding a direct factory that respects small MOQs without markup gouging transformed our club’s merchandise margins.',
        review6Name: 'Sébastien Laurent',
        review6Company: 'AS Montmartre &bull; France',
        review6Text: 'Flawless embroidery on our crests and precision sublimation on team training vests. Hafeez and the team are master craftsmen.',
      },
    },
    {
      type: 'SocialFollowApp',
      props: {
        id: 'social-follow-app-1',
        enabled: true,
        eyebrow: 'Official Community',
        heading: 'Stay connected with us.',
        accent: 'Follow our journey.',
        facebookUrl: 'https://www.facebook.com/thehrsports',
        embedId: '25727583',
        followerText: '12.4K+ Active Sports Clubs & Apparel Buyers',
      },
    },
    {
      type: 'HomeCta',
      props: {
        id: 'home-cta-1',
        headlineTop: "LET'S",
        headlineBottom: 'TALK?',
        speechBubble: "Got a design? Let's build.",
        subtitle:
          'Got a sketch, an Instagram reference, or a complete tech pack? Send it over. We review your specifications, suggest athletic fabrics, and deliver an exact factory quote in 24 hours.',
        primaryButtonText: 'Request a quote',
        primaryButtonLink: '/request-a-quote',
        secondaryButtonText: 'Contact our team',
        secondaryButtonLink: '/contact',
      },
    },
  ],
  root: {
    props: {
      title: 'Home Page',
    },
  },
};
