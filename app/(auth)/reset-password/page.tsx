'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await resetPassword(formData);
      if (res && !res.success && res.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-base bg-burgundy text-white font-mono font-extrabold flex items-center justify-center text-sm shadow-2xs">
            HR
          </div>
          <span className="font-extrabold tracking-tight text-xl text-ink">HR SPORTS OEM</span>
        </div>
        <p className="text-center text-xs font-mono uppercase tracking-widest text-muted">
          Security Update
        </p>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Set New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white border border-gray-200 rounded-base p-6 sm:p-8 shadow-2xs">
          {error && (
            <div className="mb-6 p-4 rounded-base bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                New Password (Min. 8 characters)
              </label>
              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  className="pl-9 text-sm"
                  disabled={isPending}
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  className="pl-9 text-sm"
                  disabled={isPending}
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2 mt-2 bg-burgundy hover:bg-burgundy-hover"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Save New Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
