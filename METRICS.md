# StackAudit Metrics Dashboard

## 1. The North Star Metric
**Total Annualized Savings Uncovered (TASU)**
* **Definition:** The sum of all unique savings identified across the platform, projected annually.
* **Target:** $1.2M by Month 3 (Equivalent to $100k/mo).
* **Why:** This is the "Marketing Number." It proves the platform's aggregate value to the ecosystem.

---

## 2. Growth & Virality (The Engine)

| Metric | Formula | Current | Target |
| :--- | :--- | :--- | :--- |
| **Audit Completion** | `(Reports Viewed) / (Integration Starts)` | 35% | **50%** |
| **Email Capture** | `(Opt-ins) / (Audits with >$0 Savings)` | 18% | **30%** |
| **Viral Coefficient (K)** | `(Shares × Conv. Rate to New Audit)` | 0.05 | **0.30** |
| **The "Flex" Rate** | `(Social Shares) / (Audits with >$500 Savings)` | 5% | **20%** |

---

## 3. Product Activation (The "Aha!" Moment)

### High-Value Activation Rate
* **Formula:** `(Audits showing >$100/mo savings) / (Total Audits)`
* **Goal:** 30%
* **Action:** If this drops, the scraping/audit logic needs an update to detect new AI pricing tiers or "hidden" seat costs.

### Integration Stickiness
* **Metric:** Average integrations per user.
* **Target:** 2.5 (e.g., Stripe + Gmail + SSO).
* **Logic:** The more "data pipes" connected, the higher the switching cost for the Pro plan.

---

## 4. Business & Conversion (Pro Tier)

### Trial-to-Paid Conversion
* **Formula:** `(Pro Subscriptions) / (Free Audits with >$100 Savings)`
* **Target:** 10%
* **Strategy:** Automated email sequence: "We found $X for you. Upgrade to Pro to keep these savings from creeping back."

---

## 5. System Health & Infrastructure

### Data Freshness Index
* **Metric:** Average age of "AI Model Pricing" data in the database.
* **Threshold:** < 24 hours.
* **Status:** Daily verification active.

### Gemini API Reliability
* **Current:** 95% (Affected by Rate Limits).
* **Target:** 99.9%.
* **Remediation:** Implement exponential backoff + fallback to a "Lite" heuristic model when Gemini limits are reached.

### Audit Accuracy (Precision/Recall)
* **Metric:** False Positive Rate (FPR).
* **Target:** < 2%.
* **Validation:** Weekly manual spot-checks of 10 random reports.

---

## 6. Retention (The "Guardian" Effect)

### "Zombie" Alert Response
* **Metric:** `% of 'New Unused Seat' alerts resulting in a seat cancellation.`
* **Target:** 60%
* **Why:** This proves the Pro plan ($49/mo) provides active ROI.