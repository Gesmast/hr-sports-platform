import { Country } from '@/types';
import { MOQ_LABEL, MOQ_UNITS } from '@/lib/constants';

export const countries: Country[] = [
  {
    slug: 'usa',
    name: 'United States',
    flagIcon: '🇺🇸',
    headline: 'Direct OEM Sportswear & Custom Apparel Manufacturing for the US Market',
    subcopy: 'Eliminate middleman importer markups. We deliver custom sublimated jerseys, athletic kits, and private-label activewear direct to North American brands, universities, and leagues with FedEx/DHL express customs clearance.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '3–5 Days (Air Cargo)',
      happyClients: '180+ US Brands & Colleges',
      dutyAdvantage: 'Direct DDP Air & Ocean Freight Available',
    },
    localizedWhyUs: [
      {
        title: 'Factory-Direct US Wholesale Pricing',
        description: 'Bypass US-based apparel resellers and distributors who add 60–120% margins. Work directly with our master pattern cutters and sublimation engineers.',
      },
      {
        title: 'Full Tech-Pack & Private Labeling',
        description: 'Custom woven labels, heat-transfer neck tags, barcode polybagging, and ASTM-compliant garment care tags ready for direct US retail distribution.',
      },
      {
        title: 'Guaranteed Lead Times for Seasons',
        description: 'Strict delivery schedules tailored for NCAA, high school athletics, travel leagues, and corporate marathon calendar rollouts.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Factory-direct cost per piece ($12–$24 range for pro sublimated kits)',
        localRetail: '$45–$85+ per jersey due to reseller broker markups and licensing overhead',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} (mixed sizing supported)`,
        localRetail: 'Often 100–250+ units for bespoke custom cuts, or strict stock-blank limitations',
      },
      {
        label: 'Customization Freedom',
        hrSports: '100% full-coverage digital dye sublimation, custom cut & sew patterns, exact Pantone PMS matching',
        localRetail: 'Limited to catalog stock blanks with vinyl heat-press or screen-print limitations',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Free pre-production physical prototype shipped for sign-off prior to bulk run',
        localRetail: 'Digital mockups only or $150–$300 non-refundable physical sample charges',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 days factory production + 3–5 days direct tracked air cargo to your door',
        localRetail: '6–10 weeks if backordered or sourced through third-party intermediaries',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Fully custom woven neck tags, hang tags, branded biodegradable polybags included',
        localRetail: 'Generic blank tags or extra $2.50–$4.00 per unit re-labeling fee',
      },
    ],
    testimonial: {
      quote: 'HR Sports solved our collegiate club jersey supply chain. The sublimation fidelity is immaculate and samples were in our Chicago office in 4 days.',
      author: 'Marcus Vance',
      role: 'Director of Athletic Equipment',
      company: 'Midwest Collegiate Sports Syndicate (USA)',
      location: 'Chicago, IL',
    },
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    flagIcon: '🇬🇧',
    headline: 'Custom Football Kits & Activewear Manufacturing for UK Clubs & Retailers',
    subcopy: 'Precision British standard sizing, FA-compliant football teamwear, rugby kits, and technical activewear manufactured with full sublimation and shipped directly to UK warehouses.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '3–5 Days (Heathrow DDP)',
      happyClients: '120+ UK Clubs & Gym Brands',
      dutyAdvantage: 'HMRC Customs & VAT Documentation Ready',
    },
    localizedWhyUs: [
      {
        title: 'UK Sizing & Cut Profiles',
        description: 'Engineered specifically for British athletic profiles and standard European sportswear size grading across XS to 4XL.',
      },
      {
        title: 'Heavyweight Rugby & Football Knits',
        description: '280 GSM reinforced rip-stop polyester and 150 GSM AeroVent mesh engineered for heavy UK turf and rain performance.',
      },
      {
        title: 'Direct Heathrow Air Cargo Gateway',
        description: 'Streamlined customs processing with full duty-paid freight options directly to London, Manchester, Birmingham, and Glasgow.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Direct factory pricing (£10–£18 per pro sublimated shirt)',
        localRetail: '£38–£65+ through UK teamwear distributors and catalog agents',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} with complete size distribution`,
        localRetail: 'High minimums or stock catalog restrictions with limited re-order continuity',
      },
      {
        label: 'Customization Freedom',
        hrSports: 'Bespoke collar styles, silicone crests, 3D rubberized badges, sublimated sponsor graphics',
        localRetail: 'Basic embroidery or heat vinyl transfer on generic catalog templates',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Physical prototype delivered to the UK for tactile and fit approval before bulk cut',
        localRetail: 'PDF proofs only without fabric hand-feel verification',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 days production + 4 days air courier directly to your facility',
        localRetail: '8–12 weeks when reliant on third-party offshore agent chains',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Custom UK size labels, barcodes, branded eco-packaging ready for distribution',
        localRetail: 'Requires costly local relabeling services',
      },
    ],
    testimonial: {
      quote: 'We cut our kit manufacturing lead times in half and improved profit margins by 42% switching directly to HR Sports for our football academies.',
      author: 'David Sterling',
      role: 'Head of Operations',
      company: 'Apex Youth Football League (UK)',
      location: 'Manchester, UK',
    },
  },
  {
    slug: 'australia',
    name: 'Australia',
    flagIcon: '🇦🇺',
    headline: 'High-Performance Custom Sports Apparel for Australian Clubs & Brands',
    subcopy: 'Built for the Australian climate: UPF 50+ UV-blocking fabrics, ultra-breathable Aussie rules, cricket, netball, and rugby teamwear manufactured direct-to-factory.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '4–6 Days (Air Express)',
      happyClients: '95+ Aussie Brands & Clubs',
      dutyAdvantage: 'Duty-Friendly Air Cargo to SYD, MEL, BNE & PER',
    },
    localizedWhyUs: [
      {
        title: 'UPF 50+ Solar Protection Knits',
        description: 'Certified sun-safe technical fabrics engineered specifically for grueling Australian outdoor summer sports and harsh UV conditions.',
      },
      {
        title: 'AFL, Rugby & Cricket Patterns',
        description: 'Tailored silhouettes with reinforced collar stitching, bar-tacked armholes, and 4-way stretch gussets.',
      },
      {
        title: 'Direct Australia Post & DHL Handoff',
        description: 'Door-to-door expedited courier routing directly into Sydney, Melbourne, Brisbane, and Perth.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Factory-direct cost (A$18–A$32 for fully sublimated custom team kits)',
        localRetail: 'A$65–A$110+ per piece through Australian agency intermediaries',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} per custom design`,
        localRetail: 'Strict 50–100 unit minimums or expensive setup surcharges',
      },
      {
        label: 'Customization Freedom',
        hrSports: 'Unlimited sublimation colors, custom pantone matching, personalized names & numbers at zero surcharge',
        localRetail: 'Extra fees per number, name, and sponsor print location',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Master physical sample dispatched to Australia for stitch and fit review',
        localRetail: 'Digital render approval only',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 day build + 4–6 day air cargo express',
        localRetail: '6–10 weeks during peak winter/summer sport registration windows',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Australian standard care labels, custom sizing tags, and individual retail bagging',
        localRetail: 'Stock generic blanks with third-party print shop finishing',
      },
    ],
    testimonial: {
      quote: 'The UPF 50+ moisture-wicking jerseys have been incredible for our summer touch rugby tournaments across Queensland.',
      author: 'Liam O’Connor',
      role: 'Commercial Manager',
      company: 'Gold Coast Sports Association (Australia)',
      location: 'Brisbane, QLD',
    },
  },
  {
    slug: 'canada',
    name: 'Canada',
    flagIcon: '🇨🇦',
    headline: 'OEM Custom Athletic Apparel & Teamwear for Canadian Brands',
    subcopy: 'From heavy-duty hockey warmups and training kits to lightweight activewear. Direct factory pricing with seamless customs and express delivery to Toronto, Vancouver, Montreal, and Calgary.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '3–5 Days (Air Cargo)',
      happyClients: '75+ Canadian Organizations',
      dutyAdvantage: 'Bilingual CA Care Labeling Compliant',
    },
    localizedWhyUs: [
      {
        title: 'Bilingual Compliance Ready',
        description: 'Full English/French textile care label printing, fiber composition disclosures, and CA-number compliance ready out of the box.',
      },
      {
        title: 'Thermal & Grid Fleece Specialization',
        description: 'Engineered 290 GSM moisture-wicking fleece and storm-resistant outerwear designed for harsh Canadian transitions.',
      },
      {
        title: 'Direct Canadian Customs Routing',
        description: 'Reliable freight forwarding with prepaid duty assistance into all major Canadian metropolitan hubs.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Factory-direct pricing (C$16–C$30 per custom sublimated kit)',
        localRetail: 'C$55–C$95+ through domestic promotional and teamwear reps',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} with flexible size distribution`,
        localRetail: 'High minimums or forced catalog stock colors',
      },
      {
        label: 'Customization Freedom',
        hrSports: 'True full-coverage dye sublimation, reflective thermal hits, custom collar and cuff ribs',
        localRetail: 'Limited print areas on stock offshore blanks',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Complete physical sample shipped for approval before mass cut-and-sew',
        localRetail: 'PDF signoff only',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 days production + 4 days air cargo to Canadian hubs',
        localRetail: '7–11 weeks through domestic agency pipelines',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Compliant EN/FR bilingual labeling, custom hangtags, individual barcode polybags',
        localRetail: 'Additional relabeling fees or generic tags',
      },
    ],
    testimonial: {
      quote: 'We outfitted 12 regional leagues across Ontario with custom sublimation kits. Quality and stitch consistency exceeded our previous domestic suppliers.',
      author: 'Chloe Tremblay',
      role: 'Apparel Director',
      company: 'NorthStar Athletic Group (Canada)',
      location: 'Montreal, QC',
    },
  },
  {
    slug: 'germany',
    name: 'Germany',
    flagIcon: '🇩🇪',
    headline: 'Präzisions-Sportbekleidung & OEM-Herstellung für den deutschen Markt',
    subcopy: 'Deutsche Qualitätsansprüche, OEKO-TEX® zertifizierte Textilfasern und modernste Sublimationstechnik direkt vom Hersteller für Sportvereine, Fitnessmarken und Industrieunternehmen.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Tage',
      shippingDays: '3–5 Tage (Luftfracht FRA)',
      happyClients: '110+ Deutsche Vereine & Marken',
      dutyAdvantage: 'Zollabfertigung & EU-Konformität',
    },
    localizedWhyUs: [
      {
        title: 'OEKO-TEX® Standard 100 Konformität',
        description: 'Hautfreundliche, schadstofffreie Reaktivfarben und Garne für höchste europäische Verbraucherschutzstandards.',
      },
      {
        title: 'Präzise europäische Schnittführung',
        description: 'Exakte Größenskalierung nach deutschen DIN-Körpermaßtabellen für perfekte Passform bei Herren, Damen und Junioren.',
      },
      {
        title: 'Direkte Frachtanbindung Frankfurt (FRA)',
        description: 'Schnelle und transparente Logistik mit zuverlässiger Zollabfertigung direkt an Ihre Unternehmensadresse in ganz Deutschland.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direkte Stückkosten',
        hrSports: 'Hersteller-Direktpreis (€11–€21 für vollsublimierte Profi-Trikots)',
        localRetail: '€40–€75+ über deutsche Zwischenhändler und Sportagenturen',
      },
      {
        label: 'Mindestbestellmenge (MOQ)',
        hrSports: `${MOQ_LABEL} (Größen frei kombinierbar)`,
        localRetail: 'Hohe Mindestmengen oder hohe Rüstkosten bei Kleinauflagen',
      },
      {
        label: 'Design- & Sublimationsfreiheit',
        hrSports: '100% vollflächige Sublimation, individuelle Pantone-Farbtreue, integrierte Sponsorenlogos',
        localRetail: 'Eingeschränkte Flock- und Siebdruckflächen auf Standardkataloggütern',
      },
      {
        label: 'Physisches Produktionsmuster',
        hrSports: 'Kostenloses Freigabemuster vor dem Serienstart zur Prüfung von Haptik und Passform',
        localRetail: 'Nur digitale Freigabe oder kostenpflichtige Einzelfertigung',
      },
      {
        label: 'Produktions- & Lieferzeit',
        hrSports: '10–14 Tage Fertigung + 3–5 Tage Express-Luftfracht',
        localRetail: '6–10 Wochen bei Auftragsweitergabe an Drittagenturen',
      },
      {
        label: 'Private Label & Verpackung',
        hrSports: 'Individuelle Nackenlabels, EAN-Barcodes, maßgeschneiderte Polybeutel inklusive',
        localRetail: 'Teure Nachkonfektionierung oder Standard-Herstelleretiketten',
      },
    ],
    testimonial: {
      quote: 'Die Druckschärfe und Farbechtheit unserer Vereinstrikots nach 40 Waschgängen ist hervorragend. HR Sports ist unser verlässlicher OEM-Partner.',
      author: 'Stefan Becker',
      role: 'Geschäftsführer',
      company: 'Vanguard Sports Performance (Deutschland)',
      location: 'Frankfurt am Main',
    },
  },
  {
    slug: 'france',
    name: 'France',
    flagIcon: '🇫🇷',
    headline: 'Fabrication OEM de Vêtements de Sport & Maillots Personnalisés pour la France',
    subcopy: 'Supprimez les intermédiaires. Maillots sublimés de haute précision, tenues de clubs et vêtements techniques fabriqués directement en usine avec livraison express partout en France.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Jours',
      shippingDays: '3–5 Jours (Fret Aérien CDG)',
      happyClients: '85+ Marques & Clubs Français',
      dutyAdvantage: 'Conformité Douanière & TVA UE',
    },
    localizedWhyUs: [
      {
        title: 'Coupes Françaises & Finitions Haut de Gamme',
        description: 'Modèles ajustés avec coutures plates anti-frottement, cols ergonomiques et matières respirantes haute performance.',
      },
      {
        title: 'Sublimation Numérique HD',
        description: 'Restitution fidèle de vos chartes graphiques et logos sponsors sans aucune limite de couleurs.',
      },
      {
        title: 'Expédition Directe Paris CDG & Régions',
        description: 'Suivi logistique transparent et livraison rapide dans toute la métropole.',
      },
    ],
    comparisonRows: [
      {
        label: 'Coût Unitaire Direct',
        hrSports: 'Tarif direct usine (11€–20€ le maillot technique sublimé)',
        localRetail: '42€–70€+ auprès des distributeurs et grossistes traditionnels',
      },
      {
        label: 'Quantité Minimale (MOQ)',
        hrSports: `${MOQ_LABEL} par design (tailles panachées)`,
        localRetail: 'Minimums élevés ou catalogue de stocks prédéfinis',
      },
      {
        label: 'Liberté de Personnalisation',
        hrSports: 'Sublimation intégrale 360°, col et manches personnalisés, marquage sponsors inclus',
        localRetail: 'Frais supplémentaires par logo ou flocage thermocollé',
      },
      {
        label: 'Échantillon Physique de Validation',
        hrSports: 'Prototype réel expédié pour validation avant lancement de la production en série',
        localRetail: 'Validation sur Bon À Tirer (BAT) numérique uniquement',
      },
      {
        label: 'Délais de Fabrication',
        hrSports: '10–14 jours de production + 3–5 jours de livraison express',
        localRetail: '7–10 semaines via les circuits d’importation classiques',
      },
      {
        label: 'Étiquetage & Marque Blanche',
        hrSports: 'Étiquettes tissées personnalisées, étiquettes de taille et emballages individuels',
        localRetail: 'Étiquettes génériques ou surcoût de reconditionnement',
      },
    ],
    testimonial: {
      quote: 'Une qualité de tissu remarquable et un respect absolu des délais pour notre réseau de 15 clubs de football en région parisienne.',
      author: 'Julien Moreau',
      role: 'Responsable Équipements',
      company: 'Ligue Sportive Île-de-France',
      location: 'Paris, France',
    },
  },
  {
    slug: 'netherlands',
    name: 'Netherlands',
    flagIcon: '🇳🇱',
    headline: 'Custom Sportswear & Performance Apparel Manufacturing for the Netherlands',
    subcopy: 'Direct-to-factory OEM activewear, cycling kits, football jerseys, and corporate sports apparel delivered straight to Amsterdam, Rotterdam, Utrecht, and Eindhoven.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '3–5 Days (Schiphol Cargo)',
      happyClients: '90+ Dutch Brands & Clubs',
      dutyAdvantage: 'Schiphol Air Gateway & Port Access',
    },
    localizedWhyUs: [
      {
        title: 'Cycling & Multi-Sport Pattern Expertise',
        description: 'Anatomic aero-fit cycling jerseys with Italian silicone grippers, 3-compartment reinforced rear pockets, and quick-wicking panels.',
      },
      {
        title: 'Eco-Performance Knits (GRS Certified)',
        description: 'Recycled ocean polyester and sustainable textile processes matching Dutch environmental standards.',
      },
      {
        title: 'Fast Schiphol & Rotterdam Handoff',
        description: 'Direct air cargo entry through Schiphol Airport with rapid onward DPD/DHL dispatch.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Direct factory cost (€11–€22 per custom sublimated jersey)',
        localRetail: '€40–€75+ via Dutch teamwear resellers and agency brokers',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} with full size distribution`,
        localRetail: 'High order thresholds or limited stock catalog models',
      },
      {
        label: 'Customization Freedom',
        hrSports: 'Full digital dye sublimation, laser perforation, silicone waist grips, reflective piping',
        localRetail: 'Basic vinyl printing on standard catalog templates',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Pre-production prototype dispatched to your office for quality signoff',
        localRetail: 'Digital mockups only',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 days production + 3–5 days air transit',
        localRetail: '6–9 weeks when passing through intermediary agents',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Custom woven neck labels, hangtags, and individual barcode packaging included',
        localRetail: 'Additional relabeling fees',
      },
    ],
    testimonial: {
      quote: 'We source custom cycling apparel and hockey jerseys from HR Sports. The stitch strength and aerodynamic fabric hand-feel are top tier.',
      author: 'Bram Van Dijk',
      role: 'Product Director',
      company: 'Velocita Performance Wear (Netherlands)',
      location: 'Amsterdam, NL',
    },
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    flagIcon: '🇮🇪',
    headline: 'Custom GAA, Rugby & Sports Apparel Manufacturing for Irish Clubs',
    subcopy: 'Heavy-duty tear-resistant GAA jerseys, rugby kits, and technical sportswear manufactured direct-to-factory with door-to-door express air delivery to Dublin, Cork, Galway, and Limerick.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–12 Days',
      shippingDays: '3–5 Days (Dublin Express)',
      happyClients: '65+ Irish Clubs & Brands',
      dutyAdvantage: 'Direct EU Delivery with Zero Customs Delays',
    },
    localizedWhyUs: [
      {
        title: 'High-Tensile Gaelic & Rugby Fabrications',
        description: 'Reinforced 220–260 GSM interlock knits with triple-needle safety stitching designed for high-impact contact sports.',
      },
      {
        title: 'Complete Sublimation & Silicone Crests',
        description: 'Vibrant club colors, crests, and county sponsor logos infused permanently into the yarn with zero peeling.',
      },
      {
        title: 'Direct Dublin Airport Express Gateway',
        description: 'Direct courier delivery directly into clubhouses and commercial warehouses across Ireland.',
      },
    ],
    comparisonRows: [
      {
        label: 'Direct Unit Cost',
        hrSports: 'Factory-direct cost (€11–€20 per pro-spec sublimated jersey)',
        localRetail: '€42–€70+ through Irish sports shops and distributor agents',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} with mixed adult and juvenile sizes`,
        localRetail: 'Strict minimum order volumes or substantial short-run setup fees',
      },
      {
        label: 'Customization Freedom',
        hrSports: '100% custom cut & sew, mandarin/round/V-neck collars, unlimited sponsor integration',
        localRetail: 'Standard catalogue templates with limited design adjustments',
      },
      {
        label: 'Pre-Production Physical Sample',
        hrSports: 'Full pre-production sample shipped to Ireland for club committee approval',
        localRetail: 'Digital mockups only',
      },
      {
        label: 'Turnaround & Logistics',
        hrSports: '10–14 days production + 4 days express air courier',
        localRetail: '7–10 weeks during spring and championship seasons',
      },
      {
        label: 'Branding & Packaging',
        hrSports: 'Custom club/brand neck tags, barcode labels, and individual polybags included',
        localRetail: 'Standard manufacturer tags or extra cost for private relabeling',
      },
    ],
    testimonial: {
      quote: 'The durability of the GAA kits during our county championship run was fantastic. Colors remained vibrant all season long.',
      author: 'Ciaran O’Donnell',
      role: 'Club Secretary',
      company: 'Celtic Coast GAA & Sports Trust (Ireland)',
      location: 'Dublin, Ireland',
    },
  },
  {
    slug: 'worldwide',
    name: 'Worldwide & Global Markets',
    flagIcon: '🌐',
    isWorldwide: true,
    headline: 'Global OEM Sports Apparel & Uniform Manufacturing Direct From Factory',
    subcopy: 'Supplying athletic brands, sporting leagues, corporate conglomerates, and educational institutions across 42+ countries with industrial-scale precision and express international freight.',
    heroStats: {
      moq: MOQ_LABEL,
      productionDays: '10–14 Days',
      shippingDays: '3–6 Days (Global Air Cargo)',
      happyClients: '500+ Global OEM Clients',
      dutyAdvantage: 'FOB, CIF, & DDP International Shipping Options',
    },
    localizedWhyUs: [
      {
        title: 'Global Export Infrastructure',
        description: 'Exporting millions of custom performance garments annually across North America, Europe, Oceania, the Middle East, and Asia.',
      },
      {
        title: 'Tier-1 Industrial Production Capacity',
        description: 'Automated laser cutters, 12 high-capacity Japanese dye-sublimation printer lines, and 250+ skilled garment technicians.',
      },
      {
        title: 'Comprehensive Quality Assurance',
        description: 'Multi-stage AQL 2.5 quality control inspection covering fabric tensile strength, seam integrity, and colorfastness.',
      },
    ],
    comparisonRows: [
      {
        label: 'Unit Pricing Structure',
        hrSports: 'Direct factory pricing with tiered volume discounts starting at factory cost',
        localRetail: '200% to 300% markup added by regional import brokers and distributors',
      },
      {
        label: 'Minimum Order Quantity (MOQ)',
        hrSports: `${MOQ_LABEL} per style (enables fast testing of new collections)`,
        localRetail: 'Often 500–1,000+ pieces for custom offshore orders through trading agents',
      },
      {
        label: 'Manufacturing Transparency',
        hrSports: 'Direct communication with factory textile engineers and pattern makers',
        localRetail: 'Information shielded behind third-party sales representatives',
      },
      {
        label: 'Prototyping & Sampling',
        hrSports: 'Pre-production master sample produced and dispatched before mass cutting begins',
        localRetail: 'Samples take 4–6 weeks or are not offered for smaller volume orders',
      },
      {
        label: 'Production Speed',
        hrSports: '10–14 business days production + expedited global air courier',
        localRetail: '10–16 weeks via multi-tiered international middleman chains',
      },
      {
        label: 'Branding & White-Labeling',
        hrSports: 'Full private label package: custom woven tags, care labels, hangtags, and packaging',
        localRetail: 'Generic branding or expensive third-party repacking fees',
      },
    ],
    testimonial: {
      quote: 'HR Sports has been our exclusive OEM partner for 5 years across 6 product lines. Their reliability, fabric innovation, and communication are unmatched.',
      author: 'Elena Rostova',
      role: 'VP of Sourcing & Supply Chain',
      company: 'AeroAthletics Global Group',
      location: 'International',
    },
  },
];
