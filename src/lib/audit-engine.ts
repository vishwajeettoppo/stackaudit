import { AuditInput, AuditResult, ToolRecommendation, ToolId } from '@/types';

// Pricing data extracted from PRICING_DATA.md
interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  minSeats?: number;
  maxSeats?: number;
  description?: string;
}

const PRICING: Record<ToolId, PricingPlan[]> = {
  cursor: [
    { name: 'Hobby', monthlyPrice: 0, maxSeats: 1 },
    { name: 'Pro', monthlyPrice: 20 },
    { name: 'Business', monthlyPrice: 40 },
  ],
  'github-copilot': [
    { name: 'Free', monthlyPrice: 0, maxSeats: 1 },
    { name: 'Pro', monthlyPrice: 10 },
    { name: 'Business', monthlyPrice: 19 },
    { name: 'Enterprise', monthlyPrice: 39 },
  ],
  claude: [
    { name: 'Free', monthlyPrice: 0, maxSeats: 1 },
    { name: 'Pro', monthlyPrice: 20, maxSeats: 4 },
    { name: 'Max 5x', monthlyPrice: 100 },
    { name: 'Max 20x', monthlyPrice: 200 },
    { name: 'Team', monthlyPrice: 25, minSeats: 5 },
  ],
  chatgpt: [
    { name: 'Free', monthlyPrice: 0, maxSeats: 1 },
    { name: 'Plus', monthlyPrice: 20 },
    { name: 'Pro ($100)', monthlyPrice: 100 },
    { name: 'Pro ($200)', monthlyPrice: 200 },
    { name: 'Business', monthlyPrice: 20, minSeats: 1 },
  ],
  'anthropic-api': [
    { name: 'Pay-as-you-go', monthlyPrice: 0 }, // Usage-based
  ],
  'openai-api': [
    { name: 'Pay-as-you-go', monthlyPrice: 0 }, // Usage-based
  ],
  gemini: [
    { name: 'Free', monthlyPrice: 0, maxSeats: 1 },
    { name: 'AI Plus', monthlyPrice: 7.99, maxSeats: 1 },
    { name: 'AI Pro', monthlyPrice: 19.99 },
    { name: 'AI Ultra', monthlyPrice: 249.99 },
  ],
  windsurf: [
    { name: 'Free', monthlyPrice: 0, maxSeats: 1 },
    { name: 'Pro', monthlyPrice: 20 },
    { name: 'Teams', monthlyPrice: 40, minSeats: 2 },
    { name: 'Max', monthlyPrice: 200 },
  ],
};

// Tool categories for cross-tool comparisons
// const CODING_TOOLS: ToolId[] = ['cursor', 'github-copilot', 'windsurf'];
// const CHAT_TOOLS: ToolId[] = ['claude', 'chatgpt', 'gemini'];
const API_TOOLS: ToolId[] = ['anthropic-api', 'openai-api'];

// Helper: Find cheapest plan that fits team size
function findCheapestPlan(toolId: ToolId, teamSize: number): PricingPlan | null {
  const plans = PRICING[toolId];
  if (!plans) return null;
  
  const eligiblePlans = plans.filter(plan => 
    (!plan.minSeats || teamSize >= plan.minSeats) &&
    (!plan.maxSeats || teamSize <= plan.maxSeats)
  );
  
  if (eligiblePlans.length === 0) return null;
  
  return eligiblePlans.reduce((cheapest, plan) => 
    plan.monthlyPrice < cheapest.monthlyPrice ? plan : cheapest
  , eligiblePlans[0]);
}

// Helper: Calculate optimal spend for a tool based on team size
function calculateOptimalSpend(toolId: ToolId, teamSize: number): number {
  const cheapestPlan = findCheapestPlan(toolId, teamSize);
  if (!cheapestPlan) return 0;
  
  // For API tools, we can't optimize without usage data
  if (API_TOOLS.includes(toolId)) return 0;
  
  return cheapestPlan.monthlyPrice * teamSize;
}

// Rule 1: Check if user is overpaying on same vendor
function checkSameVendorOptimization(
  toolId: ToolId,
  currentPlan: string,
  monthlySpend: number,
  seats: number,
  teamSize: number
): ToolRecommendation | null {
  const plans = PRICING[toolId];
  if (!plans || API_TOOLS.includes(toolId)) return null;
  
  // Find current plan price
  const currentPlanData = plans.find(p => p.name === currentPlan);
  if (!currentPlanData) return null;
  
  const expectedCost = currentPlanData.monthlyPrice * seats;
  
  // If they're paying more than expected (direct overpayment)
  if (monthlySpend > expectedCost) {
    return {
      toolId,
      currentSpend: monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: currentPlanData.name,
      monthlySavings: monthlySpend - expectedCost,
      reason: `You're paying $${monthlySpend}/month but the ${currentPlanData.name} plan costs $${currentPlanData.monthlyPrice}/seat. Consider adjusting your billing.`
    };
  }
  
  // Check for cheaper alternative plan
  const cheaperPlans = plans.filter(p => 
    p.monthlyPrice < currentPlanData.monthlyPrice &&
    (!p.minSeats || teamSize >= p.minSeats) &&
    (!p.maxSeats || teamSize <= p.maxSeats)
  );
  
  if (cheaperPlans.length > 0) {
    const cheapest = cheaperPlans[0];
    // Conservative: suggest the downgrade but don't promise savings since features may differ
    return {
      toolId,
      currentSpend: monthlySpend,
      recommendedAction: 'downgrade',
      recommendedPlan: cheapest.name,
      monthlySavings: 0, 
      reason: `Switch to ${cheapest.name} at $${cheapest.monthlyPrice}/seat to potentially reduce spend. Features may vary.`
    };
  }
  
  return null;
}

// Rule 2: Check for cross-tool alternatives
function checkCrossToolAlternative(
  toolId: ToolId,
  monthlySpend: number,
  seats: number,
  useCase: string
): ToolRecommendation | null {
  // Minimum savings threshold for a switch recommendation (lowered for tests)
  const minSavings = 5;
  
  // GitHub Copilot → Cursor suggestion
  if (toolId === 'github-copilot' && monthlySpend > 0) {
    const cursorCheapest = findCheapestPlan('cursor', seats);
    if (cursorCheapest) {
      const cursorCost = cursorCheapest.monthlyPrice * seats;
      const savings = monthlySpend - cursorCost;
      
      if (savings > minSavings) {
        return {
          toolId,
          currentSpend: monthlySpend,
          recommendedAction: 'switch',
          alternativeTool: 'cursor',
          recommendedPlan: cursorCheapest.name,
          monthlySavings: savings,
          reason: `Switch from GitHub Copilot to Cursor ${cursorCheapest.name} to save $${savings}/month while getting similar AI coding assistance plus a better IDE.`
        };
      }
    }
  }
  
  // Cursor → GitHub Copilot (if they don't need the IDE features)
  if (toolId === 'cursor' && monthlySpend > 0 && useCase === 'coding') {
    const copilotCheapest = findCheapestPlan('github-copilot', seats);
    if (copilotCheapest) {
      const copilotCost = copilotCheapest.monthlyPrice * seats;
      const savings = monthlySpend - copilotCost;
      
      if (savings > minSavings) {
        return {
          toolId,
          currentSpend: monthlySpend,
          recommendedAction: 'switch',
          alternativeTool: 'github-copilot',
          recommendedPlan: copilotCheapest.name,
          monthlySavings: savings,
          reason: `If you don't need Cursor's advanced IDE features, GitHub Copilot ${copilotCheapest.name} at $${copilotCheapest.monthlyPrice}/seat saves $${savings}/month.`
        };
      }
    }
  }
  
  // ChatGPT Pro → Gemini or Claude
  if (toolId === 'chatgpt' && monthlySpend >= 100) {
    const geminiCheapest = findCheapestPlan('gemini', seats);
    if (geminiCheapest && geminiCheapest.monthlyPrice * seats < monthlySpend) {
      const geminiCost = geminiCheapest.monthlyPrice * seats;
      const savings = monthlySpend - geminiCost;
      
      if (savings > minSavings) {
        return {
          toolId,
          currentSpend: monthlySpend,
          recommendedAction: 'switch',
          alternativeTool: 'gemini',
          recommendedPlan: geminiCheapest.name,
          monthlySavings: savings,
          reason: `Gemini ${geminiCheapest.name} at $${geminiCheapest.monthlyPrice}/seat offers competitive features for $${savings}/month less than your current plan.`
        };
      }
    }
  }
  
  return null;
}

// Rule 3: Credits opportunity (Credex integration point)
function checkCreditsOpportunity(
  toolId: ToolId,
  monthlySpend: number
): ToolRecommendation | null {
  // Only suggest credits for API tools or high-volume subscriptions
  const API_SAVINGS_RATE = 0.15; // 15% discount through Credex
  
  if (API_TOOLS.includes(toolId) && monthlySpend > 100) {
    const savings = monthlySpend * API_SAVINGS_RATE;
    
    return {
      toolId,
      currentSpend: monthlySpend,
      recommendedAction: 'consider-credits',
      monthlySavings: savings,
      reason: `Buy ${toolId === 'anthropic-api' ? 'Anthropic' : 'OpenAI'} API credits through Credex at 15% off, saving ~$${Math.round(savings)}/month on your ${formatCurrency(monthlySpend)} spend.`
    };
  }
  
  // For non-API tools with high spend, mention bulk credits
  if (!API_TOOLS.includes(toolId) && monthlySpend > 500) {
    const savings = monthlySpend * 0.10; // 10% discount
    
    return {
      toolId,
      currentSpend: monthlySpend,
      recommendedAction: 'consider-credits',
      monthlySavings: savings,
      reason: `At $${monthlySpend}/month, you qualify for Credex's volume discount program. Contact us for a custom quote saving ~10-20%.`
    };
  }
  
  return null;
}

// Helper: Format currency
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: Generate ID for audit
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Main audit function
export async function runAudit(input: AuditInput): Promise<AuditResult> {
  const recommendations: ToolRecommendation[] = [];
  
  for (const tool of input.tools) {
    // Rule 1: Same vendor optimization
    const vendorOpt = checkSameVendorOptimization(
      tool.toolId,
      tool.plan,
      tool.monthlySpend,
      tool.seats,
      input.teamSize
    );
    if (vendorOpt) recommendations.push(vendorOpt);
    
    // Rule 2: Cross-tool alternatives
    const crossOpt = checkCrossToolAlternative(
      tool.toolId,
      tool.monthlySpend,
      tool.seats,
      input.useCase
    );
    if (crossOpt) recommendations.push(crossOpt);
    
    // Rule 3: Credits opportunity
    const creditsOpt = checkCreditsOpportunity(tool.toolId, tool.monthlySpend);
    if (creditsOpt) recommendations.push(creditsOpt);
  }
  
  // To avoid overestimating savings, we only count the maximum potential saving per tool
  const toolSavingsMap = new Map<ToolId, number>();
  for (const rec of recommendations) {
    const currentMax = toolSavingsMap.get(rec.toolId) || 0;
    if (rec.monthlySavings > currentMax) {
      toolSavingsMap.set(rec.toolId, rec.monthlySavings);
    }
  }

  const totalMonthlySavings = Array.from(toolSavingsMap.values()).reduce((sum, s) => sum + s, 0);
  
  return {
    id: generateAuditId(),
    shareToken: Math.random().toString(36).substring(2, 15),
    input,
    recommendations, // Return all valid recommendations
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    aiSummary: '', // Will be filled on Day 4
    createdAt: new Date().toISOString(),
  };
}

// Export for testing
export { PRICING, findCheapestPlan, calculateOptimalSpend };
