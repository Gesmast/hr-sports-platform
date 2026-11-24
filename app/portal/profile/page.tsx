'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Camera,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  X,
  Lock,
} from 'lucide-react';
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  changePasswordInPortal,
  sendPasswordResetFromPortal,
} from '@/app/actions/portal';
import { createClient } from '@/lib/supabase/client';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Active section tab: 'profile' | 'security' | 'shipping'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'shipping'>('profile');

  // Avatar Management
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Camera Snapshot States (like Nexgensim)
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Password Update States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [resetEmailPending, setResetEmailPending] = useState(false);

  // Fetch full profile on mount
  useEffect(() => {
    async function load() {
      try {
        const p = await getUserProfile();
        setProfile(p);
        setAvatarUrl(p?.avatar_url || p?.googleAvatar || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Handle Avatar Upload from File
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${profile?.id || 'user'}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage bucket 'avatars'
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      let publicUrl = '';
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      } else {
        // Fallback to Base64 data URL
        publicUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const res = await updateUserAvatar(publicUrl);
      if (res.success) {
        setAvatarUrl(publicUrl);
        setSuccess('Profile avatar updated successfully!');
      } else {
        setError(res.error || 'Failed to update avatar.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error processing image.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Start Camera Stream
  const handleStartCamera = async () => {
    setIsCameraOpen(true);
    setCameraError(null);
    setCapturedPhoto(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 480, facingMode: 'user' },
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 200);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please check browser permissions.');
    }
  };

  // Capture Snapshot from Camera
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
    }
  };

  // Save Captured Camera Photo
  const handleSaveCapturedPhoto = async () => {
    if (!capturedPhoto) return;
    setUploadingAvatar(true);
    handleCloseCamera();

    try {
      const res = await updateUserAvatar(capturedPhoto);
      if (res.success) {
        setAvatarUrl(capturedPhoto);
        setSuccess('Camera photo saved as account avatar!');
      } else {
        setError(res.error || 'Failed to save camera photo.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error saving photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Close Camera Stream
  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedPhoto(null);
  };

  // Remove Custom Avatar
  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    setError(null);
    try {
      const fallbackUrl = profile?.googleAvatar || '';
      const res = await updateUserAvatar(fallbackUrl);
      if (res.success) {
        setAvatarUrl(fallbackUrl || null);
        setSuccess('Custom avatar removed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not remove avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Submit Profile Information
  const handleSubmitProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateUserProfile(formData);
      if (!res.success && res.error) {
        setError(res.error);
      } else {
        setSuccess('Account profile and shipping address updated successfully!');
        setTimeout(() => setSuccess(null), 4000);
      }
    });
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordPending(true);
    try {
      const formData = new FormData();
      formData.set('currentPassword', currentPassword);
      formData.set('newPassword', newPassword);
      formData.set('confirmPassword', confirmPassword);

      const res = await changePasswordInPortal(formData);
      if (!res.success) {
        setPasswordError(res.error || 'Failed to update password.');
      } else {
        setPasswordSuccess('Password successfully updated! Your credentials are in sync.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Error updating password.');
    } finally {
      setPasswordPending(false);
    }
  };

  // Handle Forgot/Reset Password Email Request
  const handleSendResetEmail = async () => {
    setResetEmailPending(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      const res = await sendPasswordResetFromPortal();
      if (!res.success) {
        setPasswordError(res.error || 'Failed to send recovery link.');
      } else {
        setPasswordSuccess(`Password recovery email dispatched to ${profile?.email}. Check your inbox!`);
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Could not send recovery link.');
    } finally {
      setResetEmailPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-black">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  const shipping = profile?.shipping_address || {};
  const isGoogle = profile?.isGoogle;
  const initial = (profile?.full_name?.[0] || profile?.company_name?.[0] || profile?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="max-w-4xl space-y-6 text-black">
      {/* Page Header */}
      <div className="pb-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Account & Security Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-1 max-w-2xl leading-relaxed">
            Manage your corporate identity, profile photo, Google OAuth synchronization, password security, and delivery address.
          </p>
        </div>

        {/* Status Pill */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-mono shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-black">{isGoogle ? 'Google OAuth Active' : 'Direct Auth Active'}</span>
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-bold flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-black hover:text-red-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto text-black hover:text-emerald-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-zinc-200 text-black font-black border border-gray-300 shadow-2xs'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-gray-200 font-bold'
          }`}
        >
          <User className="w-3.5 h-3.5 text-black" />
          <span>Profile & Avatar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-zinc-200 text-black font-black border border-gray-300 shadow-2xs'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-gray-200 font-bold'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-black" />
          <span>Password & Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`px-3.5 py-2 text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'bg-zinc-200 text-black font-black border border-gray-300 shadow-2xs'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-gray-200 font-bold'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-black" />
          <span>Shipping Logistics</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: Profile & Avatar Management                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Avatar Showcase & Controls Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
                  <User className="w-4 h-4 text-black" />
                  <span>Account Photo & Identity</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Your photo appears across quotes, manufacturing work orders, and direct client communications.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-black shadow-2xs bg-zinc-100 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile?.full_name || 'Account Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black font-mono text-black">
                      {initial}
                    </span>
                  )}
                </div>

                {/* Google Sync Badge */}
                {isGoogle && (
                  <div
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-black"
                    title="Synced with Google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  {/* Upload Image Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-black" />
                    )}
                    <span>Upload Image</span>
                  </button>

                  {/* Take Photo with Webcam Button */}
                  <button
                    type="button"
                    onClick={handleStartCamera}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-zinc-100 text-black border border-gray-300 transition shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-black" />
                    <span>Take Photo</span>
                  </button>

                  {/* Remove Button */}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-mono text-zinc-500 space-y-0.5 font-bold">
                  <p>Allowed: PNG, JPG, WebP (Max 5MB).</p>
                  {isGoogle && (
                    <p className="text-black font-bold">
                      ✓ Synchronized with your Google Account profile image.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <form onSubmit={handleSubmitProfile} className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
                <Building className="w-4 h-4 text-black" />
                <span>Procurement Entity & Contact Info</span>
              </h2>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-gray-200 font-bold">
                Role: {profile?.role || 'client'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  Primary Contact Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pl-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                    disabled={isPending}
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="companyName"
                    defaultValue={profile?.company_name || ''}
                    placeholder="e.g. Apex Athletic Syndicate"
                    className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pl-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                    disabled={isPending}
                  />
                  <Building className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  Authentication Email (Locked)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full bg-zinc-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-zinc-500 font-medium cursor-not-allowed opacity-90"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                  Tied to your Supabase Auth session credentials.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  Direct Phone / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    defaultValue={profile?.phone || ''}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pl-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                    disabled={isPending}
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Hidden fields for shipping */}
            <input type="hidden" name="street" value={shipping.street || ''} />
            <input type="hidden" name="city" value={shipping.city || ''} />
            <input type="hidden" name="state" value={shipping.state || ''} />
            <input type="hidden" name="postalCode" value={shipping.postalCode || ''} />
            <input type="hidden" name="country" value={shipping.country || ''} />

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-black" />
                    <span>Save Contact Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 2: Password, Google OAuth, & Security                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Feedback Banners for Security */}
          {passwordError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-bold flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passwordError}</span>
              <button onClick={() => setPasswordError(null)} className="ml-auto text-black hover:text-red-700 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
              <button onClick={() => setPasswordSuccess(null)} className="ml-auto text-black hover:text-emerald-700 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Google OAuth Provider Status Card */}
          {isGoogle && (
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-200/80">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-black tracking-tight">
                      Linked with Google Account
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium mt-1 leading-relaxed">
                    You authenticate seamlessly using your Google identity (<span className="text-black font-bold font-mono">{profile?.email}</span>). No manual password is required to log in. You can still set a direct password below if you wish to sign in with email and password as well.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Change / Set Password Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
                  <Lock className="w-4 h-4 text-black" />
                  <span>{isGoogle ? 'Set Direct Account Password' : 'Change Password'}</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update your authentication credentials. Minimum 8 characters.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {!isGoogle && (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pr-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                      disabled={passwordPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3 text-black transition cursor-pointer"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                    New Password (Min. 8 Chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={8}
                      className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pr-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                      disabled={passwordPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3 text-black transition cursor-pointer"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={8}
                      className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 pr-10 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                      disabled={passwordPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3 text-black transition cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                {/* Send Reset Email Trigger */}
                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={resetEmailPending}
                  className="text-xs text-zinc-600 hover:text-black hover:underline font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {resetEmailPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-black" />
                  )}
                  <span>Forgot password? Send recovery link via email</span>
                </button>

                <button
                  type="submit"
                  disabled={passwordPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {passwordPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-black" />
                      <span>{isGoogle ? 'Save Direct Password' : 'Update Password'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 3: Shipping & Logistics Details                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'shipping' && (
        <form onSubmit={handleSubmitProfile} className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-5">
          <div className="pb-3.5 border-b border-gray-100">
            <h2 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" />
              <span>Primary Consignee Air-Cargo Delivery Address</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Used as the default delivery destination when converting production quotes into international air-cargo export batches.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                Street Address & Suite / Unit
              </label>
              <input
                type="text"
                name="street"
                defaultValue={shipping.street || ''}
                placeholder="742 Evergreen Terrace, Suite 400"
                className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={shipping.city || ''}
                  placeholder="Springfield"
                  className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  defaultValue={shipping.state || ''}
                  placeholder="Oregon"
                  className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  defaultValue={shipping.postalCode || ''}
                  placeholder="97477"
                  className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
                Country / Region
              </label>
              <input
                type="text"
                name="country"
                defaultValue={shipping.country || ''}
                placeholder="United States"
                className="w-full bg-white border border-gray-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-zinc-400 font-medium focus:outline-none transition"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Preserve profile fields */}
          <input type="hidden" name="fullName" value={profile?.full_name || ''} />
          <input type="hidden" name="companyName" value={profile?.company_name || ''} />
          <input type="hidden" name="phone" value={profile?.phone || ''} />

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted under Row Level Security</span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-black" />
                  <span>Save Shipping Address</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* Live Camera Modal (Nexgensim-style webcam capture)          */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-black">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-black" />
                <h3 className="text-sm font-bold text-black">Capture Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="text-black hover:bg-zinc-100 p-1 rounded-lg border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                {cameraError}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Viewfinder or Snapshot Preview */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-black border border-gray-300 relative flex items-center justify-center shadow-inner">
                  {capturedPhoto ? (
                    <img
                      src={capturedPhoto}
                      alt="Captured snapshot"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  )}
                </div>

                {/* Camera Actions */}
                <div className="flex items-center justify-center gap-3">
                  {!capturedPhoto ? (
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-black" />
                      <span>Take Photo</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setCapturedPhoto(null)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-zinc-100 text-black border border-gray-300 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-black" />
                        <span>Retake</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCapturedPhoto}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-200 hover:bg-zinc-300 text-black border border-black transition shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>Save as Avatar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
