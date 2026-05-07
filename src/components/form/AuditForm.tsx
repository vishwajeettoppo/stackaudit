'use client'

import { useRouter } from 'next/navigation'
import { useFormStore } from '@/store/form-store'
import ToolCard from './ToolCard'
import ToolSelector from './ToolSelector'
import { UseCase } from '@/types'

const USE_CASES = [
  { id: 'coding', label: '💻 Coding' },
  { id: 'writing', label: '✍️ Writing' },
  { id: 'data', label: '📊 Data & Analysis' },
  { id: 'research', label: '🔍 Research' },
  { id: 'mixed', label: '🔀 Mixed' },
] as const

export default function AuditForm() {
  const router = useRouter()
  const { tools, teamSize, useCase, setTeamSize, setUseCase } = useFormStore()

  const isValid = tools.length > 0 && tools.every((t) => t.plan !== '')

  const handleSubmit = () => {
    if (!isValid) return
    router.push('/audit/preview')
  }

  return (
    <div className="space-y-12">
      {/* Team context */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="label-caps ml-1">
              Organization Seats
            </label>
            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-3 text-sm font-bold text-foreground focus:outline-none input-glow tabular-numbers"
            />
          </div>
          <div className="space-y-3">
            <label className="label-caps ml-1">
              Audit Domain
            </label>
            <div className="relative">
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="w-full appearance-none bg-muted/30 border border-border/50 rounded-lg px-4 py-3 text-sm font-bold text-foreground focus:outline-none input-glow"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.id} value={uc.id} className="bg-card">
                    {uc.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool cards */}
      <div className="space-y-6">
        {tools.length > 0 && (
          <div className="flex items-center gap-4 text-muted-foreground/30 mb-8">
            <div className="h-px flex-1 bg-border/50"></div>
            <p className="label-caps whitespace-nowrap">Inventory Registry</p>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>
        )}
        <div className="space-y-4">
          {tools.map((entry) => (
            <ToolCard key={entry.toolId} entry={entry} />
          ))}
        </div>
      </div>

      {/* Add tool */}
      <ToolSelector />

      {/* Validation & Submit */}
      <div className="pt-10 border-t border-border/50">
        {tools.length > 0 && !isValid && (
          <div className="flex items-center gap-3 text-primary bg-primary/5 px-5 py-4 rounded-xl mb-8 border border-primary/10 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider">
              Verification Required: Select a plan for each registry entry.
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || tools.length === 0}
          className="group relative w-full bg-primary text-white font-black py-5 px-10 rounded-xl transition-all duration-500 text-lg shadow-xl shadow-primary/10 hover:shadow-primary/30 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.99] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          <span className="flex items-center justify-center gap-4 relative z-10 uppercase tracking-widest text-sm">
            Execute System Audit
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        {tools.length === 0 && (
          <p className="text-center text-[10px] font-bold text-muted-foreground/50 mt-8 uppercase tracking-[0.2em]">
            Initializing: Add infrastructure components to begin
          </p>
        )}
      </div>
    </div>
  )
}