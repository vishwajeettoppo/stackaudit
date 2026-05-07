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
- Anthropic API access: console.anthropic.com showed $0 credits with no free tier available without adding a payment method. 
- Resolved by switching to Gemini 1.5 Flash via Google AI Studio (aistudio.google.com).
- Given "Anthropic preferred, or any LLM" — Gemini satisfies the requirement and has a free tier that covers the full project scope.

**What I learned:**
- Zustand is a lightweight React state management library — no boilerplate unlike Redux. Define state and actions in one function, use anywhere with useFormStore().
- The persist middleware auto-syncs state to localStorage, so form data survives page reloads with zero extra code.
- GitHub Actions CI runs automatically on every push to main. The workflow file in .github/workflows/ci.yml defines jobs — ours runs lint, typecheck, and tests in sequence on Ubuntu.