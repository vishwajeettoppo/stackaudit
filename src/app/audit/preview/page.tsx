'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuditResult } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function AuditPreviewPage() {
  const router = useRouter();
  const [state, setState] = useState<{
    result: AuditResult | null;
    loading: boolean;
  }>({
    result: null,
    loading: true,
  });

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('auditResult');

    if (!storedResult) {
      router.push('/');
      return;
    }

    try {
      const parsedResult = JSON.parse(storedResult);
      // Defer update to satisfy lint
      const timeout = setTimeout(() => {
        setState({ result: parsedResult, loading: false });
      }, 0);
      return () => clearTimeout(timeout);
    } catch {
      router.push('/');
    }
  }, [router]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="label-caps animate-pulse">Analyzing Infrastructure...</p>
        </div>
      </div>
    );
  }

  if (!state.result) return null;

  const result = state.result;
  const hasSavings = result.totalMonthlySavings > 0;
  const totalSpend = result.input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-base font-black tracking-tighter">S</span>
            </div>
            <div>
              <span className="text-xl tracking-tight block leading-none mb-1 uppercase text-foreground">
                <span className="font-black">Stack</span>
                <span className="font-light text-primary">Audit</span>
              </span>
              <span className="label-caps !text-primary leading-none">Intelligence System</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Summary (4 Columns) */}
          <div className="lg:col-span-4 space-y-8 animate-fade-in">
            <div className="credex-card p-8 space-y-8">
              <div className="space-y-1">
                <p className="label-caps">Audit Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm font-black uppercase tracking-widest text-success">Certified Optimal</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="label-caps mb-4">Financial Overview</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Identified Spend</p>
                    <p className="text-4xl font-black tabular-numbers tracking-tighter">${totalSpend.toLocaleString()}<span className="text-lg text-muted-foreground">/mo</span></p>
                  </div>

                  {hasSavings ? (
                    <div className="bg-success/5 border border-success/20 rounded-xl p-5 space-y-1">
                      <p className="text-[10px] font-black text-success uppercase tracking-[0.2em]">Efficiency Reclaim</p>
                      <p className="text-3xl font-black text-success tabular-numbers tracking-tighter">
                        +${result.totalMonthlySavings.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-success/60 uppercase">Monthly capital recovery</p>
                    </div>
                  ) : (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                      <p className="text-sm font-bold text-primary italic">✓ Stack architecture is currently optimized for value.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 space-y-4">
                <p className="label-caps">Organization Context</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Seats</p>
                    <p className="font-bold tabular-numbers">{result.input.teamSize}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Domain</p>
                    <p className="font-bold capitalize">{result.input.useCase}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 px-6 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              ← Re-Execute Configuration
            </button>
          </div>

          {/* Right Column: Registry Recommendations (8 Columns) */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between px-2">
              <h2 className="label-caps !text-foreground font-black text-sm">Optimization Registry</h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{result.recommendations.length} Actionable insights</span>
            </div>

            {result.recommendations.length === 0 ? (
              <div className="credex-card p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-success/5 rounded-full flex items-center justify-center mx-auto border border-success/10 text-success">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black tracking-tight">System Integrity Validated</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                  Your current AI stack demonstrates peak financial efficiency. No redundancies detected based on current market benchmarks.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="credex-card overflow-hidden group hover:border-primary/30 transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <div className="md:col-span-8 p-8 space-y-4 border-b md:border-b-0 md:border-r border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-[9px] font-black text-primary uppercase tracking-widest">
                            {rec.recommendedAction}
                          </div>
                          <h3 className="font-black text-lg tracking-tight capitalize">{rec.toolId.replace('-', ' ')}</h3>
                        </div>
                        <p className="text-muted-foreground font-medium leading-relaxed">{rec.reason}</p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          {rec.recommendedPlan && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-muted-foreground uppercase">Suggested Plan:</span>
                              <span className="text-xs font-bold bg-muted/50 px-2 py-1 rounded border border-border/50">{rec.recommendedPlan}</span>
                            </div>
                          )}
                          {rec.alternativeTool && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-muted-foreground uppercase">Migration Target:</span>
                              <span className="text-xs font-bold bg-primary/5 text-primary px-2 py-1 rounded border border-primary/10 capitalize">{rec.alternativeTool.replace('-', ' ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-4 p-8 bg-muted/20 flex flex-col justify-center items-center text-center space-y-1">
                        <p className="label-caps !text-success">Efficiency Gain</p>
                        <p className="text-3xl font-black text-success tabular-numbers tracking-tighter">${rec.monthlySavings}<span className="text-xs">/mo</span></p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">${(rec.monthlySavings * 12).toLocaleString()} projected yearly</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* High-Value API Optimization CTA */}
            {result.totalMonthlySavings > 500 && (
              <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-white shadow-2xl shadow-primary/20 animate-fade-in">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Optimization</span>
                  </div>
                  <div className="max-w-xl space-y-3">
                    <h3 className="text-3xl font-black tracking-tight leading-none">High-Volume Infrastructure Detected.</h3>
                    <p className="text-primary-foreground/70 font-medium leading-relaxed">
                      At this spend velocity, you qualify for the Credex Capital Program. Access institutional-grade discounts (15-20% off) for Anthropic, OpenAI, and frontier model APIs.
                    </p>
                  </div>
                  <button className="bg-white text-primary font-black px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] hover:bg-accent hover:text-primary transition-all active:scale-95 shadow-xl shadow-black/10">
                    Request Certified Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}