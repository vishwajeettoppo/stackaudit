# Architecture Diagram

\```mermaid
graph TB
    subgraph Frontend
        A[Next.js App Router]
        B[Audit Form<br/>+ localStorage]
        C[Results Page<br/>+ Email Modal]
    end
    
    subgraph Backend
        D[API Routes]
        E[Audit Engine<br/>3 Rule Types]
        F[Gemini AI<br/>Summaries]
    end
    
    subgraph Database
        G[(Supabase<br/>Postgres)]
    end
    
    subgraph External
        H[Resend<br/>Email]
        I[Credex<br/>Referral]
    end
    
    A --> B
    B --> D
    D --> E
    D --> F
    D --> G
    C --> G
    G --> H
    C --> I
    
    style E fill:#f9f,stroke:#333,stroke-width:4px
    style F fill:#bbf,stroke:#333,stroke-width:2px
\```

## Stack Justification

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | Next.js 14 | API routes, OG tags, Vercel deploy |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Rapid UI development |
| State | Zustand + persist | Simple, localStorage built-in |
| Database | Supabase | Free tier, Postgres, easy setup |
| AI | Gemini 2.5 Flash | Free tier, fast, good enough |
| Email | Resend | Free transactional, React templates |
| Testing | Vitest | Fast, works with Next.js |

## Data Flow

1. User submits form → Zustand saves to localStorage
2. Form data POST to /api/audit
3. Audit engine runs 3 rule types
4. Result saved to Supabase with share_token
5. User views results with AI summary from Gemini
6. Email capture → Resend sends report
7. Share link generates OG image dynamically