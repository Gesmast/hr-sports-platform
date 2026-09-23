'use client';

import React, { useState, useId, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Download,
  Palette,
  Plus,
  Trash2,
  Layers,
  Shirt,
  Shield,
  FileText,
  Flag,
  Upload,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  Check,
  Search,
  ChevronDown,
  FileSpreadsheet,
  Ruler,
} from 'lucide-react';
import { PhoneInput } from './PhoneInput';
import { detectCountryFromTimezone } from '@/lib/phone';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { BorderCard } from '@/components/shared/BorderCard';
import { DesignUploadZone } from './DesignUploadZone';
import { SizeChartModal } from './SizeChartModal';
import { RegionFlagIcon } from './RegionFlags';
import {
  quoteSchema,
  QuoteSchemaType,
  GarmentSpecType,
  PlayerRosterRowType,
  LogoPlacementType,
  DesignSourceType,
  DesignBriefType,
} from '@/lib/schemas/quote';
import {
  MOQ_UNITS,
  MOQ_LABEL,
  GARMENT_TYPES,
  COUNTRIES,
  SIZE_CHART_CONFIG,
  STANDARD_SIZES,
  getDefaultSizeChartRegion,
  type SizeChartRegion,
} from '@/lib/constants';
import { materials } from '@/data/materials';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';
import {
  generateIndividualizedSummary,
  generateUniformSummary,
} from '@/lib/pdf/roster-compiler';
import { SIZE_CHART_PRESETS, SizeChartStandard } from '@/lib/pdf/size-charts';
import { parseRosterExcel } from '@/lib/excel/parseRosterExcel';
import { formatInquiryCode, getCountryAlpha3 } from '@/lib/utils';
import { motion, type Variants } from 'framer-motion';

const stepperRailVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.7,
    },
  },
};

const stepItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mobileStepperVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const mobileStepItemVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const formCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.48,
    },
  },
};

const formFieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const DESIGN_STYLE_THEMES = [
  'Bold & Aggressive',
  'Modern / Minimal',
  'Classic / Traditional',
  'Geometric / Abstract',
  'Camouflage',
  'Gradient / Ombre',
  'Tribal / Pattern-Based',
  'Grunge / Distressed',
];

export const PRINT_COVERAGE_OPTIONS = [
  {
    id: 'full_sublimation',
    label: 'Full Sublimation (All-Over Print / Graphics)',
    desc: 'Entire garment is printed edge-to-edge with custom patterns, gradients, and graphics.',
  },
  {
    id: 'solid_base_accent',
    label: 'Solid Base Color + Accent Graphics',
    desc: 'Solid base fabric body with graphic side panels, shoulders, sleeves, or piping.',
  },
  {
    id: 'solid_only',
    label: 'Solid Color Only (No Background Graphics)',
    desc: 'Clean solid base with text and logos only (no background pattern).',
  },
];

export const TEXT_ELEMENTS_OPTIONS = [
  'Team/Club Name on Front',
  'Sponsor Name/Logo',
  'Player Name & Number',
  'Slogan/Tagline',
];

export const GRAPHIC_ELEMENTS_OPTIONS = [
  'Country Flag',
  'Club Crest/Badge',
  'Mascot',
  'Stripes/Racing Panels',
  'None of these',
];

export const SWATCH_PRESET_COLORS = [
  { name: 'Cream / SAP', hex: '#FAF6EA' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#111827' },
  { name: 'Navy Blue', hex: '#0F172A' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Bahrain Red', hex: '#CE1126' },
  { name: 'Forest Green', hex: '#15803D' },
  { name: 'Gold / Yellow', hex: '#EAB308' },
  { name: 'Charcoal Grey', hex: '#4B5563' },
  { name: 'Burgundy', hex: '#881337' },
];

interface InquiryFormProps {
  initialGarment?: string;
  initialFabric?: string;
  initialCategory?: string;
}

// Preset Pantone/Hex Athletic Colors
const COLOR_PRESETS = [
  { name: 'Jet Black', hex: '#111111', class: 'bg-[#111111]' },
  { name: 'Optical White', hex: '#F5F5F0', class: 'bg-[#F5F5F0] border-zinc-300' },
  { name: 'Athletic Red', hex: '#DC2626', class: 'bg-red-600' },
  { name: 'Cobalt Blue', hex: '#2563EB', class: 'bg-blue-600' },
  { name: 'Emerald Green', hex: '#059669', class: 'bg-emerald-600' },
  { name: 'Graphite Grey', hex: '#71717A', class: 'bg-zinc-500' },
  { name: 'Gold Amber', hex: '#D97706', class: 'bg-amber-600' },
  { name: 'Cream / Sand', hex: '#FDFBF7', class: 'bg-[#FDFBF7] border-zinc-300' },
];

export const LOOKING_FOR_OPTIONS = [
  'Custom Sportswear',
  'Uniform',
  'Merch',
] as const;
export type LookingForType = (typeof LOOKING_FOR_OPTIONS)[number];

export const UNIFORM_TYPES = [
  'Security Uniform',
  'Promotional Uniform',
  'Corporate Uniform',
] as const;
export type UniformType = (typeof UNIFORM_TYPES)[number];

export const SPORT_CATEGORIES = [
  'Cricket',
  'Football/Soccer',
  'Basketball',
  'Gym & Activewear',
  'Hockey',
];

export const SPORT_OPTIONS = SPORT_CATEGORIES;

export const NAME_NUMBER_EXCEL_TEMPLATE_URL =
  'https://pub-6a38698c8f7d411694afe9e4dd678660.r2.dev/Excel%20Sheet%20Customization%3A%20With%20Name%20%26%20Number./Customization_%20Name%20%26%20number.xlsx';

// Reboot Step 2: Manufacturing & Specification Options
export const SHIRT_TYPE_OPTIONS = [
  'Simple shirt (cut & sew)',
  'Front sublimation',
  'Front + back sublimation',
  'Full sublimation',
] as const;

export const NECK_STYLE_OPTIONS = [
  'Round neck',
  'Round V-neck',
  'Polo neck',
  'Collar V-shirt',
  'Collar zip',
  'Ban round neck',
  'Ban V-neck',
] as const;

export const ARM_STYLE_OPTIONS = [
  'Half sleeve',
  'Full sleeve',
  'Sleeveless',
  'Three-quarter',
] as const;

export const TROUSER_METHOD_OPTIONS = [
  'Cut & Sew',
  'Sublimation',
] as const;

export const TROUSER_CUT_SEW_METHODS = [
  'Magzi',
  'Side panel sublimation',
  'Side half panel',
  'Side full panel',
  'Single strip',
  'Two strip',
  'Three strip',
] as const;

export const POCKET_DESIGN_OPTIONS = [
  'Plain zip pocket',
  'Ban zip pocket',
  'Plain pocket',
  'Cross pocket',
  'Super pocket',
] as const;

export const UNIFORM_CARGO_POCKET_OPTIONS = [
  'Standard (2 Side Pockets)',
  'Four pocket',
  'Six pocket',
] as const;

// Two-Level Hierarchical Fabric Taxonomy
export const FABRIC_TAXONOMY = {
  Mesh: [
    'One-tuck mesh',
    'Two-tuck mesh',
    'Three-tuck mesh',
    'Four-tuck mesh',
    'Adidas mesh',
    'Jacquard mesh',
    'BD lycra mesh',
    "Bird's eye mesh",
    'Honeycomb mesh',
    'Net mesh',
  ],
  Interlock: [
    'Normal interlock',
    '75/72 interlock',
    'Heavy interlock',
    'Speedo interlock',
  ],
} as const;

export type FabricFamily = keyof typeof FABRIC_TAXONOMY;
export const FABRIC_FAMILIES = Object.keys(FABRIC_TAXONOMY) as FabricFamily[];

const FABRIC_OPTIONS = [
  'SAP Cream Fabric',
  'Kings Cream Fabric',
  'Micro Polyester Mesh',
  'Pique Polyester',
  'Interlock Polyester',
  'Dry-Fit Polyester',
  'Bird-Eye Mesh',
  'Lycra/Spandex Blend',
  'Nylon-Spandex',
  'Cotton-Poly Blend',
  'French Terry',
  'Fleece',
  'Softshell',
];

const COLLAR_OPTIONS = [
  'Collar',
  'Round Neck (Crew)',
  'V-Neck',
  'Polo Collar',
  'Henley Collar',
  'Mandarin/Stand Collar',
  'Sailor Collar',
  'No Collar',
];

const BUTTON_OPTIONS = [
  'Kaaj Buttons (Placket)',
  'Snap Buttons',
  'Zip Placket',
  'No Buttons / Pullover',
];

const SLEEVE_OPTIONS = [
  'Half Sleeves',
  'Sleeveless',
  'Cap Sleeve',
  '3/4 Sleeve',
  'Full Sleeve',
  'Raglan Sleeve',
];

const FLY_OPTIONS = [
  '-',
  'Zip Fly',
  'Button Fly',
  'Elastic Waist (No Fly)',
  'Drawstring Only',
];

const POCKET_OPTIONS = [
  'Cross Pocket',
  'Side Seam Pocket',
  'Zip Pocket',
  'Cargo Pocket',
  'No Pocket',
];

const CUFF_OPTIONS = [
  'As Per Pattern',
  'Elastic Cuff',
  'Ribbed Cuff',
  'Open Hem',
  'Straight Cut',
];

const PANEL_PIPING_OPTIONS = [
  '-',
  'Contrast Side Panel',
  'Contrast Piping',
  'Racer-Back Panel',
  'Mesh Panel Insert',
];

const LOGO_METHOD_OPTIONS = [
  'Sublimation',
  'Embroidery',
  'Heat Transfer Vinyl (HTV)',
  'Woven Patch',
  '3D Silicone/TPU Badge',
  'Stickers',
];

const FONT_OPTIONS = [
  'Block',
  'Varsity',
  'Cricket',
  'Digital',
  'Script',
  'Impact',
  'Athletic Condensed',
  '-',
];

interface LogoSlotConfig {
  id: string;
  label: string;
  allowFlag?: boolean;
}

const TOP_LOGO_SLOTS: LogoSlotConfig[] = [
  { id: 'left_chest', label: 'Left Chest' },
  { id: 'right_chest', label: 'Right Chest' },
  { id: 'stomach', label: 'Stomach' },
  { id: 'left_shoulder_top', label: 'Left Shoulder Top', allowFlag: true },
  { id: 'right_shoulder_top', label: 'Right Shoulder Top' },
  { id: 'back_below_neck', label: 'Back (Below Neck)' },
  { id: 'left_shoulder_bottom', label: 'Left Shoulder Bottom' },
  { id: 'right_shoulder_bottom', label: 'Right Shoulder Bottom' },
  { id: 'back_above_name_no', label: 'Back (Above Name/No)' },
  { id: 'back_name', label: 'Back Name (Text Preview)' },
  { id: 'back_number', label: 'Back Number (Text Preview)' },
  { id: 'back_below_name_no', label: 'Back (Below Name/No)' },
];

const BOTTOM_LOGO_SLOTS: LogoSlotConfig[] = [
  { id: 'left_pocket', label: 'Left Pocket' },
  { id: 'right_pocket', label: 'Right Pocket' },
  { id: 'left_side', label: 'Left Side' },
  { id: 'right_side', label: 'Right Side' },
  { id: 'back_left_side', label: 'Back Left Side' },
  { id: 'back_right_side', label: 'Back Right Side' },
];

export const InquiryForm: React.FC<InquiryFormProps> = ({
  initialGarment,
  initialFabric,
  initialCategory,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [inquirySeq] = useState<number>(1);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [activeGarmentTab, setActiveGarmentTab] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const defaultTopGarment: GarmentSpecType = {
    garment_type: 'top',
    type_name: initialGarment || 'Sublimation T-Shirts',
    colour_mode: 'sublimation',
    colour_value: 'Sublimation',
    fabric_name: initialFabric || 'SAP Cream Fabric',
    fabric_gsm: 160,
    collar_type: 'Collar',
    button_type: 'Kaaj Buttons',
    sleeve_length: 'Half Sleeves',
    panel_piping: '-',
    logo_application: ['Sublimation'],
    font_name: '-',
    logo_placements: [
      { slot: 'left_chest', image_url: null, height_in: 3, width_in: 2.5 },
      { slot: 'right_chest', image_url: null, height_in: 3, width_in: 2.5 },
      { slot: 'left_shoulder_top', image_url: null, flag_auto: true },
    ],
    sizing: {
      mode: 'uniform',
      qty_by_size: { S: 10, M: 20, L: 15, XL: 5 },
    },
  };

  const defaultBottomGarment: GarmentSpecType = {
    garment_type: 'bottom',
    type_name: 'Cut-N-Sew Trousers',
    colour_mode: 'solid',
    colour_value: 'Cream',
    fabric_name: 'Kings Cream Fabric',
    fabric_gsm: 220,
    fly_type: '-',
    pocket_type: 'Cross Pocket',
    cuff_type: 'As Per Pattern',
    panel_piping: '-',
    logo_application: ['Stickers'],
    font_name: '-',
    logo_placements: [
      { slot: 'left_pocket', image_url: null, height_in: 3, width_in: 2.5 },
      { slot: 'right_pocket', image_url: null, height_in: 3, width_in: 2.5 },
    ],
    sizing: {
      mode: 'uniform',
      qty_by_size: { M: 4, L: 7, XL: 11, '2XL': 3 },
    },
  };

  const initialRoster: PlayerRosterRowType[] = [
    { player_name: 'VEDANTA', number: '21', size: 'M', qty: 2 },
    { player_name: 'SUJAY', number: '02', size: 'M', qty: 2 },
    { player_name: 'AFZAL', number: '804', size: 'L', qty: 2 },
    { player_name: 'MUKHIA', number: '18', size: 'L', qty: 2 },
    { player_name: 'GAUTHAM', number: '23', size: 'XL', qty: 2 },
    { player_name: 'HEMBO', number: '', size: 'XL', qty: 2, role_note: 'Technical Manager' },
    { player_name: 'AHMED', number: '888', size: '2XL', qty: 2 },
  ];

  const initialBlanks = {
    S: 3,
    M: 3,
    L: 3,
    XL: 3,
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ');

  const isInitialUniform =
    initialCategory?.toLowerCase() === 'uniform' ||
    initialGarment?.toLowerCase().includes('uniform');
  const defaultLookingFor = isInitialUniform ? 'Uniform' : '';
  const defaultSport = isInitialUniform
    ? 'Uniform'
    : (initialCategory && SPORT_CATEGORIES.includes(initialCategory as any) ? initialCategory : '');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<QuoteSchemaType>({
    resolver: zodResolver(quoteSchema),
    shouldUnregister: false,
    defaultValues: {
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      targetDeliveryDate: 'Standard Production (30–45 Days)',
      order_by: '',
      designer: '-',
      order_date: todayStr,
      dispatch_date: 'Standard Production (30–45 Days)',
      team_country_name: '',
      country: 'US',
      lookingFor: defaultLookingFor,
      sport: defaultSport,
      uniform_type: '',
      inquiry_code: '',
      kit_selection: '',
      order_type: isInitialUniform ? 'uniform' : '',
      size_chart_standard: 'mens_export',
      volumeMOQ: '' as unknown as number,
      garmentType: initialGarment || '',
      materialVariant: initialFabric || '',
      sizeBreakdown: '',
      uploadMode: 'design-help',
      has_logo: 'no',
      logo_files: [],
      logo_placement_note: '',
      designFiles: [],
      designNotes: '',
      primaryColor: '#FAF6EA',
      accentColor: '#FFFFFF',
      garments: [],
      roster: [],
      blanks_by_size: {},
      design: {
        source: 'requested_from_team',
        uploaded_files: [],
        brief: {
          primary_colors: [],
          secondary_colors: [],
          style_themes: [],
          print_coverage: 'full_sublimation',
          reference_brand: '',
          text_elements: [],
          graphic_elements: [],
          elements_to_avoid: '',
          brand_guidelines_file: null,
          inspiration_images: [],
          additional_notes: '',
        },
      },
    },
    mode: 'onChange',
  });

  const orderType = watch('order_type');
  const sizeStandard = watch('size_chart_standard') as SizeChartStandard;
  const garments = watch('garments') || [];
  const roster = watch('roster') || [];
  const blanksBySize = watch('blanks_by_size') || {};
  const teamCountry = watch('team_country_name') || 'BEHRAIN';
  const uploadMode = watch('uploadMode');
  const companyName = watch('companyName');
  const totalAllocatedPieces = Object.values(blanksBySize).reduce(
    (acc: number, val: any) => acc + (Number(val) || 0),
    0
  );
  const rawVolumeMOQ = watch('volumeMOQ');
  const targetOrderQty = (rawVolumeMOQ && !isNaN(Number(rawVolumeMOQ)) && Number(rawVolumeMOQ) > 0)
    ? Number(rawVolumeMOQ)
    : MOQ_UNITS;

  // Structured Design Source & Brief state
  const design = watch('design') || {
    source: 'requested_from_team',
    uploaded_files: [],
    brief: {
      primary_colors: ['#FAF6EA'],
      secondary_colors: ['#FFFFFF'],
      style_themes: ['Bold & Aggressive'],
      print_coverage: 'full_sublimation',
      reference_brand: '',
      text_elements: ['Team/Club Name on Front'],
      graphic_elements: ['Country Flag', 'Club Crest/Badge'],
      elements_to_avoid: '',
      brand_guidelines_file: null,
      inspiration_images: [],
      additional_notes: '',
    },
  };

  const designSource = design?.source || 'requested_from_team';
  const primaryColors = design?.brief?.primary_colors || ['#FAF6EA'];
  const secondaryColors = design?.brief?.secondary_colors || ['#FFFFFF'];
  const styleThemes = design?.brief?.style_themes || ['Bold & Aggressive'];
  const printCoverage = design?.brief?.print_coverage || 'full_sublimation';
  const referenceBrand = design?.brief?.reference_brand || '';
  const textElements = design?.brief?.text_elements || ['Team/Club Name on Front'];
  const graphicElements = design?.brief?.graphic_elements || ['Country Flag', 'Club Crest/Badge'];
  const elementsToAvoid = design?.brief?.elements_to_avoid || '';
  const additionalNotes = design?.brief?.additional_notes || '';

  const [designUploadError, setDesignUploadError] = useState<string | null>(null);
  const [designFilesList, setDesignFilesList] = useState<Array<{ name: string; sizeMb: string; dataUrl: string }>>([]);
  const [brandGuidelinesFileName, setBrandGuidelinesFileName] = useState<string | null>(null);
  const [inspirationImagesList, setInspirationImagesList] = useState<string[]>([]);

  // Step 3: Minimalist Logo & Design States
  const [hasLogo, setHasLogo] = useState<'yes' | 'no' | ''>('');
  const [designChoice, setDesignChoice] = useState<'client_provided' | 'requested_from_team' | ''>('');
  const [logoFilesList, setLogoFilesList] = useState<Array<{ name: string; sizeMb: string; dataUrl: string }>>([]);
  const [logoPlacement, setLogoPlacement] = useState<string>('');
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [referenceFilesList, setReferenceFilesList] = useState<Array<{ name: string; sizeMb: string; dataUrl: string }>>([]);
  const [referenceUploadError, setReferenceUploadError] = useState<string | null>(null);

  // Player Customization Excel Sheet state
  const [rosterExcelFileName, setRosterExcelFileName] = useState<string | null>(null);
  const [rosterExcelFileSize, setRosterExcelFileSize] = useState<string | null>(null);
  const [rosterExcelError, setRosterExcelError] = useState<string | null>(null);
  const [isRosterExcelDragging, setIsRosterExcelDragging] = useState(false);

  const processRosterExcelFile = (file: File) => {
    setRosterExcelError(null);
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setRosterExcelError('Please upload an Excel spreadsheet (.xlsx or .xls)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setRosterExcelError('File size must be under 25MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setValue('roster_excel_file', dataUrl, { shouldDirty: true });
      setValue('roster_excel_file_name', file.name, { shouldDirty: true });

      // Automatically parse player names, numbers, and sizes from the uploaded Excel
      try {
        const parsedPlayers = parseRosterExcel(dataUrl);
        if (parsedPlayers && parsedPlayers.length > 0) {
          setValue('roster', parsedPlayers as any, { shouldDirty: true });
        }
      } catch (parseErr) {
        console.warn('Could not parse roster rows from Excel:', parseErr);
      }

      setRosterExcelFileName(file.name);
      setRosterExcelFileSize((file.size / 1024).toFixed(1) + ' KB');
      setRosterExcelError(null);
      clearErrors('roster_excel_file');
    };
    reader.readAsDataURL(file);
  };

  const handleRosterExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processRosterExcelFile(file);
    }
  };

  const handleRosterExcelDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRosterExcelDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processRosterExcelFile(file);
    }
  };

  const handleRosterExcelDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isRosterExcelDragging) {
      setIsRosterExcelDragging(true);
    }
  };

  const handleRosterExcelDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRosterExcelDragging(false);
  };

  const handleRemoveRosterExcel = () => {
    setValue('roster_excel_file', null, { shouldDirty: true });
    setValue('roster_excel_file_name', null, { shouldDirty: true });
    setValue('roster', [], { shouldDirty: true });
    setRosterExcelFileName(null);
    setRosterExcelFileSize(null);
    setRosterExcelError(null);
    setIsRosterExcelDragging(false);
  };

  // What are you looking for? state
  const [lookingFor, setLookingFor] = useState<string>(defaultLookingFor);
  const [selectedSport, setSelectedSport] = useState<string>(
    defaultSport !== 'Uniform' && defaultSport !== 'Merch' ? defaultSport : ''
  );
  const [selectedUniformType, setSelectedUniformType] = useState<string>('');

  // Step 2: Rebooted Garment & Manufacturing States (starts unselected / empty)
  const [kitSelection, setKitSelection] = useState<'full_kit' | 'shirt_only' | 'trouser_only' | ''>('');
  const [shirtType, setShirtType] = useState<string>('');
  const [neckStyle, setNeckStyle] = useState<string>('');
  const [armStyle, setArmStyle] = useState<string>('');

  const [trouserMethod, setTrouserMethod] = useState<'Cut & Sew' | 'Sublimation' | ''>('');
  const [trouserCutSewMethod, setTrouserCutSewMethod] = useState<string>('');
  const [pocketDesign, setPocketDesign] = useState<string>('');

  // Two-Level Fabric States (starts unselected / empty)
  const [fabricFamily, setFabricFamily] = useState<FabricFamily | ''>('');
  const [fabricType, setFabricType] = useState<string>('');

  // Uniform-only additions states
  const [uniformCargoPockets, setUniformCargoPockets] = useState<string>('');
  const [hasBackPockets, setHasBackPockets] = useState<'No' | 'Yes' | ''>('');
  const [backPocketType, setBackPocketType] = useState<string>('');

  const isCustomizationFilled = lookingFor === 'Custom Sportswear'
    ? Boolean(orderType)
    : true;
  const isStep2CardVisible = Boolean(
    kitSelection &&
    isCustomizationFilled &&
    rawVolumeMOQ &&
    !isNaN(Number(rawVolumeMOQ)) &&
    Number(rawVolumeMOQ) > 0
  );

  // Synchronize Step 2 specifications with form values & garments array
  React.useEffect(() => {
    const isUniform = lookingFor === 'Uniform';
    const isMerch = lookingFor === 'Merch';
    const fullFabricName = fabricFamily && fabricType ? `${fabricFamily} - ${fabricType}` : (fabricFamily || '');

    const topName = isUniform
      ? `${watch('uniform_type') || 'Uniform'} Top${shirtType ? ` (${shirtType})` : ''}`
      : isMerch
      ? `Merch Top / Tee${shirtType ? ` (${shirtType})` : ''}`
      : `${selectedSport || 'Custom'} Jersey${shirtType ? ` (${shirtType})` : ''}`;

    const bottomName = isUniform
      ? `${watch('uniform_type') || 'Uniform'} Trouser${trouserMethod ? ` (${trouserMethod})` : ''}`
      : isMerch
      ? `Merch Bottom${trouserMethod ? ` (${trouserMethod})` : ''}`
      : `${selectedSport || 'Custom'} Trouser / Shorts${trouserMethod ? ` (${trouserMethod})` : ''}`;

    const topGarment: GarmentSpecType = {
      garment_type: 'top',
      type_name: topName,
      shirt_type: shirtType || undefined,
      neck_style: neckStyle || undefined,
      collar_type: neckStyle || undefined,
      arm_style: armStyle || undefined,
      sleeve_length: armStyle || undefined,
      fabric_name: fullFabricName || 'Custom Performance Fabric',
      fabric_family: fabricFamily || undefined,
      fabric_type: fabricType || undefined,
      colour_value: shirtType || '-',
      colour_mode: shirtType.toLowerCase().includes('sublimation') ? 'sublimation' : 'solid',
      panel_piping: '-',
      button_type: neckStyle.includes('Polo') ? 'Kaaj Buttons' : neckStyle.includes('zip') ? 'Zipper' : 'None',
      logo_application: [shirtType && shirtType.toLowerCase().includes('sublimation') ? 'Sublimation' : 'Embroidery'],
      logo_placements: [],
    };

    const bottomGarment: GarmentSpecType = {
      garment_type: 'bottom',
      type_name: bottomName,
      trouser_method: trouserMethod || undefined,
      trouser_cut_sew_method: trouserMethod === 'Cut & Sew' ? trouserCutSewMethod || undefined : undefined,
      pocket_design: pocketDesign || undefined,
      pocket_type: pocketDesign || undefined,
      trouser_cargo_pockets: isUniform ? uniformCargoPockets || undefined : undefined,
      has_back_pockets: isUniform && hasBackPockets ? hasBackPockets : undefined,
      back_pocket_type: isUniform && hasBackPockets === 'Yes' ? backPocketType || undefined : undefined,
      fabric_name: fullFabricName || 'Custom Performance Fabric',
      fabric_family: fabricFamily || undefined,
      fabric_type: fabricType || undefined,
      colour_value: trouserMethod || '-',
      colour_mode: trouserMethod === 'Sublimation' ? 'sublimation' : 'solid',
      panel_piping: trouserMethod === 'Cut & Sew' ? trouserCutSewMethod || '-' : '-',
      logo_application: ['Embroidery'],
      logo_placements: [],
    };

    let nextGarments: GarmentSpecType[] = [];
    if (kitSelection === 'shirt_only') {
      nextGarments = [topGarment];
    } else if (kitSelection === 'trouser_only') {
      nextGarments = [bottomGarment];
    } else {
      nextGarments = [topGarment, bottomGarment];
    }

    setValue('garments', nextGarments, { shouldDirty: true });
    setValue('kit_selection', kitSelection, { shouldDirty: true });
    setValue('shirt_type', shirtType, { shouldDirty: true });
    setValue('neck_style', neckStyle, { shouldDirty: true });
    setValue('arm_style', armStyle, { shouldDirty: true });
    setValue('trouser_method', trouserMethod, { shouldDirty: true });
    setValue('trouser_cut_sew_method', trouserCutSewMethod, { shouldDirty: true });
    setValue('pocket_design', pocketDesign, { shouldDirty: true });
    setValue('fabric_family', fabricFamily, { shouldDirty: true });
    setValue('fabric_type', fabricType, { shouldDirty: true });
    setValue('trouser_cargo_pockets', uniformCargoPockets, { shouldDirty: true });
    setValue('has_back_pockets', hasBackPockets, { shouldDirty: true });
    setValue('back_pocket_type', backPocketType, { shouldDirty: true });

    setValue(
      'garmentType',
      kitSelection === 'shirt_only' ? topName : kitSelection === 'trouser_only' ? bottomName : `${topName} + ${bottomName}`,
      { shouldValidate: false, shouldDirty: true }
    );
    setValue('materialVariant', fullFabricName, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [
    kitSelection,
    shirtType,
    neckStyle,
    armStyle,
    trouserMethod,
    trouserCutSewMethod,
    pocketDesign,
    fabricFamily,
    fabricType,
    uniformCargoPockets,
    hasBackPockets,
    backPocketType,
    lookingFor,
    selectedSport,
    setValue,
    watch,
  ]);

  // Country selector dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const selectedCountryCode = watch('country') || 'PK';
  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];
  const defaultSizeRegion = getDefaultSizeChartRegion(selectedCountryCode);
  const [selectedSizeRegion, setSelectedSizeRegion] = useState<SizeChartRegion>(defaultSizeRegion);
  const hasUserCustomizedSizeRegion = useRef(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!hasUserCustomizedSizeRegion.current) {
      setSelectedSizeRegion(defaultSizeRegion);
    }
  }, [defaultSizeRegion]);

  // Dynamic 8-character inquiry code (e.g. "PAK-00001", "USA-00001")
  const inquiryCode = formatInquiryCode(selectedCountryCode, inquirySeq);

  React.useEffect(() => {
    setValue('inquiry_code', inquiryCode, { shouldDirty: false });
  }, [inquiryCode, setValue]);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Phone country and country selector state
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>('US');
  const hasUserManuallySelectedCountryRef = React.useRef(false);

  // Auto-detect visitor country on mount via Edge Geolocation API with timezone fallback
  React.useEffect(() => {
    // 1. Instant timezone detection
    const tzCountry = detectCountryFromTimezone();
    if (tzCountry && tzCountry !== 'US') {
      const match = COUNTRIES.find((c) => c.code === tzCountry);
      if (match) {
        setPhoneCountryCode(match.code);
        if (!hasUserManuallySelectedCountryRef.current) {
          setValue('country', match.code, { shouldValidate: false });
        }
      }
    }

    // 2. Exact IP Geolocation from Edge API
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country) {
          const match = COUNTRIES.find((c) => c.code === data.country);
          if (match) {
            setPhoneCountryCode(match.code);
            if (!hasUserManuallySelectedCountryRef.current) {
              setValue('country', match.code, { shouldValidate: false });
            }
          }
        }
      })
      .catch(() => {
        // silently fallback
      });
  }, [setValue]);

  const contactPhoneValue = watch('contactPhone') || '';

  // Branch A: Handle Design Pack Files Upload (max 25MB per file)
  const MAX_DESIGN_FILE_SIZE = 25 * 1024 * 1024;
  const handleDesignFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignUploadError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > MAX_DESIGN_FILE_SIZE);
    if (oversized) {
      setDesignUploadError(`File "${oversized.name}" exceeds the 25MB limit (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Please upload files under 25MB.`);
      return;
    }

    const newFilesList = [...designFilesList];
    const newUrls: string[] = [...(design?.uploaded_files || [])];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newFilesList.push({
          name: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(1),
          dataUrl,
        });
        newUrls.push(dataUrl);
        setDesignFilesList([...newFilesList]);
        setValue('design.uploaded_files', newUrls, { shouldDirty: true });
        setValue('designFiles', newUrls, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDesignFile = (idx: number) => {
    const updatedList = designFilesList.filter((_, i) => i !== idx);
    setDesignFilesList(updatedList);
    const updatedUrls = (design?.uploaded_files || []).filter((_, i) => i !== idx);
    setValue('design.uploaded_files', updatedUrls, { shouldDirty: true });
    setValue('designFiles', updatedUrls, { shouldDirty: true });
  };

  // Step 3 Logo Upload Handler (max 25MB)
  const handleLogoFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoUploadError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > MAX_DESIGN_FILE_SIZE);
    if (oversized) {
      setLogoUploadError(`File "${oversized.name}" exceeds the 25MB limit (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Please upload files under 25MB.`);
      return;
    }

    const newFilesList = [...logoFilesList];
    const newUrls: string[] = [...(watch('logo_files') || [])];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newFilesList.push({
          name: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(1),
          dataUrl,
        });
        newUrls.push(dataUrl);
        setLogoFilesList([...newFilesList]);
        setValue('logo_files', newUrls, { shouldDirty: true });

        // Synchronize with first garment for PDF compilation
        const curGarments = [...garments];
        if (curGarments.length > 0) {
          curGarments[0].logo_placements = [
            {
              slot: 'primary_logo',
              image_url: dataUrl,
              width_in: 2.5,
              height_in: 2.5,
              placement_note: logoPlacement || 'Front placement',
            },
          ];
          setValue('garments', curGarments, { shouldDirty: true });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveLogoFile = (idx: number) => {
    const updatedList = logoFilesList.filter((_, i) => i !== idx);
    setLogoFilesList(updatedList);
    const updatedUrls = (watch('logo_files') || []).filter((_, i) => i !== idx);
    setValue('logo_files', updatedUrls, { shouldDirty: true });
  };

  // Step 3 Reference Designs / Inspiration Upload Handler (max 25MB)
  const handleReferenceFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferenceUploadError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > MAX_DESIGN_FILE_SIZE);
    if (oversized) {
      setReferenceUploadError(`File "${oversized.name}" exceeds the 25MB limit (${(oversized.size / (1024 * 1024)).toFixed(1)}MB). Please upload files under 25MB.`);
      return;
    }

    const newFilesList = [...referenceFilesList];
    const newUrls: string[] = [...(design?.brief?.inspiration_images || [])];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newFilesList.push({
          name: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(1),
          dataUrl,
        });
        newUrls.push(dataUrl);
        setReferenceFilesList([...newFilesList]);
        setValue('design.brief.inspiration_images', newUrls, { shouldDirty: true });
        setValue('design.uploaded_files', newUrls, { shouldDirty: true });
        setValue('designFiles', newUrls, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveReferenceFile = (idx: number) => {
    const updatedList = referenceFilesList.filter((_, i) => i !== idx);
    setReferenceFilesList(updatedList);
    const updatedUrls = (design?.brief?.inspiration_images || []).filter((_, i) => i !== idx);
    setValue('design.brief.inspiration_images', updatedUrls, { shouldDirty: true });
    setValue('design.uploaded_files', updatedUrls, { shouldDirty: true });
    setValue('designFiles', updatedUrls, { shouldDirty: true });
  };

  // Contextual item placement label derived from Step 2
  const itemPlacementLabel = React.useMemo(() => {
    if (kitSelection === 'shirt_only') return 'top / shirt';
    if (kitSelection === 'trouser_only') return 'bottom / trouser';
    if (kitSelection === 'full_kit') {
      if (lookingFor === 'Uniform') return 'full uniform (top & bottom)';
      if (lookingFor === 'Merch') return 'full set (top + bottom)';
      return 'full kit (top & bottom)';
    }
    return 'garment';
  }, [kitSelection, lookingFor]);

  // Branch B: Brief toggles
  const togglePrimaryColor = (hex: string) => {
    const current = primaryColors;
    const next = current.includes(hex)
      ? current.length > 1 ? current.filter((c) => c !== hex) : current
      : [...current, hex];
    setValue('design.brief.primary_colors', next, { shouldDirty: true });
    if (next[0]) setValue('primaryColor', next[0]);
  };

  const toggleSecondaryColor = (hex: string) => {
    const current = secondaryColors;
    const next = current.includes(hex)
      ? current.filter((c) => c !== hex)
      : [...current, hex];
    setValue('design.brief.secondary_colors', next, { shouldDirty: true });
    if (next[0]) setValue('accentColor', next[0]);
  };

  const toggleStyleTheme = (theme: string) => {
    const current = styleThemes;
    const next = current.includes(theme)
      ? current.length > 1 ? current.filter((t) => t !== theme) : current
      : [...current, theme];
    setValue('design.brief.style_themes', next, { shouldDirty: true });
  };

  const toggleTextElement = (el: string) => {
    const current = textElements;
    const next = current.includes(el)
      ? current.filter((item) => item !== el)
      : [...current, el];
    setValue('design.brief.text_elements', next, { shouldDirty: true });
  };

  const toggleGraphicElement = (el: string) => {
    if (el === 'None of these') {
      setValue('design.brief.graphic_elements', ['None of these'], { shouldDirty: true });
      return;
    }
    const current = graphicElements.filter((item) => item !== 'None of these');
    const next = current.includes(el)
      ? current.filter((item) => item !== el)
      : [...current, el];
    setValue('design.brief.graphic_elements', next, { shouldDirty: true });
  };

  const handleBrandGuidelinesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrandGuidelinesFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue('design.brief.brand_guidelines_file', event.target?.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleInspirationImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const current = [...inspirationImagesList];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        current.push(url);
        setInspirationImagesList([...current]);
        setValue('design.brief.inspiration_images', [...current], { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  // Multi-Garment management
  const handleAddGarment = (cat: 'top' | 'bottom' | 'outerwear') => {
    const newG: GarmentSpecType = cat === 'bottom'
      ? {
          garment_type: 'bottom',
          type_name: 'Match Shorts',
          colour_mode: 'solid',
          colour_value: 'Cream',
          fabric_name: 'Kings Cream Fabric',
          fly_type: '-',
          pocket_type: 'Side Seam Pocket',
          cuff_type: 'Open Hem',
          panel_piping: '-',
          logo_application: ['Stickers'],
          font_name: '-',
          logo_placements: [],
          sizing: { mode: 'uniform', qty_by_size: {} },
        }
      : {
          garment_type: 'top',
          type_name: 'Polo Shirt',
          colour_mode: 'sublimation',
          colour_value: 'Sublimation',
          fabric_name: 'SAP Cream Fabric',
          collar_type: 'Polo Collar',
          button_type: 'Snap Buttons',
          sleeve_length: 'Half Sleeves',
          panel_piping: '-',
          logo_application: ['Sublimation'],
          font_name: '-',
          logo_placements: [],
          sizing: { mode: 'uniform', qty_by_size: {} },
        };

    const next = [...garments, newG];
    setValue('garments', next);
    setActiveGarmentTab(next.length - 1);
  };

  const handleRemoveGarment = (idx: number) => {
    if (garments.length <= 1) return;
    const next = garments.filter((_, i) => i !== idx);
    setValue('garments', next);
    setActiveGarmentTab(Math.max(0, idx - 1));
  };

  // Player Roster management
  const handleAddPlayer = () => {
    const newPlayer: PlayerRosterRowType = {
      player_name: '',
      number: '',
      size: 'L',
      qty: 2,
      role_note: null,
    };
    setValue('roster', [...roster, newPlayer]);
  };

  const handleRemovePlayer = (idx: number) => {
    setValue(
      'roster',
      roster.filter((_, i) => i !== idx)
    );
  };

  // Live Summary generation
  const activeGarment = garments[activeGarmentTab] || garments[0];
  const liveSummary = orderType === 'individualized'
    ? generateIndividualizedSummary(
        roster,
        blanksBySize,
        `${activeGarment?.sleeve_length?.toUpperCase() || 'HALF SLEEVE'} ${activeGarment?.type_name?.toUpperCase() || 'T-SHIRTS'} SIZES (EACH PLAYER 2 QTY)`
      )
    : generateUniformSummary(
        activeGarment?.sizing?.qty_by_size || {},
        `${activeGarment?.type_name?.toUpperCase() || 'GARMENT'} SIZES`
      );

  // Helper to compress and optimize uploaded logo files
  const compressImageFile = async (
    file: File,
    maxWidth: number = 600,
    maxHeight: number = 600,
    quality: number = 0.85
  ): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
          resolve(rawDataUrl);
          return;
        }
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === 'image/png' || file.type === 'image/svg+xml' ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(format, quality));
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Update specific logo slot fields (image, width, height, notes) immutably
  const updateLogoSlot = (
    garmentIdx: number,
    slotId: string,
    patch: Partial<LogoPlacementType>
  ) => {
    const nextGarments = garments.map((g, gIdx) => {
      if (gIdx !== garmentIdx) return g;
      const currentPlacements = g.logo_placements ? [...g.logo_placements] : [];
      const pIdx = currentPlacements.findIndex(
        (p) => p.slot.toLowerCase() === slotId.toLowerCase()
      );
      if (pIdx >= 0) {
        currentPlacements[pIdx] = { ...currentPlacements[pIdx], ...patch };
      } else {
        currentPlacements.push({
          slot: slotId,
          image_url: null,
          height_in: 3,
          width_in: 2.5,
          ...patch,
        });
      }
      return { ...g, logo_placements: currentPlacements };
    });

    setValue('garments', nextGarments, { shouldDirty: true, shouldValidate: true });
  };

  // Logo file upload with automatic client-side compression
  const handleLogoUpload = async (garmentIdx: number, slotId: string, file: File) => {
    try {
      const optimizedDataUrl = await compressImageFile(file, 600, 600, 0.85);
      updateLogoSlot(garmentIdx, slotId, { image_url: optimizedDataUrl });
    } catch (err) {
      console.error('Error uploading logo:', err);
    }
  };

  const handleRemoveLogo = (garmentIdx: number, slotId: string) => {
    updateLogoSlot(garmentIdx, slotId, { image_url: null });
  };

  // Auto-flag SVG generator for country
  const handleSetFlag = (garmentIdx: number, slotId: string) => {
    const flagSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><rect width="500" height="300" fill="#CE1126"/><path d="M0,0 L140,0 L200,30 L140,60 L200,90 L140,120 L200,150 L140,180 L200,210 L140,240 L200,270 L140,300 L0,300 Z" fill="#FFFFFF"/></svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(flagSvg)}`;
    updateLogoSlot(garmentIdx, slotId, { image_url: dataUrl, flag_auto: true, height_in: 2.5, width_in: 3.5 });
  };

  const validateStep2 = async (): Promise<boolean> => {
    let valid = true;

    // 1. Items Check
    if (!kitSelection) {
      setError('kit_selection', { message: 'Please select items' });
      valid = false;
    } else {
      clearErrors('kit_selection');
    }

    // 2. Order Customization Check (if Custom Sportswear)
    if (lookingFor === 'Custom Sportswear' && !orderType) {
      setError('order_type', { message: 'Please select order customization' });
      valid = false;
    } else {
      clearErrors('order_type');
    }

    // 3. MOQ check: volumeMOQ >= MOQ_UNITS (50)
    const vol = getValues('volumeMOQ');
    if (!vol || isNaN(Number(vol)) || Number(vol) < MOQ_UNITS) {
      setError('volumeMOQ', { message: `Minimum order quantity is ${MOQ_UNITS} pieces` });
      valid = false;
    } else {
      clearErrors('volumeMOQ');
    }

    // 4. Fabric Family & Fabric Type
    if (!fabricFamily) {
      setError('fabric_family', { message: 'Please select a fabric family' });
      valid = false;
    } else {
      clearErrors('fabric_family');
    }

    if (fabricFamily && !fabricType) {
      setError('fabric_type', { message: 'Please select a fabric type' });
      valid = false;
    } else if (fabricType) {
      clearErrors('fabric_type');
    }

    // 5. Individualized Excel Sheet Upload requirement
    if (orderType === 'individualized') {
      const excelData = getValues('roster_excel_file');
      if (!excelData && !rosterExcelFileName) {
        setRosterExcelError('Please upload your completed player Excel sheet (.xlsx / .xls) before proceeding');
        setError('roster_excel_file', { message: 'Completed Player Names & Numbers Excel sheet is required' });
        valid = false;
      } else {
        setRosterExcelError(null);
        clearErrors('roster_excel_file');
      }
    }

    // Also run trigger on step 2 fields
    const rhfValid = await trigger([
      'kit_selection',
      'order_type',
      'volumeMOQ',
      'fabric_family',
      'fabric_type',
      ...(orderType === 'individualized' ? ['roster_excel_file' as const] : []),
    ]);

    return valid && rhfValid;
  };

  const validateStep3 = (): boolean => {
    let valid = true;

    // 1. Logo Question Check
    if (!hasLogo) {
      setLogoUploadError('Please select whether you have a logo');
      setError('has_logo', { message: 'Please select whether you have a logo' });
      valid = false;
    } else if (hasLogo === 'yes') {
      const logoFiles = getValues('logo_files') || [];
      if (logoFilesList.length === 0 && logoFiles.length === 0) {
        setLogoUploadError('Please upload your logo file(s) before proceeding');
        setError('logo_files', { message: 'Please upload at least one logo file' });
        valid = false;
      } else {
        setLogoUploadError(null);
        clearErrors('logo_files');
      }
    } else {
      setLogoUploadError(null);
      clearErrors('logo_files');
    }

    // 2. Design Question Check
    if (!designChoice) {
      setDesignUploadError('Please choose whether you have a design or want us to create one');
      valid = false;
    } else if (designChoice === 'client_provided') {
      const designFiles = getValues('designFiles') || [];
      const uploadedFiles = getValues('design.uploaded_files') || [];
      if (designFilesList.length === 0 && designFiles.length === 0 && uploadedFiles.length === 0) {
        setDesignUploadError('Please upload your design file(s) before proceeding');
        setError('designFiles', { message: 'Please attach at least one design file or artwork' });
        valid = false;
      } else {
        setDesignUploadError(null);
        clearErrors('designFiles');
      }
    } else if (designChoice === 'requested_from_team') {
      const notes = getValues('designNotes');
      if (!notes || notes.trim().length < 3) {
        setError('designNotes', { message: 'Please provide design instructions or notes for our team' });
        valid = false;
      } else {
        clearErrors('designNotes');
      }
    }

    return valid;
  };

  const goToNextStep = async () => {
    setServerError(null);
    if (currentStep === 1) {
      const isValid = await trigger(['order_by', 'contactEmail', 'lookingFor', 'sport', 'uniform_type']);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isStep2Valid = await validateStep2();
      if (isStep2Valid) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    setServerError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const goToStep = async (targetStep: 1 | 2 | 3) => {
    setServerError(null);
    if (targetStep < currentStep) {
      // Going back to any previous section is always allowed and retains all form history
      setCurrentStep(targetStep);
      return;
    }
    if (targetStep === currentStep) return;
    if (currentStep === 1 && targetStep > 1) {
      const isStep1Valid = await trigger(['order_by', 'contactEmail', 'lookingFor', 'sport', 'uniform_type']);
      if (!isStep1Valid) return;
      if (targetStep === 2) {
        setCurrentStep(2);
        return;
      }
      const isStep2Valid = await validateStep2();
      if (isStep2Valid) setCurrentStep(3);
    } else if (currentStep === 2 && targetStep === 3) {
      const isStep2Valid = await validateStep2();
      if (isStep2Valid) setCurrentStep(3);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const formData = getValues();
      const refId = referenceId || `HRS-${Date.now().toString().slice(-6)}`;
      const doc = await generateQuoteSpecPdf(formData, refId);
      const clientLabel = (formData.companyName || formData.order_by || 'ORDER').replace(/\s+/g, '-');
      doc.save(`HR-SPORTS-INQUIRY-${refId}-${clientLabel}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const onSubmit = async (data: QuoteSchemaType) => {
    if (!validateStep3()) {
      return;
    }
    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        ...data,
        inquiry_code: inquiryCode,
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setReferenceId(resData.referenceId);
        setCurrentStep(4);
      } else {
        setServerError(resData.error || 'Failed to submit quote inquiry. Please check your data.');
      }
    } catch (err: any) {
      setServerError('Network error while processing quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors: any) => {
    console.warn('Form validation failed:', formErrors);
    validateStep3();
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const messages = errorKeys.map((k) => formErrors[k]?.message || k).filter(Boolean);
      setServerError(`Please complete the required details before submitting: ${messages.join(' • ')}`);
    }
  };

  // Step 4: Success Confirmation Screen (Centered Note & PDF Download)
  if (currentStep === 4 && referenceId) {
    return (
      <div className="min-h-[500px] flex items-center justify-center py-6 px-4 animate-in fade-in duration-300">
        <BorderCard variant="surface" className="w-full max-w-xl mx-auto p-8 sm:p-12 text-center space-y-6 shadow-2xl border-border bg-surface">
          <div className="w-16 h-16 bg-burgundy text-white rounded-full mx-auto flex items-center justify-center shadow-lg ring-4 ring-burgundy/20">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-burgundy font-bold">
              Inquiry Submitted Successfully
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Thank You for Your Inquiry
            </h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed pt-1">
              Your inquiry has been logged in our system. Our manufacturing and CAD engineering team will review your specifications and contact you shortly.
            </p>
          </div>

          {/* Centered Note with Inquiry Number */}
          <div className="p-5 bg-zinc-900/90 border border-zinc-700/80 rounded-xl max-w-sm mx-auto shadow-inner space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              Your Inquiry Number
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider block text-burgundy">
              {referenceId}
            </span>
            <span className="text-[11px] font-mono text-zinc-400 block pt-1">
              Keep this inquiry number for reference when contacting our team.
            </span>
          </div>

          {/* Buttons: Download PDF Summary & Submit Another */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isDownloadingPdf}
              onClick={handleDownloadPdf}
              className="gap-2 w-full sm:w-auto font-mono font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download PDF Summary
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setCurrentStep(1);
                setReferenceId(null);
              }}
              className="w-full sm:w-auto text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-500 cursor-pointer whitespace-nowrap"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </BorderCard>
      </div>
    );
  }

  return (
    <div className="relative lg:flex lg:items-start lg:gap-8 xl:gap-12">
      {/* ========================================================================= */}
      {/* DESKTOP (PC): STICKY VERTICAL STEPPER RAIL (LEFT OF FORM) */}
      {/* ========================================================================= */}
      <motion.aside
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={stepperRailVariants}
        className="hidden lg:block w-48 xl:w-56 shrink-0 sticky top-28 py-4"
      >
        <div className="relative flex flex-col space-y-12 pl-2">
          {/* Vertical Background Track Line */}
          <div className="absolute left-[29px] top-6 bottom-6 w-1 bg-zinc-200 z-0 -translate-x-1/2" />

          {/* Vertical Active Progress Track Line */}
          <div
            className="absolute left-[29px] top-6 w-1 bg-burgundy transition-all duration-300 z-0 -translate-x-1/2"
            style={{
              height: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            }}
          />

          {/* PC Step 1 */}
          <motion.div variants={stepItemVariants}>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={`relative z-10 flex items-center gap-4 text-left transition-all group ${
                currentStep >= 1 ? 'cursor-pointer' : 'cursor-default'
              }`}
              title="Step 1: Your Details"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                  currentStep > 1
                    ? 'bg-burgundy text-white border-black shadow-md ring-2 ring-burgundy/30 group-hover:scale-105'
                    : currentStep === 1
                    ? 'bg-burgundy text-white border-black shadow-lg scale-110 ring-4 ring-burgundy/20'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                }`}
              >
                {currentStep > 1 ? (
                  <Check className="w-5 h-5 stroke-[3] text-white" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <div>
                <span className={`text-sm font-mono font-semibold block transition-colors ${
                  currentStep >= 1 ? 'text-ink group-hover:text-burgundy' : 'text-muted'
                }`}>
                  Details
                </span>
                {currentStep > 1 && (
                  <span className="text-[10px] font-mono text-muted group-hover:text-burgundy block -mt-0.5">
                    Click to edit
                  </span>
                )}
              </div>
            </button>
          </motion.div>

          {/* PC Step 2 */}
          <motion.div variants={stepItemVariants}>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className={`relative z-10 flex items-center gap-4 text-left transition-all group ${
                currentStep >= 2 ? 'cursor-pointer' : 'cursor-default'
              }`}
              title="Step 2: Garment Specifications"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                  currentStep > 2
                    ? 'bg-burgundy text-white border-black shadow-md ring-2 ring-burgundy/30 group-hover:scale-105'
                    : currentStep === 2
                    ? 'bg-burgundy text-white border-black shadow-lg scale-110 ring-4 ring-burgundy/20'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                }`}
              >
                {currentStep > 2 ? (
                  <Check className="w-5 h-5 stroke-[3] text-white" />
                ) : (
                  <span>2</span>
                )}
              </div>
              <div>
                <span className={`text-sm font-mono font-semibold block transition-colors ${
                  currentStep >= 2 ? 'text-ink group-hover:text-burgundy' : 'text-muted'
                }`}>
                  Garment Specs
                </span>
                {currentStep > 2 && (
                  <span className="text-[10px] font-mono text-muted group-hover:text-burgundy block -mt-0.5">
                    Click to edit
                  </span>
                )}
              </div>
            </button>
          </motion.div>

          {/* PC Step 3 */}
          <motion.div variants={stepItemVariants}>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className={`relative z-10 flex items-center gap-4 text-left transition-all group ${
                currentStep >= 3 ? 'cursor-pointer' : 'cursor-default'
              }`}
              title="Step 3: Design"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                  currentStep === 3
                    ? 'bg-burgundy text-white border-black shadow-lg scale-110 ring-4 ring-burgundy/20'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                }`}
              >
                <span>3</span>
              </div>
              <div>
                <span className={`text-sm font-mono font-semibold block transition-colors whitespace-nowrap shrink-0 ${
                  currentStep >= 3 ? 'text-ink' : 'text-muted'
                }`}>
                  Design
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </motion.aside>

      {/* ========================================================================= */}
      {/* FORM BODY CONTAINER */}
      {/* ========================================================================= */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={formCardVariants}
        className="flex-1 w-full min-w-0"
      >
        <BorderCard variant="default" className="p-5 sm:p-8 lg:p-10 shadow-sm relative">
          {/* MOBILE ONLY: COMPACT HORIZONTAL STEPPER WITH SMALLER CIRCLES */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={mobileStepperVariants}
            className="block lg:hidden mb-8 border-b border-border-light pb-6"
          >
            <div className="relative flex items-start justify-between max-w-sm mx-auto px-4">
              {/* Mobile Track Lines */}
              <div className="absolute top-4 left-6 right-6 -translate-y-1/2 h-0.5 bg-zinc-200 z-0" />
              <div
                className="absolute top-4 left-6 -translate-y-1/2 h-0.5 bg-burgundy transition-all duration-300 z-0"
                style={{
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? 'calc(50% - 1rem)' : 'calc(100% - 2rem)',
                }}
              />

              {/* Mobile Step 1 */}
              <motion.div variants={mobileStepItemVariants}>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                      currentStep > 1
                        ? 'bg-burgundy text-white border-black shadow-xs group-hover:scale-110'
                        : currentStep === 1
                        ? 'bg-burgundy text-white border-black shadow-md scale-105 ring-2 ring-burgundy/20'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                    }`}
                  >
                    {currentStep > 1 ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                    ) : (
                      <span>1</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono transition-colors ${
                      currentStep >= 1 ? 'font-semibold text-ink group-hover:text-burgundy' : 'font-medium text-muted'
                    }`}
                  >
                    Details
                  </span>
                </button>
              </motion.div>

              {/* Mobile Step 2 */}
              <motion.div variants={mobileStepItemVariants}>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className={`relative z-10 flex flex-col items-center text-center group ${
                    currentStep >= 2 ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                      currentStep > 2
                        ? 'bg-burgundy text-white border-black shadow-xs group-hover:scale-110'
                        : currentStep === 2
                        ? 'bg-burgundy text-white border-black shadow-md scale-105 ring-2 ring-burgundy/20'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                    }`}
                  >
                    {currentStep > 2 ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono transition-colors ${
                      currentStep >= 2 ? 'font-semibold text-ink group-hover:text-burgundy' : 'font-medium text-muted'
                    }`}
                  >
                    Specs
                  </span>
                </button>
              </motion.div>

              {/* Mobile Step 3 */}
              <motion.div variants={mobileStepItemVariants}>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className={`relative z-10 flex flex-col items-center text-center group ${
                    currentStep >= 3 ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                      currentStep === 3
                        ? 'bg-burgundy text-white border-black shadow-md scale-105 ring-2 ring-burgundy/20'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-400'
                    }`}
                  >
                    <span>3</span>
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                      currentStep >= 3 ? 'font-semibold text-ink' : 'font-medium text-muted'
                    }`}
                  >
                    Design
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border-hairline border-red-300 rounded-base text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: YOUR DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={formContainerVariants}
            className="space-y-5"
          >
            <motion.div variants={formFieldVariants}>
              <h3 className="text-2xl font-extrabold text-ink tracking-tight">
                Your Details
              </h3>
              <p className="text-[15px] text-muted mt-1.5 leading-relaxed">
                Kindly provide your contact details.
              </p>
            </motion.div>

            <motion.div variants={formFieldVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Your Name"
                placeholder="e.g. John Doe"
                autoComplete="name"
                {...register('order_by')}
                error={errors.order_by?.message}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register('contactEmail')}
                error={errors.contactEmail?.message}
                required
              />

              <PhoneInput
                id="whatsapp"
                label="WhatsApp"
                optional
                value={contactPhoneValue}
                countryCode={phoneCountryCode}
                onCountryChange={(newCode) => {
                  setPhoneCountryCode(newCode);
                  if (!hasUserManuallySelectedCountryRef.current) {
                    setValue('country', newCode, { shouldValidate: true, shouldDirty: true });
                  }
                }}
                onChange={(formattedDisplay, fullInternational, isValid) => {
                  setValue('contactPhone', fullInternational || formattedDisplay, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                error={errors.contactPhone?.message}
              />
            </motion.div>

            <motion.div
              variants={formFieldVariants}
              className="p-4 bg-surface border-hairline border-border rounded-2xl"
            >
              <div className={`grid grid-cols-1 ${lookingFor === 'Custom Sportswear' || lookingFor === 'Uniform' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 items-start transition-all duration-200`}>
                {/* Searchable Country Dropdown with SVG Flags */}
                <div className="relative">
                  <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wider font-bold text-white mb-1.5 whitespace-nowrap">
                    Country
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className="w-full h-[42px] flex items-center justify-between bg-white text-ink border-hairline rounded-base px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <img
                        src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                        alt={selectedCountry.name}
                        className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-zinc-200 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="font-medium truncate">{selectedCountry.name}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted shrink-0 ml-2" />
                  </button>

                  {isCountryOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-border rounded-base shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100">
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          autoFocus
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-border-light rounded-base focus:outline-none focus:ring-1 focus:ring-ink"
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto divide-y divide-zinc-100">
                        {filteredCountries.length === 0 ? (
                          <div className="text-xs text-muted p-2 text-center">No country found</div>
                        ) : (
                          filteredCountries.map((c) => {
                            const isSelected = c.code === selectedCountryCode;
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  hasUserManuallySelectedCountryRef.current = true;
                                  setValue('country', c.code, { shouldValidate: true });
                                  setIsCountryOpen(false);
                                  setCountrySearch('');
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs text-left rounded hover:bg-zinc-100 transition-colors ${
                                  isSelected ? 'bg-zinc-100 font-bold text-ink' : 'text-zinc-700'
                                }`}
                              >
                                <span className="flex items-center gap-2.5 truncate">
                                  <img
                                    src={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                                    alt={c.name}
                                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-zinc-200 shrink-0"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                  <span className="truncate">{c.name}</span>
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-ink shrink-0 ml-1" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                  {errors.country?.message && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.country.message}</p>
                  )}
                </div>

                {/* What are you looking for? Field */}
                <div className="relative">
                  <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                    <span>What are you looking for?</span>
                    <span className="text-red-400 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={lookingFor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLookingFor(val);
                        setValue('lookingFor', val, { shouldValidate: true, shouldDirty: true });
                        if (val === 'Custom Sportswear') {
                          setValue('sport', selectedSport || '', { shouldValidate: false, shouldDirty: true });
                          setValue('order_type', '', { shouldValidate: false, shouldDirty: true });
                        } else if (val === 'Uniform') {
                          setValue('sport', 'Uniform', { shouldValidate: true, shouldDirty: true });
                          setValue('order_type', 'uniform', { shouldValidate: true, shouldDirty: true });
                          setValue('uniform_type', selectedUniformType || '', { shouldValidate: false, shouldDirty: true });
                        } else if (val === 'Merch') {
                          setValue('sport', 'Merch', { shouldValidate: true, shouldDirty: true });
                          setValue('order_type', 'uniform', { shouldValidate: true, shouldDirty: true });
                        }
                      }}
                      className={`w-full h-[42px] appearance-none bg-white ${
                        !lookingFor ? 'text-zinc-400' : 'text-ink font-medium'
                      } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                        errors.lookingFor ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="" disabled>
                        Select an option...
                      </option>
                      <option value="Custom Sportswear" className="text-ink font-medium">Custom Sportswear</option>
                      <option value="Uniform" className="text-ink font-medium">Uniform</option>
                      <option value="Merch" className="text-ink font-medium">Merch</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.lookingFor?.message && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.lookingFor.message}</p>
                  )}
                </div>

                {/* Third Field: Conditional on What are you looking for? */}
                {/* 1. Custom Sportswear -> Select Sport */}
                {lookingFor === 'Custom Sportswear' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wider font-bold text-white mb-1.5 whitespace-nowrap">
                      <span>Select Sport</span>
                      <span className="text-red-400 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('sport')}
                        value={watch('sport') === 'Uniform' || watch('sport') === 'Merch' ? (selectedSport || '') : (watch('sport') || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSport(val);
                          setValue('sport', val, { shouldValidate: true, shouldDirty: true });
                        }}
                        className={`w-full h-[42px] appearance-none bg-white ${
                          !watch('sport') || watch('sport') === 'Uniform' || watch('sport') === 'Merch' ? 'text-zinc-400' : 'text-ink font-medium'
                        } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                          errors.sport ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="" disabled>
                          Select a sport...
                        </option>
                        {SPORT_CATEGORIES.map((sp) => (
                          <option key={sp} value={sp} className="text-ink font-medium">
                            {sp}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.sport?.message && (
                      <p className="mt-1 text-xs text-red-400 font-medium">{errors.sport.message}</p>
                    )}
                  </motion.div>
                )}

                {/* 2. Uniform -> Type of Uniform */}
                {lookingFor === 'Uniform' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wider font-bold text-white mb-1.5 whitespace-nowrap">
                      <span>Type of Uniform</span>
                      <span className="text-red-400 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={watch('uniform_type') || selectedUniformType || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedUniformType(val);
                          setValue('uniform_type', val, { shouldValidate: true, shouldDirty: true });
                        }}
                        className={`w-full h-[42px] appearance-none bg-white ${
                          !watch('uniform_type') && !selectedUniformType ? 'text-zinc-400' : 'text-ink font-medium'
                        } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                          errors.uniform_type ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="" disabled>
                          Select uniform type...
                        </option>
                        {UNIFORM_TYPES.map((u) => (
                          <option key={u} value={u} className="text-ink font-medium">
                            {u}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.uniform_type?.message && (
                      <p className="mt-1 text-xs text-red-400 font-medium">{errors.uniform_type.message}</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pt-4 flex justify-end"
            >
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={goToNextStep}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ORDER TYPE & MULTI-GARMENT SPECIFICATIONS */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* STEP 2: ORDER TYPE & GARMENT SPECIFICATIONS (CONSISTENT WITH STEP 1) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Step 2 Header & Back Breadcrumb */}
            <div>
              <button
                type="button"
                onClick={goToPrevStep}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-burgundy sm:text-[#9b7278] hover:text-burgundy sm:hover:text-burgundy transition-colors mb-2.5 group"
                title="Return to Details (Step 1)"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Step 1: Your Details</span>
              </button>
              <h3 className="text-2xl font-extrabold text-ink tracking-tight">
                Order & Garment Details
              </h3>
              <p className="text-[15px] text-muted mt-1.5 leading-relaxed">
                Configure your order items, garment details, manufacturing methods, and fabrics.
              </p>
            </div>

            {/* TOP DIRECT ROW (2 OR 3 COLUMNS DIRECT ON CARD) */}
            <div className={`grid grid-cols-1 ${lookingFor === 'Custom Sportswear' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              {/* Field 1: Items */}
              <div className="relative">
                <div className="h-5 flex items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-ink whitespace-nowrap">
                    Items *
                  </label>
                </div>
                <div className="relative">
                  <select
                    value={kitSelection}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setKitSelection(val);
                      setValue('kit_selection', val, { shouldValidate: true, shouldDirty: true });
                    }}
                    className={`w-full h-[42px] appearance-none bg-white ${
                      !kitSelection ? 'text-zinc-400' : 'text-ink font-medium'
                    } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                      errors.kit_selection ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="" disabled>
                      Select items...
                    </option>
                    <option value="full_kit" className="text-ink font-medium">
                      {lookingFor === 'Uniform' ? 'Full Uniform' : lookingFor === 'Merch' ? 'Full (Top + Bottom)' : 'Full Kit'}
                    </option>
                    <option value="shirt_only" className="text-ink font-medium">
                      Top
                    </option>
                    <option value="trouser_only" className="text-ink font-medium">
                      Bottom
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.kit_selection?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.kit_selection.message}</p>
                )}
              </div>

              {/* Field 2: Customization Type (Only for Custom Sportswear) */}
              {lookingFor === 'Custom Sportswear' && (
                <div className="relative">
                  <div className="h-5 flex items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider font-semibold text-ink whitespace-nowrap">
                      Order Customization *
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      value={orderType || ''}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setValue('order_type', val, { shouldValidate: true, shouldDirty: true });
                      }}
                      className={`w-full h-[42px] appearance-none bg-white ${
                        !orderType ? 'text-zinc-400' : 'text-ink font-medium'
                      } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                        errors.order_type ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="" disabled>
                        Select customization...
                      </option>
                      <option value="individualized" className="text-ink font-medium">With Name &amp; Number</option>
                      <option value="uniform" className="text-ink font-medium">Without Name &amp; Number</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  {errors.order_type?.message && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.order_type.message}</p>
                  )}
                </div>
              )}

              {/* Field 3: Total Quantity */}
              <div className="relative">
                <div className="h-5 flex items-center justify-between mb-1.5 gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-ink whitespace-nowrap">
                    Total Quantity *
                  </label>
                  <span className="text-[11px] font-mono text-burgundy font-bold whitespace-nowrap">
                    MOQ: {MOQ_UNITS} Pieces
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={MOQ_UNITS}
                    step={1}
                    placeholder={String(MOQ_UNITS)}
                    {...register('volumeMOQ', { valueAsNumber: true })}
                    className={`w-full h-[42px] bg-white text-ink font-medium border-hairline rounded-base px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink ${
                      errors.volumeMOQ ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.volumeMOQ?.message && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.volumeMOQ.message}</p>
                )}
              </div>
            </div>

            {/* Placeholder when 3 top fields are not yet filled */}
            {!isStep2CardVisible ? (
              <div className="p-8 border border-dashed border-zinc-200 bg-zinc-50/60 rounded-2xl text-center flex flex-col items-center justify-center space-y-2.5 transition-all">
                <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center font-bold">
                  <Shirt className="w-5 h-5 text-burgundy" />
                </div>
                <p className="text-sm font-mono font-semibold text-zinc-700">
                  Kindly select the options above
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-5 bg-surface border-hairline border-border rounded-2xl space-y-6"
              >
              {/* ATTRIBUTE 1: SHIRT SPECIFICATIONS (if unselected preview, full_kit, or shirt_only) */}
              {(kitSelection === '' || kitSelection === 'full_kit' || kitSelection === 'shirt_only') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-burgundy" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-zinc-300" />
                        {lookingFor === 'Uniform' ? 'Uniform Top' : lookingFor === 'Merch' ? 'Merch Top' : 'Top'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">Upper Garment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Shirt Type */}
                    <div className="relative">
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Shirt Type *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={shirtType}
                          onChange={(e) => setShirtType(e.target.value)}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !shirtType ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select shirt type...
                          </option>
                          {SHIRT_TYPE_OPTIONS.map((st) => (
                            <option key={st} value={st} className="text-ink font-medium">
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Neck Style */}
                    <div className="relative">
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Neck Style *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={neckStyle}
                          onChange={(e) => setNeckStyle(e.target.value)}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !neckStyle ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select neck style...
                          </option>
                          {NECK_STYLE_OPTIONS.map((ns) => (
                            <option key={ns} value={ns} className="text-ink font-medium">
                              {ns}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Arm Style */}
                    <div className="relative">
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Arm Style *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={armStyle}
                          onChange={(e) => setArmStyle(e.target.value)}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !armStyle ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select arm style...
                          </option>
                          {ARM_STYLE_OPTIONS.map((as) => (
                            <option key={as} value={as} className="text-ink font-medium">
                              {as}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ATTRIBUTE 2: TROUSER SPECIFICATIONS (if unselected preview, full_kit, or trouser_only) */}
              {(kitSelection === '' || kitSelection === 'full_kit' || kitSelection === 'trouser_only') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-burgundy" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-300" />
                        {lookingFor === 'Uniform' ? 'Uniform Bottom' : lookingFor === 'Merch' ? 'Merch Bottom' : 'Bottom'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">Lower Garment</span>
                  </div>

                  <div className={`grid grid-cols-1 ${trouserMethod === 'Cut & Sew' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                    {/* Manufacturing Method */}
                    <div className="relative">
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Manufacturing Method *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={trouserMethod}
                          onChange={(e) => setTrouserMethod(e.target.value as any)}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !trouserMethod ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select manufacturing method...
                          </option>
                          {TROUSER_METHOD_OPTIONS.map((tm) => (
                            <option key={tm} value={tm} className="text-ink font-medium">
                              {tm}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Cut & Sew Detail (Only if Cut & Sew) */}
                    {trouserMethod === 'Cut & Sew' && (
                      <div className="relative animate-in fade-in duration-150">
                        <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                          <span>Cut & Sew Method *</span>
                        </label>
                        <div className="relative">
                          <select
                            value={trouserCutSewMethod}
                            onChange={(e) => setTrouserCutSewMethod(e.target.value)}
                            className={`w-full h-[42px] appearance-none bg-white ${
                              !trouserCutSewMethod ? 'text-zinc-400' : 'text-ink font-medium'
                            } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                          >
                            <option value="" disabled>
                              Select cut &amp; sew method...
                            </option>
                            {TROUSER_CUT_SEW_METHODS.map((cm) => (
                              <option key={cm} value={cm} className="text-ink font-medium">
                                {cm}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}

                    {/* Pocket Design */}
                    <div className="relative">
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Pocket Design *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={pocketDesign}
                          onChange={(e) => setPocketDesign(e.target.value)}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !pocketDesign ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select pocket design...
                          </option>
                          {POCKET_DESIGN_OPTIONS.map((pd) => (
                            <option key={pd} value={pd} className="text-ink font-medium">
                              {pd}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Uniform-Only Additions */}
                  {lookingFor === 'Uniform' && (
                    <div className="pt-3 border-t border-border/40 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Cargo Pockets */}
                        <div className="relative">
                          <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                            <span>Uniform Pockets *</span>
                          </label>
                          <div className="relative">
                            <select
                              value={uniformCargoPockets}
                              onChange={(e) => setUniformCargoPockets(e.target.value)}
                              className={`w-full h-[42px] appearance-none bg-white ${
                                !uniformCargoPockets ? 'text-zinc-400' : 'text-ink font-medium'
                              } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                            >
                              <option value="" disabled>
                                Select uniform pockets...
                              </option>
                              {UNIFORM_CARGO_POCKET_OPTIONS.map((cp) => (
                                <option key={cp} value={cp} className="text-ink font-medium">
                                  {cp}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* Back Pockets */}
                        <div className="relative">
                          <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                            <span>Back Pockets *</span>
                          </label>
                          <div className="relative">
                            <select
                              value={hasBackPockets}
                              onChange={(e) => setHasBackPockets(e.target.value as any)}
                              className={`w-full h-[42px] appearance-none bg-white ${
                                !hasBackPockets ? 'text-zinc-400' : 'text-ink font-medium'
                              } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer`}
                            >
                              <option value="" disabled>
                                Select back pockets...
                              </option>
                              <option value="No" className="text-ink font-medium">No</option>
                              <option value="Yes" className="text-ink font-medium">Yes</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* Back Pocket Type Detail */}
                        {hasBackPockets === 'Yes' && (
                          <div className="relative animate-in fade-in duration-200">
                            <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                              <span>Back Pocket Style *</span>
                            </label>
                            <input
                              type="text"
                              value={backPocketType}
                              onChange={(e) => setBackPocketType(e.target.value)}
                              placeholder="e.g. Flap with button, Welt pocket"
                              className="w-full h-[42px] bg-white text-ink font-medium border-hairline rounded-base px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ATTRIBUTE 3: FABRIC SPECIFICATIONS (TWO-LEVEL TAXONOMY) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-burgundy" />
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-zinc-300" />
                      Fabric & Material
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">Two-Level Selection</span>
                </div>

                <div className={`grid grid-cols-1 ${fabricFamily ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4 items-start transition-all duration-200`}>
                  {/* Level 1: Fabric Family */}
                  <div className="relative">
                    <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                      <span>Fabric Family *</span>
                    </label>
                    <div className="relative">
                      <select
                        value={fabricFamily}
                        onChange={(e) => {
                          const fam = e.target.value as FabricFamily;
                          setFabricFamily(fam);
                          setFabricType('');
                          setValue('fabric_family', fam, { shouldValidate: true, shouldDirty: true });
                          setValue('fabric_type', '', { shouldValidate: false, shouldDirty: true });
                        }}
                        className={`w-full h-[42px] appearance-none bg-white ${
                          !fabricFamily ? 'text-zinc-400' : 'text-ink font-medium'
                        } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                          errors.fabric_family ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="" disabled>
                          Select fabric family...
                        </option>
                        {FABRIC_FAMILIES.map((fam) => (
                          <option key={fam} value={fam} className="text-ink font-medium">
                            {fam}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.fabric_family?.message && (
                      <p className="mt-1 text-xs text-red-400 font-medium">{errors.fabric_family.message}</p>
                    )}
                  </div>

                  {/* Level 2: Fabric Type (Cascades dynamically ONLY when Fabric Family is selected, matching Section 1) */}
                  {fabricFamily && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <label className="h-5 flex items-center text-xs font-mono uppercase tracking-wide font-bold text-white mb-1.5 whitespace-nowrap">
                        <span>Fabric Type ({fabricFamily}) *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={fabricType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFabricType(val);
                            setValue('fabric_type', val, { shouldValidate: true, shouldDirty: true });
                          }}
                          className={`w-full h-[42px] appearance-none bg-white ${
                            !fabricType ? 'text-zinc-400' : 'text-ink font-medium'
                          } border-hairline rounded-base px-3.5 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer ${
                            errors.fabric_type ? 'border-red-500' : ''
                          }`}
                        >
                          <option value="" disabled>
                            Select fabric type...
                          </option>
                          {FABRIC_TAXONOMY[fabricFamily]?.map((type) => (
                            <option key={type} value={type} className="text-ink font-medium">
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.fabric_type?.message && (
                        <p className="mt-1 text-xs text-red-400 font-medium">{errors.fabric_type.message}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ATTRIBUTE 4: SIZE BREAKDOWN (FOR WITHOUT NAME & NUMBER / BULK ORDERS) */}
              {orderType !== 'individualized' && (
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-burgundy shrink-0" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
                        <Ruler className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                        <span>Size Breakdown (Pieces per Size)</span>
                      </span>
                    </div>

                    {/* Regional Dropdown & View Size Guide Button */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                      <div className="relative shrink-0" ref={regionDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsRegionDropdownOpen((prev) => !prev)}
                          className="h-[32px] inline-flex items-center gap-2 whitespace-nowrap shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold text-xs border border-zinc-700 hover:border-zinc-500 rounded-base px-2.5 transition-colors cursor-pointer"
                          aria-label="Select size chart standard"
                        >
                          <RegionFlagIcon region={selectedSizeRegion} className="w-4 h-3 shrink-0" />
                          <span className="whitespace-nowrap">{SIZE_CHART_CONFIG[selectedSizeRegion]?.shortName || 'Asian'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-150 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRegionDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 z-30 min-w-[150px] bg-zinc-900 border border-zinc-700 rounded-base shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            {(['us', 'uk', 'asian'] as SizeChartRegion[]).map((rKey) => {
                              const cfg = SIZE_CHART_CONFIG[rKey];
                              const isSelected = selectedSizeRegion === rKey;
                              return (
                                <button
                                  key={rKey}
                                  type="button"
                                  onClick={() => {
                                    hasUserCustomizedSizeRegion.current = true;
                                    setSelectedSizeRegion(rKey);
                                    setIsRegionDropdownOpen(false);
                                    setIsSizeGuideOpen(true);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-left whitespace-nowrap transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-burgundy text-white'
                                      : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
                                  }`}
                                >
                                  <RegionFlagIcon region={rKey} className="w-4 h-3 shrink-0" />
                                  <span className="whitespace-nowrap">{cfg.shortName}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="inline-flex items-center gap-1.5 h-[32px] px-3 whitespace-nowrap shrink-0 text-xs font-mono font-bold text-white bg-burgundy hover:bg-burgundyHover rounded-base transition-colors shadow-2xs cursor-pointer"
                        title="View size chart image"
                      >
                        <Ruler className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">View Size Chart ({SIZE_CHART_CONFIG[selectedSizeRegion]?.shortName || 'Asian'})</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {STANDARD_SIZES.map((sz) => {
                      const qty = blanksBySize[sz] !== undefined && blanksBySize[sz] !== null ? blanksBySize[sz] : '';
                      return (
                        <div key={sz} className="flex flex-col items-center bg-burgundy border border-burgundy rounded-base p-2 hover:bg-burgundyHover transition-colors shadow-2xs">
                          <span className="text-xs font-mono font-bold uppercase text-white mb-1.5">
                            {sz}
                          </span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={qty}
                            onChange={(e) => {
                              const val = e.target.value === '' ? undefined : parseInt(e.target.value) || 0;
                              const nextBlanks = { ...blanksBySize };
                              if (val === undefined || val === 0) {
                                delete nextBlanks[sz];
                              } else {
                                nextBlanks[sz] = val;
                              }
                              setValue('blanks_by_size', nextBlanks, { shouldDirty: true });

                              const currentVol = getValues('volumeMOQ');
                              if (!currentVol || isNaN(Number(currentVol))) {
                                const sum = Object.values(nextBlanks).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
                                if (sum > 0) {
                                  setValue('volumeMOQ', sum, { shouldValidate: true, shouldDirty: true });
                                }
                              }
                            }}
                            className="w-full h-[38px] bg-white text-ink text-center font-mono font-bold text-sm border-hairline rounded-base focus:outline-none focus:ring-2 focus:ring-white"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Status Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono pt-1 text-zinc-400">
                    <span className="flex items-center gap-2">
                      <span>Total Quantity:</span>
                      <strong
                        className={`font-bold ${
                          totalAllocatedPieces === targetOrderQty
                            ? 'text-emerald-400'
                            : totalAllocatedPieces > targetOrderQty
                            ? 'text-amber-400'
                            : 'text-zinc-200'
                        }`}
                      >
                        {totalAllocatedPieces} / {targetOrderQty} Pieces
                      </strong>
                      {totalAllocatedPieces === targetOrderQty ? (
                        <span className="text-emerald-400 font-semibold">✓ Exact match ({targetOrderQty} pieces)</span>
                      ) : totalAllocatedPieces < targetOrderQty ? (
                        <span className="text-amber-400 font-medium">
                          ({targetOrderQty - totalAllocatedPieces} more to reach target {targetOrderQty} pieces)
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">
                          ({totalAllocatedPieces - targetOrderQty} pieces over target {targetOrderQty})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

            {/* Conditional Excel Spreadsheet Section placed BELOW the black card (White & Red/Burgundy Aesthetic) */}
            {isStep2CardVisible && orderType === 'individualized' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-5 sm:p-6 bg-white border-2 border-red-100 shadow-sm rounded-2xl space-y-5"
              >
                {/* Top: Header with Title on Left & Two Buttons Aligned to the Top-Right */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-burgundy flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono uppercase font-bold tracking-wider text-ink">
                        Player Names &amp; Numbers Excel Sheet
                      </span>
                      <span className="text-[10px] font-mono bg-red-100 text-burgundy border border-red-200 px-2 py-0.5 rounded font-bold">
                        .XLSX
                      </span>
                    </div>
                  </div>

                  {/* Two Buttons Aligned to the Top Right */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 h-[38px] px-3.5 whitespace-nowrap shrink-0 bg-white hover:bg-red-50/50 text-ink text-xs font-bold font-mono tracking-wide rounded-base transition-colors border border-burgundy shadow-2xs cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      <span className="whitespace-nowrap">View Size Chart ({SIZE_CHART_CONFIG[selectedSizeRegion || defaultSizeRegion]?.shortName || 'Asian'})</span>
                    </button>

                    <a
                      href={NAME_NUMBER_EXCEL_TEMPLATE_URL}
                      download="Customization_Name_&_number.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-[38px] px-4 whitespace-nowrap shrink-0 bg-burgundy hover:bg-[#6b0f2b] active:scale-[0.98] text-white text-xs font-bold font-mono tracking-wide rounded-base transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">Download Excel Template</span>
                    </a>
                  </div>
                </div>

                {/* Instructions Text Aligned Below */}
                <div className="text-xs text-muted leading-relaxed space-y-1">
                  <p><strong className="text-ink">Step 1:</strong> Download the pre-formatted Excel template above.</p>
                  <p><strong className="text-ink">Step 2:</strong> Fill in each player&apos;s jersey name, number, and top &amp; bottom sizes.</p>
                  <p><strong className="text-ink">Step 3:</strong> Upload your completed Excel file below.</p>
                </div>

                {/* Bottom: Excel File Upload Field (Accepts ONLY .xlsx / .xls) */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink">
                    Upload Completed Player Excel Sheet (.xlsx / .xls)
                  </label>

                  {!rosterExcelFileName ? (
                    <label
                      onDragOver={handleRosterExcelDragOver}
                      onDragEnter={handleRosterExcelDragOver}
                      onDragLeave={handleRosterExcelDragLeave}
                      onDrop={handleRosterExcelDrop}
                      className={`border-2 border-dashed rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all group ${
                        isRosterExcelDragging
                          ? 'border-burgundy bg-red-100/70 scale-[1.01] ring-2 ring-burgundy/20'
                          : 'border-red-200 hover:border-burgundy bg-red-50/30 hover:bg-red-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 text-center sm:text-left pointer-events-none">
                        <div className={`w-10 h-10 rounded-lg bg-white border border-red-200 text-burgundy transition-transform flex items-center justify-center shrink-0 shadow-2xs ${
                          isRosterExcelDragging ? 'scale-110 text-burgundy' : 'group-hover:scale-105'
                        }`}>
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink group-hover:text-burgundy transition-colors">
                            {isRosterExcelDragging ? 'Drop your Excel file here' : 'Click to upload or drag & drop your filled Excel file'}
                          </div>
                          <div className="text-[11px] font-mono text-muted mt-0.5">
                            Only Excel files accepted (.xlsx, .xls • Max 25MB)
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-burgundy bg-white border border-red-300 px-3.5 py-1.5 rounded-base shadow-2xs group-hover:bg-burgundy group-hover:text-white transition-all shrink-0 pointer-events-none">
                        Choose Excel File
                      </span>

                      <input
                        type="file"
                        accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        className="hidden"
                        onChange={handleRosterExcelUpload}
                      />
                    </label>
                  ) : (
                    <div className="p-4 bg-red-50/40 border border-red-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 rounded-lg bg-white border border-red-200 text-burgundy flex items-center justify-center shrink-0 shadow-2xs">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-ink truncate flex items-center gap-2">
                            <span>{rosterExcelFileName}</span>
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                              ✓ Ready to Process
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-muted">
                            {rosterExcelFileSize} • Attached to your quote inquiry
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="cursor-pointer text-xs font-mono text-zinc-700 hover:text-ink bg-white border border-border px-3 py-1.5 rounded-base hover:bg-zinc-50 shadow-2xs transition-colors flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          Replace
                          <input
                            type="file"
                            accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="hidden"
                            onChange={handleRosterExcelUpload}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleRemoveRosterExcel}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-100 rounded-base transition-colors"
                          title="Remove uploaded Excel sheet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {rosterExcelError && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {rosterExcelError}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goToPrevStep}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={goToNextStep}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: DESIGN */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <button
                type="button"
                onClick={goToPrevStep}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-burgundy hover:text-burgundy transition-colors mb-2.5 group whitespace-nowrap shrink-0 cursor-pointer"
                title="Return to Garment Details (Step 2)"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Step 2: Garment Details</span>
              </button>
              <h3 className="text-2xl font-extrabold text-ink tracking-tight whitespace-nowrap">
                Design
              </h3>
              <p className="text-[15px] text-muted mt-1 leading-relaxed">
                Select your logo and design preferences for your order.
              </p>
            </div>

            {/* ========================================================================= */}
            {/* QUESTION 1: DO YOU HAVE A LOGO? */}
            {/* ========================================================================= */}
            <div className="p-5 bg-surface border-hairline border-border rounded-2xl space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Do you have a logo?
              </h4>

              {/* Red & White Selectable Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* YES CARD */}
                <button
                  type="button"
                  onClick={() => {
                    setHasLogo('yes');
                    setValue('has_logo', 'yes', { shouldDirty: true });
                  }}
                  className={`p-4 rounded-xl text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                    hasLogo === 'yes'
                      ? 'bg-burgundy border-2 border-white ring-2 ring-burgundy/40 shadow-md'
                      : 'bg-burgundy/85 hover:bg-burgundy border-2 border-transparent text-white'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                    {hasLogo === 'yes' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                  </div>
                  <div className="text-sm font-bold text-white whitespace-nowrap">
                    Yes, I have a logo
                  </div>
                </button>

                {/* NO CARD */}
                <button
                  type="button"
                  onClick={() => {
                    setHasLogo('no');
                    setValue('has_logo', 'no', { shouldDirty: true });
                    setLogoFilesList([]);
                    setValue('logo_files', [], { shouldDirty: true });
                    setLogoPlacement('');
                    setValue('logo_placement_note', '', { shouldDirty: true });
                  }}
                  className={`p-4 rounded-xl text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                    hasLogo === 'no'
                      ? 'bg-burgundy border-2 border-white ring-2 ring-burgundy/40 shadow-md'
                      : 'bg-burgundy/85 hover:bg-burgundy border-2 border-transparent text-white'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                    {hasLogo === 'no' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                  </div>
                  <div className="text-sm font-bold text-white whitespace-nowrap">
                    No, I do not have a logo
                  </div>
                </button>
              </div>

              {/* CONDITIONAL: If Yes, show file upload + placement question */}
              {hasLogo === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 bg-white border-2 border-red-100 shadow-sm rounded-2xl space-y-4 text-ink"
                >
                  {/* File Upload Question */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                      Upload Logo File(s) (.svg, .ai, .eps, .pdf, .png, .jpg)
                    </label>

                    {/* Section 2 Style Dropzone */}
                    <label className="border-2 border-dashed border-red-200 hover:border-burgundy bg-red-50/30 hover:bg-red-50/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all group">
                      <div className="flex items-center gap-3.5 text-center sm:text-left pointer-events-none">
                        <div className="w-10 h-10 rounded-lg bg-white border border-red-200 text-burgundy transition-transform flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink group-hover:text-burgundy transition-colors whitespace-nowrap">
                            Click to upload or drag & drop logo files
                          </div>
                          <div className="text-[11px] font-mono text-muted mt-0.5 whitespace-nowrap">
                            Vector / High-Resolution formats preferred • Max 25MB
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-burgundy bg-white border border-red-300 px-3.5 py-1.5 rounded-base shadow-2xs group-hover:bg-burgundy group-hover:text-white transition-all shrink-0 pointer-events-none whitespace-nowrap">
                        Choose Files
                      </span>

                      <input
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                        className="hidden"
                        onChange={handleLogoFilesUpload}
                      />
                    </label>

                    {logoUploadError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-base text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{logoUploadError}</span>
                      </div>
                    )}

                    {logoFilesList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono uppercase font-bold text-muted whitespace-nowrap">
                          Uploaded Files ({logoFilesList.length}):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {logoFilesList.map((file, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-red-50/40 border border-red-200 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div className="truncate pr-2">
                                <div className="font-bold text-ink truncate text-xs">{file.name}</div>
                                <div className="text-[10px] font-mono text-muted">{file.sizeMb} MB</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLogoFile(idx)}
                                className="text-red-500 hover:text-red-700 p-1 shrink-0 cursor-pointer"
                                title="Remove file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Placement Question referencing Step 2 placement */}
                  <div className="space-y-2 pt-3 border-t border-zinc-100">
                    <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                      Where should your logo be placed on your {itemPlacementLabel}?
                    </label>

                    <input
                      type="text"
                      value={logoPlacement}
                      onChange={(e) => {
                        setLogoPlacement(e.target.value);
                        setValue('logo_placement_note', e.target.value, { shouldDirty: true });
                      }}
                      placeholder="Specify placement (e.g. Left chest, right sleeve, left thigh)..."
                      className="w-full h-[42px] bg-white text-ink border border-zinc-200 rounded-base px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-burgundy transition-all placeholder:text-muted/60"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* QUESTION 2: APPEARS STEP-BY-STEP ONLY AFTER QUESTION 1 IS ANSWERED       */}
            {/* ========================================================================= */}
            {hasLogo !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-5 bg-surface border-hairline border-border rounded-2xl space-y-4"
              >
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Do you already have a design, or would you like us to create one for you?
                </h4>

                {/* Red & White Selectable Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* OPTION 1: "I already have a design" */}
                  <button
                    type="button"
                    onClick={() => {
                      setDesignChoice('client_provided');
                      setValue('design.source', 'client_provided', { shouldDirty: true });
                      setValue('uploadMode', 'file', { shouldDirty: true });
                    }}
                    className={`p-4 rounded-xl text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                      designChoice === 'client_provided'
                        ? 'bg-burgundy border-2 border-white ring-2 ring-burgundy/40 shadow-md'
                        : 'bg-burgundy/85 hover:bg-burgundy border-2 border-transparent text-white'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                      {designChoice === 'client_provided' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>
                    <div className="text-sm font-bold text-white whitespace-nowrap">
                      I already have a design
                    </div>
                  </button>

                  {/* OPTION 2: "Create a design for me" */}
                  <button
                    type="button"
                    onClick={() => {
                      setDesignChoice('requested_from_team');
                      setValue('design.source', 'requested_from_team', { shouldDirty: true });
                      setValue('uploadMode', 'design-help', { shouldDirty: true });
                    }}
                    className={`p-4 rounded-xl text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                      designChoice === 'requested_from_team'
                        ? 'bg-burgundy border-2 border-white ring-2 ring-burgundy/40 shadow-md'
                        : 'bg-burgundy/85 hover:bg-burgundy border-2 border-transparent text-white'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                      {designChoice === 'requested_from_team' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>
                    <div className="text-sm font-bold text-white whitespace-nowrap">
                      Create a design for me
                    </div>
                  </button>
                </div>

                {/* BRANCH 1: "I already have a design" */}
                {designChoice === 'client_provided' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 bg-white border-2 border-red-100 shadow-sm rounded-2xl space-y-4 text-ink"
                  >
                    {/* File Upload Field */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                        Upload Design File(s) (.png, .jpg, .jpeg, .svg, .pdf, .ai, .eps, .psd)
                      </label>

                      {/* Section 2 Style Dropzone */}
                      <label className="border-2 border-dashed border-red-200 hover:border-burgundy bg-red-50/30 hover:bg-red-50/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all group">
                        <div className="flex items-center gap-3.5 text-center sm:text-left pointer-events-none">
                          <div className="w-10 h-10 rounded-lg bg-white border border-red-200 text-burgundy transition-transform flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-ink group-hover:text-burgundy transition-colors whitespace-nowrap">
                              Click to upload or drag & drop design files
                            </div>
                            <div className="text-[11px] font-mono text-muted mt-0.5 whitespace-nowrap">
                              Multiple files allowed • Vector / High-Res preferred • Max 25MB
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-burgundy bg-white border border-red-300 px-3.5 py-1.5 rounded-base shadow-2xs group-hover:bg-burgundy group-hover:text-white transition-all shrink-0 pointer-events-none whitespace-nowrap">
                          Choose Files
                        </span>

                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps,.psd"
                          className="hidden"
                          onChange={handleDesignFilesUpload}
                        />
                      </label>

                      {designUploadError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-base text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{designUploadError}</span>
                        </div>
                      )}

                      {designFilesList.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-mono uppercase font-bold text-muted whitespace-nowrap">
                            Uploaded Files ({designFilesList.length}):
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {designFilesList.map((file, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 bg-red-50/40 border border-red-200 rounded-xl flex items-center justify-between text-xs"
                              >
                                <div className="truncate pr-2">
                                  <div className="font-bold text-ink truncate text-xs">{file.name}</div>
                                  <div className="text-[10px] font-mono text-muted">{file.sizeMb} MB</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDesignFile(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 shrink-0 cursor-pointer"
                                  title="Remove file"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes Field */}
                    <div className="space-y-2 pt-3 border-t border-zinc-100">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                        Design Notes & Instructions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Pantone colors, embroidery, printing techniques, placement instructions..."
                        {...register('designNotes')}
                        className="w-full bg-white text-ink border border-zinc-200 rounded-base p-3 text-sm focus:outline-none focus:ring-1 focus:ring-burgundy transition-all placeholder:text-muted/60"
                      />
                      {errors.designNotes && (
                        <p className="text-xs text-red-600 font-medium">{errors.designNotes.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* BRANCH 2: "Create a design for me" */}
                {designChoice === 'requested_from_team' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 bg-white border-2 border-red-100 shadow-sm rounded-2xl space-y-4 text-ink"
                  >
                    {/* Optional Reference File Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                        Reference Designs or Inspiration Images (Optional)
                      </label>

                      {/* Section 2 Style Dropzone */}
                      <label className="border-2 border-dashed border-red-200 hover:border-burgundy bg-red-50/30 hover:bg-red-50/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all group">
                        <div className="flex items-center gap-3.5 text-center sm:text-left pointer-events-none">
                          <div className="w-10 h-10 rounded-lg bg-white border border-red-200 text-burgundy transition-transform flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-ink group-hover:text-burgundy transition-colors whitespace-nowrap">
                              Click to upload or drag & drop reference images
                            </div>
                            <div className="text-[11px] font-mono text-muted mt-0.5 whitespace-nowrap">
                              Upload sample jerseys, sketches, moodboards • Max 25MB
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-burgundy bg-white border border-red-300 px-3.5 py-1.5 rounded-base shadow-2xs group-hover:bg-burgundy group-hover:text-white transition-all shrink-0 pointer-events-none whitespace-nowrap">
                          Choose Files
                        </span>

                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                          className="hidden"
                          onChange={handleReferenceFilesUpload}
                        />
                      </label>

                      {referenceUploadError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-base text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{referenceUploadError}</span>
                        </div>
                      )}

                      {referenceFilesList.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-mono uppercase font-bold text-muted whitespace-nowrap">
                            Uploaded Reference Files ({referenceFilesList.length}):
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {referenceFilesList.map((file, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 bg-red-50/40 border border-red-200 rounded-xl flex items-center justify-between text-xs"
                              >
                                <div className="truncate pr-2">
                                  <div className="font-bold text-ink truncate text-xs">{file.name}</div>
                                  <div className="text-[10px] font-mono text-muted">{file.sizeMb} MB</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveReferenceFile(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 shrink-0 cursor-pointer"
                                  title="Remove file"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Creative Notes Field */}
                    <div className="space-y-2 pt-3 border-t border-zinc-100">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-ink whitespace-nowrap">
                        What colors, style, or themes would you like our design team to create?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe colors, patterns, club styling direction..."
                        {...register('designNotes')}
                        className="w-full bg-white text-ink border border-zinc-200 rounded-base p-3 text-sm focus:outline-none focus:ring-1 focus:ring-burgundy transition-all placeholder:text-muted/60"
                      />
                      {errors.designNotes && (
                        <p className="text-xs text-red-600 font-medium">{errors.designNotes.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* BOTTOM ACTIONS                                                            */}
            {/* ========================================================================= */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-medium leading-relaxed">{serverError}</span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-light">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goToPrevStep}
                className="gap-1.5 whitespace-nowrap shrink-0 w-full sm:w-auto cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Garment Details
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="gap-2 whitespace-nowrap shrink-0 w-full sm:w-auto cursor-pointer font-bold tracking-wide"
              >
                Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        </form>
      </BorderCard>
    </motion.div>

    {/* Size Specification Guide Modal / Drawer */}
    <SizeChartModal
      isOpen={isSizeGuideOpen}
      onClose={() => setIsSizeGuideOpen(false)}
      initialRegion={selectedSizeRegion}
      onRegionChange={(region) => {
        hasUserCustomizedSizeRegion.current = true;
        setSelectedSizeRegion(region);
      }}
    />
  </div>
  );
};

export default InquiryForm;
