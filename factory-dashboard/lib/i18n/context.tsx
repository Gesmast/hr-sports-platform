'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale } from './translations';

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
  isUrdu: boolean;
  isRoman: boolean;
  l: (en: string, ur?: string, roman?: string) => string;
}

export const AUTO_ROMAN_MAP: Record<string, string> = {
  // Navigation & Headers
  'OPERATIONS & INQUIRIES': 'OPERATIONS AUR LEADS',
  'SHOP FLOOR STATIONS': 'PRODUCTION FLOOR STATIONS',
  'COMMERCIAL & INVENTORY': 'COMMERCIAL AUR STOCK',
  'MANAGEMENT & ANALYTICS': 'MANAGEMENT AUR REPORTS',
  'WEBSITE MANAGEMENT': 'WEBSITE KI SETTINGS',
  'Promotions & News': 'Promotions aur News',
  'Video Slots & Media': 'Video Slots aur Media',
  'Policies': 'Company Policies',
  'Email & Settings': 'Email aur System Settings',
  'Visual Theme & Content Editor': 'Theme aur Content Editor',
  'Theme & Content Editor': 'Theme aur Content Editor',
  'User Management': 'Users Ki Setting',
  'Staff Attendance': 'Staff Attendance',

  // Owner Command Center & Greetings
  'Owner Operations Command Center': 'Aslam-o-Alaikum! Sir Hafeez',
  'Aslam-o-Alaikum! Sir Hafeez': 'Aslam-o-Alaikum! Sir Hafeez',
  'Factory Shift Active': 'Factory Shift Chalu Hai',
  'Search Job #, Customer, Staff...': 'Job #, Party ya Staff dhoondo...',
  'New Job Card': 'Naya Job Card',
  'Clear': 'Clear Karo',

  // 8 KPI Tiles
  'Emergency': 'Emergency Orders',
  'Overdue Delivery': 'Delivery Overdue',
  'Due in 48 Hours': '48 Ghante Mein Delivery',
  'Target Missed': 'Target Miss Hua',
  'QC Decision Needed': 'QC Approval Chahiye',
  'No Target Set': 'Target Set Nahi Hua',
  'Billing Pending': 'Billing Pending Hai',
  'Active Orders': 'Chalu Orders',
  'Active priorities': 'Zaroori kaam chalu hai',
  'All on schedule': 'Sab time par hai',
  'Past deadline': 'Time guzar chuka hai',
  'None overdue': 'Koi overdue nahi',
  'Next 2 working days': 'Agley 2 dino mein',
  'Past 7 days record': 'Pichlay 7 din ka record',
  'Requires Owner approval': 'Owner ki approval chahiye',
  'Available at station': 'Station par mojud hai',
  'Dispatched without bill': 'Baghair bill ke dispatch hua',
  'pcs in work': 'pieces par kaam jari hai',

  // 5 Owner Tabs
  'Operations Overview': 'Operations Overview',
  'Exceptions Matrix': 'Tawajjah Talab Orders (Exceptions)',
  'Stage Bottlenecks': 'Marahil Ki Rokawat (Bottlenecks)',
  'Master Jobs Table': 'Sab Production Jobs',
  'Close Requests': 'Order Band Karne Ki Requests',

  // Emergency Strip
  'Priority Emergency': 'Emergency Priority',
  'Clear Emergency': 'Emergency Khatam Karo',
  'Open Job': 'Job Kholo',
  'Deadline Passed': 'Time Guzar Chuka Hai',
  'remaining': 'baaqi hain',

  // Staff Pings & Notices
  'Staff Pings & Important Notes': 'Staff Ke Zaroori Paighamat',
  'Staff Pings & Important Notes Ledger': 'Staff Ke Tamam Zaroori Paighamat Ka Record',
  'View Full Notice History': 'Pichlay Tamam Paighamat Dekho',
  'All': 'Sab',
  'Unread': 'Naye Paighamat (Unread)',
  'Urgent': 'Zaroori / Urgent Alerts',
  'All caught up': 'Sab parh liye hain',
  'New': 'Naye',
  'photo attached': 'tasveer sath lagi hai',
  'From': 'Kahan se',

  // Staff Performance & Factory Health
  'Factory Health & Staff Performance Ledger': 'Factory Health aur Staff Performance Ledger',
  'Executive Factory Health & Staff Performance Ledger': 'Factory Health aur Staff Performance Ledger',
  'Live In-House Audit': 'Live Factory Audit',
  'Staff Reports (8)': 'Staff Performance Reports (8)',
  '10 Stages': '10 Production Marahil',
  'AI Factory Dossier': 'AI Factory Audit Report',
  'Audit Report': 'Audit Report',
  'Role Score': 'Score',
  'Today': 'Aaj',
  'Yesterday': 'Kal (Beeta Hua)',
  'This Week': 'Is Hafte',
  'This Month': 'Is Mahine',
  'Custom': 'Apni Marzi Ki Tareekh',
  'Stage / Department': 'Marhala / Department',
  'Supervisor': 'In-Charge / Supervisor',
  'In Queue': 'Queue Mein Pieces',
  'Done in Filter': 'Mukammal Huay',
  'Defect Rate': 'Defect Rate',
  'Efficiency Score': 'Karkardagi Score',
  'Status': 'Haalat (Status)',
  'Optimal': 'Theek Hai (Optimal)',
  'Moderate': 'Darmiyana (Moderate)',
  'Bottleneck': 'Atka Hua (Bottleneck)',

  // Common Actions & Exceptions Matrix
  'Save Changes': 'Save Karo',
  'Cancel': 'Cancel',
  'Confirm': 'Confirm Karo',
  'Refresh Data': 'Refresh Karo',
  'Sync Logs': 'Sync Karo',
  'Export CSV': 'CSV Download Karo',
  'Search...': 'Dhoondo...',
  'Filter': 'Filter',
  'Actions': 'Actions',
  'View Details': 'Details Dekho',
  'Loading data...': 'Data load ho raha hai...',
  'No records found': 'Koyi record nahi mila',
  'Normal': 'Normal',
  'High': 'High',
  'Sign Out': 'Bahar Niklo (Logout)',
  'Resolve Job': 'Masla Hal Karo (Resolve)',
  'Open': 'Kholo',
  'Critical': 'Zaroori (Critical)',
  'Warning': 'Khabardar (Warning)',
  'Info': 'Maloomat (Info)',
  'Immediate Floor Action Needed': 'Fauran Floor Action Chahiye',
  'Keep An Eye': 'Nazar Rakhein',
  'Track & Coordinate': 'Progress Track Karo',
  'Send to Rework': 'Rework Ke Liye Bhejo',
  'Scrap & Continue': 'Scrap Kar Ke Aage Chalao',
  'All Jobs': 'Sab Jobs',
  'Web Orders': 'Website Ke Orders',
  'Offline Deals': 'Offline / WhatsApp Orders',
  'Active Jobs': 'Chalu Jobs',
  'Completed': 'Mukammal',
  'Approve Close': 'Band Karne Ki Manzoori',
  'Reject & Continue': 'Reject Karo, Kaam Chalao',
  'Pending Requests': 'Pending Requests',
  'Approved / Closed': 'Approved / Band Shuda',
  'See All 10': 'Sab 10 Marahil Dekho',
  'View All Exceptions Matrix': 'Tamam Exceptions Matrix Dekho',
  'Top Alerts Requiring Attention': 'Tawajjah Talab Zaroori Alerts',
  'Busiest Production Stations': 'Sab Se Masroof Production Stations',
  'Ranked by backlog pieces in line': 'Line mein ruke hue pieces ke hisaab se',
  'Stage Backlogs & Work Bottlenecks (All 10 Stages)': 'Marahil Ki Rokawat aur Pending Kaam (Sab 10 Stages)',
  'Master Production Job Cards': 'Sab Production Job Cards',
  'Order & Lead Close Requests (Owner Approval)': 'Order aur Lead Band Karne Ki Requests (Owner Approval)',
};

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
  isUrdu: false,
  isRoman: false,
  l: (en, ur, roman) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('hr_factory_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'ur' || saved === 'roman')) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    if (locale === 'ur') {
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('hr_factory_locale', newLocale);
  };

  const isUrdu = locale === 'ur';
  const isRoman = locale === 'roman';
  const t = translations[locale] || translations.en;

  const l = (en: string, ur?: string, roman?: string): string => {
    if (locale === 'ur') return ur || en;
    if (locale === 'roman') {
      if (roman) return roman;
      if (AUTO_ROMAN_MAP[en]) return AUTO_ROMAN_MAP[en];
      return en;
    }
    return en;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isUrdu, isRoman, l }}>
      <div className={isUrdu ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
