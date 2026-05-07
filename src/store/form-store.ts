import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ToolId } from '@/lib/pricing-data'

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface ToolEntry {
  toolId: ToolId
  plan: string
  monthlySpend: number
  seats: number
}

export interface FormState {
  // form data
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase

  // actions
  addTool: (toolId: ToolId) => void
  removeTool: (toolId: ToolId) => void
  updateTool: (toolId: ToolId, updates: Partial<Omit<ToolEntry, 'toolId'>>) => void
  setTeamSize: (size: number) => void
  setUseCase: (useCase: UseCase) => void
  resetForm: () => void
}

const DEFAULT_STATE = {
  tools: [] as ToolEntry[],
  teamSize: 1,
  useCase: 'mixed' as UseCase,
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      addTool: (toolId) =>
        set((state) => {
          if (state.tools.find((t) => t.toolId === toolId)) return state
          return {
            tools: [
              ...state.tools,
              { toolId, plan: '', monthlySpend: 0, seats: 1 },
            ],
          }
        }),

      removeTool: (toolId) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.toolId !== toolId),
        })),

      updateTool: (toolId, updates) =>
        set((state) => ({
          tools: state.tools.map((t) =>
            t.toolId === toolId ? { ...t, ...updates } : t
          ),
        })),

      setTeamSize: (teamSize) => set({ teamSize }),

      setUseCase: (useCase) => set({ useCase }),

      resetForm: () => set(DEFAULT_STATE),
    }),
    {
      name: 'stackaudit-form', // localStorage key
    }
  )
)