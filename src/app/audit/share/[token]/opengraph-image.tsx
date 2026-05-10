import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET({ params }: { params: { token: string } }) {
  // Fetch audit data
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const response = await fetch(
    `${supabaseUrl}/rest/v1/audits?share_token=eq.${params.token}&select=total_monthly_savings`,
    {
      headers: {
        apikey: supabaseKey,
      },
    }
  );
  
  const data = await response.json();
  const savings = data[0]?.total_monthly_savings || 0;

  return new ImageResponse(
    (
      <div style={{
        fontSize: 60,
        background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}>
        {savings > 0 ? (
          <>
            <div style={{ fontSize: 80, marginBottom: 20 }}>💰</div>
            <div style={{ fontSize: 40, fontWeight: 'bold' }}>Save ${savings}/month</div>
            <div style={{ fontSize: 24, marginTop: 20 }}>on AI tools</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
            <div style={{ fontSize: 40, fontWeight: 'bold' }}>AI Stack Optimized</div>
          </>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}