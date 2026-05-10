import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { supabase } from '@/lib/supabase';
import { AuditInput } from '@/types';

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 8);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: AuditInput = body;
    
    // Validate required fields
    if (!input.tools || !input.teamSize || !input.useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Run the audit engine
    const result = await runAudit(input);
    
    // Generate share token
    const shareToken = generateShareToken();
    
    // Save to Supabase (without email first)
    const { error: dbError } = await supabase
      .from('audits')
      .insert({
        id: result.id,
        share_token: shareToken,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        tools: input.tools,
        recommendations: result.recommendations,
        team_size: input.teamSize,
        use_case: input.useCase,
      });
    
    if (dbError) {
      console.error('Supabase error:', dbError);
      // Still return result even if save fails
    }
    
    return NextResponse.json({ 
      ...result, 
      shareToken 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}