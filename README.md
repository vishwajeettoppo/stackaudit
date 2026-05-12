# StackAudit — Institutional AI Spend Intelligence

![StackAudit Home](/public/image1.png)

> **Know exactly what your AI stack is costing you.** StackAudit is a high-fidelity intelligence system engineered to identify redundant AI subscriptions, optimize seat usage, and reclaim capital for modern engineering organizations.

---

## 🏛️ The Institutional Grade Standard

StackAudit moves beyond simple calculators. It is a professional auditing environment built on three core pillars:

1.  **Algorithmic Precision:** Hardcoded financial logic ensures zero-hallucination math, while the Gemini 2.5 Flash API provides a narrative executive summary of your stack's health.
2.  **Trust-First Architecture:** A "Zero-Knowledge" client-side processing model ensures your sensitive spend data never leaves your browser until you choose to save it.
3.  **Multi-Path Recommendations:** The system identifies direct overpayments, low-friction plan downgrades, and high-value tool migrations (e.g., GitHub Copilot → Cursor).

## ✨ Key Features

-   **High-Fidelity Dashboard:** A structured 12-column grid layout utilizing **Tonal Layering** and precision elevation.
-   **AI Narrative Summary:** Context-aware intelligence reports that synthesize dense data into actionable executive insights.
-   **Certified Registry:** A component-level breakdown of your entire infrastructure with "Verified" efficiency badges.
-   **Dynamic Theming:** Seamless transition between **Institutional Light** and **Deep Space Dark** modes.
-   **Collaborative Reporting:** Instant shareable links and PDF exportation for cross-departmental reviews.
-   **Email Fulfillment:** Automated audit delivery via the Resend API with personalized optimization tips.

![Results Dashboard](/public/image2.png)

## 🛠️ Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Database:** [Supabase](https://supabase.com/)
-   **AI Engine:** [Google Gemini 2.5 Flash](https://ai.google.dev/)
-   **Email:** [Resend](https://resend.com/)
-   **Testing:** [Vitest](https://vitest.dev/)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/vishwajeettoppo/stackaudit.git
cd stackaudit
npm install
```

### 2. Environment Configuration
Create a `.env.local` file and populate the following:
```env
# AI & Email
GEMINI_API_KEY="your_gemini_key"
RESEND_API_KEY="your_resend_key"
NEXT_PUBLIC_DEV_EMAIL="your_verified_email@example.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
```

### 3. Run Development Server
```bash
npm run dev
```

## 🧪 Quality Assurance

StackAudit maintains a strict quality threshold. You can verify the system integrity using:

-   **Unit Tests:** `npm run test` (10/10 core engine tests passing)
-   **Linting:** `npm run lint` (Zero errors/warnings)
-   **Type Safety:** `npx tsc --noEmit`

## 📂 Documentation

Detailed documentation on project methodology:
-   [**ARCHITECTURE.md**](./ARCHITECTURE.md) — System design and data flow.
-   [**PROMPTS.md**](./PROMPTS.md) — AI strategy and prompt engineering.
-   [**TESTS.md**](./TESTS.md) — Automated testing coverage.
-   [**REFLECTION.md**](./REFLECTION.md) — Technical challenges and reversals.

---

Built for the future of AI Engineering by **StackAudit**. Powered by [Credex](https://credex.rocks).
