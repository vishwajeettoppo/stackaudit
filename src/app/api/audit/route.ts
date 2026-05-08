import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit-engine';
import { AuditInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: AuditInput = body;
    
    // Validate required fields
    if (!input.tools || !input.teamSize || !input.useCase) {
      return NextResponse.json(
        { error: 'Missing required fields: tools, teamSize, or useCase' },
        { status: 400 }
      );
    }
    
    // Run the audit engine
    const result = await runAudit(input);
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}