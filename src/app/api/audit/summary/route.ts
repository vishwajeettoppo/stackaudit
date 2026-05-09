import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuditInput, ToolRecommendation } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SummaryRequest extends AuditInput {
  totalMonthlySavings: number;
  recommendations: ToolRecommendation[];
}

export async function POST(request: NextRequest) {
  let body: SummaryRequest | null = null;

  try {
    body = await request.json();
    if (!body) throw new Error('Empty request body');

    // Build prompt for Gemini
    const prompt = buildPrompt(body);

    // Use cheaper/faster model for summaries
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Gemini API error:', error);

    if (!body) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Return fallback summary
    const fallbackSummary = generateFallbackSummary(body);

    return NextResponse.json({ summary: fallbackSummary }, { status: 200 });
  }
}

function buildPrompt(data: SummaryRequest): string {
  const hasSavings = data.totalMonthlySavings > 0;

  if (!hasSavings) {
    return `You are an AI spend auditor. Write a short, encouraging summary (max 100 words) for a team spending optimally on AI tools.

Team size: ${data.teamSize} seats
Use case: ${data.useCase}
Tools used: ${data.tools.map((t) => t.toolId).join(', ')}
Total monthly spend: $${data.tools.reduce((sum: number, t) => sum + t.monthlySpend, 0)}

Tone: Professional but friendly. Be honest that they're spending well. Don't invent savings.`;
  }

  return `You are an AI spend auditor. Write a short, punchy summary (max 100 words) for a team that can save money.

Potential monthly savings: $${data.totalMonthlySavings}
Annual savings: $${data.totalMonthlySavings * 12}

Top recommendations:
${data.recommendations.slice(0, 3).map((r, i: number) => 
  `${i + 1}. ${r.toolId}: ${r.reason.substring(0, 100)}`
).join('\n')}

Team size: ${data.teamSize} seats
Use case: ${data.useCase}

Tone: Urgent but helpful. Focus on the biggest savings opportunity. Mention specific dollar amounts. Be direct.`;
}

function generateFallbackSummary(data: SummaryRequest): string {
  const totalSpend = data.tools.reduce((sum: number, t) => sum + t.monthlySpend, 0);

  if (data.totalMonthlySavings === 0) {
    return `Your AI stack is already optimized! At ${data.tools.length} tool${data.tools.length !== 1 ? 's' : ''} and $${totalSpend}/month, you're spending efficiently. No immediate changes needed — keep monitoring as your team grows.`;
  }

  const topRec = data.recommendations[0];
  if (topRec) {
    return `We found $${data.totalMonthlySavings}/month in potential savings ($${data.totalMonthlySavings * 12}/year). Your biggest opportunity: ${topRec.toolId} — ${topRec.reason.substring(0, 120)}. ${data.totalMonthlySavings > 500 ? 'Contact Credex to lock in these savings with discounted credits.' : 'Implement these changes to optimize your AI spend.'}`;
  }

  return `Your audit shows $${data.totalMonthlySavings}/month in potential savings. Review the recommendations below to optimize your AI tool stack and reduce waste.`;
}