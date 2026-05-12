# Interviews

## Pritesh Yadav (HCL Technologies)
**Date:** May 8, 2026

Pritesh is managing a crew of about 12-15 people. They’re running ChatGPT Team ($30/seat) and GitHub Copilot, plus a fair amount of Claude API usage for some internal projects they're spinning up.

* **What's happening:** He admitted he has basically zero clue if they're overpaying. He just signs off on whatever the devs ask for because he doesn't want to be the bottleneck.
* **The "Aha" Moment:** We found two designers on his team who have Copilot seats "just in case" but haven't touched code in months. That’s a $40/month leak they didn't even notice.
* **The Reality Check:** He told me: *"Look, I’m not gonna swap the whole team's workflow to save 20 bucks. It’s not worth the Slack messages. But if you show me a way to cut $200+ of dead weight without changing how we work, I'm in."*
* **Product Change:** Adding a **$20 minimum threshold** for team recommendations. I'm also prioritizing seat-level activity tracking over just "total bill" summaries.

---

## Saad Waris (Java Dev @ Hyand)
**Date:** May 10, 2026

Saad is a heavy-lifter in the Java/Spring Boot world. Personally, he’s shelling out for ChatGPT Pro, Cursor Pro, and Midjourney for some side projects. Total is around $70/mo.

* **What's happening:** He’s got "subscription debt." He tried out Copilot, moved to Cursor because it’s better for his Angular work, but realized he’s still being billed for both.
* **The "Aha" Moment:** He's paying $70/month but doesn't actually know which tool is saving him time vs. which one he just forgot to cancel.
* **The Reality Check:** He wants an automated "Cancel this now" alert if he hasn't touched a tool in 30 days.
* **Product Change:** Implementing **Duplicate Tool Detection**. If the engine sees a user paying for two tools in the same category (like Cursor + Copilot), it flags it as a "Forgotten Sub." Dropping the alert threshold to $10 for individual accounts.

---

## Anand Bhaskar (Test Automation @ SEDEMAC)
**Date:** May 11, 2026

Anand is in charge of automation. His team is on Copilot Enterprise ($39/seat) because their legal/security team insisted on it for the "Enterprise features."

* **What's happening:** Total disconnect between the VP of Engineering and the actual devs. They pay for 15 seats, but Anand knows only about 8 guys use it daily. The rest use it once a week at most.
* **The "Aha" Moment:** He can't just go to his boss and say "I think we're wasting money." He needs a "paper trail" to back him up.
* **The Reality Check:** If StackAudit can spit out a PDF that says *"You're losing $5k a year on unused seats,"* he can actually get the downgrade or seat-reassignment approved.
* **Product Change:** Adding a **"Boss-Ready" PDF Export** and showing **Annualized Savings**. Annual numbers (e.g., $4,800/yr) hit way harder than monthly numbers ($400/mo) when talking to finance.

---

## Final Synthesis: What I'm Building Now

| Feedback Pattern | The Fix in StackAudit |
| :--- | :--- |
| **No Spend Visibility** | One-click "Integration Scan" (Stripe/Gmail) to build the first map. |
| **Dead Weight Seats** | Utilization logic: Flag seats with 0 activity in 14+ days. |
| **Forgotten Subs** | "Twin Tool" alert (e.g., paying for Jasper AND ChatGPT). |
| **Need ROI Proof** | PDF Export for "The Boss" + Annual Savings projections. |
| **Migration Friction** | High-threshold alerts ($20+ for teams) so we only flag "worth it" moves. |