## Day 1 — 2026-05-07

**What I did:**
- Initialized Next.js 16 + TypeScript project with Tailwind CSS 4
- Set up GitHub repo and Actions CI pipeline (`ci.yml`)
- Created all required .md files at repo root.
- Researched and documented current pricing for all 8 required tools in `PRICING_DATA.md`
- Defined core TypeScript types for the audit domain in `src/types/index.ts`

- Built landing page with StackAudit branding and hero section
- Built Zustand store with localStorage persistence for form state
- Built ToolCard, ToolSelector, and AuditForm components
- Form validates that every added tool has a plan selected


**What I got stuck on:**
- *Anthropic API access*: console.anthropic.com showed $0 credits with no free tier available without adding a payment method. 
- Resolved by switching to Gemini 1.5 Flash via Google AI Studio (aistudio.google.com).
- Given "Anthropic preferred, or any LLM" — Gemini satisfies the requirement and has a free tier that covers the full project scope.

**What I learned:**
- Zustand is a lightweight React state management library — no boilerplate unlike Redux. Define state and actions in one function, use anywhere with useFormStore().
- The persist middleware auto-syncs state to localStorage, so form data survives page reloads with zero extra code.
- GitHub Actions CI runs automatically on every push to main. The workflow file in .github/workflows/ci.yml defines jobs — ours runs lint, typecheck, and tests in sequence on Ubuntu.

## Day 2 — 2026-05-08

**What I did:**
- Created the brain of the app - audit engine that finds savings opportunities
- Added 3 types of checks:
  - Same tool downgrade (paying too much on current tool)
  - Switch to cheaper competitor (e.g., Copilot → Cursor)
  - Buy discounted credits through Credex (for heavy API users)
- Wrote 10 tests to make sure calculations are correct
- Documented all pricing with links and conditions (e.g., Claude Team needs 5+ people)
- Form submission → API route → Audit engine → Results page
- Basic preview page - Displays savings and recommendations
- Added `monthlySpend > 0` validation (was missing before)


**Problems I ran into:**
- *Suggesting useless switches* - Engine told Copilot users paying $10 to switch to Cursor for $0 savings. Fixed by only suggesting switches that save at least $20 (individual) or $50 (team).
- *Missing team requirements* - Tried to downgrade 5-person Claude Team ($125) to Pro ($100) but Pro is for individuals only. Fixed by checking minimum seats before suggesting plans.

**API tools broke logic** - Anthropic API is pay-as-you-go, not per person like subscriptions. Added special handling for API tools.

**How I fixed them:**
- Added savings thresholds to filter out bad suggestions
- Added `minSeats` check before recommending any plan
- Created separate logic for API vs subscription tools

## Day 3 — 2026-05-09

**What I did:**
- Solved lint errors
- Integrated Google Gemini API for AI-powered summaries (free tier)
- Built complete results page with:
  - Hero savings number (monthly + annual)
  - Per-tool breakdown cards
  - AI summary section with loading states
- Added fallback summaries when Gemini API fails
- Implemented print/PDF export functionality

## Day 4 — 2026-05-10

**What I did:**
- Set up Supabase database for storing audit results
- Created email capture modal
- Integrated Resend for emails
- Built HTML email template with audit summary
- Added shareable URLs with unique tokens
- Built shared audit view page

**What worked:**
- Emails delivered within 2-3 seconds
- Share links preserve all audit data