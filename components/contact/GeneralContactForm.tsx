'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { contactSchema } from '@/lib/schemas/contact';

export const GeneralContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.comment,
    };

    const validation = contactSchema.safeParse(payload);
    if (!validation.success) {
      setStatus('error');
      setErrorMessage(validation.error.errors[0]?.message || 'Please fill in all required fields correctly.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', comment: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send your message. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    }
  };

  return (
    <div className="bg-white border-hairline border-border-light rounded-3xl p-6 sm:p-10 shadow-xs">
      {status === 'success' ? (
        <div className="py-12 px-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-ink tracking-tight">
            Thank You for Reaching Out!
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
            Your message has been received by our support team. We will review your inquiry and get back to you within 24–48 business hours.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-ink text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider font-bold rounded-full transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3.5 bg-rose-50 border-hairline border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-zinc-100/80 hover:bg-zinc-100 text-ink placeholder:text-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-ink transition-all"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="sr-only">
                Email *
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-zinc-100/80 hover:bg-zinc-100 text-ink placeholder:text-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-ink transition-all"
              />
            </div>
          </div>

          {/* Row 2: Phone number */}
          <div>
            <label htmlFor="contact-phone" className="sr-only">
              Phone number (optional)
            </label>
            <input
              id="contact-phone"
              type="tel"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-zinc-100/80 hover:bg-zinc-100 text-ink placeholder:text-zinc-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-ink transition-all"
            />
          </div>

          {/* Row 3: Comment */}
          <div>
            <label htmlFor="contact-comment" className="sr-only">
              Comment
            </label>
            <textarea
              id="contact-comment"
              rows={6}
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              className="w-full bg-zinc-100/80 hover:bg-zinc-100 text-ink placeholder:text-zinc-500 rounded-xl p-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-ink transition-all resize-y min-h-[150px]"
            />
          </div>

          {/* Row 4: Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-ink text-white hover:bg-zinc-800 active:scale-[0.99] font-mono font-bold text-xs sm:text-sm uppercase tracking-widest py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  <span>SEND MESSAGE</span>
                  <Send className="w-4 h-4 -rotate-12" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GeneralContactForm;
