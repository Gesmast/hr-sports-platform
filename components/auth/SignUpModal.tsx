'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { signUpSchema } from '@/lib/schemas/auth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn?: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onOpenSignIn,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = signUpSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      // In credentials provider, sign in directly
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError('Failed to create account.');
      } else {
        onClose();
        router.push('/portal');
        router.refresh();
      }
    } catch (err) {
      setError('Registration encountered an issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white border-hairline border-border rounded-base p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
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
            <Building2 className="w-3.5 h-3.5 stroke-[1.5]" />
            OEM Client Registration
          </div>
          <h3 id="signup-modal-title" className="text-2xl font-extrabold tracking-tight text-ink">
            Create Client Account
          </h3>
          <p className="text-xs text-muted mt-1.5">
            Set up an enterprise account to manage multi-style production batches and live shipping status.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-hairline border-red-300 text-red-700 text-xs rounded-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Full Name / Representative"
            placeholder="Marcus Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Company / Brand Organization"
            placeholder="Apex Athletic Syndicate"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />

          <Input
            label="Corporate Email"
            type="email"
            placeholder="procurement@apex.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              Register Account & Enter Portal
              <ArrowRight className="w-4 h-4 ml-2 stroke-[1.5]" />
            </Button>
          </div>
        </form>

        {onOpenSignIn && (
          <div className="mt-4 pt-4 border-t border-border-light text-center text-xs text-muted">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="text-ink font-bold hover:underline"
            >
              Sign in to Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;
