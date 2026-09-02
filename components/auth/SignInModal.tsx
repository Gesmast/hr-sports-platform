'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { signInSchema } from '@/lib/schemas/auth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState('client@demo.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please check your inputs');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid corporate email or password.');
      } else {
        onClose();
        router.push('/portal');
        router.refresh();
      }
    } catch (err: any) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white border-hairline border-border rounded-base p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-ink p-1 rounded-sm transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
            Client Authentication
          </div>
          <h3 id="signin-modal-title" className="text-2xl font-extrabold tracking-tight text-ink">
            Access Client Portal
          </h3>
          <p className="text-xs text-muted mt-1.5">
            Track active production runs, inspect QC certificates, and download tech packs.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-hairline border-red-300 text-red-700 text-xs rounded-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Corporate Email"
            type="email"
            placeholder="procurement@brand.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In to Portal
              <ArrowRight className="w-4 h-4 ml-2 stroke-[1.5]" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-border-light text-center text-xs text-muted">
          <p className="mb-2">
            Demo Credentials preloaded for immediate evaluation:
          </p>
          <code className="text-[11px] bg-surface px-2 py-1 rounded-sm text-ink font-mono block">
            client@demo.com / password123
          </code>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
