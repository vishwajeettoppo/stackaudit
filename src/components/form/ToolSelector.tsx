'use client'

import { TOOLS, ToolId } from '@/lib/pricing-data'
import { useFormStore } from '@/store/form-store'

export default function ToolSelector() {
  const { tools, addTool } = useFormStore()
  const addedToolIds = tools.map((t) => t.toolId)
  const availableTools = TOOLS.filter((t) => !addedToolIds.includes(t.id))

  if (availableTools.length === 0) return (
    <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border/50">
      <p className="label-caps !text-muted-foreground/40 font-bold">All identified infrastructure registered ✨</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 text-muted-foreground/20">
        <div className="h-px flex-1 bg-border/50"></div>
        <p className="label-caps !text-[9px]">Add Infrastructure Component</p>
        <div className="h-px flex-1 bg-border/50"></div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {availableTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => addTool(tool.id as ToolId)}
            className="group flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-lg text-xs font-black text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded bg-muted text-[10px] group-hover:bg-primary/10 transition-colors">
              +
            </span>
            <span className="uppercase tracking-widest">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}