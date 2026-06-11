# TradePad — Website Copy & Layout Plan
## Comprehensive Brief for www.nirav.work

> **Purpose of this document:** Complete content, copy, and layout specification for the TradePad landing page. Every word, every section, every layout decision is defined here before a line of code changes. This is the brief — build from it.
>
> **Source:** `niiraav/NiravPortfolio` → `static/index.html` + `static/assets/styles.css`
> **Live at:** www.nirav.work
> **Deployed via:** GitHub Pages on push to `main`

---

## 1. Strategy

### What the page must do
Dave is a sole-trader tradesperson. He reads this on his phone in his van, between jobs. He has ~8 seconds before he decides whether this is for him. The page has three jobs, in order:

1. **Make him nod.** "This person understands my life." The problem section does this. He should read the first pain point and say "yeah, that's me."
2. **Make the product feel simple.** Not powerful, not feature-rich — *simple*. Every competitor has failed Dave by being too complex. This page must feel like relief.
3. **Remove every barrier to starting.** Free. No card. No contract. Two minutes. Every CTA reinforces this.

### What the page must NOT do
- Feature anything that isn't built yet. CIS, payment links, "snap a photo" — all removed. False promises destroy trust permanently with tradespeople.
- Show invented testimonials or inflated user counts. Dave talks to other tradespeople. He will find out.
- Feel corporate. No stock photography of smiling men in hard hats. No "enterprise-grade solution." No bullet points that end in "—ise."
- Feel startup-y. No "disrupt," no "10x," no growth-hacking language.

### Tone of voice
- A trusted mate who happens to be good with software
- Speaks Dave's language — "van," "site," "quote," "kettle" — not SaaS language
- Every sentence earns its place. If it doesn't add meaning, cut it.
- Direct. One idea per sentence.

---

## 2. What Stays, What Changes, What's New

### The design system stays completely
The Cal.com-inspired design language (Inter, tight tracking, black/white/grey, clean cards) is correct for this product. It feels premium without feeling corporate. Keep all CSS variables, typography scale, button styles, component classes, and the footer design.

### What changes (existing content, wrong copy)
| Element | Current | New |
|---|---|---|
| `<title>` | "TradePad — Job to Cash in 2 Minutes" | "TradePad — Built for the job site. Not the office." |
| `<meta description>` | Mentions CIS, WhatsApp photo | See §3 |
| Hero tag | "Built for UK tradespeople · CIS-ready" | "Built for UK sole traders · Offline-first" |
| Hero headline | "Invoicing shouldn't take longer than the job." | **"Built for the job site. Not the office."** |
| Hero subhead | Mentions WhatsApp photo, CIS | See §4 |
| Hero social proof | "Building with 12 trades across the UK" | Dynamic — see §4 |
| Problem section (all 3 cards) | CIS card, forgotten invoice, late payment | Missed call, cold quote, uninvoiced job |
| Problem stat callouts | £3,600/yr, 20% CIS, 14 days (unverified) | Removed — copy carries the weight |
| How It Works step 1 | "Snap a photo" | "Log it in 10 seconds" |
| How It Works step 2 | Mentions CIS deductions | "Send the quote before you leave" |
| How It Works step 3 | "Payment link" | "Get paid without chasing" |
| Footer resource links | CIS guide, late-payment template, quote checklist | Keep legal, remove CIS-specific |
| Nav links | "Why TradePad", "How it works" | Add "Pricing" |
| `<nav>` logo tagline | None | "The job app for working alone." |

### What gets removed
- Every instance of "CIS" — it's not built, it's a false promise
- "Snap a photo" — not a feature
- "Payment link" — not built
- All three stat callouts (the numbers are unverified; the stories are enough)
- "Quote to cash in three taps" as a headline — demoted to supporting copy
- The `docs/CNAME` footer redirect (www.nirav.work keeps as-is)

### What gets added (4 new sections + small additions)
1. **Dirty Hands Promise** — after How It Works, before Social Proof
2. **Pricing** — after Social Proof, before Competitor table
3. **Competitor table** — after Pricing
4. **FAQ accordion** — before the footer CTA
5. **Mid-page CTA beat** — subtle "Start free" link after Dirty Hands Promise
6. **Offline trust badge** — in hero, near the app screenshot

---

## 3. Head / Meta

```html
<title>TradePad — Built for the job site. Not the office.</title>

<meta name="description"
  content="TradePad is the job management app built for UK sole traders. 
  Send quotes, track jobs, and get paid — offline-first, from your phone, 
  in under 2 minutes. Free to start. No card needed.">

<!-- Open Graph (for social sharing — Facebook groups, WhatsApp) -->
<meta property="og:title" content="TradePad — Built for the job site. Not the office.">
<meta property="og:description"
  content="Send quotes, track jobs, get paid — without stopping work to do admin. 
  Built for UK tradespeople. Works offline. Free to start.">
<meta property="og:image" content="[hero screenshot image URL]">
<meta property="og:url" content="https://www.nirav.work">
<meta property="og:type" content="website">

<!-- Twitter / X card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TradePad — Built for the job site. Not the office.">
<meta name="twitter:description"
  content="The job app built for working alone. Send quotes, track jobs, get paid — offline-first.">
```

---

## 4. Navigation

### Desktop (≥900px)
```
[● TradePad]    [Why TradePad]  [How it works]  [Pricing]    [Start free →]
```

### Mobile (<900px)
```
[● TradePad]                                               [Start free →]
```
Nav links hidden on mobile — the CTA button is all that matters.

### Copy
- Logo: `● TradePad`
- Nav links: `Why TradePad` · `How it works` · `Pricing`
- CTA button: `Start free`

### Behaviour
- Sticky, frosted glass (existing `.top-nav` styles — keep as-is)
- "Start free" scrolls to the waitlist form (pre-launch) / links to app (post-launch)
- On scroll past hero, the nav CTA gains a border (visual weight increase) — add CSS: `.scrolled .btn-sm { border: 1px solid var(--hairline); }`

---

## 5. Hero Section

### Layout
**Desktop (≥1024px):** 2-column grid. Left: copy stack. Right: app screenshot in a white card frame (existing `.hero-mockup` component).

**Mobile:** single column. Copy first, then screenshot. The screenshot appears below the first CTA — Dave reads the promise before he sees the product.

### Copy

**Tag line (the pill above the headline):**
```
● Built for UK sole traders · Offline-first
```
*The green pulsing dot signals "live / active." "Offline-first" replaces "CIS-ready" — it's a real differentiator, not a feature we haven't built.*

**Headline:**
```
Built for the job site.
Not the office.
```
*Two sentences. Hard break between them. "Not the office" is the differentiator — every competitor is built for a desk. This line excludes Dave from their world and includes him in ours.*

**Subheadline:**
```
TradePad helps UK tradespeople send quotes, track jobs, and get paid — 
without stopping work to do admin.
```

**CTA button:**
```
Join the waitlist — it's free
```
*Pre-launch: email capture. Post-launch: changes to "Start free — no card needed" linking to app.*

**Privacy note beneath CTA:**
```
Free during early access. No card. No contracts. Privacy policy.
```

**Social proof line (dynamic — see §12 for the two-state spec):**

*State A — Launch day (0 signups shown):*
```
Join the first UK tradespeople to try TradePad
```

*State B — 50+ signups:*
```
[avatar] [avatar] [avatar] [avatar]  ★★★★★
Join [N]+ tradespeople already on the waitlist
```
*Avatars remain static coloured initials (JS, RM, TK, DA) as before — they represent real beta users once the Roadshow runs. The count is populated from Supabase: fetch count from `early_access_signups`, update the DOM. Never hard-code a number.*

### App screenshot
- Show the **QuotePreview screen** — the moment Dave sees a professional quote on his phone before sending it to a customer. This is the "aha moment." It answers the question "what does this actually look like?" before Dave has to sign up.
- Frame: existing `.hero-mockup` white card with shadow
- The screenshot image should be a real device screenshot at 2x resolution, WebP format
- Soft fade at the bottom (existing `::after` pseudo-element keeps this — no change needed)

**Offline trust badge** — small badge overlaid bottom-right of the mockup:
```html
<div class="offline-badge">
  <svg><!-- wifi-off icon --></svg>
  Works offline
</div>
```
*CSS: `position: absolute; bottom: 24px; right: 16px; z-index: 3;` — white pill with subtle shadow. Calls out the #1 differentiator without interrupting the screenshot.*

---

## 6. Problem Section

### Purpose
Make Dave nod. Each card describes a specific moment from his real life. He should read it and think "that happened to me last week." No stats. The story is the proof.

### Anchor
```html
<section id="problems">
```
Nav link "Why TradePad" scrolls here.

### Section header
```
[label]  The problem

[headline]  Evening admin is stealing your jobs.

[subhead]  Three things happen every week that cost you money. 
           Not because you're disorganised — because you're busy.
```

### Card 1 — Missed call
**Icon:** phone with a missed-call indicator (red dot on phone icon)

**Headline:**
```
Missed a call. Lost the job.
```

**Body:**
```
You were drilling. They called. You meant to call back. 
You forgot.
By the time you remembered, they'd called someone else.
```

**Stat block (bottom of card):** — *removed from current design. The story is enough. No unverified numbers.*

### Card 2 — Cold quote
**Icon:** document with clock (quote expiring)

**Headline:**
```
Sent the quote. Never followed up.
```

**Body:**
```
WhatsApp threads pile up. Quotes get buried. 
Three weeks later you check and the customer's gone quiet.
The job was yours — until it wasn't.
```

### Card 3 — Uninvoiced job
**Icon:** banknote / wallet

**Headline:**
```
Job's done. Invoice hasn't gone out.
```

**Body:**
```
It's 8pm. You did three jobs today. You'll do the invoicing tomorrow.
Tomorrow becomes Friday. Friday becomes "next week."
That's £300 sitting in limbo for no reason.
```

### Layout
3-column grid on desktop (`grid-3` class), stacked on mobile — identical to current structure. Keep `.feature-card` component with `.feature-icon`. Remove the `.stat` block from all three cards.

---

## 7. Dirty Hands Promise Section

### Purpose
This is the single most powerful differentiator in the product. It was buried in Section 4 on the old page. It is now a full-width, maximum-contrast section that interrupts the page's grey rhythm with a black block.

### Visual treatment
**Full-width dark section.** Background: `var(--surface-dark)` (#101010). White text. High contrast. No card containers — the section itself IS the container.

This section should feel different from everything else on the page. It's a statement, not a feature list.

### Layout
**Desktop:** 2 columns — copy left (60%), visual right (40%).
**Mobile:** copy only, stacked. Visual is hidden on mobile (it's a decorative photo).

### Copy

**Label (small caps, muted):**
```
The dirty hands test
```

**Headline:**
```
Built for the job site.
Not the office.
```
*Same as hero — this is intentional. The repetition reinforces the brand line and this section earns it with evidence.*

**Body (4 short statements, each its own line — not a paragraph):**
```
One-handed. Gloves on. Standing in a customer's kitchen.

No menus. No learning curve.
If it takes more than 3 taps, we didn't build it right.

Works with no signal.
Your changes save to your phone and sync when you're back online.

If every competitor goes offline, TradePad keeps working.
No other app in this space can say that.
```

**CTA (subtle, secondary):**
```
[button: secondary-on-dark]  "See how it works ↓"
```
*Scrolls to How It Works. This is not the primary CTA — it's a nudge for Dave who isn't ready to sign up yet.*

### Right-side visual (desktop only)
A single image: a pair of work gloves on a dirty workbench, with a phone showing the TradePad app in the background. If no photo is available at launch, use the app mockup on a dark background instead.

*Alt text: "TradePad running on a phone at a job site"*

---

## 8. How It Works Section

### Purpose
Show Dave the three core flows of the actual app. Each step matches a real screen. The pill-tab component (existing) highlights whichever step Dave taps. The screenshots show the real app UI.

### Anchor
```html
<section id="how-it-works">
```

### Section header
```
[label]  How it works

[headline]  From missed call to paid job.

[subhead]  Three things TradePad does that paper and WhatsApp can't.
```

### Pill tabs
```
[1 · Log it]   [2 · Quote it]   [3 · Get paid]
```

### Step 1 — Log missed call
**Badge:** `10 seconds`

**Headline:**
```
Log it before you start the van.
```

**Body:**
```
Missed call comes in. Log the number and name before you pull away.
TradePad saves it as a job and puts it in your tasks.
You never forget to call back again.
```

**Screenshot:** LogMissedCall screen — showing the phone number input and the two buttons ("Save & call back" / "Save only"). Clean, minimal.

### Step 2 — Send quote
**Badge:** `Under a minute`

**Headline:**
```
Send the quote before you leave the driveway.
```

**Body:**
```
Add your line items. Set the price.
One tap and it goes to the customer via WhatsApp — with your name on it, looking professional.
```

**Screenshot:** QuotePreview screen — the formatted quote card showing customer name, line items, total, and the WhatsApp send button.

*This screenshot IS the most important visual on the page. It's what makes the customer ask "what app is that?" It must show a clean, professional-looking quote — not a rough wireframe.*

### Step 3 — Mark paid
**Badge:** `One tap`

**Headline:**
```
Mark it paid when the money lands.
```

**Body:**
```
TradePad tracks every job — quoted, booked, done, paid.
You know at a glance who owes you and who's paid up.
No spreadsheet. No chasing on a Friday night.
```

**Screenshot:** Jobs list screen — showing a mix of job statuses (enquiry, quoted, paid). Communicates at a glance what "tracking jobs" means.

### Layout
Same `.steps-grid` + `.step-card` components as current. Keep the pill-tab JS behaviour. **Remove the timing badges** ("~15 seconds", "~45 seconds", "2 minutes total") — they were tied to the old flow.

---

## 9. Social Proof Section

### Pre-Roadshow state (launch)
This section is **hidden** (`display: none`) until real testimonials exist.

Do not ship placeholder names or invented quotes. Dave talks to other tradespeople. He will google the names. Discovery of fake testimonials destroys trust permanently.

Add an HTML comment:
```html
<!-- TESTIMONIALS: Hidden until Van Roadshow completes. 
     Real quotes from real users only. See GTM-STRATEGY.md §5. -->
```

### Post-Roadshow state (after ~20 site visits)
Section becomes visible. Three cards, filled with real Roadshow quotes.

**Section header:**
```
[label]  From the trades

[headline]  What tradespeople say.

[subhead]  Real people. Real jobs. No invented reviews.
```

**Card template:**
```
★★★★★

"[Direct quote — Dave's own words, not cleaned up or polished. 
 His grammar, his voice. Authenticity over eloquence.]"

[Photo]  [First name, last initial]
         [Trade] · [City]
```

**Tone note for collecting quotes:** ask Roadshow participants "what would you tell another tradesperson about this?" Not "what do you think of the app?" The first gives you a quote; the second gives you feedback.

**Layout:** 3-column grid on desktop, stacked on mobile. Uses existing `.testimonial-card` component.

---

## 10. Pricing Section

### Purpose
Remove the last objection. Dave has seen the product, understood the value, and is now asking "but how much?" Answer it clearly: less than a takeaway, free to start.

### Anchor
```html
<section id="pricing">
```

### Section header
```
[label]  Pricing

[headline]  Less than a takeaway.

[subhead]  Start free. Upgrade when you're busy.
           No contracts. Cancel any time.
```

### Two cards

**Card 1 — Free (left / top on mobile):**
```
FREE
[subtext]  To get you started

£0
/month

─────────────────

✓  5 active jobs per month
✓  First quotes free
✓  Offline-first
✓  All core features
✓  No credit card needed

[button: secondary]  Get started free
```

**Card 2 — Pro (right / bottom on mobile) — featured, dark background:**
```
[badge: "Most popular"]

PRO
[subtext]  For when you're busy

£9
/month

─────────────────

✓  Unlimited jobs
✓  Unlimited quotes
✓  Your own logo on quotes
✓  Priority support (4hr reply)
✓  Everything in Free

[button: primary-on-dark]  Start Pro — 14 days free

[subtext below button]  Then £9/month · Cancel any time
```

**Annual option (below both cards, centred):**
```
Pay annually and save 27% — just £79/year.
[link]  Switch to annual →
```

### Layout
2-column grid on desktop (`grid-2`, same as existing pricing class). On mobile: **Free on top, Pro beneath** — the reverse of desktop. This matters: on mobile, Dave scrolls from Free → Pro → CTA, building commitment on the way down. On desktop, the featured card (Pro) reads as the default recommendation by being visually dominant.

**Visual weight:** Pro card uses `.pricing-featured` (existing dark card style). Free card uses standard `.pricing-card`. The existing CSS handles this correctly.

### Trust signals on pricing cards
Each card footer adds:
- Free: "No credit card · No catch"
- Pro: "First 14 days free · Cancel any time"

---

## 11. Competitor Comparison Section

### Purpose
Dave is suspicious of new software. He may have tried Tradify or Jobber and been burned. This table validates that scepticism and positions TradePad as the obvious choice — without feeling defensive.

### Section header
```
[label]  How we compare

[headline]  The only app built for one person.

[subhead]  Every competitor was designed for teams. 
           TradePad is the first one built for working alone.
```

### Table

| | TradePad | Tradify | Jobber | Paper + WhatsApp |
|---|---|---|---|---|
| **Works offline** | ✅ | ❌ | ❌ | ✅ |
| **Built for sole traders** | ✅ | ❌ | ❌ | — |
| **UK-native** | ✅ | ❌ (NZ) | ❌ (CA) | — |
| **Free to start** | ✅ | ❌ | ❌ | ✅ |
| **Professional quotes** | ✅ | ✅ | ✅ | ❌ |
| **Price (1 person)** | **£9/mo** | £19/mo | £31/mo | £0 |

**Why include Paper + WhatsApp:** it's Dave's real current solution and it wins on two rows. Including it shows we're honest — not just cherry-picking the comparison. And it loses on the two things that cost Dave money: professional quotes and tracking. That's the point.

**Note on NZ/CA labels:** small grey sub-labels under each competitor name showing origin ("New Zealand", "Canada"). This reinforces "UK-native" without beating the drum.

### Layout
Responsive HTML table. On mobile: horizontal scroll wrapper (`overflow-x: auto`). On desktop: full-width.

**CSS additions needed:**
```css
.compare-table { width: 100%; border-collapse: collapse; }
.compare-table th { font-weight: 600; font-size: 14px; padding: 12px 16px; text-align: left; border-bottom: 2px solid var(--ink); }
.compare-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid var(--hairline); }
.compare-table tr:last-child td { border-bottom: none; }
.compare-table td:first-child { font-weight: 500; color: var(--ink); }
.compare-table .col-us { background: rgba(17,17,17,0.03); }
.compare-table .price-row td { font-weight: 600; }
.compare-table .price-row .col-us { color: var(--ink); }
.compare-table .price-row td:not(.col-us) { color: var(--muted); }
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
```

---

## 12. FAQ Section

### Section header
```
[label]  Common questions

[headline]  Everything you need to know.
```

### 4 Questions (accordion — one open at a time)

**Q1:** Is TradePad on the App Store?
```
No download needed. TradePad is a web app — open it in any browser on your phone and tap 
"Add to Home Screen." It works exactly like an app, but you never have to search the App Store.
```

**Q2:** Does it actually work without internet?
```
Yes. Everything saves to your phone first. Jobs, quotes, notes — all stored locally. 
When you're back on signal (your driveway, a pub car park, home), it syncs automatically. 
You'll never lose a job because you were in a basement.
```

**Q3:** Is my data safe?
```
Your data is stored securely in the UK. It belongs to you — you can export everything 
at any time. We'll never sell it, share it, or hold it hostage if you decide to leave.
```

**Q4:** Can I cancel anytime?
```
Yes. No contracts. No questions. Cancel from your account settings in 30 seconds.
If you do cancel, we'll ask what made you leave — that's the only reason we ask.
```

### Accordion behaviour (JS addition)
Simple `<details>` / `<summary>` HTML — no JS needed. Native browser accordion is accessible, animatable with CSS, and works offline.

```html
<details class="faq-item">
  <summary class="faq-q">Is TradePad on the App Store?</summary>
  <div class="faq-a">
    No download needed. TradePad is a web app...
  </div>
</details>
```

**CSS additions needed:**
```css
.faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 0; }
.faq-item { border-bottom: 1px solid var(--hairline); }
.faq-item:first-child { border-top: 1px solid var(--hairline); }
.faq-q {
  list-style: none; display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; font-size: 16px; font-weight: 500; color: var(--ink);
  cursor: pointer; gap: 16px;
}
.faq-q::-webkit-details-marker { display: none; }
.faq-q::after { content: "+"; font-size: 20px; font-weight: 300; color: var(--muted); flex-shrink: 0; }
details[open] .faq-q::after { content: "−"; }
.faq-a { padding: 0 0 20px; font-size: 15px; color: var(--body); line-height: 1.6; max-width: 600px; }
```

---

## 13. Footer CTA Section (before dark footer)

### Visual treatment
Full-width `section-soft` (light grey background, existing class). Not the dark footer — this is the final conversion push before Dave hits the footer and scrolls away.

### Copy
```
[headline, display-md]
Still running your business from WhatsApp and paper?

[subhead]
You're losing money every week.
It takes 2 minutes to get started.

[email form — identical to hero]
[your@email.com]  [Join the waitlist]

[privacy note]
Free during early access · No card needed · Privacy policy
```

---

## 14. Footer

### Keep largely as-is. Update these elements:

**Tagline under logo:**
```
The job app for working alone.
```

**Footer column 1 — Product:**
```
Why TradePad
How it works
Pricing
Download (Add to Home Screen)
```

**Footer column 2 — Company:**
```
About
Privacy policy
Contact
```

**Footer column 3 — For tradespeople:** *(replaces CIS guide, late-payment template)*
```
How to send quotes on WhatsApp
How offline-first apps work
[more TBD post-launch]
```

**Footer column 4 — remove** (was "resources" with unbuilt CIS content). Collapse to 3 columns.

**Footer bottom strip:**
```
© 2026 TradePad. Made in the UK.        hello@nirav.work
```

**Add trust badge row** (new, above the bottom strip):
```
[🔒 Data stored in the UK]  [No contracts]  [Works offline]
```
*Small grey text with icons — passive trust signals that Dave absorbs without reading.*

---

## 15. Full Section Order (Final)

```
┌─────────────────────────────────────┐
│  NAV                                │  Sticky, frosted
├─────────────────────────────────────┤
│  HERO                               │  Headline · Subhead · CTA · Social proof · Screenshot
├─────────────────────────────────────┤
│  PROBLEM                            │  3 pain points (missed call, cold quote, uninvoiced job)
├─────────────────────────────────────┤
│  DIRTY HANDS PROMISE                │  Dark section · "Built for the job site."
├─────────────────────────────────────┤
│  HOW IT WORKS                       │  3 steps matching real app flows
├─────────────────────────────────────┤
│  SOCIAL PROOF                       │  Hidden pre-Roadshow. 3 real quotes post-Roadshow.
├─────────────────────────────────────┤
│  PRICING                            │  Free + Pro · 27% annual saving
├─────────────────────────────────────┤
│  COMPETITOR TABLE                   │  TradePad vs Tradify vs Jobber vs Paper
├─────────────────────────────────────┤
│  FAQ                                │  4 questions · native <details> accordion
├─────────────────────────────────────┤
│  FOOTER CTA                         │  "Still running your business from WhatsApp and paper?"
├─────────────────────────────────────┤
│  FOOTER                             │  Dark · 3 columns · trust badges · © TradePad
└─────────────────────────────────────┘
```

---

## 16. Conversion Architecture

Every major section has a conversion path. Dave can act at any point.

| Trigger | CTA text | Action |
|---|---|---|
| Hero (primary) | "Join the waitlist — it's free" | Email form submit |
| Nav | "Start free" | Scroll to hero form |
| Dirty Hands Promise | "See how it works ↓" | Scroll to How It Works |
| Pricing — Free card | "Get started free" | Scroll to hero form |
| Pricing — Pro card | "Start Pro — 14 days free" | Scroll to hero form (pre-launch) / app (launch) |
| Footer CTA | "Join the waitlist" | Email form submit |

**No pop-ups, no exit-intent modals, no chat widgets.** Dave finds these patronising. The page earns the signup through copy, not tricks.

---

## 17. Trust Signal Map

Trust signals are scattered throughout the page — never clustered in one "trust section" because that signals you're trying to compensate for something.

| Signal | Where |
|---|---|
| "Offline-first" | Hero tag |
| "Works offline" badge | Hero screenshot overlay |
| "Built for UK sole traders" | Hero tag |
| "Free · No card needed" | Every CTA / privacy note |
| "No contracts" | Pricing card footer |
| "Cancel any time" | Pricing card footer |
| "Data stored in the UK" | FAQ Q3 |
| "You own your data" | FAQ Q3 |
| "Made in the UK" | Footer bottom |
| "Data stored in the UK" | Footer trust badge row |
| Real testimonials (post-Roadshow) | Social proof section |

---

## 18. Two-State Spec (Pre-Launch vs Post-Launch)

### Pre-launch (now — waitlist phase)
- Primary CTA: email capture → `early_access_signups` Supabase table
- Social proof line: "Join the first UK tradespeople to try TradePad" (no number)
- Social proof section: hidden
- Pricing CTA: "Join the waitlist — it's free" (not "Start free")
- Hero tag shows: "● Early access open"

### Post-launch (app live)
- Primary CTA: "Start free — no card needed" → links to app URL
- Social proof line: dynamic count from Supabase (see §4)
- Social proof section: visible with real Roadshow quotes
- Pricing — Free CTA: "Start free" → app signup
- Pricing — Pro CTA: "Start Pro" → app signup with plan pre-selected
- Hero tag: reverts to "● Built for UK sole traders · Offline-first"

The HTML accommodates both states with a `data-state="pre-launch"` attribute on `<body>`. JS reads this and shows/hides the appropriate CTA text. Switching to post-launch = change one attribute.

---

## 19. Assets Required

| Asset | Format | Notes |
|---|---|---|
| Hero app screenshot | WebP, 2x (800px wide) | QuotePreview screen on iPhone 15 Pro Midnight |
| Step 1 screenshot | WebP, 2x | LogMissedCall screen |
| Step 2 screenshot | WebP, 2x | QuotePreview / QuoteSent screen |
| Step 3 screenshot | WebP, 2x | Jobs list with mixed statuses |
| Dirty Hands photo (optional) | WebP | Work gloves + phone on workbench. If unavailable, use Step 2 screenshot on dark bg. |
| OG image (social sharing) | PNG, 1200×630px | Hero headline + app screenshot. Used when Dave shares the link on Facebook. |

**Screenshot guidance:**
- Take on a real iPhone 15 (not simulator) for authentic rendering
- Use the app's light mode (matches the page's white background)
- Populate with realistic data: a real-looking customer name, real line items (e.g. "Boiler service — £120", "Parts — £45"), a real job title
- Do not show test data ("Test Customer", "Job 1", "£0.00")

---

## 20. What NOT to Build

| Idea | Reason not to include |
|---|---|
| Cookie consent banner | Not needed at launch — Posthog EU region, no marketing pixels, no cross-site tracking |
| Chat widget (Intercom, Crisp) | Dave won't use it; it adds weight and feels corporate |
| Exit-intent pop-up | Patronising; tradespeople close it immediately |
| Video autoplay | Dave watches video with sound off in the van; autoplay without controls feels broken |
| Animation-heavy intro | Slower loads; Dave has 4G at best on site |
| "As seen in" press logos | Nothing to put there yet |
| Cookie pop-up for analytics | Not required for first-party analytics in EU region |

---

## 21. Page Performance Targets

| Metric | Target | How |
|---|---|---|
| LCP (Largest Contentful Paint) | <1.5s on 4G | Hero image lazy-loaded after text; WebP format; preconnect on fonts already in `<head>` |
| CLS (Cumulative Layout Shift) | <0.1 | Set explicit `width` + `height` on all images |
| FID (First Input Delay) | <100ms | No blocking JS above fold; Supabase loaded async |
| Page weight | <500KB total | WebP screenshots at 2x; no video autoplay; no heavy libraries |

---

## 22. Pre-Build Checklist

Before the first line of HTML changes:

- [ ] App screenshots captured on real iPhone — QuotePreview, LogMissedCall, Jobs list
- [ ] Screenshots show realistic data (real names, real job titles, real amounts)
- [ ] OG image created (1200×630, hero headline + screenshot)
- [ ] Dirty Hands photo sourced OR decision made to use app screenshot on dark bg
- [ ] Confirm app URL (where "Start free" links to post-launch)
- [ ] Confirm Supabase `early_access_signups` table is live and accepting inserts
- [ ] Confirm privacy.html is current and covers Posthog analytics
- [ ] Domain decision: keep www.nirav.work or move to tradepad.co.uk / tradepad.app

---

*End of WEBSITE-COPY-LAYOUT-PLAN.md*
