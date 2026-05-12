
# StackAudit Project Reflection

## Question 1 — The hardest bug you hit this week

Honestly, the trickiest bug this week was that "useTheme must be used within a ThemeProvider" crash during SSR. It showed up right after I added the theme toggle to the header. My first guess was that ThemeProvider wasn't wrapping Layout correctly in `src/app/layout.tsx` — but I checked, and that wasn't it. Dug deeper and found the real culprit: my mount-guard logic (`if (!mounted) return <>{children}</>`) was meant to stop a FOUC, but it was spitting out raw children with no `Context.Provider` wrapper during the server pre-render phase.

So when header components tried to call `useTheme` during SSR, there was no context to find — instant crash. I tried `useLayoutEffect` to restore the theme earlier, but that doesn't run on the server and just created more React warnings. Eventually fixed it by making the provider always render `ThemeContext.Provider`, but hiding the UI with `visibility: hidden` tied to the `mounted` state. Keeps the context chain intact during SSR, and still blocks the FOUC on the client side. Definitely learned a lot about how tricky context gets in hybrid SSR/CSR setups like Next.js 16.

## Question 2 — A decision you reversed mid-week

The biggest reversal was actually the whole visual identity and copy direction. I started with a pretty standard "Modern SaaS" look — bright indigo gradients, heavily rounded corners, casual stuff like "Save money on your AI stack." But as I got deeper into building `audit-engine.ts`, I realized that didn't fit. You're asking startup teams to hand over sensitive spend data and team size. That requires a different kind of credibility.

So I scrapped it and went with what I called an "Institutional Audit System" feel instead. Moved to a 12-column grid, switched to Manrope for headlines and Work Sans for metadata, and rewrote the copy — "Intelligence System," "Capital Reclamation," that kind of language. Swapped standard shadows for tonal layering with tinted ambient shadows too. The pivot came down to one thing: if a CFO or engineering lead pulls up this tool and it looks like a weekend side project, they're not going to trust the numbers, no matter how accurate they are. The branding had to match the seriousness of what the tool is actually doing.

## Question 3 — What you'd build in week 2

Week 2 would be all about removing friction and adding staying power. The biggest pain point right now is that users have to manually look up seat counts and plan details across a bunch of different dashboards — nobody loves that. So first priority would be "Capital Connectors": direct API integrations with Stripe, AWS, and Google Cloud billing, so users can just authorize a read-only connection and get a fully populated audit with zero manual input.

On the growth side, I'd build an "Audit Integrity Badge" — a little embeddable widget startups can throw on their careers or engineering pages to show they run a lean AI stack. Basically turns every user into a distribution channel. And for retention, a "Spend Velocity Monitor" that watches your saved stack and fires off a "Reclaim Alert" whenever a cheaper alternative pops up or a model price drops. AI pricing moves fast, so that kind of proactive nudge is actually useful. Those three things cover onboarding friction, passive distribution, and ongoing retention — the core stuff that makes a SaaS utility actually stick.

## Question 4 — How you used AI tools

I was the primary agent here (Gemini), with Google Web Search for live data. AI was genuinely useful for speed tasks — generating boilerplate components, sketching out the CSS design system, writing initial test cases. But there were areas I didn't trust it. Pricing data in `PRICING_DATA.md` I researched manually, because LLMs are notoriously bad at keeping up with fast-moving SaaS tiers — they'll confidently give you numbers that are months out of date. Same with the financial calculations in the audit engine; I verified those by hand.

One concrete moment where the AI got it wrong: during the theme toggle, it suggested using a `useEffect` to pull theme state from `localStorage` on mount. That triggered a pretty nasty ESLint violation (`react-hooks/set-state-in-effect`) because it caused a cascading re-render right after the initial mount. Caught it through linting, refactored to use a single-state object with a deferred update via `setTimeout`. Worked fine after that. It's a good reminder — AI is great for getting structure down fast, but the fine-tuning and performance stuff still needs a human eye.

## Question 5 — Self-ratings 1–10

- **Discipline: 9/10** — Kept a solid pace the whole session, start to finish, no abandoned threads.
- **Code quality: 8/10** —  Typed + AI generated, clean architecture in the audit engine, all 10 unit tests passing, zero ESLint errors.
- **Design sense: 8/10** — Happy with how the "Institutional Finance" direction translated into the actual UI — the tonal layering and typography do the job.
- **Problem-solving: 8/10** — The SSR context crash and the client directive issues were both gnarly, but tracked them down and fixed them properly.
- **Entrepreneurial thinking: 7/10** — Caught early that trust was the real adoption bottleneck, and the mid-week pivot was the right call.