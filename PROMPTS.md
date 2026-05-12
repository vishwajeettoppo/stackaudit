
This document details the AI architecture and prompt engineering strategy for the StackAudit executive summary engine.

## 1. Verbatim Prompts

The following prompts are generated dynamically based on the audit results and sent to the `gemini-2.5-flash` model.

### Path A: Savings Identified (User Prompt)
```text
You are an AI spend auditor. Write a short, punchy summary (max 100 words) for a team that can save money.

Potential monthly savings: $[totalMonthlySavings]
Annual savings: $[totalAnnualSavings]

Top recommendations:
[List of top 3 tool-specific recommendations with reasons]

Team size: [teamSize] seats
Use case: [useCase]

Tone: Urgent but helpful. Focus on the biggest savings opportunity. Mention specific dollar amounts. Be direct.
```

### Path B: Optimized Stack (User Prompt)
```text
You are an AI spend auditor. Write a short, encouraging summary (max 100 words) for a team spending optimally on AI tools.

Team size: [teamSize] seats
Use case: [useCase]
Tools used: [list of tool names]
Total monthly spend: $[totalMonthlySpend]

Tone: Professional but friendly. Be honest that they're spending well. Don't invent savings.
```

## 2. Design Choices

### Persona: The AI Spend Auditor
I chose an "AI Spend Auditor" persona to establish immediate authority. This aligns with the "Institutional Grade" branding of StackAudit, moving away from a generic chatbot feel to a specialized financial tool.

### Constraints: 100 Word Maximum
In a dense dashboard environment, cognitive load is a primary concern. Constraining the model to 100 words ensures the "Executive Summary" remains an at-a-glance feature, forcing the model to prioritize the single most impactful finding.

### Input Structure: Processed Summary vs. Raw Data
I deliberately avoided passing the entire raw audit JSON. Instead, the prompt receives a "Processed Summary" (pre-calculated savings, top 3 filtered recommendations). This reduces token usage and prevents the model from having to perform its own data filtering.

### Dual-Tone Strategy
The prompt logic branches based on whether savings are found. 
- **Urgent/Direct:** Used when capital is being wasted, pushing the user toward action.
- **Friendly/Professional:** Used when the stack is optimized, reinforcing the user's good management and building trust.

## 3. Iteration: What didn't work

### Hallucinated Math
**Problem:** In early versions, I passed raw tool prices and let the model calculate totals. It frequently made basic arithmetic errors or hallucinated "hidden" savings that didn't exist.
**Fix:** Moved all financial calculations to the TypeScript `audit-engine.ts`. The model is now passed final numbers as "Certified Facts" and is strictly instructed not to invent its own figures.

### Generic "Best Practice" Advice
**Problem:** The model often produced generic tips like "Review your subscriptions monthly," which added no value to the specific audit.
**Fix:** Injected the top 3 concrete recommendations from the audit registry directly into the prompt. This forced the model to reference specific tools (e.g., "Switching from Copilot to Cursor...") rather than speaking in generalities.

### "Cold" Bullet Points
**Problem:** I initially requested a structured list, but the output felt like a duplicate of the registry table below it.
**Fix:** Switched to a "Narrative" format. The AI's value is in synthesis and tone, while the table's value is in data. A narrative summary feels more like a "consultant's voice" and justifies the AI's presence.

## 4. Fallback Strategy

To handle API failures or rate limits gracefully, StackAudit implements a **Templated Fallback Engine** (`generateFallbackSummary`):

- **Optimized Case:** Returns a string interpolating the total tool count and spend (e.g., *"Your AI stack is already optimized! At 4 tools and $120/month, you're spending efficiently..."*)
- **Savings Case:** Identifies the highest-value recommendation and constructs a direct summary (e.g., *"We found $40/month in potential savings. Your biggest opportunity: cursor — Switch from GitHub Copilot to Cursor..."*)

This ensures that the "AI Narrative Summary" card never displays an error or remains empty, maintaining the high-fidelity dashboard experience.
