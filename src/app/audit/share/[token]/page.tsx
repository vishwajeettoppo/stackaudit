import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';

interface SharedAuditData {
  total_monthly_savings: number;
  use_case: string;
  team_size: number;
}

export default function SharedAuditPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [audit, setAudit] = useState<SharedAuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      const { data } = await supabase
        .from('audits')
        .select('*')
        .eq('share_token', token)
        .single();

      if (data) {
        setAudit(data);
      }
      setLoading(false);
    };

    fetchAudit();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="label-caps animate-pulse">Retrieving Audit Data...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-5xl">🔍</p>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">Audit Not Found</h1>
            <p className="text-muted-foreground font-medium">This shared intelligence record may have been decommissioned or expired.</p>
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary text-white rounded-xl text-xs font-normal uppercase tracking-widest hover:bg-primary/90 transition-all"
          >
            ← Return to System
          </Link>
        </div>
      </div>
    );
  }

  const savings = audit.total_monthly_savings;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-base font-black tracking-tighter">S</span>
            </div>
            <div>
              <span className="text-xl tracking-tight block leading-none mb-1 uppercase">
                <span className="font-black">Stack</span>
                <span className="font-black text-primary">Audit</span>
              </span>
              <span className="label-caps !text-primary leading-none">Shared Intelligence</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="credex-card overflow-hidden">
          <div className="bg-muted/30 px-8 py-4 border-b border-border">
            <p className="label-caps !text-foreground">Certified Audit Results</p>
          </div>

          <div className="p-12 text-center space-y-10">
            {savings > 0 ? (
              <>
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-success/5 rounded-full flex items-center justify-center mx-auto border border-success/10 text-success">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="label-caps !text-success">Potential Efficiency Reclaim</p>
                    <p className="text-6xl font-black text-foreground tabular-numbers tracking-tighter">
                      ${savings.toLocaleString()}<span className="text-2xl text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>

                <div className="max-w-md mx-auto p-6 rounded-2xl bg-secondary/50 border border-border space-y-2">
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    This organization context suggests a potential capital recovery of <span className="font-black text-foreground tabular-numbers">${(savings * 12).toLocaleString()}</span> over a 12-month fiscal cycle.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-xl text-xs font-normal uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
                  >
                    Run Your Own Audit →
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-success/5 rounded-full flex items-center justify-center mx-auto border border-success/10 text-success">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Infrastructure Fully Optimized</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto italic">
                      Verification complete: This stack demonstrate peak financial efficiency with zero identifiable waste.
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="inline-block bg-foreground text-background px-10 py-4 rounded-xl text-xs font-normal uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  Analyze Your Stack
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="mt-12 text-center label-caps !text-muted-foreground/30">
          StackAudit Institutional Intelligence · Shared Report
        </p>
      </div>
    </main>
  );
}