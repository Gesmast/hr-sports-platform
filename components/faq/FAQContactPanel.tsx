'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { BorderCard } from '@/components/shared/BorderCard';
import { contactSchema } from '@/lib/schemas/contact';

export const FAQContactPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'United States',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = contactSchema.safeParse(formData);

    if (!validation.success) {
      setStatus('error');
      setResponseMsg(validation.error.errors[0]?.message || 'Please complete all required fields.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setResponseMsg('Your message has been sent to our support desk. We will respond within 24 hours.');
        setFormData({ name: '', email: '', country: 'United States', message: '' });
      } else {
        setStatus('error');
        setResponseMsg(data.error || 'Failed to dispatch inquiry.');
      }
    } catch (err) {
      setStatus('error');
      setResponseMsg('Network connection error. Please try again.');
    }
  };

  return (
    <BorderCard variant="surface" className="p-6 sm:p-8">
      <div className="mb-6">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-ink" />
          General Direct Inquiry
        </div>
        <h3 className="text-xl font-extrabold text-ink tracking-tight">
          Have a Question Not Answered Above?
        </h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Send a lightweight inquiry directly to our factory team. For quote requests with file attachments, please use the <a href="/request-a-quote" className="underline font-bold text-ink">Request Quote</a> page.
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-6 bg-emerald-50 border-hairline border-emerald-300 rounded-base text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
          <h4 className="font-bold text-emerald-900 text-sm">Message Transmitted</h4>
          <p className="text-xs text-emerald-800 leading-relaxed">{responseMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-mono font-bold uppercase text-emerald-900 underline mt-2"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3 bg-red-50 border-hairline border-red-300 rounded-base text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{responseMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              placeholder="Marcus Vance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Corporate Email"
              type="email"
              placeholder="marcus@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-1.5">
              Your Country / Region *
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-white text-ink border-hairline rounded-base px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Ireland">Ireland</option>
              <option value="International / Other">International / Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-1.5">
              Message or Specific Requirement *
            </label>
            <textarea
              rows={4}
              placeholder="Ask us about specific fabric compositions, custom label minimums, or logistics routing..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full bg-white text-ink border-hairline rounded-base p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={status === 'loading'}
            className="w-full gap-2"
          >
            Send General Inquiry
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}
    </BorderCard>
  );
};

export default FAQContactPanel;
