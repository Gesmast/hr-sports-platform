'use client';

import React, { useState, useId } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { BorderCard } from '@/components/shared/BorderCard';
import { DesignUploadZone } from './DesignUploadZone';
import {
  quoteSchema,
  QuoteSchemaType,
  GarmentSpecType,
  PlayerRosterRowType,
  LogoPlacementType,
  DesignSourceType,
  DesignBriefType,
} from '@/lib/schemas/quote';
import { MOQ_UNITS, MOQ_LABEL, GARMENT_TYPES } from '@/lib/constants';
import { materials } from '@/data/materials';
import { generateQuoteSpecPdf } from '@/lib/pdf/quote-spec-compiler';
import {
  generateIndividualizedSummary,
  generateUniformSummary,
} from '@/lib/pdf/roster-compiler';
import { SIZE_CHART_PRESETS, SizeChartStandard } from '@/lib/pdf/size-charts';

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

const SPORT_OPTIONS = [
  'Cricket',
  'Football/Soccer',
  'Basketball',
  'Rugby',
  'MMA/BJJ',
  'Gym & Activewear',
  'Streetwear',
  'Other',
];

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
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [activeGarmentTab, setActiveGarmentTab] = useState(0);

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<QuoteSchemaType>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      targetDeliveryDate: 'Standard Production (30–45 Days)',
      order_by: '',
      designer: '-',
      order_date: todayStr,
      dispatch_date: 'Standard Production (30–45 Days)',
      team_country_name: 'BEHRAIN',
      sport: 'Cricket',
      order_type: 'individualized',
      size_chart_standard: 'mens_export',
      volumeMOQ: 50,
      garmentType: initialGarment || 'Sublimation T-Shirt',
      materialVariant: initialFabric || 'SAP Cream Fabric',
      sizeBreakdown: 'M: 9, L: 13, XL: 19, 2XL: 6',
      uploadMode: 'design-help',
      designFiles: [],
      designNotes: 'Sublimation cricket kits with Bahrain national crest, sponsor logos, and player roster.',
      primaryColor: '#FAF6EA',
      accentColor: '#FFFFFF',
      garments: [defaultTopGarment, defaultBottomGarment],
      roster: initialRoster,
      blanks_by_size: initialBlanks,
      design: {
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
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDesignFile = (idx: number) => {
    const updatedList = designFilesList.filter((_, i) => i !== idx);
    setDesignFilesList(updatedList);
    const updatedUrls = (design?.uploaded_files || []).filter((_, i) => i !== idx);
    setValue('design.uploaded_files', updatedUrls, { shouldDirty: true });
  };

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

  const goToNextStep = async () => {
    setServerError(null);
    if (currentStep === 1) {
      const dDate = getValues('dispatch_date');
      if (dDate) {
        setValue('targetDeliveryDate', dDate);
      }
      const isValid = await trigger(['companyName', 'contactEmail', 'targetDeliveryDate']);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger(['volumeMOQ', 'garmentType', 'materialVariant']);
      if (isValid) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    setServerError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const formData = getValues();
      const refId = referenceId || `HRS-${Date.now().toString().slice(-6)}`;
      const doc = await generateQuoteSpecPdf(formData, refId);
      doc.save(`HR-SPORTS-SPEC-${(formData.companyName || 'ORDER').replace(/\s+/g, '-')}-${refId}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const onSubmit = async (data: QuoteSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  // Step 4: Success Confirmation Screen
  if (currentStep === 4 && referenceId) {
    return (
      <BorderCard variant="surface" className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-ink text-white rounded-full mx-auto flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
            Manufacturing Spec Sheet Generated
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Order Intake Queued
          </h3>
          <p className="text-xs text-muted mt-2 max-w-md mx-auto leading-relaxed">
            Your technical spec sheet and roster breakdown have been validated. A formal commercial proforma invoice will be dispatched within <strong>24 business hours</strong>.
          </p>
        </div>

        <div className="p-4 bg-white border-hairline border-border rounded-base max-w-md mx-auto">
          <span className="text-[10px] font-mono uppercase text-muted block mb-1">
            Factory Tracking Reference ID
          </span>
          <span className="text-xl font-mono font-extrabold text-ink tracking-wider">
            {referenceId}
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            isLoading={isDownloadingPdf}
            onClick={handleDownloadPdf}
            className="gap-2 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Download OMTEX Spec Sheet (PDF)
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setCurrentStep(1);
              setReferenceId(null);
            }}
            className="w-full sm:w-auto"
          >
            Submit Another Spec Sheet
          </Button>
        </div>
      </BorderCard>
    );
  }

  return (
    <BorderCard variant="default" className="p-6 sm:p-10 shadow-sm relative">
      {/* Multi-Step Progress Header */}
      <div className="mb-8 border-b border-border-light pb-6">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="font-bold text-ink uppercase tracking-wider">
            Step 0{currentStep} of 03
          </span>
          <span className="text-muted">
            {currentStep === 1 && 'Order & Client Meta'}
            {currentStep === 2 && 'Order Type & Garment Specifications'}
            {currentStep === 3 && 'Logo Placements, Player Roster & Sizing'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 1 ? 'bg-ink' : 'bg-surface'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 2 ? 'bg-ink' : 'bg-surface'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${currentStep >= 3 ? 'bg-ink' : 'bg-surface'}`} />
        </div>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border-hairline border-red-300 rounded-base text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: ORDER & CLIENT META */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-extrabold text-ink tracking-tight">
                Order & Client Meta Information
              </h3>
              <p className="text-xs text-muted mt-1">
                Fills the top header strip of the technical spec sheet (Client Name, Order By, Delivery Date).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company or Brand Name / Client Name *"
                placeholder="e.g. NIRAJ / Bahrain Cricket"
                {...register('companyName')}
                error={errors.companyName?.message}
                required
              />

              <Input
                label="Order Placed By (Agent / Rep) *"
                placeholder="e.g. AZIM"
                {...register('order_by')}
                error={errors.order_by?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Corporate Email Address *"
                type="email"
                placeholder="procurement@team.com"
                {...register('contactEmail')}
                error={errors.contactEmail?.message}
                required
              />

              <Input
                label="Phone / WhatsApp (Optional)"
                type="tel"
                placeholder="+973 000 0000"
                {...register('contactPhone')}
                error={errors.contactPhone?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-1.5 text-red-600">
                When do you want it by (Dispatch / Delivery Date) *
              </label>
              <input
                type="text"
                placeholder="e.g. 15 / 08 / 2026 or Standard Production (30–45 Days)"
                {...register('dispatch_date', {
                  onChange: (e) => {
                    setValue('targetDeliveryDate', e.target.value);
                  },
                })}
                className="w-full bg-white text-ink border-hairline rounded-base px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              />
              <span className="text-[10px] text-muted block mt-1">
                Target turnaround timeframe or delivery deadline.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface border-hairline border-border rounded-base">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider font-bold text-ink mb-1.5">
                  Country / Club Display Heading *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BEHRAIN"
                  {...register('team_country_name')}
                  className="w-full bg-white text-ink border-hairline rounded-base px-3.5 py-2 text-sm font-bold uppercase tracking-wide focus:outline-none focus:ring-1 focus:ring-ink"
                />
                <span className="text-[10px] text-muted block mt-1">
                  Prints in large bold letters on the visual mockup sheet.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider font-bold text-ink mb-1.5">
                  Sport / Category *
                </label>
                <select
                  {...register('sport')}
                  className="w-full bg-white text-ink border-hairline rounded-base px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                >
                  {SPORT_OPTIONS.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={goToNextStep}
                className="gap-2"
              >
                Continue to Garment Specs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ORDER TYPE & MULTI-GARMENT SPECIFICATIONS */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-extrabold text-ink tracking-tight">
                Order Type & Garment Specifications
              </h3>
              <p className="text-xs text-muted mt-1">
                Configure your order type and stamp out specifications for each garment ordered.
              </p>
            </div>

            {/* SECTION 2: ORDER TYPE (UNIFORM vs INDIVIDUALIZED) */}
            <div className="p-4 bg-surface border-hairline border-border rounded-base space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider font-bold text-ink">
                Is this order Uniform or Individualized (Name & Number per player)? *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 border-hairline rounded-base cursor-pointer flex items-start gap-3 transition-colors ${
                    orderType === 'uniform'
                      ? 'border-ink bg-white shadow-sm'
                      : 'border-border-light bg-transparent hover:border-ink'
                  }`}
                >
                  <input
                    type="radio"
                    value="uniform"
                    {...register('order_type')}
                    className="mt-1 text-ink focus:ring-ink"
                  />
                  <div>
                    <span className="font-bold text-ink block text-xs uppercase font-mono">
                      Uniform Order
                    </span>
                    <span className="text-[11px] text-muted leading-tight block mt-0.5">
                      Every unit is identical. Sizing is entered as simple quantity per size (e.g. S: 10, M: 20).
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 border-hairline rounded-base cursor-pointer flex items-start gap-3 transition-colors ${
                    orderType === 'individualized'
                      ? 'border-ink bg-white shadow-sm'
                      : 'border-border-light bg-transparent hover:border-ink'
                  }`}
                >
                  <input
                    type="radio"
                    value="individualized"
                    {...register('order_type')}
                    className="mt-1 text-ink focus:ring-ink"
                  />
                  <div>
                    <span className="font-bold text-ink block text-xs uppercase font-mono">
                      Individualized (Name & Number)
                    </span>
                    <span className="text-[11px] text-muted leading-tight block mt-0.5">
                      Each player gets customized jersey name, number, and size (e.g. Mukhia #18), plus blank stock units.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* SIZING STANDARD & VOLUME MOQ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-1.5">
                  Size Chart Standard *
                </label>
                <select
                  {...register('size_chart_standard')}
                  className="w-full bg-white text-ink border-hairline rounded-base px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
                >
                  <option value="mens_export">Men&apos;s Export (XS: 36 - 4XL: 50)</option>
                  <option value="womens_export">Women&apos;s Export (XS: 32 - 4XL: 46)</option>
                  <option value="youth">Youth / Kids (YS: 26 - YXL: 32)</option>
                  <option value="unisex">Unisex Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-1.5">
                  Total Order Quantity (Pieces) *
                </label>
                <Input
                  type="number"
                  min={MOQ_UNITS}
                  step={1}
                  placeholder="30"
                  {...register('volumeMOQ', { valueAsNumber: true })}
                  error={errors.volumeMOQ?.message}
                />
              </div>
            </div>

            {/* MULTI-GARMENT SPECIFICATION TABS */}
            <div className="border border-border rounded-base p-4 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-light">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {garments.map((g, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGarmentTab(idx)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase transition-colors ${
                        activeGarmentTab === idx
                          ? 'bg-ink text-white'
                          : 'bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      {idx + 1}. {g.type_name || g.garment_type}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddGarment('top')}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Top
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddGarment('bottom')}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Bottom
                  </Button>
                </div>
              </div>

              {/* ACTIVE GARMENT FORM FIELDS */}
              {garments[activeGarmentTab] && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                      <Shirt className="w-4 h-4 text-ink" />
                      Garment #{activeGarmentTab + 1} Specification (Page {activeGarmentTab + 1} of PDF)
                    </span>
                    {garments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGarment(activeGarmentTab)}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-mono"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove Garment
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Garment Category
                      </label>
                      <select
                        value={garments[activeGarmentTab].garment_type}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          const next = [...garments];
                          next[activeGarmentTab].garment_type = val;
                          setValue('garments', next);
                        }}
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      >
                        <option value="top">Top (Shirt / Jersey / Hoodie)</option>
                        <option value="bottom">Bottom (Trouser / Short / Pant)</option>
                        <option value="outerwear">Outerwear (Tracksuit / Jacket)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Garment Type Name
                      </label>
                      <input
                        type="text"
                        value={garments[activeGarmentTab].type_name}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].type_name = e.target.value;
                          setValue('garments', next);
                        }}
                        placeholder="e.g. Sublimation T-Shirts"
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Fabric Blend & GSM
                      </label>
                      <select
                        value={garments[activeGarmentTab].fabric_name}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].fabric_name = e.target.value;
                          setValue('garments', next);
                        }}
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      >
                        {FABRIC_OPTIONS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Colour / Colourway
                      </label>
                      <input
                        type="text"
                        value={garments[activeGarmentTab].colour_value}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].colour_value = e.target.value;
                          setValue('garments', next);
                        }}
                        placeholder="e.g. Sublimation / Cream"
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Panel & Piping Type
                      </label>
                      <select
                        value={garments[activeGarmentTab].panel_piping || '-'}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].panel_piping = e.target.value;
                          setValue('garments', next);
                        }}
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      >
                        {PANEL_PIPING_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Logo Application Method
                      </label>
                      <select
                        value={garments[activeGarmentTab].logo_application?.[0] || 'Sublimation'}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].logo_application = [e.target.value];
                          setValue('garments', next);
                        }}
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ink"
                      >
                        {LOGO_METHOD_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* TOP SPECIFIC FIELDS */}
                  {garments[activeGarmentTab].garment_type === 'top' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface rounded-base border-hairline border-border">
                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Collar Type
                        </label>
                        <select
                          value={garments[activeGarmentTab].collar_type || 'Collar'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].collar_type = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {COLLAR_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Button Type
                        </label>
                        <select
                          value={garments[activeGarmentTab].button_type || 'Kaaj Buttons'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].button_type = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {BUTTON_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Sleeve Length
                        </label>
                        <select
                          value={garments[activeGarmentTab].sleeve_length || 'Half Sleeves'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].sleeve_length = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {SLEEVE_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM SPECIFIC FIELDS */}
                  {garments[activeGarmentTab].garment_type === 'bottom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface rounded-base border-hairline border-border">
                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Fly Type
                        </label>
                        <select
                          value={garments[activeGarmentTab].fly_type || '-'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].fly_type = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {FLY_OPTIONS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Pocket Type
                        </label>
                        <select
                          value={garments[activeGarmentTab].pocket_type || 'Cross Pocket'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].pocket_type = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {POCKET_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                          Length & Bottom / Cuff
                        </label>
                        <select
                          value={garments[activeGarmentTab].cuff_type || 'As Per Pattern'}
                          onChange={(e) => {
                            const next = [...garments];
                            next[activeGarmentTab].cuff_type = e.target.value;
                            setValue('garments', next);
                          }}
                          className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                        >
                          {CUFF_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {orderType === 'individualized' && (
                    <div className="w-full sm:w-1/3">
                      <label className="block text-[11px] font-mono uppercase font-bold text-ink mb-1">
                        Font Name (for Name / Number)
                      </label>
                      <select
                        value={garments[activeGarmentTab].font_name || '-'}
                        onChange={(e) => {
                          const next = [...garments];
                          next[activeGarmentTab].font_name = e.target.value;
                          setValue('garments', next);
                        }}
                        className="w-full bg-white text-ink border-hairline rounded-base px-3 py-2 text-xs focus:outline-none"
                      >
                        {FONT_OPTIONS.map((fo) => (
                          <option key={fo} value={fo}>
                            {fo}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goToPrevStep}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={goToNextStep}
                className="gap-2"
              >
                Continue to Logos & Sizing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: BRANDING & LOGOS, ROSTER & SIZING */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-extrabold text-ink tracking-tight">
                Design Source, Branding & Player Roster
              </h3>
              <p className="text-xs text-muted mt-1">
                Specify your design source, upload branding artwork, and configure player rosters.
              </p>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: DESIGN SOURCE (BRANCH A vs BRANCH B) */}
            {/* ========================================================================= */}
            <div className="border border-border rounded-base p-5 space-y-6 bg-surface">
              {/* Question & Reference Mockup Banner */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border-light">
                <div className="space-y-1.5 flex-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Design Specification
                  </span>
                  <h4 className="text-lg font-bold text-ink">
                    Do you already have a design for this order?
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    A completed design means a full 3-view digital tech pack or garment mockup (front, side & back views) as shown in the factory reference preview.
                  </p>
                </div>

                {/* Sample Reference Mockup Display */}
                <div className="bg-white border border-border rounded-base p-2.5 shadow-xs shrink-0 flex flex-col items-center">
                  <div className="text-[9px] font-mono text-muted uppercase font-bold mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-blue-600" />
                    Sample Reference: 3-View Design Mockup
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/design-reference-mockup.png"
                    alt="Factory Reference 3-View Garment Mockup (Front, Side, Back)"
                    className="h-20 sm:h-24 w-auto object-contain rounded-xs"
                  />
                </div>
              </div>

              {/* Option Cards: Option A vs Option B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* OPTION A CARD */}
                <button
                  type="button"
                  onClick={() => {
                    setValue('design.source', 'client_provided', { shouldDirty: true });
                    setValue('uploadMode', 'file');
                  }}
                  className={`p-4 rounded-base border text-left transition-all flex items-start gap-3.5 ${
                    designSource === 'client_provided'
                      ? 'border-ink bg-white shadow-sm ring-1 ring-ink/10'
                      : 'border-border bg-white/60 hover:bg-white hover:border-ink/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    designSource === 'client_provided' ? 'border-ink bg-ink text-white' : 'border-border'
                  }`}>
                    {designSource === 'client_provided' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-ink">
                      Yes, I have a design
                    </div>
                    <p className="text-xs text-muted leading-snug">
                      I have artwork files, mockups, or tech packs ready to upload (.ai, .pdf, .eps, .png, .svg).
                    </p>
                    <span className="inline-block text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs mt-1">
                      Tag: client_provided
                    </span>
                  </div>
                </button>

                {/* OPTION B CARD */}
                <button
                  type="button"
                  onClick={() => {
                    setValue('design.source', 'requested_from_team', { shouldDirty: true });
                    setValue('uploadMode', 'design-help');
                  }}
                  className={`p-4 rounded-base border text-left transition-all flex items-start gap-3.5 ${
                    designSource === 'requested_from_team'
                      ? 'border-ink bg-white shadow-sm ring-1 ring-ink/10'
                      : 'border-border bg-white/60 hover:bg-white hover:border-ink/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    designSource === 'requested_from_team' ? 'border-ink bg-ink text-white' : 'border-border'
                  }`}>
                    {designSource === 'requested_from_team' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-ink">
                      No, please create a design for me
                    </div>
                    <p className="text-xs text-muted leading-snug">
                      Our factory design team will build your 3-view custom mockup from scratch based on your design brief.
                    </p>
                    <span className="inline-block text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-xs mt-1">
                      Tag: requested_from_team
                    </span>
                  </div>
                </button>
              </div>

              {/* ================================================================= */}
              {/* BRANCH A: "Yes, I have a design" (File Uploader)                  */}
              {/* ================================================================= */}
              {designSource === 'client_provided' && (
                <div className="p-4 bg-white border border-border rounded-base space-y-3 animate-in fade-in duration-200">
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase text-ink">
                      Upload your design file(s)
                    </h5>
                    <p className="text-[11px] text-muted">
                      Accepted formats: .png, .jpg, .jpeg, .svg, .pdf, .ai, .eps, .psd (Max 25MB per file)
                    </p>
                  </div>

                  {/* Dropzone */}
                  <label className="border-2 border-dashed border-border-light hover:border-ink/40 rounded-base p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-surface/50 hover:bg-surface">
                    <Upload className="w-8 h-8 text-muted mb-2" />
                    <span className="text-xs font-bold text-ink">
                      Click to choose files or drag & drop here
                    </span>
                    <span className="text-[10px] text-muted mt-0.5 font-mono">
                      Multiple files allowed • Vector / High-Res formats preferred
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps,.psd"
                      className="hidden"
                      onChange={handleDesignFilesUpload}
                    />
                  </label>

                  {/* Error Alert if file > 25MB */}
                  {designUploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-base text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{designUploadError}</span>
                    </div>
                  )}

                  {/* Uploaded Files Inventory */}
                  {designFilesList.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-border-light">
                      <div className="text-[10px] font-mono uppercase font-bold text-muted">
                        Uploaded Design Pack Files ({designFilesList.length}):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {designFilesList.map((file, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-surface border border-border-light rounded-base flex items-center justify-between text-xs"
                          >
                            <div className="truncate pr-2">
                              <div className="font-bold text-ink truncate text-[11px]">{file.name}</div>
                              <div className="text-[10px] font-mono text-muted">{file.sizeMb} MB</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDesignFile(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================================================================= */}
              {/* BRANCH B: "No, please create a design for me" (Structured Brief)  */}
              {/* ================================================================= */}
              {designSource === 'requested_from_team' && (
                <div className="p-5 bg-white border border-border rounded-base space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border-light pb-3">
                    <h5 className="text-sm font-bold text-ink flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Structured Design Brief
                    </h5>
                    <p className="text-xs text-muted mt-0.5">
                      Provide key visual requirements so our factory design studio can engineer your 3-view mockup with accuracy.
                    </p>
                  </div>

                  {/* 1. PRIMARY COLORS (MULTI-SELECT, REQUIRED MIN 1) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      1. Primary Color(s) * (Min 1 required)
                    </label>
                    <p className="text-[11px] text-muted">
                      Select base jersey/garment colors from the athletic palette.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SWATCH_PRESET_COLORS.map((c) => {
                        const isSelected = primaryColors.includes(c.hex);
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => togglePrimaryColor(c.hex)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-base border text-xs font-mono transition-all ${
                              isSelected ? 'border-ink bg-slate-100 font-bold ring-1 ring-ink' : 'border-border bg-white hover:border-ink/40'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-ink ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. SECONDARY / ACCENT COLORS (OPTIONAL) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      2. Secondary / Accent Color(s) (Optional)
                    </label>
                    <p className="text-[11px] text-muted">
                      Sleeve trim, collar, piping, and contrast panel accents.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SWATCH_PRESET_COLORS.map((c) => {
                        const isSelected = secondaryColors.includes(c.hex);
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => toggleSecondaryColor(c.hex)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-base border text-xs font-mono transition-all ${
                              isSelected ? 'border-ink bg-slate-100 font-bold ring-1 ring-ink' : 'border-border bg-white hover:border-ink/40'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-ink ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. DESIGN STYLE / THEME (MULTI-SELECT, REQUIRED MIN 1) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      3. Design Style / Theme * (Select at least 1)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DESIGN_STYLE_THEMES.map((theme) => {
                        const isSelected = styleThemes.includes(theme);
                        return (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => toggleStyleTheme(theme)}
                            className={`px-3 py-1.5 rounded-base border text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-ink bg-ink text-white font-bold'
                                : 'border-border bg-surface hover:bg-white text-ink'
                            }`}
                          >
                            {theme}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. PRINT COVERAGE (SINGLE-SELECT, REQUIRED) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      4. Print Coverage * (Single-select)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {PRINT_COVERAGE_OPTIONS.map((opt) => {
                        const isSelected = printCoverage === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setValue('design.brief.print_coverage', opt.id as any, { shouldDirty: true })}
                            className={`p-3 rounded-base border text-left transition-all ${
                              isSelected
                                ? 'border-ink bg-slate-50 ring-1 ring-ink'
                                : 'border-border bg-white hover:border-ink/40'
                            }`}
                          >
                            <div className="text-xs font-bold text-ink mb-1">{opt.label}</div>
                            <div className="text-[10px] text-muted leading-tight">{opt.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. REFERENCE TEAM, CLUB, OR BRAND */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      5. Reference Team, Club, or Brand (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Real Madrid, Oregon Ducks, Red Bull Racing, Bahrain National Cricket"
                      value={referenceBrand}
                      onChange={(e) => setValue('design.brief.reference_brand', e.target.value, { shouldDirty: true })}
                      className="w-full bg-surface border border-border rounded-base px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  {/* 6. TEXT ELEMENTS TO INCLUDE (MULTI-SELECT) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      6. Text Elements to Include (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TEXT_ELEMENTS_OPTIONS.map((el) => {
                        const isSelected = textElements.includes(el);
                        return (
                          <button
                            key={el}
                            type="button"
                            onClick={() => toggleTextElement(el)}
                            className={`px-3 py-1 rounded-base border text-xs transition-all ${
                              isSelected
                                ? 'border-ink bg-slate-900 text-white font-bold'
                                : 'border-border bg-surface text-ink hover:bg-white'
                            }`}
                          >
                            {el}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 7. GRAPHIC ELEMENTS TO INCLUDE (MULTI-SELECT) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      7. Graphic Elements to Include (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GRAPHIC_ELEMENTS_OPTIONS.map((el) => {
                        const isSelected = graphicElements.includes(el);
                        return (
                          <button
                            key={el}
                            type="button"
                            onClick={() => toggleGraphicElement(el)}
                            className={`px-3 py-1 rounded-base border text-xs transition-all ${
                              isSelected
                                ? 'border-ink bg-slate-900 text-white font-bold'
                                : 'border-border bg-surface text-ink hover:bg-white'
                            }`}
                          >
                            {el}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 8. COLORS OR ELEMENTS TO AVOID */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      8. Colors or Elements to Avoid (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. No purple, avoid heavy gradients on the collar, no cartoon mascots"
                      value={elementsToAvoid}
                      onChange={(e) => setValue('design.brief.elements_to_avoid', e.target.value, { shouldDirty: true })}
                      className="w-full bg-surface border border-border rounded-base px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  {/* 9. EXISTING BRAND GUIDELINES FILE UPLOAD */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      9. Existing Brand Guidelines (Optional)
                    </label>
                    <p className="text-[11px] text-muted">
                      Upload club identity guide, Pantone codes, or typography guidelines (.pdf, .png, .jpg, .ai).
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded-base hover:bg-white text-ink flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        {brandGuidelinesFileName ? 'Change File' : 'Upload Guidelines'}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.ai"
                          className="hidden"
                          onChange={handleBrandGuidelinesUpload}
                        />
                      </label>
                      {brandGuidelinesFileName && (
                        <span className="text-xs font-mono text-emerald-700 font-bold truncate">
                          ✓ {brandGuidelinesFileName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 10. INSPIRATION IMAGES (MULTI-FILE) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      10. Inspiration Images (Optional)
                    </label>
                    <p className="text-[11px] text-muted">
                      Screenshots or photos of jerseys/kits you like.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded-base hover:bg-white text-ink flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Add Inspiration Image(s)
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleInspirationImagesUpload}
                        />
                      </label>
                      {inspirationImagesList.length > 0 && (
                        <span className="text-xs font-mono text-ink">
                          {inspirationImagesList.length} image(s) attached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 11. ADDITIONAL NOTES */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase font-bold text-ink">
                      11. Additional Notes for Design Team (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Anything else our factory design studio should know about your design vision?"
                      value={additionalNotes}
                      onChange={(e) => {
                        setValue('design.brief.additional_notes', e.target.value, { shouldDirty: true });
                        setValue('designNotes', e.target.value);
                      }}
                      className="w-full bg-surface border border-border rounded-base p-3 text-xs text-ink focus:outline-none focus:border-ink resize-y"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: BRANDING & LOGO POSITION GRID */}
            <div className="border border-border rounded-base p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-ink" />
                  Logo Placement Grid & Sizes ({activeGarment?.type_name})
                </span>
                <span className="text-[11px] text-muted">
                  Specify Height (H) and Width (W) in inches per logo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {(activeGarment?.garment_type === 'bottom' ? BOTTOM_LOGO_SLOTS : TOP_LOGO_SLOTS).map((slot) => {
                  const currentPlacement = activeGarment?.logo_placements?.find((lp) => lp.slot === slot.id);
                  const hasImage = Boolean(currentPlacement?.image_url);

                  return (
                    <div
                      key={slot.id}
                      className="p-3 bg-surface border-hairline border-border rounded-base flex flex-col justify-between space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-ink truncate pr-1" title={slot.label}>
                          {slot.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {slot.allowFlag && (
                            <button
                              type="button"
                              onClick={() => handleSetFlag(activeGarmentTab, slot.id)}
                              className="text-[9px] font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded-xs hover:bg-red-200 flex items-center gap-1"
                              title={`Use Flag of ${teamCountry}`}
                            >
                              <Flag className="w-2.5 h-2.5" />
                              Flag
                            </button>
                          )}
                          {hasImage && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLogo(activeGarmentTab, slot.id)}
                              className="text-[9px] text-red-500 hover:text-red-700 p-0.5"
                              title="Remove logo image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Thumbnail / Slot Preview */}
                      <div className="w-full h-18 bg-white border border-dashed border-border-light rounded-xs flex items-center justify-center overflow-hidden relative">
                        {hasImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={currentPlacement!.image_url!}
                            alt={slot.label}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-[10px] text-muted font-mono">- (No Logo)</span>
                        )}
                      </div>

                      {/* Upload Button */}
                      <label className="cursor-pointer text-[10px] font-mono bg-white border border-border px-2.5 py-1.5 rounded-xs hover:bg-surface text-ink flex items-center justify-center gap-1.5">
                        <Upload className="w-3 h-3" />
                        {hasImage ? 'Change Image' : 'Upload Logo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(activeGarmentTab, slot.id, file);
                          }}
                        />
                      </label>

                      {/* Explicit Width (W) and Height (H) inputs in inches */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                        <div className="flex items-center gap-1 bg-white border border-border px-1.5 py-1 rounded-xs">
                          <span className="text-muted font-bold">W:</span>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="2.5"
                            value={currentPlacement?.width_in ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              updateLogoSlot(activeGarmentTab, slot.id, { width_in: val });
                            }}
                            className="w-full bg-transparent text-ink text-center focus:outline-none font-bold"
                          />
                          <span className="text-muted">&quot;</span>
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-border px-1.5 py-1 rounded-xs">
                          <span className="text-muted font-bold">H:</span>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="3.0"
                            value={currentPlacement?.height_in ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              updateLogoSlot(activeGarmentTab, slot.id, { height_in: val });
                            }}
                            className="w-full bg-transparent text-ink text-center focus:outline-none font-bold"
                          />
                          <span className="text-muted">&quot;</span>
                        </div>
                      </div>

                      {/* Optional placement note */}
                      <input
                        type="text"
                        placeholder="Placement Note (e.g. Centered)"
                        value={currentPlacement?.placement_note ?? ''}
                        onChange={(e) => {
                          updateLogoSlot(activeGarmentTab, slot.id, { placement_note: e.target.value });
                        }}
                        className="w-full bg-white border border-border px-1.5 py-0.5 rounded-xs text-[9px] font-mono text-ink placeholder:text-muted/60 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 5: SIZING & PLAYER ROSTER TABLE */}
            <div className="border border-border rounded-base p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-ink" />
                  {orderType === 'individualized' ? 'Player Roster Table & Blanks' : 'Size & Quantity Matrix'}
                </span>
                <span className="text-xs font-mono font-bold text-blue-700">
                  Total Calculated: {liveSummary.totalQty} Units
                </span>
              </div>

              {/* INDIVIDUALIZED ROSTER TABLE */}
              {orderType === 'individualized' ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border bg-surface font-mono uppercase text-muted text-[10px]">
                          <th className="p-2">#</th>
                          <th className="p-2">Player Name</th>
                          <th className="p-2">Jersey #</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Qty / Player</th>
                          <th className="p-2">Role / Note (Optional)</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light">
                        {roster.map((player, pIdx) => (
                          <tr key={pIdx} className="hover:bg-surface/50">
                            <td className="p-2 font-mono text-muted">{pIdx + 1}</td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={player.player_name}
                                onChange={(e) => {
                                  const next = [...roster];
                                  next[pIdx].player_name = e.target.value.toUpperCase();
                                  setValue('roster', next);
                                }}
                                placeholder="e.g. MUKHIA"
                                className="w-full bg-white border border-border px-2 py-1 rounded-xs uppercase font-bold"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={player.number}
                                onChange={(e) => {
                                  const next = [...roster];
                                  next[pIdx].number = e.target.value;
                                  setValue('roster', next);
                                }}
                                placeholder="18"
                                className="w-16 bg-white border border-border px-2 py-1 rounded-xs font-mono text-center font-bold text-blue-700"
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={player.size}
                                onChange={(e) => {
                                  const next = [...roster];
                                  next[pIdx].size = e.target.value;
                                  setValue('roster', next);
                                }}
                                className="bg-white border border-border px-2 py-1 rounded-xs font-mono font-bold"
                              >
                                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min={1}
                                value={player.qty}
                                onChange={(e) => {
                                  const next = [...roster];
                                  next[pIdx].qty = parseInt(e.target.value) || 1;
                                  setValue('roster', next);
                                }}
                                className="w-14 bg-white border border-border px-2 py-1 rounded-xs font-mono text-center"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={player.role_note || ''}
                                onChange={(e) => {
                                  const next = [...roster];
                                  next[pIdx].role_note = e.target.value;
                                  setValue('roster', next);
                                }}
                                placeholder="e.g. Technical Manager"
                                className="w-full bg-white border border-border px-2 py-1 rounded-xs"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(pIdx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddPlayer}
                      className="gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Add Player Row
                    </Button>
                  </div>

                  {/* Blank Units per size */}
                  <div className="p-3 bg-surface border-hairline border-border rounded-base">
                    <span className="text-[11px] font-mono font-bold uppercase text-ink block mb-2">
                      Blank Stock Units per Size (No Name/Number):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((sz) => (
                        <div key={sz} className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="text-muted font-bold">{sz}:</span>
                          <input
                            type="number"
                            min={0}
                            value={blanksBySize[sz] ?? 3}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setValue('blanks_by_size', {
                                ...blanksBySize,
                                [sz]: val,
                              });
                            }}
                            className="w-12 bg-white border border-border px-1.5 py-1 rounded-xs text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* UNIFORM QUANTITY TABLE */
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((sz) => {
                    const currentMap = activeGarment?.sizing?.qty_by_size || {};
                    return (
                      <div key={sz} className="p-2 bg-surface border border-border rounded-xs text-center">
                        <span className="text-[10px] font-mono font-bold uppercase text-muted block">
                          {sz}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={currentMap[sz] || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const nextGarments = [...garments];
                            if (!nextGarments[activeGarmentTab].sizing) {
                              nextGarments[activeGarmentTab].sizing = { mode: 'uniform', qty_by_size: {} };
                            }
                            nextGarments[activeGarmentTab].sizing!.qty_by_size[sz] = val;
                            setValue('garments', nextGarments);
                          }}
                          placeholder="0"
                          className="w-full bg-white border border-border px-1 py-1 rounded-xs text-center font-mono font-bold text-sm mt-1"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LIVE GENERATED SPEC BREAKDOWN PREVIEW */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-base space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-900 block">
                  Live Generated Spec Sheet Breakdown Text (Prints on Right Visual Block):
                </span>
                <p className="text-xs font-mono font-bold text-red-700">
                  {liveSummary.title}
                </p>
                <div className="space-y-0.5 text-xs font-mono text-blue-800">
                  {liveSummary.lines.map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
                <div className="text-xs font-mono font-bold text-red-700 pt-1">
                  TOTAL {liveSummary.totalQty} QTY
                </div>
              </div>
            </div>

            {/* DESIGN NOTES & ATTACHED ASSETS */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink">
                Special Manufacturing Notes & Directives *
              </label>
              <textarea
                rows={3}
                placeholder="Specific printing, embroidery, stitch tolerances or packaging instructions..."
                {...register('designNotes')}
                className="w-full bg-white text-ink border-hairline rounded-base p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
              />
              {errors.designNotes && (
                <p className="text-xs text-red-600 font-medium">{errors.designNotes.message}</p>
              )}
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="pt-4 flex items-center justify-between border-t border-border-light">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goToPrevStep}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleDownloadPdf}
                  isLoading={isDownloadingPdf}
                  className="gap-1.5"
                  title="Generate instant OMTEX PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Spec Sheet (PDF)
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="gap-2"
                >
                  Submit Production Quote
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </BorderCard>
  );
};

export default InquiryForm;
