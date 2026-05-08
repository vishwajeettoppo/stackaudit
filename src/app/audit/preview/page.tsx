'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuditResult } from '@/types';

export default function AuditPreviewPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('auditResult');
    
    if (!storedResult) {
      // No result found, redirect back to form
      router.push('/');
      return;
    }
    
    const parsedResult = JSON.parse(storedResult);
    setResult(parsedResult);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your audit results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const hasSavings = result.totalMonthlySavings > 0;
  const showCredexCTA = result.totalMonthlySavings > 500;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Savings Number */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your AI Spend Audit Results
          </h1>
          {hasSavings ? (
            <>
              <div className="inline-block bg-green-100 rounded-lg p-6 mb-4">
                <p className="text-sm text-green-600 uppercase tracking-wide">Potential Monthly Savings</p>
                <p className="text-5xl font-bold text-green-700">
                  ${result.totalMonthlySavings.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  ${result.totalAnnualSavings.toLocaleString()} annually
                </p>
              </div>
              <p className="text-gray-600">
                You could save {((result.totalMonthlySavings / result.input.tools.reduce((sum, t) => sum + t.monthlySpend, 0)) * 100).toFixed(0)}% on your current AI spend
              </p>
            </>
          ) : (
            <div className="inline-block bg-blue-100 rounded-lg p-6 mb-4">
              <p className="text-xl font-semibold text-blue-700">
                ✓ You're spending well!
              </p>
              <p className="text-gray-600 mt-2">
                Your AI stack is already optimized
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Recommendations
          </h2>
          
          {result.recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                No optimization opportunities found. Your setup looks great!
              </p>
            </div>
          ) : (
            result.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {rec.toolId.replace('-', ' ')}
                    </h3>
                    <p className="text-gray-600 mt-1">{rec.reason}</p>
                    
                    {rec.recommendedPlan && (
                      <p className="text-sm text-gray-500 mt-2">
                        → Switch to: <span className="font-medium">{rec.recommendedPlan}</span>
                      </p>
                    )}
                    
                    {rec.alternativeTool && (
                      <p className="text-sm text-gray-500 mt-2">
                        → Alternative tool: <span className="font-medium">{rec.alternativeTool}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${rec.monthlySavings}/mo
                    </p>
                    <p className="text-sm text-gray-500">
                      ${(rec.monthlySavings * 12).toLocaleString()}/yr
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Credex CTA (only show for >$500/mo savings) */}
        {showCredexCTA && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">
                Want to save even more?
              </h3>
              <p className="text-purple-100 mb-6">
                Credex offers 15-20% discounted credits for Anthropic, OpenAI, and other AI APIs.
                Get a custom quote for your team.
              </p>
              <button
                onClick={() => {
                  // Open email capture modal or redirect
                  alert('Credex CTA clicked - implement email capture in Day 5');
                }}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get a Quote →
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Run another audit
          </button>
        </div>
      </div>
    </div>
  );
}