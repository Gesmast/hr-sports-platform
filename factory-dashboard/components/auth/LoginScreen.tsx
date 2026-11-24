'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRole } from '@/lib/auth/role-context';
import { useI18n } from '@/lib/i18n/context';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Quote,
} from 'lucide-react';

interface WorkerQuote {
  author: string;
  authorTitle: string;
  tag: string;
  quote: string;
  highlight: string;
}

const URDU_QUOTES: WorkerQuote[] = [
  {
    author: 'قائداعظم محمد علی جناح',
    authorTitle: 'بابائے قوم کا سنہری اصول',
    tag: 'فرمانِ قائداعظم',
    quote: '”کام، کام اور صرف کام — محنت، دیانت اور لگن ہی سے ہم اپنے کارخانے اور قوم کو بلندیوں تک پہنچا سکتے ہیں۔“',
    highlight: 'کام، کام اور کام',
  },
  {
    author: 'علامہ محمد اقبال',
    authorTitle: 'حکیم الامت کا درسِ عمل',
    tag: 'کلامِ اقبال',
    quote: '”عمل سے زندگی بنتی ہے جنت بھی جہنم بھی\nیہ خاکی اپنی فطرت میں نہ نوری ہے نہ ناری ہے“',
    highlight: 'محنت اور عمل کی عظمت',
  },
  {
    author: 'علامہ محمد اقبال',
    authorTitle: 'ہمت اور امید کا پیغام',
    tag: 'بانگِ درا',
    quote: '”نہیں ہے نا امید اقبال اپنی کشتِ ویراں سے\nذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی“',
    highlight: 'انتھک کوشش اور امید',
  },
  {
    author: 'فیض احمد فیض',
    authorTitle: 'سچی لگن اور جذبہ',
    tag: 'کلامِ فیض',
    quote: '”ہم پرورشِ لوح و قلم کرتے رہیں گے\nجو دل پہ گزرتی ہے رقم کرتے رہیں گے“',
    highlight: 'اپنے فن اور ہنر سے لگن',
  },
  {
    author: 'قائداعظم محمد علی جناح',
    authorTitle: 'اتحاد، یقین اور انتھک محنت',
    tag: 'رہنمائے قوم',
    quote: '”مسلسل جدوجہد اور ایمان داری سے کیا گیا کام کبھی رائیگاں نہیں جاتا۔ اپنی ذمہ داری کو عبادت سمجھ کر پورا کرو۔“',
    highlight: 'ایمان، اتحاد اور تنظیم',
  },
];

const ROMAN_QUOTES: WorkerQuote[] = [
  {
    author: 'Quaid-e-Azam Muhammad Ali Jinnah',
    authorTitle: 'Babaye Qaum Ka Sunehra Usool',
    tag: 'Farman-e-Quaid',
    quote: '“Kaam, kaam aur sirf kaam — mehnat, diyanat aur lagan hi se hum apnay karkhane aur qaum ko bulandiyon tak pohncha saktay hain.”',
    highlight: 'Kaam, Kaam aur Kaam',
  },
  {
    author: 'Allama Muhammad Iqbal',
    authorTitle: 'Hakeem-ul-Ummat Ka Dars-e-Amal',
    tag: 'Kalam-e-Iqbal',
    quote: '“Amal se zindagi banti hai jannat bhi jahannam bhi\nYe khaaki apni fitrat mein na noori hai na naari hai”',
    highlight: 'Mehnat aur Amal Ki Azmat',
  },
  {
    author: 'Allama Muhammad Iqbal',
    authorTitle: 'Himmat aur Umeed Ka Pegham',
    tag: 'Baang-e-Dara',
    quote: '“Nahi hai na-umeed Iqbal apni kisht-e-veeraan se\nZara num ho to yeh mitti barri zarkheez hai saaqi”',
    highlight: 'Anthak Koshish aur Umeed',
  },
  {
    author: 'Faiz Ahmed Faiz',
    authorTitle: 'Sacchi Lagan aur Jazba',
    tag: 'Kalam-e-Faiz',
    quote: '“Hum parwarish-e-lauh-o-qalam kartay rahein gay\nJo dil pe guzarti hai raqam kartay rahein gay”',
    highlight: 'Apnay Fun aur Hunar Se Lagan',
  },
  {
    author: 'Quaid-e-Azam Muhammad Ali Jinnah',
    authorTitle: 'Ittehad, Yaqeen aur Anthak Mehnat',
    tag: 'Rehnumaye Qaum',
    quote: '“Musalsal jaddo-jehad aur imandari se kiya gaya kaam kabhi raayegaan nahi jaata. Apni zimmedari ko ibadat samajh kar poora karo.”',
    highlight: 'Iman, Ittehad aur Tanzeem',
  },
];

const ENGLISH_QUOTES: WorkerQuote[] = [
  {
    author: 'Quaid-e-Azam Muhammad Ali Jinnah',
    authorTitle: 'Founder of the Nation',
    tag: 'FOUNDER’S DIRECTIVE',
    quote: '“Work, work and only work. With perseverance, unwavering determination, and discipline, we are bound to succeed.”',
    highlight: 'Work, Work and Work',
  },
  {
    author: 'Thomas A. Edison',
    authorTitle: 'Inventor & Industrialist',
    tag: 'WORK ETHIC',
    quote: '“There is no substitute for hard work. Genius is one percent inspiration and ninety-nine percent perspiration.”',
    highlight: 'Relentless Dedication',
  },
  {
    author: 'Henry Ford',
    authorTitle: 'Pioneer of Modern Manufacturing',
    tag: 'QUALITY & INTEGRITY',
    quote: '“Quality means doing it right when no one is looking. True craftsmanship shines through every cut, stitch, and finish.”',
    highlight: 'Flawless Craftsmanship',
  },
  {
    author: 'Aristotle',
    authorTitle: 'Philosopher of Excellence',
    tag: 'DAILY DISCIPLINE',
    quote: '“We are what we repeatedly do. Excellence, then, is not an isolated act, but a daily habit on the factory floor.”',
    highlight: 'Excellence is a Habit',
  },
  {
    author: 'Colin Powell',
    authorTitle: 'Leadership & Discipline',
    tag: 'FLOOR COMMITMENT',
    quote: '“A dream does not become reality through magic; it takes sweat, determination, and diligent daily labor.”',
    highlight: 'Sweat & Determination',
  },
];

export function LoginScreen() {
  const { loginWithEmail } = useRole();
  const { t, isUrdu, isRoman } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation alerts & error states
  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Active quote carousel index
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const activeQuotesList = isUrdu ? URDU_QUOTES : isRoman ? ROMAN_QUOTES : ENGLISH_QUOTES;

  // Auto-play quotes carousel every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % activeQuotesList.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeQuotesList.length]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setEmailError(null);
    setPasswordError(null);

    const trimmedEmail = email.trim();

    // 1. Email format check
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setEmailError(
        isUrdu
          ? 'برائے مہربانی درست ای میل ایڈریس درج کریں'
          : isRoman
          ? 'Barae meherbani durust email address enter karein.'
          : 'Please enter a valid email address.'
      );
      setLoading(false);
      return;
    }

    // 2. Blocked / restricted email check
    if (trimmedEmail.toLowerCase() === 'admin@site.com' || trimmedEmail.toLowerCase() === 'test@test.com') {
      setEmailError(
        isUrdu
          ? 'یہ ای میل سسٹم میں رسائی کے لیے مجاز نہیں ہے'
          : isRoman
          ? 'Yeh email factory system tak rasai ke liye majaz nahi hai.'
          : 'This email is not permitted to access factory systems.'
      );
      setLoading(false);
      return;
    }

    // 3. Password length check
    if (!password || password.length < 6) {
      setPasswordError(
        isUrdu
          ? 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے'
          : isRoman
          ? 'Password kam az kam 6 characters ka hona chahiye.'
          : 'Password must be at least 6 characters.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await loginWithEmail(trimmedEmail, password);
      if (!res.success) {
        if (res.field === 'email') {
          setEmailError(
            res.error ||
              (isUrdu
                ? 'یہ ای میل سسٹم میں رجسٹرڈ نہیں ہے'
                : isRoman
                ? 'Yeh email system mein registered nahi hai.'
                : 'This email is not registered in the system.')
          );
        } else if (res.field === 'password') {
          setPasswordError(
            res.error ||
              (isUrdu
                ? 'غلط پاس ورڈ! برائے مہربانی درست پاس ورڈ درج کریں'
                : isRoman
                ? 'Ghalat password! Barae meherbani sahi password darj karein.'
                : 'Incorrect password for this authorized account.')
          );
        } else {
          setLoginError(
            res.error ||
              (isUrdu
                ? 'لاگ ان کی تصدیق نہیں ہو سکی'
                : isRoman
                ? 'Login ki tasdeeq nahi ho saki. Credentials check karein.'
                : 'Authentication failed. Please check credentials.')
          );
        }
      }
    } catch {
      setLoginError(
        isUrdu
          ? 'سرور سے رابطہ نہیں ہو سکا۔ دوبارہ کوشش کریں'
          : isRoman
          ? 'Server se rabta nahi ho saka. Dobara koshish karein.'
          : 'Connection error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentQuote = activeQuotesList[activeQuoteIndex] || activeQuotesList[0];

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-bg text-ink flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 antialiased selection:bg-ink selection:text-surface overflow-x-hidden">
      {/* Centered content shell: my-auto distributes equal margins above and below for absolute vertical & horizontal centering */}
      <div className="w-full max-w-5xl my-auto flex flex-col items-center justify-center shrink-0">
        
        {/* Top Header Bar strictly aligned with the card */}
        <header className="w-full flex items-center justify-between pb-3.5 sm:pb-4 border-b border-border mb-4 sm:mb-6">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
              {isUrdu ? 'مینوفیکچرنگ پورٹل' : isRoman ? 'Manufacturing Operations Portal' : 'Manufacturing Portal'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Two-Column Auth Frame */}
        <main className="w-full bg-surface border border-border rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Authentic Login Form */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[480px] sm:min-h-[500px]">
            <div>
              {/* Brand Logo inside card (left-aligned) */}
              <div className="flex items-center justify-between">
                <div className="relative h-10 w-32 sm:h-12 sm:w-40">
                  <Image
                    src="/logo.png"
                    alt="HR SPORTS"
                    fill
                    className="object-contain object-left dark:invert"
                    priority
                  />
                </div>
              </div>

              {/* Headings with Quaid-e-Azam work motto */}
              <div className="mt-7 mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {isUrdu ? 'سسٹم میں لاگ ان کریں' : isRoman ? 'Portal Mein Dakhil Hon' : 'Sign in to continue'}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-ink mt-1.5 font-mono">
                  {isUrdu
                    ? 'قائداعظم کا فرمان: ”کام، کام اور صرف کام“'
                    : isRoman
                    ? 'Quaid-e-Azam: “Kaam, kaam aur sirf kaam.”'
                    : 'Quaid-e-Azam: “Work, work and only work.”'}
                </p>
                <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
                  {isUrdu
                    ? 'اپنے فیکٹری ورک سٹیشن پر لاگ ان کریں اور دیانتداری سے اپنا کام شروع کریں۔'
                    : isRoman
                    ? 'Apnay factory workstation par login karein aur diyanatdari se kaam shuru karein.'
                    : 'Sign in to your factory workstation and let craftsmanship speak through your work.'}
                </p>
              </div>

              {/* General Login Error Alert */}
              {loginError && (
                <div className="mb-4 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-ink uppercase tracking-wider font-mono"
                  >
                    {isUrdu ? 'ای میل' : isRoman ? 'Work Email' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. owner@thehrsports.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                        setLoginError(null);
                      }}
                      disabled={loading}
                      required
                      className={`w-full pl-10 pr-3.5 py-3 rounded-lg border text-sm bg-surface-elevated text-ink placeholder:text-muted/60 transition focus:outline-none focus:ring-2 ${
                        emailError
                          ? 'border-rose-500 ring-rose-500/20 focus:border-rose-500'
                          : 'border-border focus:border-ink focus:ring-ink/20'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <span className="block text-rose-500 text-xs font-semibold mt-1">
                      {emailError}
                    </span>
                  )}
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-ink uppercase tracking-wider font-mono"
                  >
                    {isUrdu ? 'پاس ورڈ' : isRoman ? 'Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(null);
                        setLoginError(null);
                      }}
                      disabled={loading}
                      required
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border text-sm bg-surface-elevated text-ink placeholder:text-muted/60 transition focus:outline-none focus:ring-2 ${
                        passwordError
                          ? 'border-rose-500 ring-rose-500/20 focus:border-rose-500'
                          : 'border-border focus:border-ink focus:ring-ink/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition cursor-pointer p-0.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <span className="block text-rose-500 text-xs font-semibold mt-1">
                      {passwordError}
                    </span>
                  )}
                </div>

                {/* Submit Sign In Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-ink text-surface hover:opacity-90 font-bold text-sm rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-surface" />
                        <span>{isUrdu ? 'تصدیق ہو رہی ہے...' : isRoman ? 'Check kar rahe hain...' : 'Authenticating...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isUrdu ? 'لاگ ان کریں' : isRoman ? 'Portal Mein Dakhil Hon' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Form Footer inside card */}
            <div className="mt-8 pt-6 border-t border-border text-xs text-muted flex items-center justify-between font-medium">
              <span>The HR Sports</span>
              <span className="font-mono text-[11px] uppercase tracking-wide">Direct Manufacturing</span>
            </div>
          </div>

          {/* Right Column: Worker Inspiration & Motivational Quotes Panel */}
          <div className="hidden md:flex flex-col justify-between bg-surface-elevated border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-border p-8 lg:p-10 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-muted">
                {isUrdu ? 'محنت اور ہمت کا پیغام' : isRoman ? 'MEHNAT AUR HIMMAT KA PEGHAM' : 'INSPIRATION & WORK ETHIC'}
              </span>
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-surface border border-border text-ink">
                {currentQuote.tag}
              </span>
            </div>

            {/* Dynamic Quote Slide */}
            <div className="my-auto py-6">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-center mb-5 text-ink">
                <Quote className="w-6 h-6 text-ink stroke-[2.2]" />
              </div>

              <blockquote
                className={`text-lg lg:text-xl font-bold text-ink mb-4 ${
                  isUrdu ? 'font-urdu leading-loose' : 'font-sans italic leading-relaxed'
                }`}
              >
                {currentQuote.quote}
              </blockquote>

              <div className="mt-4 pt-3 border-t border-border/80">
                <div className="font-extrabold text-sm text-ink">
                  {currentQuote.author}
                </div>
                <div className="text-xs text-muted font-medium mt-0.5">
                  {currentQuote.authorTitle}
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono font-bold text-ink shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentQuote.highlight}</span>
              </div>
            </div>

            {/* Carousel Dot Indicators & Quote Counter */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <span className="text-[11px] font-mono text-muted">
                0{activeQuoteIndex + 1} / 0{activeQuotesList.length}
              </span>

              <div className="flex gap-2">
                {activeQuotesList.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveQuoteIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeQuoteIndex === index ? 'w-5 bg-ink' : 'w-2 bg-muted/40 hover:bg-muted'
                    }`}
                    aria-label={`Go to quote ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
