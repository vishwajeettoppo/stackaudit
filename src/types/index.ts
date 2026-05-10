export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  toolId: ToolId
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  toolId: ToolId
  currentSpend: number
  recommendedAction: 'downgrade' | 'switch' | 'optimal' | 'consider-credits'
  recommendedPlan?: string
  alternativeTool?: string
  monthlySavings: number
  reason: string
}

export interface AuditResult {
  id: string
  shareToken: string
  input: AuditInput
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string
  createdAt: string
}