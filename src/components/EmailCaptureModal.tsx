'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditId: string;
  shareToken: string;
  totalSavings: number;
  annualSavings: number;
  recommendationsCount: number;
  shareUrl: string;
}

export default function EmailCaptureModal({ 
  isOpen, 
  onClose, 
  auditId, 
  totalSavings,
  annualSavings,
  recommendationsCount,
  shareUrl
}: Omit<EmailCaptureModalProps, 'shareToken'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      // 1. Update audit with email in Supabase
      const { error: updateError } = await supabase
        .from('audits')
        .update({ email })
        .eq('id', auditId);

      if (updateError) throw updateError;

      // 2. Send email via Resend
      const emailResponse = await fetch('/api/email/send-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          totalSavings,
          annualSavings,
          shareUrl,
          recommendationsCount,
          auditId,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Email send failed:', errorData.error);
        if (errorData.hint) {
          console.warn(errorData.hint);
        }
        // Still show success to user - they got the email capture at least
      }

      setSubmitted(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h3 className="text-xl font-bold mb-2">Check your inbox!</h3>
          <p className="text-gray-600">
            We&apos;ll send your audit report to <strong className="font-semibold">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            (Check spam folder if you don&apos;t see it in 2 minutes)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Save ${totalSavings}/month?
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter your email to get a detailed report with step-by-step instructions 
          to claim your savings.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Sending Report...' : 'Send My Report →'}
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            We&apos;ll email you the report. No spam.
          </p>
        </form>
      </div>
    </div>
  );
}
