import AuditForm from '@/components/form/AuditForm'
import ThemeToggle from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-105">
              <span className="text-white text-base font-black tracking-tighter">C</span>
            </div>
            <div>
              <span className="font-black text-foreground text-xl tracking-tight block leading-none mb-1 uppercase">StackAudit</span>
              <span className="label-caps !text-primary leading-none">Intelligence System</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 mr-8">
              <a href="#" className="label-caps hover:text-primary transition-colors">Methodology</a>
              <a href="#" className="label-caps hover:text-primary transition-colors">Benchmarks</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 12-Column Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Hero/Context (5 Columns) */}
          <div className="lg:col-span-5 space-y-12 animate-fade-in-up opacity-0">
            <div>
              <div className="inline-flex items-center gap-3 bg-primary/5 text-primary px-4 py-2 rounded-full mb-10 border border-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest font-worksans">Institutional Grade</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground mb-8 leading-[1.1] tracking-tight">
                Algorithmic<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent">
                  Spend Intelligence.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                StackAudit employs high-precision financial auditing to optimize your AI infrastructure. Identify redundancies and reclaim capital with institutional transparency.
              </p>
            </div>

            {/* Precision Metrics Display */}
            <div className="grid grid-cols-2 gap-6 pt-4 tabular-numbers">
              <div className="space-y-1">
                <p className="label-caps">Avg. Optimization</p>
                <p className="text-3xl font-black text-success tracking-tighter">23.4%</p>
              </div>
              <div className="space-y-1">
                <p className="label-caps">Time to Audit</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">58.2s</p>
              </div>
            </div>

            {/* Compliance/Security Note */}
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border/50 space-y-3">
              <p className="label-caps !text-foreground">Security & Sovereignty</p>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Audits are processed client-side. No financial data ever leaves your local environment. Zero-knowledge by design.
              </p>
            </div>
          </div>

          {/* Right Column: Audit Engine (7 Columns) */}
          <div className="lg:col-span-7 animate-fade-in-up opacity-0 animate-delay-200">
            <div className="credex-card overflow-hidden">
              <div className="border-b border-border/50 bg-muted/30 px-8 py-5 flex items-center justify-between">
                <h2 className="label-caps !text-foreground font-black">Audit Configuration</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Engine</span>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <AuditForm />
              </div>
            </div>
            
            {/* Contextual Intelligence Labels */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="py-3 px-4 rounded-xl border border-border/30 bg-background/50">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Context-Aware</p>
              </div>
              <div className="py-3 px-4 rounded-xl border border-border/30 bg-background/50">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tabular Accuracy</p>
              </div>
              <div className="py-3 px-4 rounded-xl border border-border/30 bg-background/50">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Multi-Model</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                <span className="text-background text-xs font-black">S</span>
              </div>
              <span className="tracking-widest text-sm uppercase">
                <span className="font-black text-foreground">Stack</span>
                <span className="font-medium text-muted-foreground">Audit</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
              Precision-engineered for the modern engineering organization. 
              The authoritative standard for AI subscription intelligence.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="label-caps !text-foreground">Intelligence</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Pricing Data Library</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Optimization Models</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="label-caps !text-foreground">System</h4>
            <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
              <li><a href="https://credex.rocks" className="hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" target="_blank" rel="noopener noreferrer">Powered by Credex</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Architecture</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pt-10 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="label-caps !text-muted-foreground/40">© 2026 StackAudit System · v2.1.0-PRECISION</span>
          <div className="flex gap-10">
            <a href="#" className="label-caps !text-muted-foreground/40 hover:!text-primary transition-colors">Privacy Sovereignty</a>
            <a href="#" className="label-caps !text-muted-foreground/40 hover:!text-primary transition-colors">Institutional Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
