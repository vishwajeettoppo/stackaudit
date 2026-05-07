'use client'

import { TOOL_MAP } from '@/lib/pricing-data'
import { useFormStore, ToolEntry } from '@/store/form-store'

interface ToolCardProps {
  entry: ToolEntry
}

export default function ToolCard({ entry }: ToolCardProps) {
  const { updateTool, removeTool } = useFormStore()
  const tool = TOOL_MAP[entry.toolId]

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-credex hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted border border-border/30 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
            {tool.name[0]}
          </div>
          <div>
            <h3 className="font-black text-foreground text-base tracking-tight leading-none mb-1">{tool.name}</h3>
            <p className="label-caps !text-[9px]">Inventory Asset</p>
          </div>
        </div>
        <button
          onClick={() => removeTool(entry.toolId)}
          className="text-muted-foreground/30 hover:text-destructive p-2 hover:bg-destructive/5 rounded-lg transition-all"
          title="Decommission asset"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan selector */}
        <div className="space-y-3">
          <label className="label-caps ml-1">
            Contract Plan
          </label>
          <div className="relative">
            <select
              value={entry.plan}
              onChange={(e) => updateTool(entry.toolId, { plan: e.target.value })}
              className="w-full appearance-none bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none input-glow"
            >
              <option value="">Verify plan...</option>
              {tool.plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.label} {plan.pricePerSeat > 0 ? `($${plan.pricePerSeat})` : '(Free)'}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="space-y-3">
          <label className="label-caps ml-1">
            Active Seats
          </label>
          <input
            type="number"
            min={1}
            value={entry.seats}
            onChange={(e) =>
              updateTool(entry.toolId, { seats: parseInt(e.target.value) || 1 })
            }
            className="w-full bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none input-glow tabular-numbers"
          />
        </div>

        {/* Monthly spend */}
        <div className="space-y-3">
          <label className="label-caps ml-1">
            Certified Spend
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm font-bold">$</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={entry.monthlySpend}
              onChange={(e) =>
                updateTool(entry.toolId, {
                  monthlySpend: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full bg-muted/30 border border-border/50 rounded-lg pl-8 pr-4 py-2.5 text-sm font-bold text-foreground focus:outline-none input-glow tabular-numbers"
            />
          </div>
        </div>
      </div>
    </div>
  )
}