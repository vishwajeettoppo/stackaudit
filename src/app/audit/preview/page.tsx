'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuditResult } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';
import EmailCaptureModal from '@/components/EmailCaptureModal';

export default function AuditPreviewPage() {
  const router = useRouter();
  const [state, setState] = useState<{
    result: AuditResult | null;
    loading: boolean;
    aiSummary: string | null;
    summaryLoading: boolean;
    summaryError: boolean;
    showEmailModal: boolean;
    auditId: string;
    shareToken: string;
  }>({
    result: null,
    loading: true,
    aiSummary: null,
    summaryLoading: false,
    summaryError: false,
    showEmailModal: false,
    auditId: '',
    shareToken: '',
  });

  const fetchAiSummary = useCallback(async (auditResult: AuditResult) => {
    setState(prev => ({ ...prev, summaryLoading: true, summaryError: false }));
    
    try {
      const response = await fetch('/api/audit/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalMonthlySavings: auditResult.totalMonthlySavings,
          recommendations: auditResult.recommendations,
          tools: auditResult.input.tools,
          teamSize: auditResult.input.teamSize,
          useCase: auditResult.input.useCase,
        }),
      });
      
      const data = await response.json();
      
      if (data.summary) {
        setState(prev => ({ ...prev, aiSummary: data.summary, summaryLoading: false }));
      } else {
        setState(prev => ({ ...prev, summaryError: true, summaryLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load AI summary:', error);
      setState(prev => ({ ...prev, summaryError: true, summaryLoading: false }));
    }
  }, []);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('auditResult');
    
    if (!storedResult) {
      router.push('/');
      return;
    }
    
    try {
      const parsedResult = JSON.parse(storedResult);
      // Defer update to satisfy lint
      const timeout = setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          result: parsedResult, 
          loading: false,
          auditId: parsedResult.id,
          shareToken: parsedResult.shareToken
        }));
        
        fetchAiSummary(parsedResult);

        // Show email modal after 3 seconds if savings > 0
        if (parsedResult.totalMonthlySavings > 0) {
          setTimeout(() => {
            setState(prev => ({ ...prev, showEmailModal: true }));
          }, 3000);
        }
      }, 0);
      return () => clearTimeout(timeout);
    } catch {
      router.push('/');
    }
  }, [router, fetchAiSummary]);

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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-105">
              <span className="text-white text-base font-black tracking-tighter">S</span>
            </div>
            <div>
              <span className="text-xl tracking-tight block leading-none mb-1 uppercase text-foreground">
                <span className="font-black">Stack</span>
                <span className="font-black text-primary">Audit</span>
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Core Metrics (4 Columns) */}
          <div className="lg:col-span-4 space-y-8 animate-fade-in">
            <div className="credex-card p-8 space-y-8">
              <div className="space-y-1">
                <p className="label-caps">Audit Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${hasSavings ? 'bg-amber-500' : 'bg-success'} animate-pulse`}></div>
                  <span className={`text-sm font-normal uppercase tracking-widest ${hasSavings ? 'text-amber-500' : 'text-success'}`}>
                    {hasSavings ? 'Action Required' : 'Certified Optimal'}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="label-caps mb-4">Financial Overview</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider mb-1">Identified Spend</p>
                    <p className="text-4xl font-black tabular-numbers tracking-tighter text-foreground">
                      ${totalSpend.toLocaleString()}<span className="text-lg text-muted-foreground font-medium">/mo</span>
                    </p>
                  </div>
                  
                  {hasSavings ? (
                    <div className="bg-success/5 border border-success/20 rounded-xl p-5 space-y-1">
                      <p className="text-[10px] font-normal text-success uppercase tracking-[0.2em]">Efficiency Reclaim</p>
                      <p className="text-3xl font-black text-success tabular-numbers tracking-tighter">
                        +${result.totalMonthlySavings.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-normal text-success/60 uppercase">Monthly capital recovery</p>
                    </div>
                  ) : (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                      <p className="text-sm font-medium text-primary italic leading-relaxed">✓ Stack architecture is currently optimized for maximum capital efficiency.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-6">
                <p className="label-caps">Spend Distribution</p>
                <div className="space-y-4">
                  {result.input.tools.map((tool) => (
                    <div key={tool.toolId} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-normal uppercase tracking-tight">
                        <span className="text-muted-foreground truncate max-w-[120px]">{tool.toolId.replace('-', ' ')}</span>
                        <span className="tabular-numbers text-foreground">{Math.round((tool.monthlySpend / totalSpend) * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${(tool.monthlySpend / totalSpend) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <p className="label-caps">Organization Context</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                    <p className="text-[9px] font-normal text-muted-foreground uppercase mb-1">Seats</p>
                    <p className="font-bold tabular-numbers tracking-tight">{result.input.teamSize}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                    <p className="text-[9px] font-normal text-muted-foreground uppercase mb-1">Domain</p>
                    <p className="font-bold capitalize truncate">{result.input.useCase}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => router.push('/')}
                className="w-full py-4 px-6 rounded-xl bg-primary text-white text-xs font-normal uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-primary/20 hover:bg-primary/90"
              >
                ← Re-Execute Configuration
              </button>
              
              <button 
                onClick={() => window.print()}
                className="w-full py-4 px-6 rounded-xl bg-foreground text-background text-xs font-normal uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-foreground/10 hover:opacity-90"
              >
                📄 Export Audit PDF
              </button>

              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/audit/share/${state.shareToken}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('Share link copied! Share your audit results with your team.');
                }}
                className="w-full py-4 px-6 rounded-xl border border-border bg-background text-foreground text-xs font-normal uppercase tracking-widest transition-all active:scale-[0.98] hover:bg-muted/50"
              >
                🔗 Copy Share Link
              </button>
            </div>
          </div>

          {/* Right Column: AI Summary & Tool Registry (8 Columns) */}
          <div className="lg:col-span-8 space-y-10 animate-fade-in-up">
            
            {/* AI Narrative Summary Box - POSITIONED AT TOP */}
            <div className="credex-card p-8 bg-primary/[0.02] border-primary/10 shadow-credex">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="label-caps !text-primary">AI Narrative Summary</h3>
              </div>
              
              {state.summaryLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6"></div>
                </div>
              ) : state.summaryError ? (
                <p className="text-sm text-muted-foreground italic">Intelligence synthesis temporarily unavailable. Manual audit registry below remains accurate.</p>
              ) : state.aiSummary ? (
                <p className="text-base text-foreground font-medium leading-relaxed italic border-l-2 border-primary/20 pl-6">
                  &ldquo;{state.aiSummary}&rdquo;
                </p>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="label-caps !text-foreground font-black text-sm">System Inventory Breakdown</h2>
                <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest">{result.input.tools.length} Infrastructure Components</span>
              </div>

              {/* Per-Tool Inventory Cards */}
              <div className="space-y-6">
                {result.input.tools.map((tool, idx) => {
                  const rec = result.recommendations.find(r => r.toolId === tool.toolId);
                  const isOptimized = !rec;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`credex-card overflow-hidden group transition-all duration-500 border-l-4 ${
                        isOptimized ? 'border-l-success/40 hover:border-success/30' : 'border-l-primary/40 hover:border-primary/30'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-8 p-8 space-y-5 border-b md:border-b-0 md:border-r border-border">
                          <div className="flex items-center gap-4">
                            <div className={`px-2.5 py-1 rounded text-[9px] font-normal uppercase tracking-widest border ${
                              isOptimized 
                                ? 'bg-success/5 border-success/20 text-success' 
                                : 'bg-primary/5 border-primary/20 text-primary'
                            }`}>
                              {isOptimized ? 'Optimized' : rec.recommendedAction}
                            </div>
                            <h3 className="font-black text-xl tracking-tight capitalize text-foreground">{tool.toolId.replace('-', ' ')}</h3>
                            <span className="label-caps !text-muted-foreground/50">{tool.plan}</span>
                          </div>
                          
                          {!isOptimized ? (
                            <p className="text-muted-foreground font-medium text-sm leading-relaxed pr-4 italic">{rec.reason}</p>
                          ) : (
                            <p className="text-muted-foreground/60 font-medium text-sm leading-relaxed italic">Verification complete: This asset meets standard efficiency benchmarks for your team size.</p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-8 pt-2">
                            <div className="space-y-1">
                              <p className="label-caps !text-[8px]">Current Allocation</p>
                              <p className="text-sm font-bold tabular-numbers text-foreground">${tool.monthlySpend}<span className="text-muted-foreground font-medium">/mo</span></p>
                            </div>
                            <div className="space-y-1">
                              <p className="label-caps !text-[8px]">Resource Utilization</p>
                              <p className="text-sm font-bold text-foreground">{tool.seats} <span className="text-muted-foreground font-medium">Active Seats</span></p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`md:col-span-4 p-8 flex flex-col justify-center items-center text-center space-y-2 ${
                          isOptimized ? 'bg-success/[0.02]' : 'bg-primary/[0.02]'
                        }`}>
                          <p className="label-caps !text-[9px]">Optimization Status</p>
                          {isOptimized ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success mb-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-sm font-normal text-success uppercase tracking-widest">Verified</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-3xl font-black tabular-numbers tracking-tighter text-primary">
                                +${rec.monthlySavings}
                                <span className="text-xs ml-0.5">/mo</span>
                              </p>
                              <p className="text-[9px] font-normal text-muted-foreground uppercase tracking-tight">Available Savings</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* High-Value API Optimization CTA */}
            {result.totalMonthlySavings > 500 && (
              <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-white shadow-2xl shadow-primary/20 animate-fade-in">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] -mr-32 -mt-32 rounded-full opacity-50"></div>
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-[10px] font-normal uppercase tracking-widest">Enterprise Optimization</span>
                  </div>
                  <div className="max-w-xl space-y-3">
                    <h3 className="text-3xl font-black tracking-tight leading-none">High-Volume Infrastructure Detected.</h3>
                    <p className="text-primary-foreground/70 font-medium leading-relaxed">
                      At this spend velocity, you qualify for the StackAudit Capital Program. Access institutional-grade discounts (15-20% off) for Anthropic, OpenAI, and frontier model APIs.
                    </p>
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, showEmailModal: true }))}
                    className="bg-white text-primary font-black px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] hover:bg-accent hover:text-primary transition-all active:scale-95 shadow-xl shadow-black/10"
                  >
                    Request Certified Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {state.showEmailModal && state.result && (
        <EmailCaptureModal
          isOpen={state.showEmailModal}
          onClose={() => setState(prev => ({ ...prev, showEmailModal: false }))}
          auditId={state.auditId}
          totalSavings={state.result.totalMonthlySavings}
          annualSavings={state.result.totalAnnualSavings}
          recommendationsCount={state.result.recommendations.length}
          shareUrl={`${window.location.origin}/audit/share/${state.shareToken}`}
        />
      )}
    </main>
  );
}
