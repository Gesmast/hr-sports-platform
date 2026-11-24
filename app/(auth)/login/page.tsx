'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SITE_CONFIG } from '@/lib/constants';

type AuthMode = 'options' | 'signin' | 'signup' | 'forgot';

// 5 Designs Carousel for HR Sports Custom Athletic Apparel
const CAROUSEL_DESIGNS = [
  {
    name: 'Pro T20 Sublimated Cricket Kit',
    category: 'Custom Sportswear • Cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
    tag: 'AeroVent™ Pinhole Mesh',
  },
  {
    name: 'Pro Matchday Sublimated Football Kit',
    category: 'Custom Sportswear • Football',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
    tag: '1200 DPI Dye-Sublimation',
  },
  {
    name: 'Pro Court Basketball Uniform',
    category: 'Custom Sportswear • Basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    tag: 'Double Pinhole Open Mesh',
  },
  {
    name: 'PowerFlex™ High-Impact Activewear',
    category: 'Gym & Activewear',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    tag: 'Squat-Proof Compression 260 GSM',
  },
  {
    name: 'Pro Heavyweight Sublimated Hockey Sweater',
    category: 'Custom Sportswear • Hockey',
    image: 'https://images.unsplash.com/photo-1515703407324-5f753eed2328?q=80&w=800&auto=format&fit=crop',
    tag: 'Reinforced TitanKnit™ 280 GSM',
  },
];

function LoginFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialModeParam = searchParams.get('mode');
  const initialMode: AuthMode =
    initialModeParam === 'signup' || initialModeParam === 'signin' || initialModeParam === 'forgot'
      ? initialModeParam
      : 'options';

  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '/portal';

  // Core state
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // OTP verification state
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpType, setOtpType] = useState<'signup' | 'recovery' | 'email'>('signup');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password reset state (after verifying recovery code)
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Error feedback state
  const [loginError, setLoginError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);

  // Animated Success transition
  const [isAnimatingSuccess, setIsAnimatingSuccess] = useState(false);

  // Carousel state (5 designs)
  const [activeSlide, setActiveSlide] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play carousel slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_DESIGNS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Clear errors when switching modes
  useEffect(() => {
    setLoginError(null);
    setEmailError(null);
    setPasswordError(null);
    setGeneralMessage(null);
  }, [mode]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoginError(null);
    try {
      const appUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setLoginError(error.message);
        setLoading(false);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  // Handle Primary Form Submission (Signin / Signup / Forgot)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setEmailError(null);
    setPasswordError(null);

    // Basic validation
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (mode !== 'forgot' && password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const appUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            data: {
              full_name: displayName,
            },
          },
        });

        if (error) {
          setLoginError(error.message);
        } else {
          // Transition to OTP verification screen
          setOtpType('signup');
          setIsVerifyingOtp(true);
          setOtpValues(['', '', '', '', '', '']);
          setResendCooldown(60);
          setGeneralMessage('Verification code sent to your email.');
        }
      } else if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes('invalid login credentials') ||
            error.message.toLowerCase().includes('invalid credentials')
          ) {
            setPasswordError('Incorrect email or password.');
          } else {
            setLoginError(error.message);
          }
        } else {
          // Trigger successful animated screen
          setIsAnimatingSuccess(true);
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 2500);
        }
      } else {
        // Forgot password mode
        const appUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
        });

        if (error) {
          setLoginError(error.message);
        } else {
          setOtpType('recovery');
          setIsVerifyingOtp(true);
          setOtpValues(['', '', '', '', '', '']);
          setResendCooldown(60);
          setGeneralMessage('Password recovery code sent to your email.');
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification logic
  const verifyCode = async (token: string) => {
    if (loading) return;
    setLoading(true);
    setLoginError(null);

    try {
      const type = otpType === 'recovery' ? 'recovery' : 'signup';
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type as any,
      });

      if (error) {
        setLoginError(error.message || 'Verification code is invalid or has expired.');
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        if (otpType === 'signup' || otpType === 'email') {
          setIsVerifyingOtp(false);
          setIsAnimatingSuccess(true);
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 2500);
        } else {
          // Recovery: proceed to set new password
          setIsVerifyingOtp(false);
          setIsResettingPassword(true);
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otpValues.join('');
    if (token.length < 6) {
      setLoginError('Please enter all 6 digits of the verification code.');
      return;
    }
    await verifyCode(token);
  };

  // Auto-verify OTP when all 6 digits are entered
  useEffect(() => {
    const token = otpValues.join('');
    if (token.length === 6 && isVerifyingOtp && !loading) {
      verifyCode(token);
    }
  }, [otpValues, isVerifyingOtp, loading]);

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setLoginError(null);

    try {
      let error = null;
      if (otpType === 'signup') {
        const res = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: displayName } },
        });
        error = res.error;
      } else if (otpType === 'recovery') {
        const res = await supabase.auth.resetPasswordForEmail(email);
        error = res.error;
      } else {
        const res = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
        error = res.error;
      }

      if (error) {
        setLoginError(error.message);
      } else {
        setResendCooldown(60);
        setOtpValues(['', '', '', '', '', '']);
        setGeneralMessage('A new 6-digit verification code has been dispatched.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpValues(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle New Password Save
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setLoginError(error.message);
      } else {
        setIsResettingPassword(false);
        setIsAnimatingSuccess(true);
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 2500);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  // Determine Titles
  const getTitles = () => {
    if (isVerifyingOtp) {
      if (otpType === 'signup') {
        return {
          title: 'Verify Your Email',
          subtitle: `We sent a 6-digit confirmation code to ${email}.`,
        };
      } else if (otpType === 'email') {
        return {
          title: 'Enter Login Code',
          subtitle: `We sent a 6-digit one-time code to ${email}.`,
        };
      } else {
        return {
          title: 'Password Recovery Code',
          subtitle: `Please enter the 6-digit reset code sent to ${email}.`,
        };
      }
    }
    if (isResettingPassword) {
      return {
        title: 'Set New Password',
        subtitle: 'Enter a strong new password for your production account.',
      };
    }
    if (mode === 'options') {
      return {
        title: 'Welcome to HR Sports',
        subtitle: 'Sign in or create an account to access our factory production portal.',
      };
    }
    if (mode === 'signup') {
      return {
        title: 'Create Client Account',
        subtitle: 'Set up your portal to submit tech packs, track samples, and place bulk orders.',
      };
    }
    if (mode === 'signin') {
      return {
        title: 'Sign In',
        subtitle: 'Access your manufacturing dashboard, orders, and tech pack reviews.',
      };
    }
    return {
      title: 'Reset Password',
      subtitle: 'Enter your registered corporate email to receive a recovery code.',
    };
  };

  // Animated Success Screen (Apple/Nexgensim Style)
  if (isAnimatingSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F] relative">
        <div className="flex flex-col items-center justify-center p-8 max-w-md w-full text-center relative z-10">
          
          {/* Animated Checkmark Icon Ring */}
          <div className="relative flex items-center justify-center w-24 h-24 bg-black/5 rounded-full mb-8">
            <svg
              className="w-12 h-12 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: 'drawCheckmark 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s',
                }}
              />
            </svg>
            <div
              className="absolute inset-0 rounded-full border-2 border-black/20 animate-ping opacity-60"
              style={{ animationDuration: '2s' }}
            />
          </div>

          <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mb-2 animate-fade-in">
            {otpType === 'email' || mode === 'signin' ? 'Signing in...' : 'Account Verified!'}
          </h2>
          <p className="text-[#86868B] text-sm leading-relaxed mb-8 animate-fade-in">
            Welcome to {SITE_CONFIG.name}. Loading your industrial production portal...
          </p>

          {/* Smooth progress loader bar */}
          <div className="w-48 h-1 bg-[#E5E5E7] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-black rounded-full animate-loading-bar" style={{ width: '0%' }} />
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes drawCheckmark {
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes load {
              from { width: 0%; }
              to { width: 100%; }
            }
            .animate-fade-in {
              animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-loading-bar {
              animation: load 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s;
            }
          `,
          }}
        />
      </div>
    );
  }

  const { title, subtitle } = getTitles();

  return (
    <div className="flex min-h-screen flex-col justify-between py-6 px-4 bg-[#F5F5F7] font-sans antialiased relative">
      
      {/* Main 2-Column Split Card */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#E5E5E7] shadow-xl overflow-hidden self-center my-auto grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Column: Interactive Forms */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[520px]">
          <div>
            
            {/* Dynamic Heading & Subtitle */}
            <div className="mb-6 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
                {title}
              </h1>
              <p className="text-[#86868B] text-sm mt-2 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Feedback Banners */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {loginError}
              </div>
            )}
            {generalMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{generalMessage}</span>
              </div>
            )}

            {/* ── 1. OTP Verification Form ─────────────────────────────── */}
            {isVerifyingOtp && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-between gap-2 max-w-[320px] mx-auto py-2">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        disabled={loading}
                        className="w-11 h-14 text-center text-xl font-bold rounded-xl border border-[#D2D2D7] bg-[#FAFAFC] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all disabled:opacity-50 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center h-11 text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify Code
                </button>

                <div className="text-center text-sm text-[#86868B] mt-4">
                  {resendCooldown > 0 ? (
                    <span className="font-mono text-xs">Resend code in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-black hover:underline font-semibold text-xs uppercase tracking-wider"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyingOtp(false);
                      setMode('signin');
                    }}
                    className="inline-flex items-center text-black hover:underline font-medium text-xs uppercase tracking-wider mt-2"
                  >
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* ── 2. Password Reset Form (After OTP verification) ────────── */}
            {isResettingPassword && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div className="grid gap-1">
                  <label htmlFor="newPassword" className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all h-11 pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-[#86868B] hover:text-[#1D1D1F]"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <span className="text-red-500 text-xs font-medium mt-1">{passwordError}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center h-11 text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save New Password
                </button>
              </form>
            )}

            {/* ── 3. Welcome / Options Screen ──────────────────────────── */}
            {!isVerifyingOtp && !isResettingPassword && mode === 'options' && (
              <div className="space-y-6">
                
                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="relative w-full h-11 bg-white hover:bg-[#F8F9FA] active:bg-[#F1F3F4] text-[#1F1F1F] border border-[#DADCE0] font-semibold rounded-full transition-colors flex items-center justify-center text-sm disabled:opacity-50 shadow-2xs cursor-pointer"
                >
                  <div className="absolute left-4 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.87h12.66c-.55 2.91-2.19 5.38-4.66 7.04l7.21 5.59C43.42 36.56 46.5 30.83 46.5 24z" />
                      <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.75-2.99-.75-4.59s.27-3.14.75-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.21-5.59c-2 1.34-4.55 2.15-7.68 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  </div>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#E5E5E7]" />
                  <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-[#86868B] font-mono">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-[#E5E5E7]" />
                </div>

                {/* Sign Up with Email Button */}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center h-11 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  Sign Up with Email
                </button>

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-[#86868B] text-center mt-4 px-2 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <Link href="/terms-of-service" className="text-black underline underline-offset-2">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-black underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* ── 4. Form-Based Auth (Signin, Signup, Forgot) ──────────── */}
            {!isVerifyingOtp && !isResettingPassword && mode !== 'options' && (
              <form onSubmit={handleAuth} className="space-y-4">
                
                {/* Full Name for Signup */}
                {mode === 'signup' && (
                  <div className="grid gap-1">
                    <label htmlFor="displayName" className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="displayName"
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D2D2D7] bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all h-11"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#86868B]" />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="grid gap-1">
                  <label htmlFor="email" className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="procurement@brand.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        emailError
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-[#D2D2D7] focus:ring-black/20 focus:border-black'
                      } bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 transition-all h-11`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(null);
                      }}
                      required
                      disabled={loading}
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#86868B]" />
                  </div>
                  {emailError && (
                    <span className="text-red-500 text-xs font-medium mt-1">{emailError}</span>
                  )}
                </div>

                {/* Password Field */}
                {mode !== 'forgot' && (
                  <div className="grid gap-1">
                    <label htmlFor="password" className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                          passwordError
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                            : 'border-[#D2D2D7] focus:ring-black/20 focus:border-black'
                        } bg-white text-[#1D1D1F] text-sm focus:outline-none focus:ring-2 transition-all h-11`}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        required
                        disabled={loading}
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#86868B]" />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-[#86868B] hover:text-[#1D1D1F]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <span className="text-red-500 text-xs font-medium mt-1">{passwordError}</span>
                    )}
                  </div>
                )}

                {/* Forgot Password Link in Signin */}
                {mode === 'signin' && (
                  <div className="flex justify-end items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-black hover:underline font-semibold text-xs font-mono"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center h-11 text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Recovery Code' : 'Sign In'}
                  </button>
                </div>

                {mode === 'signup' && (
                  <p className="text-[11px] text-[#86868B] text-center mt-3 px-2 leading-relaxed">
                    By registering, you agree to our{' '}
                    <Link href="/terms-of-service" className="text-black underline underline-offset-2">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" className="text-black underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                )}
              </form>
            )}

          </div>

          {/* Left Column Bottom Footer Switches */}
          {!isVerifyingOtp && !isResettingPassword && (
            <div className="mt-8 pt-6 border-t border-[#E5E5E7] text-xs font-mono text-[#86868B] text-center flex flex-col space-y-3">
              {mode === 'options' && (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-black font-bold uppercase hover:underline ml-1 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMode('options')}
                    className="inline-flex items-center text-black hover:underline font-semibold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back to options
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-black font-bold uppercase hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMode('options')}
                    className="inline-flex items-center text-black hover:underline font-semibold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back to options
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-black font-bold uppercase hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="inline-flex items-center text-black hover:underline font-semibold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Right Column: Showcase Carousel (Our Designs - 5 Items) ───── */}
        <div className="hidden md:flex flex-col items-center justify-between bg-[#FAFAFC] border-l border-[#E5E5E7] p-8 relative overflow-hidden select-none">
          
          {/* Header above carousel */}
          <div className="w-full flex items-center justify-center z-10 pt-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#86868B] block">
              Our Designs
            </span>
          </div>

          {/* Carousel Slide Stage */}
          <div className="w-full flex-grow flex flex-col items-center justify-center relative min-h-[440px] my-4">
            {CAROUSEL_DESIGNS.map((item, index) => {
              const isActive = activeSlide === index;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out transform ${
                    isActive
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Design Image Card */}
                  <div className="w-80 h-80 rounded-2xl overflow-hidden border border-[#E5E5E7] bg-zinc-900 shadow-md flex items-center justify-center relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>

                  {/* Design Label */}
                  <div className="mt-6 text-center max-w-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#86868B] font-bold">
                      {item.category}
                    </div>
                    <h3 className="text-base font-extrabold text-[#1D1D1F] tracking-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex gap-2 z-10 pb-1">
            {CAROUSEL_DESIGNS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === index ? 'bg-black w-5' : 'bg-[#D2D2D7] w-2 hover:bg-[#86868B]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Footer Details */}
      <div className="max-w-4xl w-full mx-auto mt-6 flex justify-center text-xs font-mono text-[#86868B] relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/contact" className="hover:underline hover:text-[#1D1D1F] transition-colors">
            Help Desk
          </Link>
          <Link href="/privacy-policy" className="hover:underline hover:text-[#1D1D1F] transition-colors">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="hover:underline hover:text-[#1D1D1F] transition-colors">
            Terms
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
