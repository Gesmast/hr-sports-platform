# HR Sports — Enterprise B2B Manufacturing Platform

A production-grade, multi-page B2B manufacturing website for **HR Sports**, an industrial OEM sports apparel manufacturer producing activewear, pro team jerseys, compression kits, and corporate uniforms.

---

## 1. Brand & Design System

The application strictly enforces an editorial hairline-border design system with sharp minimalist geometry and high-contrast typography.

### Design Tokens (`lib/design-tokens.ts` & `app/globals.css`)
- `--color-bg`: `#FFFFFF` (Pristine background)
- `--color-surface`: `#F5F5F0` (Alabaster / light beige card surface)
- `--color-ink`: `#111111` (Deep charcoal body text & inverted container surfaces)
- `--color-border`: `#27272A` (Zinc-800, 1px structural hairline borders)
- `--color-muted`: `#52525B` (Zinc-600, secondary text)
- `--radius-base`: `4px` (Sharp architectural corners)

### Global Tunable Constants (`lib/constants.ts`)
- `MOQ_UNITS = 30`: Centralized Minimum Order Quantity referenced across Zod validation schemas, form dropdown defaults, country comparison tables, FAQ responses, and hero badges.
- `MOQ_LABEL`: `"30 pieces minimum per design"`

---

## 2. Technology Stack

- **Framework**: Next.js 15+ (App Router, Server Components, Route Handlers)
- **Language**: TypeScript (strict mode, zero `any`)
- **Styling**: Tailwind CSS + custom design token CSS variables
- **Auth**: NextAuth.js v4/v5 (Credentials provider + session callbacks)
- **3D Preview**: Three.js + `@react-three/fiber` + `@react-three/drei` (OrbitControls)
- **Forms & Validation**: React Hook Form + Zod resolvers
- **Animation**: Framer Motion (fade/slide-in, layoutId tab transitions, 360° inspector crossfading)
- **Email**: Resend transactional email integration with React Email templates
- **Testing**: Vitest + React Testing Library (unit/component), Playwright (e2e smoke tests)

---

## 3. Directory Structure

```
├── app/
│   ├── layout.tsx                     # Root layout, metadata & AuthProvider
│   ├── page.tsx                       # Homepage (360° inspector, capabilities, process, map)
│   ├── globals.css                    # Design token CSS variables
│   ├── about/page.tsx                 # Editorial hero, Vision/Mission split, Values, Team
│   ├── projects/page.tsx              # Filterable case study catalog with URL sync
│   ├── projects/[id]/page.tsx         # Detailed case study narrative & sticky spec sidebar
│   ├── contact/page.tsx               # 3-step master Inquiry Form & pre-flight checklist
│   ├── faq/page.tsx                   # Categorized single-open FAQ & fallback contact form
│   ├── manufacturers/[country]/page.tsx # 9 Programmatic SEO market landing pages
│   ├── portal/                        # NextAuth-gated Client Portal
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Order status tracker (stages, QC docs, BOL downloads)
│   └── api/
│       ├── auth/[...nextauth]/route.ts# NextAuth credentials handler
│       ├── quote/route.ts             # Quote intake, database persistence & Resend emails
│       ├── upload-url/route.ts        # Presigned upload helper for direct storage
│       ├── newsletter/route.ts        # Newsletter subscription endpoint
│       └── contact/route.ts           # General FAQ message intake endpoint
├── components/
│   ├── layout/                        # Header, MobileNav, Footer (with Markets We Serve links)
│   ├── home/                          # Hero, ApparelInspector360, CapabilityGrid, HowWeWork, ShipWorldwideGrid
│   ├── about/                         # VisionMission, CoreValues, TeamGrid
│   ├── projects/                      # ProjectCard, FilterTabs, GalleryLightbox
│   ├── contact/                       # InquiryForm, QuoteChecklist, DesignUploadZone, GarmentViewer3D
│   ├── faq/                           # FAQAccordion, FAQContactPanel
│   ├── manufacturers/                 # CountryHero, LocalRetailComparisonTable
│   ├── auth/                          # SignInModal, SignUpModal, AuthProvider
│   ├── shared/                        # SectionHeading, BorderCard, Toggle, Badge, Button, Input
│   └── ui/
├── lib/
│   ├── constants.ts                   # MOQ_UNITS = 30, MOQ_LABEL, Site metadata
│   ├── design-tokens.ts               # Color palette, spacing, radii
│   ├── schemas/                       # quote.ts, newsletter.ts, contact.ts, auth.ts
│   ├── auth.ts                        # NextAuth configuration
│   ├── db.ts                          # Database layer & client orders store
│   ├── resend.ts                      # Resend email client helper
│   └── utils.ts
├── emails/                            # Transactional email templates
│   ├── QuoteConfirmation.tsx
│   ├── QuoteAdminNotification.tsx
│   └── NewsletterWelcome.tsx
├── data/                              # Static data models
│   ├── materials.ts                   # Fabric specifications (GSM, stretch %, breathability)
│   ├── projects.ts                    # Detailed client case studies & specs
│   ├── team.ts                        # Leadership and textile engineering team
│   ├── countries.ts                   # 9 target markets & domestic retail comparison rows
│   └── faqs.ts                        # Manufacturing FAQs
├── tests/
│   ├── unit/quote-schema.test.ts      # Vitest Zod validation tests
│   ├── components/inquiry-form.test.tsx # RTL component progression test
│   └── e2e/smoke.spec.ts              # Playwright smoke test
├── next.config.ts                     # Standalone build output configuration
└── tailwind.config.ts
```

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18.18+ or 20+ (Node 24 tested)
- npm 9+

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Available Scripts

- `npm run dev` — Starts the Next.js local development server with Turbopack / Webpack.
- `npm run build` — Generates a standalone production build in `.next/standalone`.
- `npm run start` — Starts the production Node.js server.
- `npm run test` — Executes unit & component tests via Vitest.
- `npm run test:e2e` — Executes Playwright end-to-end smoke tests.
- `npm run lint` — Runs ESLint code quality checks.

---

## 6. Environment Variables

Configure these in `.env.local` for local development or within Hostinger hPanel Environment Variables:

```env
# NextAuth Authentication
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Resend Transactional Emails
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=quotes@hrsports.com
ADMIN_NOTIFICATION_EMAIL=procurement@hrsports.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# S3 / Cloudflare R2 Object Storage (For direct large 3D file uploads)
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=hr-sports-design-vault
```

---

## 7. Deploying to Hostinger (Business Plan, Node.js App)

HR Sports is engineered for host-agnostic Node.js execution through Hostinger's **Node.js Selector** (Passenger-based runtime):

1. **Verify Node.js Version**: In hPanel → Node.js, ensure Node.js is set to **18.18+** or higher.
2. **Build Standalone Output**: Run `npm run build`. This generates `.next/standalone/`.
3. **Copy Static Assets**:
   - Copy the `public/` directory into `.next/standalone/public/`.
   - Copy `.next/static/` into `.next/standalone/.next/static/`.
4. **Deploy Files**: Upload the contents of `.next/standalone/` via Git or SFTP to your web directory (e.g. `public_html`).
5. **Configure Entry File**: Set the application entry file to `server.js` in hPanel Node.js Selector.
6. **Set Environment Variables**: Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your live domain with `https://`), and `RESEND_API_KEY` in hPanel Environment Variables.
7. **Restart Application**: Click **Restart** in the Node.js panel.
