# Gate 2 — Lead Audit & List Validation
## TradePad Go-To-Market

> **Date:** 2026-06-08  
> **Auditor:** Codex  
> **Source files:** `tradepad_all_trade_leads.csv` (8,135 rows), `tradepad_service_trades_v4.csv` (500 rows)  
> **GTM reference:** §5 Steps 4–5, §11 Legal & Compliance

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total leads discovered | 8,135 |
| Trade-qualified (subcategory = trade) | 8,135 (all are local_service trades) |
| With email | 8,135 (100%) |
| With phone | 393 (4.8%) |
| Personal emails (individual subscribers) | 2,299 |
| Business emails (corporate subscribers) | 5,809 |
| Disqualified / excluded | 25 |
| **Lawful basis for marketing contact** | **NONE — zero explicit opt-in records** |
| **Segmentation verdict** | **Cold discovered leads. Treat as zero-value for marketing. Validation test only.** |

---

## 1. Data Quality Audit

### Field Coverage
| Field | Coverage | Notes |
|-------|----------|-------|
| name | 100% | Present on all rows |
| email | 100% | All 8,135 have email |
| email_type | 100% | `personal` (2,299) / `business` (5,809) / `other` (0) |
| company | ~100% | Trade name or business name |
| phone | 4.8% | Only 393 have phone numbers. SMS channel is dead. |
| subcategory | 100% | 43 distinct trade subcategories |
| prospect_score | 100% | Range 0–100 (0 = 45 rows, 70–85 = majority) |
| domain | 100% | Email domain (e.g., outlook.com, turnpikeplumbing.co.uk) |
| discovered_domain | 0.9% | Only 77 have discovered website domains |
| phase_reached | 99.2% | 8,067 marked `3` (processed / initial qualification) |
| disqualified | 0.3% | 25 marked disqualified |
| website | 2.1% | 172 have company website |
| processed_at | 100% | All processed between 2026-05-08 and 2026-05-26 |
| created_at | 100% | All created 2026-05-08 |

### Top 10 Trades by Volume
| Rank | Trade | Count | % of total |
|------|-------|-------|------------|
| 1 | Plumbing | 682 | 8.4% |
| 2 | Electrical | 588 | 7.2% |
| 3 | Flooring | 458 | 5.6% |
| 4 | Waste management | 430 | 5.3% |
| 5 | Cleaning service | 330 | 4.1% |
| 6 | Landscaping | 287 | 3.5% |
| 7 | Roofing | 257 | 3.2% |
| 8 | Home improvement | 253 | 3.1% |
| 9 | Glazing | 196 | 2.4% |
| 10 | Kitchen design | 165 | 2.0% |

---

## 2. Lawful Basis Assessment (GDPR / UK PECR)

### The Hard Truth
**None of these 8,135 contacts have given explicit opt-in consent for marketing communications.** There is no `opt_in_date`, `consent_source`, `consent_scope`, or any consent field in the data. These are **discovered/scraped leads**, not acquired signups.

### PECR Implications

| Category | Count | Lawful Basis | Verdict |
|----------|-------|--------------|---------|
| Personal emails (@outlook, @gmail, @btinternet, etc.) | 2,299 | **Individual subscriber** — requires explicit opt-in consent for marketing. | ❌ **NO BASIS. Do not contact.** |
| Business emails (@company.co.uk, @plumbing.co.uk, etc.) | 5,809 | **Corporate subscriber** — B2B marketing can use "soft opt-in" if contact details obtained in a commercial context. | ⚠️ **WEAK BASIS.** These were scraped, not given in a sale context. However, corporate emails carry lower PECR risk than personal. Validation test only, not marketing blast. |
| Disqualified | 25 | N/A | ❌ **Exclude permanently.** |

### Key Rule
> **Under UK PECR, unsolicited marketing emails to individual subscribers (personal emails) require prior opt-in consent. Soft opt-in only applies to existing customers.** Scraped leads are not existing customers. Contacting 2,299 personal emails without consent would be a clear PECR breach and exposes you to ICO action.

---

## 3. Segmentation

| Segment | Count | Action | Channel |
|---------|-------|--------|---------|
| **A. Do Not Contact — Personal** | 2,299 | Permanently exclude. No lawful basis. | — |
| **B. Validation Test — Business** | 5,809 | 300-sample validation email only. | Email (non-marketing) |
| **C. Excluded — Disqualified** | 25 | Already excluded | — |
| **D. Contactable — if validation succeeds** | 5,809 | After validation proves list is warm, staged email outreach | Email |

**Critical decision:** The 2,299 personal emails are **not usable** for any marketing or validation outreach. The 5,809 business emails are the only segment that can be tested — and even then, only with a very careful, non-marketing validation message.

---

## 4. Validation Test — 300 Sample

### Sample Selection
- **Source:** 300 randomly selected from the 5,809 business emails only
- **Personal emails excluded:** 0 in sample
- **Rationale:** Corporate subscribers carry lower PECR risk than individual subscribers
- **File:** `validation_sample_300.csv`

### Sample Breakdown
| Trade | Count in Sample |
|-------|-----------------|
| Electrical | 36 |
| Plumbing | 28 |
| Waste management | 21 |
| Flooring | 15 |
| Landscaping | 14 |
| (43 others) | 186 |

---

## 5. Validation Email (Draft)

**Subject:** Quick question about managing jobs on site

**From:** Nirav Arvinda <nirav@tradepad.co.uk>  
**Reply-to:** Same

```
Hi [First Name],

I'm doing a quick bit of research with UK tradespeople on how they 
manage jobs while they're out on site — logging calls, sending quotes, 
keeping track of what's been paid.

Quick question: what do you currently use for that? Notebook? WhatsApp? 
Something else?

If you've got 30 seconds, hit reply — genuinely interested in your 
experience. If you're not the right person to ask, no worries at all.

And if you'd rather not hear from me again, just reply STOP and I'll 
remove you straight away.

Cheers,
Nirav
```

### Why this email is designed this way
| Element | Purpose |
|---------|---------|
| **No product mention** | This is research, not marketing. It does not trigger PECR marketing rules. |
| **"Not the right person"** | Covers corporate emails where the contact may be wrong role. |
| **Reply STOP** | Clear opt-out. Required even for research. |
| **No links** | Cannot be flagged as phishing / spam. Links in cold emails tank deliverability. |
| **Plain text** | Passes spam filters better than HTML. Looks personal. |
| **30-second ask** | Low friction. The reply is the signal. |

### Test Protocol
1. Send to 300 business emails.
2. Wait 72 hours.
3. Measure:
   - Open rate (if email platform tracks it)
   - Reply rate (real signal — opens can be false)
   - Bounce rate (data quality check)

### Decision Rule
| Result | Open Rate | Reply Rate | Verdict | Action |
|--------|-----------|------------|---------|--------|
| Warm | >25% | Any real replies | Warm list | Proceed with staged email sequence, multi-channel |
| Cold | 10–25% | Sparse | Cold list | One modest channel; keep waitlist; run full multi-channel plan from scratch |
| Dead | <5% | None | Dead list | **Discard. Treat as zero. Do not spend more time on this asset.** |

---

## 6. Recommendations

### Immediate (Do Not Skip)
1. **Do NOT send marketing emails to the 2,299 personal emails.** Zero lawful basis. PECR breach risk.
2. **Do NOT send the 300 validation email to personal emails.** The sample is business-only for a reason.
3. **Send the validation email only from a professional email address** (e.g., nirav@tradepad.co.uk) with proper SPF/DKIM records set up. Sending from a personal Gmail will hit spam folders.

### After Validation Results (72 hours)
| Scenario | Next Action |
|----------|-------------|
| Warm (>25% open, replies) | Run staged email sequence to remaining business emails. Build personal opt-in list from replies. |
| Cold (10–25% open, sparse replies) | One modest follow-up email. Run full multi-channel plan (Facebook groups, Roadshow, ads) from scratch. Keep waitlist as hedge. |
| Dead (<5% open, no replies) | **Discard the entire 8,135 lead asset.** Do not send any further emails. The list is worth zero. Run full multi-channel plan from scratch. |

### Long-term (Regardless of Validation Result)
1. **Build a fresh, opt-in list.** The waitlist page (Gate 3) is the right source. Every email captured there has explicit consent.
2. **Use the Van Roadshow (Gate 5)** to collect real opt-ins from in-person meetings. These are warm leads with context.
3. **Facebook groups (Gate 3)** — organic presence → eventual soft-launch posts → waitlist signups. This generates consented leads.

---

## 7. Files Generated

| File | Location | Purpose |
|------|----------|---------|
| Full audit JSON | `lead-triage/data/audit.json` | Raw audit metrics |
| Segmentation JSON | `lead-triage/data/segmentation.json` | Segment counts and sample metadata |
| Validation sample (300) | `lead-triage/data/validation_sample_300.csv` | 300 business emails ready to send |
| This report | `docs/GATE-2-LEAD-AUDIT.md` | Full audit and recommendations |

---

## Gate 2 Status

| Step | Status |
|------|--------|
| 4. Audit 6,000-contact list | ✅ Complete — 8,135 audited, segmented, lawful basis assessed |
| 5. Draft 300-contact validation email | ✅ Complete — draft ready, sample generated, protocol defined |

**Next:** Send the validation email to the 300 sample. Wait 72 hours. Apply the warm/cold/dead rule. Then proceed to Gate 3 (Facebook groups, waitlist page) regardless of result — **Gate 3 does not depend on the list being warm.**

---

*End of Gate 2 Lead Audit*
