export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface PlanOption {
  id: string
  label: string
  pricePerSeat: number  // monthly, per seat
  isTeamPlan: boolean
  minSeats?: number
}

export interface ToolDefinition {
  id: ToolId
  name: string
  category: 'coding' | 'writing' | 'general' | 'api'
  plans: PlanOption[]
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    plans: [
      { id: 'hobby', label: 'Hobby (Free)', pricePerSeat: 0, isTeamPlan: false },
      { id: 'pro', label: 'Pro', pricePerSeat: 20, isTeamPlan: false },
      { id: 'business', label: 'Business', pricePerSeat: 40, isTeamPlan: true },
    ],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    plans: [
      { id: 'individual', label: 'Individual', pricePerSeat: 10, isTeamPlan: false },
      { id: 'business', label: 'Business', pricePerSeat: 19, isTeamPlan: true },
      { id: 'enterprise', label: 'Enterprise', pricePerSeat: 39, isTeamPlan: true },
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0, isTeamPlan: false },
      { id: 'pro', label: 'Pro', pricePerSeat: 20, isTeamPlan: false },
      { id: 'max', label: 'Max', pricePerSeat: 100, isTeamPlan: false },
      { id: 'team', label: 'Team', pricePerSeat: 30, isTeamPlan: true, minSeats: 5 },
      { id: 'enterprise', label: 'Enterprise', pricePerSeat: 0, isTeamPlan: true },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0, isTeamPlan: false },
      { id: 'plus', label: 'Plus', pricePerSeat: 20, isTeamPlan: false },
      { id: 'team', label: 'Team', pricePerSeat: 30, isTeamPlan: true, minSeats: 2 },
      { id: 'enterprise', label: 'Enterprise', pricePerSeat: 0, isTeamPlan: true },
    ],
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay as you go', pricePerSeat: 0, isTeamPlan: false },
    ],
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { id: 'pay-as-you-go', label: 'Pay as you go', pricePerSeat: 0, isTeamPlan: false },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0, isTeamPlan: false },
      { id: 'one-ai-premium', label: 'Google One AI Premium', pricePerSeat: 20, isTeamPlan: false },
      { id: 'workspace', label: 'Workspace Add-on', pricePerSeat: 30, isTeamPlan: true },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf (Codeium)',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0, isTeamPlan: false },
      { id: 'pro', label: 'Pro', pricePerSeat: 15, isTeamPlan: false },
      { id: 'teams', label: 'Teams', pricePerSeat: 30, isTeamPlan: true },
    ],
  },
]

export const TOOL_MAP = Object.fromEntries(
  TOOLS.map((t) => [t.id, t])
) as Record<ToolId, ToolDefinition>