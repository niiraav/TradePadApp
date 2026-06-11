# TradePad — Go-To-Market Strategy
## Version 1.2 — Pre-Launch Planning

> **What changed from v1.1 → v1.2**
> - **Math fix:** annual saving corrected to 27% (was 26%).
> - **Social proof is now dynamic:** landing page copy scales with user count; static "500+" placeholder removed — shipping a lie destroys trust.
> - **Facebook group sequencing fixed:** credibility-first (join, answer, establish presence) before any mention of TradePad.
> - **Value triggers are Month 1-realistic:** aspirational triggers (payment speed, invoice-chasing data) replaced with ones that work on Day 1.
> - **WhatsApp dependency added to §13 risks** with a fallback mitigation.
> - **"3 taps" claim made a pre-launch gate** alongside funnel instrumentation — it's a marketing promise that must be verified before it ships.
> - **Pro + Payments deprioritised** from launch docs; removed from §4 future tiers pending PMF.
> - **List validation thresholds sharpened:** <5% open rate = dead list (discard, don't spend time on it).
> - **Offline caveat rejected:** pre-emptive "MVP requires sync" footnote on the competitive moat would do more brand damage than any rare sync failure. Build it right; claim it cleanly.
> - **Day 0–7 journey and Trust & Safety noted as PRD scope**, not absorbed here.
>
> *Previous changes (v1.0 → v1.1) summarised in the version history at the end.*

---

## 1. The Opportunity

### Market Context
The UK has approximately **2 million sole-trader tradespeople** (plumbers, electricians, builders, gas engineers). The vast majority run their business from a phone and a notebook. Admin is their biggest pain point — not finding work.

Existing job management software (Jobber, Tradify, BigChange) targets teams and small businesses. Their pricing, complexity, and onboarding assume you have a few employees. A sole trader using them is paying for features they'll never touch, navigating screens built for dispatchers, and still getting charged £30–150/month.

**TradePad's opening:** build the first job management app genuinely designed for one person working alone — from the ground up.

> **Positioning guardrail (read before adding features):** TradePad is the *anti-overkill* tool. The wedge is "admin is the pain, *not* finding work." Any feature that turns us into a lead-generation or marketplace product (e.g. a jobs board) breaks this thesis and is out of scope until after product-market fit. See §12.

---

## 2. Competitive Landscape

| Product | Sole Trader Price | Free Tier | Offline | UK-native | Key Weakness |
|---|---|---|---|---|---|
| **Jobber** | £31–149/mo | No (14-day trial) | No | No (Canadian) | Expensive, complex, overkill for 1 person |
| **Tradify** | £19/mo | No (14-day trial) | ❌ Requires signal | No (NZ-built) | Breaks underground/rural, no free entry |
| **ServiceM8** | Free (5 jobs/mo) | ✅ Limited | No | No (Australian) | Job cap is frustrating, desktop-heavy UI |
| **BigChange** | £80–100/mo | No | No | Partial | Enterprise pricing, way too complex |
| **Paper/WhatsApp** | £0 | ✅ | ✅ | — | Dave forgets to invoice, loses quotes |

### TradePad's Whitespace
- The only app **built exclusively for UK sole traders** (not teams)
- The only app that works **offline-first** (van, basement, no signal on site)
- The only app that passes the **"dirty hands test"** — usable one-handed with gloves
- Positioned between "free chaos" (WhatsApp + paper) and "expensive overkill" (Tradify/Jobber)

**Note on the real competitor:** Dave's default is not a rival app — it's **£0 paper and WhatsApp**. This matters for the free tier (§4): too-tight a free tier pushes him *back to paper*, not up to Pro.

---

## 3. Positioning

### Single Positioning Statement
> **TradePad is the job app built for working alone.** Send quotes, track jobs, and get paid — without stopping work to do admin.

### Hero Line
> **"Built for the job site. Not the office."**

This is the strongest asset and it leads everything — the landing page, the ads, the app store copy.

### Supporting Taglines (test these)
- *"3 taps. Anywhere. Even in a basement with no signal."*
- *"Your notebook. Sorted."*
- *"Quote it. Track it. Get paid."*
- *"Admin done before the kettle boils."*

**Note on "3 taps":** this is a promise, not a fact yet. It must be verified via tap-count audit before it goes on any public-facing surface. See §5, Step 0b.

### Tone of Voice
- Direct, no jargon
- Respects Dave's time — every sentence earns its place
- Never corporate. Never startup-bro.
- Speaks like a trusted mate who happens to be good with software

---

## 4. Pricing Strategy

### Recommended Model: Freemium with a Low Paid Tier

| Tier | Price | Limits | Rationale |
|---|---|---|---|
| **Free** | £0 | 5 active jobs/month · **first 2–3 quotes unmetered, then capped** | Build the habit (job logging), taste the aha (quotes), feel the wall on the repeat. |
| **Pro** | **£9/month** | Unlimited jobs, unlimited quotes, **your own logo on quotes** | Undercuts Tradify (£19) by more than half. Below psychological £10 barrier. |

**The gating principle: gate the repeat, not the first taste.**
The quote is the aha moment *and* the activation moment. Rationing it too early suppresses activation, not just conversion. A brand-new user gets their first few quotes frictionless — fast path to "this makes me look professional" — and the cap only bites *after* the behaviour is established. Never gate the habit you're trying to start; only the one you've already created.

**Why £9 works:**
- Tradify is £19/mo and the cheapest serious competitor
- £9 is "less than a takeaway" — Dave's framing, not subscription dread
- Annual option: £79/year (saves ~27%) — improves LTV and reduces churn
- No per-user pricing — Dave doesn't have users

**Why freemium (not just a trial):**
- Tradespeople are sceptical of software (they've been burned before)
- They need to build a habit before paying
- Removes the "I'll try it later" delay — they start today

### Conversion trigger: dual, not just the cap
A volume cap only converts the busy. Many sole traders may never hit 5 jobs in a slow month — the cap alone can't convert your marginal users. Pair it with **value framing that works on Day 1**:

- **Volume trigger:** hit the wall when busy → "Unlimited jobs for £9."
- **Value trigger (for the quiet) — Month 1-realistic:**
  - "Your quotes say *Powered by TradePad*. Add your own logo — £9/mo."
  - "Get unlimited quotes sent."
  - "Priority support — speak to a human within 4 hours."

*Avoid aspirational triggers until you have the data to back them: "you got paid 4 days faster" and "you've got £600 un-chased" are Phase 2 copy — they require usage history you won't have at launch.*

Volume converts the busy; value framing converts the quiet.

### "Powered by TradePad" branding — validate with the Roadshow
Free tier quotes carry a subtle "Powered by TradePad" footer. Removing it / adding Dave's own logo is a **Pro perk**. This doubles as a viral signal and an upsell trigger — but it cuts both ways. During the Van Roadshow (§5), test this directly:
- If 3/5 Daves say "I'd pay to remove that" → it's working as a perk.
- If 4/5 say "I'd never send that to a customer" → remove the branding from Free entirely; the liability outweighs the benefit.

Do not assume. Decide with data from the Roadshow.

### Future Tiers (Phase 2+, post-PMF only)
- **Pro + Accountant Export** (HMRC, CIS) — £19/mo
- *Payment integration (Stripe/Open Banking) is deprioritised until core PMF is established. It is a different product with a significant support and compliance burden. Revisit only after the admin tool has proven retention.*

---

## 5. Go-To-Market Channels

### Phase 0 — Validate Before You Spend (Now, while building)

**Goal: measure the funnel and the asset before pouring anything into either.**

The existing lead database (~6,000 contacts) is an **unverified asset**, not a warm list. Final yield = `list_quality × activation × conversion`, and all three are currently unmeasured. You get **one first impression per lead** — burning a list into an un-instrumented funnel is the most expensive mistake available. In order:

#### Step 0a — Instrument the funnel
Wire up the five funnel events before launch:
1. Sign up
2. **Log first job** (usability checkpoint)
3. **Send first quote** (the aha moment)
4. First job marked paid (habit formation)
5. Hit cap / upgrade (conversion)

**Activation metric:** *first quote sent by the time of the user's next job* — **not** a fixed calendar window. Job flow is lumpy and seasonal; a quiet fortnight is not a failed activation. Measure against the next job, not the clock. (See §9.)

#### Step 0b — Usability test + tap-count audit
Watch 5 personal contacts use it cold. **Scope: usability only** — can they find the `+`? Do they understand "quote"? Can they log a job in 10 seconds?

*Caveat:* friends are nicer, more tech-comfortable, and observed (Hawthorne effect) — this de-risks "can a human do it," **not** "will Dave bother unwatched."

**Tap-count audit (pre-launch gate):** count the actual taps for each core flow:
- Log missed call: target ≤3 taps
- Build and send a quote: target ≤5 taps
- Mark a job paid: target ≤3 taps

If any flow exceeds target, fix it before the "3 taps" claim goes on any public surface. This is a marketing promise — ship it as a lie and it makes the product feel broken.

#### Step 0c — Validate the list (small sample, legal channel only)
Establish the **lawful basis** for each contact first (opt-in date, source, consent scope; segment into email-OK / SMS-OK / do-not-contact). Then send a **plain email with a clear opt-out** to a **300-contact random sample**:
- Open >25% + real replies → **warm.** Lean in (legally), staged sequence.
- Open 10–25%, sparse replies → **cold.** One modest channel; keep the waitlist; run full multi-channel plan.
- Open <5%, no replies → **dead.** Discard. Don't spend further time on this asset; treat it as zero and run the full multi-channel plan from scratch.

#### Step 0d — Waitlist (kept as a hedge, not deleted)
- Single page: hero line, 3 benefit bullets, email capture, "Get early access"
- Offer: "First 100 users get 3 months free"
- Costs nothing; fallback if the list underperforms.

#### Step 0e — Content seeding
Join target Facebook groups. **Do not post about TradePad yet.** Spend 2–4 weeks answering genuine questions about invoicing, missed calls, chasing payment — build a presence and credibility first. Only mention TradePad once you're a recognised voice in the thread, not a stranger.

---

### Phase 1 — Launch (Month 1–2)

#### Channel 1: Facebook Groups (Highest ROI, £0 cost)
Where Dave lives. UK tradespeople are far more active here than LinkedIn/Reddit/Twitter.

**Target groups:** "UK Plumbers Forum" (100k+), "UK Electricians" (80k+), "Builders UK" + regional variants, local trades groups, Checkatrade Community, MyBuilder community.

**Sequence — do not skip steps:**
1. Join groups. Read for a week.
2. Answer questions with no agenda. Establish presence.
3. Post a genuine "I built this because I kept seeing this problem" origin story — only after credibility is established.
4. Share a 30-second screen recording of a quote sent in under a minute.
5. Offer free Pro for 6 months to first 50 who try it and give feedback.
6. Answer every "how do you manage invoicing?" thread genuinely, then mention the app.

**Never run ads inside groups** — gets you banned. Organic only.

#### Channel 2: The Van Roadshow (highest-signal activation tool)
Visit ~20 tradespeople in person; watch them use the app in *their* context; iterate live.
- **Primary purpose:** activation debugging — see where real users stall, in the van and the kitchen, as close to unobserved as possible.
- **Secondary purpose:** real testimonials and case studies (no invented placeholders on the landing page).
- **Test the "Powered by TradePad" branding decision here** (§4).
- Cost: ~£500 fuel + time. Value: the truest pre-PMF signal available.
- *Caveat:* you're still watching — discount for the observer effect; cleanest activation read is unwatched cohort data once people are live.

#### Channel 3: Facebook & Instagram Ads (paid, low budget to start)
**Budget:** £10/day to start. Scale what works; kill what doesn't (see §13 failed-launch contingency).
**Format:** 15–30s video, no voiceover, captions only (Dave watches with sound off).

**Ad concepts (led by the dirty-hands hero):**
1. **Dirty hands:** gloved hand using the app one-handed. *"3 taps. Anywhere. Even with no signal."*
2. **Speed demo:** "Quote sent in 47 seconds" — timelapse build → send via WhatsApp. *"Stop the van. Send the quote. Before you start the engine."*
3. **Professional comparison:** TradePad WhatsApp quote vs. a messy text. *"This customer chose me because my quote looked professional."*
4. **Missed call:** phone rings → voicemail → never returned. *"Sound familiar?"* → log-missed-call flow.
5. **Price:** *"Tradify is £19/month. TradePad is £9."*

**Targeting:** UK only · interests: Plumbing, Electrical, Building & construction, Self-employed, Checkatrade, MyBuilder · age 25–55 · **mobile only**.
**CTA:** "Try free" → landing page → sign up (no card).

#### Channel 4: Google Search (Phase 1 end / Phase 2)
High-intent keywords: "job management app for tradesmen uk", "send quotes from phone tradesman", "invoice app sole trader plumber", "tradify alternative", "jobber alternative uk sole trader", "free tradesman app uk".
**SEO content:** keyword landing pages, comparison pages (vs Tradify, vs Jobber), problem-focused blog posts.

#### Channel 5: YouTube Shorts & TikTok (organic, compounding)
"Watch me send a quote in under a minute" · "How I log a missed call before I start the van" · "Why I stopped using WhatsApp for quotes."

#### Channel 6: Word of Mouth + Viral Loop (the big one)
Word of mouth out-converts any paid channel for trade software. Engineer it:
- **Branded quotes, on by default:** free-tier quotes carry a subtle "Powered by TradePad." Removal + own logo is a **Pro perk** — viral surface doubles as an upgrade trigger. *Validate this decision with the Roadshow (§4) before shipping.*
- **In-app share prompt** after first paid job: "Know another tradesperson still using WhatsApp for quotes? Send them a link."
- **Referral mechanic (Phase 2):** "Give a mate 1 month free, get 1 month free."

---

### Phase 2 — Growth (Month 3–6)
- **App Store listing** (once PWA is proven, evaluate native wrapper)
- **Checkatrade / MyBuilder partnership** — get listed as a recommended tool *(this is exactly why we never scrape them — see §12)*
- **Accountant/bookkeeper referrals** — when Dave's accountant recommends software, Dave listens; consider sending free Pro accounts to 50 accountants as a seeding play
- **Trades associations** (NICEIC, Gas Safe, FMB) — get listed in recommended tools
- **Affiliate/influencer** — UK trades YouTube channels (50k–200k subs) — commission per signup
- **Partner co-marketing (explore, don't assume):** merchant/business banks (Starling, Monzo Business, Tide) and tool suppliers (Screwfix, Toolstation) already market to sole traders. Pursue only with their consented audiences — no list swaps that breach §11.

---

## 6. Website Strategy

### Single Landing Page for Launch
**URL:** tradepad.app (or tradepad.co.uk for UK trust signal). **Mobile-first, critically** — Dave reads this on his phone between jobs.

### Page Structure

#### Section 1: Hero
```
[Headline — large, bold]
"Built for the job site. Not the office."

[Subheadline]
"TradePad helps UK tradespeople send quotes, track jobs,
and get paid — without stopping work to do admin."

[CTA button — full width on mobile]
"Start free — no card needed"

[Social proof line — DYNAMIC, scaled to real user count]
  0–50 users:   "Join the first UK tradespeople to try TradePad"
  50–200 users: "Join 50+ tradespeople using TradePad"
  200–500:      "Join 200+ tradespeople using TradePad"
  500+:         "Join 500+ tradespeople using TradePad"

[App screenshot or short video — shows quote being sent]
```
**Never ship a static number you haven't earned.** If Dave checks and it's wrong, you've lost him.

**Design notes:** white/near-white background · high-contrast CTA · real phone mockup, not stock photos of a smiling man in a hard hat.

#### Section 2: The Problem (make Dave nod)
```
📞  "Missed a call. Lost the job."
     You were on site. They called. You forgot to call back.

📄  "Sent the quote. Never followed up."
     WhatsApp threads pile up. Quotes go cold.

💸  "Job's done. Still waiting to get paid."
     You marked it done. The invoice didn't go out until Friday.
```

#### Section 3: The Dirty Hands Promise
```
[Callout block — contrasting background]

"Built for the job site, not the office."

TradePad is designed to be used one-handed, with gloves on,
standing in a customer's kitchen. No menus. No learning curve.
If it takes more than 3 taps, we didn't build it right.
And it works with no signal — your changes save and sync later.
```

#### Section 4: How It Works (3 steps)
```
[1] Log it in 10 seconds — missed call comes in, log it before you start the van.
[2] Send the quote before you leave the driveway — built on your phone, sent via WhatsApp/SMS in under a minute.
[3] Get paid without chasing — mark the job done; TradePad tracks what's paid and nudges overdue.
```

#### Section 5: Social Proof
```
[3 testimonial cards — REAL users from the Van Roadshow, photo, name, trade]
```
Do not ship this section until the Van Roadshow has run. An empty section is better than an invented one.

#### Section 6: Pricing
```
FREE — 5 jobs/month · first quotes free · all core features · no card
PRO — £9/month · unlimited jobs & quotes · your own logo on quotes · priority support
[Annual: "£79/year — save 27%"]
```

#### Section 7: Competitor Comparison
```
                    TradePad    Tradify    Jobber
Works offline          ✅          ❌         ❌
Built for sole traders ✅          ❌         ❌
UK-native              ✅          ❌         ❌
Price (1 person)       £9/mo      £19/mo    £31/mo
Free to start          ✅          ❌         ❌
```

#### Section 8: FAQ
- "On the App Store?" → It's a web app — add to home screen from any browser. No download needed.
- "Work without internet?" → Yes. Changes save to your phone and sync when you're back online.
- "Is my data safe?" → Stored securely **in the UK**. You own your data, always.
- "Can I export my data?" → Yes. Your jobs and quotes are yours — export any time.
- "Cancel anytime?" → Yes, no contracts, no questions.

#### Footer CTA
```
"Still running your business from WhatsApp and paper?"
"You're losing money every week. It takes 2 minutes to get started."
[Button: "Try TradePad free"]
```

---

## 7. Marketing Materials Needed

### Immediate (Pre-launch)
- [ ] Funnel instrumentation (5 events, §5 Step 0a) — *before anything else*
- [ ] Tap-count audit for 3 core flows (§5 Step 0b) — *before any "3 taps" copy ships*
- [ ] Waitlist landing page (1 page, email capture, dynamic social proof)
- [ ] Legal opt-out email template for 300-contact list-validation send (§11)
- [ ] 3 Facebook post templates (problem story, demo video, social proof)
- [ ] 30-second screen recording demo (quote sent in real time, no voiceover, captions)
- [ ] Dirty-hands ad creative (gloved hand, one-handed use)

### Launch (after Van Roadshow)
- [ ] Full landing page with real testimonials from Roadshow
- [ ] **Event-triggered** onboarding messages (§9) — not a day-based drip
- [ ] WhatsApp quote template (branded version — decision on branding confirmed by Roadshow)
- [ ] In-app upgrade nudges (volume + value, §4 — Month 1-realistic triggers only)

### Growth
- [ ] Comparison landing pages (vs Tradify, vs Jobber)
- [ ] 3 SEO blog posts (problem-focused)
- [ ] Referral program messaging
- [ ] App Store listing copy (if native wrapper built)

---

## 8. Launch Sequence

| When | Action | Channel | Gate / Target |
|---|---|---|---|
| **Now** | Instrument funnel (5 events) | Internal | All 5 events firing cleanly |
| **Now** | Tap-count audit (3 core flows) | Internal | All flows meet tap targets or fixed |
| **Now** | Join target Facebook groups — answer questions, no promotion yet | Facebook | Credibility established before any mention of TradePad |
| **Now** | Deploy waitlist page (dynamic social proof) | Web | First email signups |
| **Week 1** | Validate list — 300-contact email sample (legal, opt-out) | Email | Warm / cold / dead decision |
| **Week 2–3** | Usability test with 5 known contacts | In person | No blocking UX bugs; log a job in <10s |
| **Week 3–4** | **Van Roadshow** — 20 tradespeople, in person | In person | Activation bugs found; branding decision made; 20 real quotes |
| **Week 4** | Soft launch to first 50 (waitlist + warm list segment) | Email | 3 months Pro free for feedback |
| **Month 2** | Public launch: full landing page, FB ads £10/day, origin-story post in groups | Web + Ads + FB | Per contingent targets (§10) |
| **Month 2** | If list validated warm: scale email outreach, staged and legal | Email | — |
| **Month 3+** | Referral mechanic; SEO content; partner outreach (Checkatrade, associations, accountants) | In-app + Partnerships | — |

---

## 9. Activation & Retention

**Activation is the funnel step most likely to leak — and it's event-triggered, not time-triggered.**

Tradespeople's job flow is lumpy and seasonal. A user in a quiet fortnight hasn't *failed* to activate — they have nothing to log. Two consequences:

1. **Measure activation against the next job, not the clock.** Definition: *first quote sent by the time of the user's next job.* A fixed "logged within 48h" window marks fine users as failures.
2. **Nudges fire on events, not dates.** Replace day-drip with behaviour triggers:
   - On next inbound call / first job created → "Send your first quote — takes under a minute."
   - After first quote sent → "Mark it paid when the money lands; we'll chase the rest."
   - 14 days no app open → "Missed a call today? Log it before you forget."
   - On cancel → **call him.** "What made you leave?" — literal phone call; highest-quality churn signal.

These are **operational/service** messages, lawful if consent was captured at signup (§11). Keep them behavioural and sparse; time-based nudges to someone with no job to log *cause* churn.

**Customer support model (Pro perk):** "Priority support — reply within 4 hours." Dave has no IT department; support is a trust signal, not a cost centre. WhatsApp support line is the right channel — it's where Dave already is. Commit to a response time and honour it. This is also the highest-signal source of product feedback in the first 90 days.

*The full onboarding flow (Day 0 to Day 7 user journey) and trust/data-safety copy belong in the PRD, not this document.*

---

## 10. Success Metrics — Contingent Ranges

Targets are **gated on the list-validation result** (§5, Step 0c). No single-number commitments on unverified inputs.

| Metric | Month 1 (cold/dead list) | Month 1 (warm list) | Month 3 | Month 6 |
|---|---|---|---|---|
| Active free users | 100–150 | 300–400 | 400–800 | 1,000–2,000 |
| Paid conversions | 8–12 | 20–30 | 60–120 | 200–400 |
| MRR | £70–110 | £180–270 | £400–1,400 | £1,800–3,600 |
| Activation rate (quote sent by next job) | **measure & set baseline** | — | improve vs M1 | — |
| Free→Pro rate | measure | measure | target 5–10% | target 8–12% |
| CAC (paid channel) | <£30 | <£30 | <£25 | <£20 |

**Honesty note on free→pro:** real-world £0-entry SMB freemium typically lands **2–5%**. Treat 15%+ as aspirational, not planned. Raising the top of the funnel does nothing if conversion is the bottleneck.

**Failed-launch contingency:** if Month 1 delivers 50 users instead of 100–150, do not panic. 50 engaged users at 10% conversion beats 500 passive ones at 1%. Actions:
- Promote Van Roadshow from secondary to primary channel — visit every user personally.
- Kill any paid channel with CAC >£50 after 30 days of data.
- If FB organic shows no engagement after 4 genuine posts, stop and try YouTube Shorts.
- Do not throw budget at a funnel before the activation leak is found and fixed.

---

## 11. Legal & Compliance (UK PECR / GDPR)

**This section is a hard gate. Several ideas from earlier drafts were removed here because they were unlawful.**

- **No cold marketing SMS or WhatsApp blasts.** Unsolicited *marketing* messages to individuals require prior opt-in consent. Soft opt-in covers only *existing customers* of a similar product — none of the 6,000 qualify. Breach = ICO exposure.
- **No marketing WhatsApp broadcasts to the list.** Also violates WhatsApp Business policy → number bans → you lose the channel the product depends on.
- **Email marketing requires a lawful basis** (consent or, narrowly, soft opt-in) **and a clear opt-out in every message.**
- **Operational/service messages are fine** (onboarding nudges, payment reminders, "what made you leave") if consent was captured at signup.
- **Establish lawful basis per contact before any outreach.** Segment into email-OK / SMS-OK / do-not-contact. Honour suppressions.
- **Data residency:** "Stored securely in the UK" is both a trust signal and a GDPR posture — make it true and keep it true.

The test: *is this message helping the user with something they signed up for (operational), or am I trying to acquire/sell (marketing)?* Marketing needs consent.

---

## 12. Out of Scope (and why)

| Idea | Verdict | Reason |
|---|---|---|
| **Jobs board / scrape MyBuilder & Checkatrade** | **Rejected** | Breaches ToS + UK database rights; poisons the partnership channel (§5 Phase 2); contradicts core positioning (§1); scope creep. Park as a post-PMF experiment at most. |
| **Cold SMS / WhatsApp acquisition blasts** | **Rejected** | Unlawful under PECR; risks WhatsApp bans (§11). |
| **Raising targets on the unverified list** | **Rejected** | Targets are contingent ranges gated on validation (§10). |
| **Tightening free tier to 3 jobs** | **Rejected** | Pushes Dave back to £0 paper, not up to Pro. Gate quotes-repeat instead (§4). |
| **Payment integration at launch** | **Deprioritised** | Different product; significant support and compliance burden. Revisit post-PMF. |
| **"MVP requires sync" caveat on offline claim** | **Rejected** | Pre-emptive caveating of the competitive moat does more brand damage than a rare sync failure. Build it right; claim it cleanly. |

---

## 13. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| The 6,000 leads are cold or dead | Validate with 300-contact sample *before* spending the list. Three-tier gate: warm / cold / dead (§5 Step 0c). Keep waitlist as hedge regardless. |
| Onboarding leaks at activation | Instrument funnel before launch; Van Roadshow to debug live; event-triggered nudges (§9). |
| Low-volume users never hit the cap | Dual conversion trigger — volume + Day-1-realistic value framing (§4). |
| "3 taps" promise is a lie | Tap-count audit is a pre-launch gate (§5 Step 0b). Don't ship the claim until the flows are verified. |
| WhatsApp dependency | The core quote-send flow runs over WhatsApp. If WhatsApp changes policy, bans business numbers, or adds fees, the flow breaks. **Mitigation:** build share-sheet and SMS fallback channels for quote sending before launch; never let WhatsApp be the only path out of the app. |
| Dave doesn't trust new software | Freemium removes the commitment barrier; UK data storage; real Roadshow testimonials build credibility. |
| Tradify/Jobber drop prices | £9 is near floor; compete on simplicity and offline, not price. |
| Low organic reach in FB groups | Credibility-first sequence (§5 Phase 0e) — never spam. |
| PECR/GDPR breach | §11 is a hard gate on all outreach decisions. |
| Word-of-mouth is slow | Branded quotes + referral mechanic; Roadshow seeds the first advocates. |

---

## 14. Immediate Next Steps (Sequenced)

These are the actions to take now, in order. Nothing in this list should be done out of sequence — each step gates the next.

### Gate 1 — Product is ready to show (do first, blocks everything)
1. **Tap-count audit.** Count taps for log-missed-call, build-and-send-quote, and mark-job-paid. Fix any flow above target before the "3 taps" claim goes anywhere public.
2. **Instrument the funnel.** Wire up the 5 events (§5 Step 0a). No point generating users before you can measure where they drop.
3. **Usability test.** 5 people, cold, watched. Fix any blocking UX issues. Scope: usability only — do not read activation signal into this.

### Gate 2 — Know what you're working with (do in parallel with Gate 1)
4. **Audit the 6,000-contact list.** For each contact: opt-in date, source, consent scope. Segment into email-OK / SMS-OK / do-not-contact. Remove anyone without a defensible basis.
5. **Draft the 300-contact validation email.** Plain text. Problem-focused. Clear opt-out. No hard sell. The goal is to measure open/reply rate, not convert.

### Gate 3 — Seed the ground before launch
6. **Join Facebook groups.** At least 5 target groups. Do not post about TradePad. Answer questions. Spend 2–4 weeks here before any product mention.
7. **Deploy the waitlist page.** Hero: "Built for the job site. Not the office." Dynamic social proof starting at zero. Offer: first 100 get 3 months free.

### Gate 4 — Validate the asset
8. **Send the list validation email** (once §4 is complete). 300-contact random sample. Wait 72 hours. Apply the warm/cold/dead decision rule.

### Gate 5 — First real users
9. **Schedule the Van Roadshow.** Identify ~20 tradespeople (personal contacts, group members, waitlist signups). Visit them in person. Watch them use the app. Test the "Powered by TradePad" branding decision. Collect real quotes for the landing page.
10. **Soft launch to 50** (waitlist + warm list segment). 3 months Pro free in exchange for feedback. This is your beta cohort.

### Gate 6 — Public launch (Month 2)
11. **Publish the full landing page.** With real testimonials from the Roadshow. Dynamic social proof at actual user count.
12. **Start Facebook ads.** £10/day. Run all 5 creative concepts in parallel for the first 2 weeks; kill the bottom 3, scale the top 2.
13. **Post origin story in Facebook groups.** Only after 2–4 weeks of genuine presence. Not before.
14. **If list validated warm:** scale email outreach, staged and legal, to the remaining contactable segment.

### Gate 7 — Scale what's working (Month 3+)
15. **Referral mechanic.** "Give a mate 1 month free, get 1 month free." Launch once you have 100+ active users — you need critical mass for referrals to compound.
16. **SEO content.** 3 blog posts. Start with the highest-intent keyword (likely "tradify alternative") — fastest path to organic search traffic.
17. **Partner outreach.** Checkatrade, MyBuilder, NICEIC, Gas Safe, FMB. One email each; a listed recommendation from any of these is worth 1,000 Facebook impressions.
18. **Accountant seeding.** Identify 50 accountants who advise sole-trader tradespeople. Send free Pro accounts. Ask for a mention in their next client newsletter.

---

## Version History

| Version | Key Changes |
|---|---|
| **1.2** (current) | Math fix (27%); dynamic social proof; Facebook credibility-first sequence; Month-1-realistic value triggers; WhatsApp dependency risk added; "3 taps" tap-count audit as pre-launch gate; Pro+Payments deprioritised; dead-list threshold added; offline caveat rejected; §14 sequenced next steps added. |
| **1.1** | Validation-first (not blast-first); funnel instrumented before spend; event-triggered activation; legal compliance hard gate (§11); dirty-hands promoted to hero; gate-the-repeat gating principle; jobs board rejected; contingent targets. |
| **1.0** | Original strategy. Strong positioning and pricing. Weak on legal compliance, unvalidated lead assumptions, optimistic targets, dirty-hands buried. |

---

*End of GTM-STRATEGY.md — Version 1.2*
