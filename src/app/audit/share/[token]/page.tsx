'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuditResult } from '@/types';

export default function SharedAuditPage({ params }: { params: { token: string } }) {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('share_token', params.token)
        .single();

      if (data) {
        setAudit(data);
      }
      setLoading(false);
    };

    fetchAudit();
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🔍</p>
          <h1 className="text-xl font-bold mb-2">Audit not found</h1>
          <p className="text-gray-600">This share link may have expired.</p>
        </div>
      </div>
    );
  }

  const savings = audit.total_monthly_savings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {savings > 0 ? (
            <>
              <p className="text-6xl mb-4">💰</p>
              <p className="text-sm text-green-600 uppercase tracking-wider font-bold mb-2">
                Shared Audit Results
              </p>
              <p className="text-5xl font-black text-green-700 mb-4">
                ${savings}/month
              </p>
              <p className="text-gray-600">
                This team could save ${savings * 12}/year on AI tools
              </p>
              <div className="mt-8">
                <a
                  href="/"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
                >
                  Run your own audit →
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-6xl mb-4">✅</p>
              <p className="text-xl font-bold mb-2">This team is spending optimally!</p>
              <p className="text-gray-600">No savings opportunities found.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}