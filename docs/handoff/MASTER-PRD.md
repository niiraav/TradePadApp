# TradePad — Master Product Requirements Document
## Version 1.0 — MVP Handoff to Kimi k2.6

> **How to use this document**
> This is the single source of truth for TradePad MVP development. Every decision documented here is final. If something is not mentioned here, it is OUT OF SCOPE for MVP. Do not invent features, do not add "nice-to-haves", do not deviate from the wireframe states referenced throughout.

---

## 1. Product Vision

**TradePad** is a PWA (Progressive Web App) for UK sole-trader tradespeople. It replaces the notebook, the WhatsApp back-and-forth, and the forgetting to invoice.

**One sentence:** TradePad helps tradespeople send quotes, track jobs, and get paid — without stopping work to do admin.

---

## 2. Primary Persona — "Dave"

| Attribute | Detail |
|---|---|
| **Who** | Dave, 34, sole-trader plumber/electrician/builder |
| **Works** | Back-to-back jobs, often alone, often in UK residential properties |
| **Phone use** | One hand, possibly gloved, standing in a customer's kitchen |
| **Admin habits** | Avoids it. Uses WhatsApp and paper notes today |
| **Pain** | Loses jobs from missed calls, forgets to invoice, chases payments too late |
| **Goal** | Just get through the day and get paid |

### The "Dirty Hands Test"
Every interaction must pass this test: *Can Dave use this with work gloves on, one hand, standing in a customer's kitchen, without reading text twice?*

If the answer is no, the feature is too complex.

---

## 3. Ten Immutable Simplicity Rules

These rules override every other consideration. If a design decision conflicts with these rules, the rules win.

1. **Every core action ≤ 3 taps from home** — Send quote, mark paid, log missed call must each be reachable in 3 taps or fewer from the home screen.
2. **Pre-fill everything** — Customer name, phone, rate card, bank details, default payment terms. Dave should never type something twice.
3. **No save buttons** — Auto-save on blur/change. Show a 5-second undo toast for destructive actions.
4. **Smart defaults** — 30-day quote expiry, On-completion payment terms, £75 callout fee. Dave configures once in Settings, never again.
5. **Progressive disclosure** — Don't show CIS UI to non-construction trades. Don't show Pro features in the free tier. Only surface complexity when relevant.
6. **Contextual action bars** — CTAs change completely based on job status. There is no generic "Actions" menu.
7. **One screen = one decision** — Quote builder is 3 steps, not one mega-form. Each step asks one thing.
8. **Zero-tap auto-magic** — Missed call SMS, invoice generation, and follow-up chasers fire silently. Dave doesn't approve each one (he can undo).
9. **No jargon** — Write "saved on device" not "IndexedDB". Write "your tax summary" not "CIS300". Write "TradePad" not "Supabase".
10. **Error recovery ≤ 2 taps** — Every error state must have an immediate recovery path visible on screen.

---

## 4. Tech Stack (Confirmed)

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| State management | Zustand |
| Backend | Supabase (Postgres + Auth + Realtime) |
| Local cache | Dexie.js (IndexedDB wrapper) |
| PWA | vite-plugin-pwa + Workbox |
| Icons | Lucide React |
| Forms | React Hook Form |
| Routing | React Router v6 |

### Architecture principle
**Offline-first**: All writes go to Dexie (local IndexedDB) first. Supabase sync happens in background. UI never waits for network. Show "syncing…" badge if Supabase is behind.

---

## 5. MVP Scope — Feature List

### ✅ IN SCOPE (MVP)
- Phone OTP authentication (Supabase Auth)
- 4-screen onboarding (name, business, defaults, done)
- Home dashboard — Today tab + Tasks tab
- Jobs list — grouped by status, filter chips
- Job Detail — all 12 states (Booked through Written Off)
- Quote flow — Missed call log → Customer details → Builder → Preview → Send
- Settings — inline edit, business profile, defaults
- Payment recording — Cash, Bank Transfer, Other (manual only)
- Chase mechanism — Send reminder via WhatsApp/SMS deep link
- No-show flow — Callout charge invoice creation
- Offline support — Dexie local storage, sync queue
- Push notifications — end-of-day unpaid nudge
- PWA manifest — installable, home screen icon

### ❌ OUT OF SCOPE (Phase 2+, DO NOT BUILD)
- Stripe payment links
- PDF generation for quotes
- Postcode lookup API (address is plain text)
- Auto-pull from device call log (PWA cannot access)
- Evidence pack auto-PDF (photos attachable, PDF deferred)
- Dispute management screen
- Customer booking link / embedded form
- Multi-device real-time sync conflict resolution UI
- CIS (Construction Industry Scheme) tax tracking
- Accountant export / HMRC integration
- Rate card / saved line items in Settings
- Customer database / previous customer lookup
- Activity feed screen
- Landing page / marketing

---

## 6. Job State Machine

### States (12 total)

| State | Code | Meaning | Terminal? |
|---|---|---|---|
| Enquiry | `enquiry` | Logged missed call, not yet quoted | No |
| Quoted | `quoted` | Quote sent, awaiting customer confirmation | No |
| Booked | `booked` | Customer confirmed, date/time set | No |
| In Progress | `in_progress` | Dave is on site, job started | No |
| Awaiting Payment | `awaiting_payment` | Job done, invoice sent or pending | No |
| Paid | `paid` | Payment received and recorded | ✅ Yes |
| No-Show | `no_show` | Dave arrived, customer wasn't home | No |
| Cancelled | `cancelled` | Job cancelled (customer or Dave) | ✅ Yes |
| Written Off | `written_off` | Unpaid, debt written off | ✅ Yes |

**Cuts for MVP (not separate states):**
- `Paused` → merged into In Progress with a note
- `Partially Paid` → not a distinct state; handled by deposit tracking
- `Accepted` → merged into Booked

### State Transitions

```
[Enquiry] → Quoted (tap "Create quote" on missed call task card)
[Quoted]  → Booked (Dave taps "Mark as Booked" after customer confirms verbally)
[Quoted]  → Cancelled
[Booked]  → In Progress (Dave taps "I'm here" on Next Up card)
[Booked]  → No-Show (Dave taps "Customer not home?" link)
[Booked]  → Cancelled
[In Progress] → Awaiting Payment (Dave taps "Mark Done" + picks payment method "Not yet")
[In Progress] → Paid (Dave taps "Mark Done" + picks Cash/Bank Transfer/Other)
[In Progress] → No-Show (Dave taps "Customer not home?" escape hatch)
[Awaiting Payment] → Paid (Dave taps "Mark as Paid")
[Awaiting Payment] → Written Off (Dave taps "Write off")
[No-Show] → Booked (Dave taps "Reschedule")
[No-Show] → Cancelled (Dave taps "Cancel / write off")
[No-Show] → Awaiting Payment (Dave taps "Charge callout" → creates separate invoice)
```

### Terminal States
`paid`, `cancelled`, `written_off` — no further transitions. Read-only in Job Detail. No contact buttons in header.

---

## 7. Flag System

Flags appear as inline badges on job rows in the Jobs list, and on task cards in the Home Tasks tab.

| Flag | Code | Trigger | Colour |
|---|---|---|---|
| **Urgent · New** | `urgent_new` | Enquiry < 2 hours old | Blue `#EFF6FF / #1D4ED8` |
| **Chase · Xd** | `chase_Xd` | Awaiting Payment, invoice sent X days ago (X < 30) | Amber `#FFFBEB / #B45309` |
| **Overdue · Xd** | `overdue_Xd` | Awaiting Payment, invoice sent ≥ 30 days ago | Red `#FEF2F2 / #DC2626` |
| **Stale · Xd** | `stale_Xd` | Quote sent X days ago, not confirmed | Grey `#F9FAFB / #6B7280` |
| **No-show** | `noshow` | Job in No-Show state | Amber `#FEF3C7 / #92400E` |
| **Action needed** | `action_needed` | No-show with no follow-up action taken | Amber |

### L2 vs L3 Rule (Home screen)
- **L2 (Can't Ignore)** = financial risk TODAY or time-sensitive window closing: Overdue·30d, Disputed, No-show, Urgent·New
- **L3 (When you get a minute)** = needs attention, can wait: Chase·Xd, Stale·Xd, Follow-up, missed call logged

---

## 8. Home Screen Architecture

### Three-layer model

**Layer 1 — Right Now (what's happening today with active jobs)**
- Compact active bar (44px) if a job is In Progress
- Next Up card (full L1 card) for the next booked/upcoming job
- Today strip (36px) showing remaining scheduled jobs

**Layer 2 — Can't Ignore (financial risk today)**
- Overdue invoices (>30 days)
- No-show jobs needing action
- Urgent new enquiries (<2h)

**Layer 3 — When You Get a Minute (admin that can wait)**
- Chase reminders (3–29 days)
- Stale quotes
- Missed calls to follow up

### Tab structure
**Today tab** — Layers 1 content only (active bar + Next Up + Today strip). No L2/L3.
**Tasks tab** — Layers 2 + 3 combined. Red badge count on Tasks tab when any L2 items exist.

### Next Up card states (home.html s1–s8)
1. **s1 — Next Up**: Full card, [Running late] primary + [I'm here] secondary
2. **s2 — Running Late sheet**: Bottom sheet over s1 with pre-filled message, WhatsApp/SMS
3. **s3 — Customer Notified**: Card returns + "✓ Customer notified · 9:14am" log line
4. **s4 — I'm Here**: Compact 44px active bar + next job full card + Today strip
5. **s5 — Mark Done (no deposit)**: Sheet — Cash / Bank Transfer / Other / Not yet → chase task
6. **s6 — Mark Done (deposit)**: Sheet — Balance shown, same options minus Bank Transfer
7. **s7 — Today Strip**: Next Up + strip "2pm · Shah · Kitchen fit-out  +1 more ›"
8. **s8 — No-Show Link**: "Customer not home?" secondary underlined link below CTAs
9. **s9 — No Jobs Today**: Prominent "No jobs today" card in Today tab
10. **s10 — All Clear**: Dashed empty card, no Tasks badge
11. **s11 — Multi-Day**: Active bar shows "Day 2" instead of duration
12. **s12 — Tasks Tab**: L2 + L3 task list

---

## 9. Payment Rules

### Payment methods (MVP — manual only)
- **Cash** — recorded, counts toward income
- **Bank Transfer** — recorded, Dave manually marks when bank notifies him
- **Other** — free text description, recorded
- **Not yet** — creates a chase task in Tasks tab, job moves to Awaiting Payment

### NO Stripe / payment links for MVP
Stripe is a Pro tier Phase 2 feature only. Do not build payment link generation.

### Deposit handling
- Set at quote creation (% of total — 10/20/25/50% presets or custom)
- Tracked in `payments` table as `type: 'deposit'`
- When job marked Done: sheet shows "Balance to collect: £X" (total minus deposit)
- Balance payment recorded separately as `type: 'balance'`

### Payment prompt (Mark Done)
When Dave taps Mark Done on home screen OR in Job Detail:
- Bottom sheet: "How were you paid?"
- Options: Cash / Bank Transfer / Other / Not yet — chase later
- "Not yet" → job moves to Awaiting Payment + chase task created in L3
- Any other option → job moves to Paid + payment record created

---

## 10. Missed Call Flow

1. Dave taps "Log Missed Call" on home footer
2. Screen: phone number + optional name
3. Two CTAs: [Save & call back] (dials immediately) / [Save only]
4. Record saved → appears in Tasks tab as L3 card
5. Task card shows: 📞 number · time ago · [Call back] [Create quote] [Dismiss]
6. Dave calls back to confirm it's a lead, then taps [Create quote]
7. Quote flow starts with phone number pre-filled

---

## 11. Quote Flow

### Entry points
- **A**: Home "Log Missed Call" → QF-1 → QF-2 (task card) → QF-3
- **B**: Home "+ New Quote" → QF-3

### Screens
| Screen | Purpose |
|---|---|
| QF-1 — Log Missed Call | Phone + optional name capture |
| QF-2 — Task card | Missed call in Tasks tab with 3 actions |
| QF-3 — Customer details | Name + phone (mandatory), address (optional plain text) |
| QF-4 — Quote builder | Job title, date/time, line items, payment terms — single scrolling screen |
| QF-5 — Deposit % variant | Same as QF-4, but Deposit selected → % presets visible, auto-scrolls into view |
| QF-6 — Quote preview | Review before sending — clean card layout |
| QF-7 — Send sheet | Plain text message (editable), WhatsApp/SMS/Copy/Save draft |
| QF-8 — Sent | Success + "Job saved as Quoted. Mark as Booked when Richards confirms." |

### Quote builder rules
- All line items MUST have an amount — no TBC items in MVP
- Empty amount field = blocked (cannot proceed to Preview)
- Deposit % is calculated from total: `depositAmount = total * (pct / 100)`
- When Deposit is selected: auto-scroll deposit section into view (`scrollIntoView({ behavior: 'smooth', block: 'nearest' })`)
- Total updates live as items are added/removed/changed

### Send method (MVP)
Plain text message via WhatsApp deep link: `https://wa.me/447700900123?text=Hi%20Richards...`
Or SMS deep link: `sms:+447700900123?body=Hi%20Richards...`
No PDF. No hosted link. These are Phase 2.

### After sending
Job is created with status `quoted`. It does NOT auto-move to Booked. Dave manually taps "Mark as Booked" when the customer confirms verbally.

### Business name gate
If business name is empty (skipped in onboarding), block quote Send with nudge: "Add your business name in Settings before sending your first quote."

---

## 12. Job Detail — State Specs

### Header rule (all states)
**Shows:** Customer name (large) + job title (small). **Nothing else.** No address, no amount.
**Active states** (Booked, In Progress, Awaiting Payment, No-Show): show [📞] [💬] contact buttons
**Terminal states** (Paid, Cancelled, Written Off): no contact buttons

### Address rule
Address shown **only** in the Booked state — in the map preview and info card. Nowhere else.

### Amount consolidation rules
| State | Where amount appears |
|---|---|
| Booked | Invoice items total only (1×) |
| In Progress | Invoice items total only (1× — updates live) |
| Awaiting Payment | Amount card (hero) + items total (breakdown) — 2× justified |
| Paid | Status badge + items total — 2× justified |
| No-Show | Not shown |
| Cancelled | Not shown |
| Written Off | Once in record card |

### States summary
| State ID | Status | Key content | Primary CTA |
|---|---|---|---|
| s1 | Booked | Map + info card (date, payment terms) + quote items | Edit details / Cancel job |
| s2 | Cancel sheet | Reason: Customer cancelled / I cancelled / Keep job | — |
| s3 | In Progress | Work log + invoice items (with ×) + total | Mark Done |
| s4 | Add Charge sheet | Description + amount fields | Add to invoice |
| s5 | Mark Done sheet | How were you paid? Cash/Bank/Other/Not yet | — |
| s6 | Awaiting Payment | Amount card (hero) + items | Mark as Paid |
| s7 | Send Reminder sheet | Editable pre-filled message | Send via WhatsApp/SMS |
| s8 | No-Show | Record card | Reschedule |
| s9 | Callout Charge sheet | Description + pre-filled amount | Create invoice |
| s10 | Paid | Status badge + work log + items + invoice link | None (read-only) |
| s11 | Cancelled | Reason + notes field (expanded by default) | None (read-only) |
| s12 | Written Off | Amount in record card + work log | None (read-only) |

### Work log
- **Add note**: Free text, no price. Diary entry for Dave's records.
- **Add charge**: Description + amount (numerical keyboard). Creates a line item AND a work log entry. Green highlight on added items.
- Green colour = `#15803D` (charge entries in work log) and `qi-added` class in invoice items

### No-Show — Callout charge
- Pre-fills description: "Callout charge"
- Pre-fills amount: Dave's default from Settings (default £75)
- Creates a **separate invoice** for the callout (does not modify the original job total)

### Inline item removal (In Progress, Booked)
Customer asks Dave to remove an item. Dave taps × on that item in the invoice items list. Item removed, total updates instantly. Available on: Booked (s1), In Progress (s3/s4/s5). NOT available on Awaiting Payment (invoice locked) or terminal states.

---

## 13. Jobs List

### Groups (top to bottom)
1. In Progress (green dot)
2. Booked (blue dot)
3. Quoted (purple dot)
4. Awaiting Payment (amber dot)
5. No-Show (orange dot)
6. Paid — collapsed (tap to expand)
7. Cancelled — collapsed
8. Written Off — collapsed

### Filter chips
- **All** — everything
- **Active** — In Progress + Booked
- **Unpaid** — Awaiting Payment only (sorted by urgency: overdue first)

### Job row layout
`[status dot] Customer · Job title / contextual sub-line [flag badge] [amount] [›]`

Contextual sub-line by status:
- In Progress: "Wed 14 May · 2h 14m in"
- Booked: "Wed 14 May · 10am"
- Quoted: "Sent 2 days ago"
- Awaiting Payment: "Invoice sent 3 days ago"
- No-Show: "14 May · 9am"

---

## 14. Onboarding

### 4 screens, progress bar (4 segments)

| Screen | Fields | Skip? |
|---|---|---|
| s1 — Welcome | Your name (mandatory), Phone (mandatory) | No skip |
| s2 — Business | Business name (optional), Trade type (4 options) | Yes |
| s3 — Defaults | Callout charge (£), Payment terms (segmented), Quote valid days | Yes |
| s4 — Done | Confirmation + "Go to home" | N/A |

**Business name behaviour if skipped:**
- Quote preview shows placeholder: "Add your business name"
- Quote Send is blocked with nudge: "Add your business name in Settings before sending"
- Settings shows red nudge banner + highlighted empty row

---

## 15. Settings

### Inline edit (no sub-screens)
Tap any value → field becomes `<input>` in place. [Done] button confirms. Segmented control for limited-choice fields.

### Sections
1. **Business profile**: Your name, Business name, Phone, Trade
2. **Quote defaults**: Payment terms (segmented), Valid for (days)
3. **Job defaults**: Callout charge (£)
4. **About**: Version, Privacy policy, Terms, Log out

---

## 16. Notifications (MVP)

### End-of-day unpaid nudge
- Fires at 6pm if 1+ jobs in Awaiting Payment state
- Copy: "X jobs marked done today. Did you get paid? Tap to confirm."
- Tapping opens Jobs list filtered to Unpaid

### No other notifications for MVP
(Auto-follow-up SMS, review requests, etc. are Phase 2 auto-magic)

---

## 17. UI Rules (Non-Negotiable)

### Touch targets
- Primary CTA: **52px height**, full width, border-radius 12px
- Secondary CTA: **46px height**, full width, border-radius 12px
- List rows: **56px min-height**
- Icon buttons: **40×40px minimum**
- Back button: **44px min-height**

### Form inputs
- Height: **48px minimum**
- Font size: **16px** (prevents iOS auto-zoom on focus)
- Amount fields: `inputmode="decimal"` attribute (triggers numerical keyboard)

### Sticky footer CTAs
All primary/secondary CTAs on **detail screens** must be in a sticky footer pinned above the device safe area. Never inline at the bottom of a scroll view. The footer has `box-shadow: 0 -4px 12px rgba(0,0,0,.06)` to float visually above content.

### No tab bar on detail screens
Tab bar (Home/Jobs/Activity/Settings) is **hidden** on all detail screens (Job Detail, Quote flow steps). Only visible on top-level screens (Home, Jobs, Settings).

### Bottom sheets
Standard pattern for quick actions. Structure: handle (36px wide, 4px tall) → title → sub-text → options (56px each) → optional action button. Overlay: `rgba(0,0,0,0.25)`.

### Icons
All Lucide React icons. The wireframe HTML files have comments mapping emoji → Lucide icon name. Example:
```
📞 → Phone
💬 → MessageCircle
💵 → Banknote
🏦 → Building2
✏️ → Pencil
🕐 → Clock
📍 → MapPin
‹ → ChevronLeft
× → X
```

### Viewport
Mobile-first. Target: 375–430px wide (iPhone SE to Pro Max). No desktop breakpoints for MVP.

### Desktop containment (App Shell)
The app runs inside a max-width scoped shell on all viewports. This prevents broken layout on desktop without requiring a separate responsive design.

```
body         → background: #F3F4F6, full viewport
#app-shell   → max-width: 430px, min-height: 100svh, margin: 0 auto,
               background: #fff, position: relative, overflow-x: hidden
               box-shadow: 0 0 40px rgba(0,0,0,.08) (visible on desktop only)
```

**Critical:** All `position: fixed` and `position: sticky` elements (BottomSheet, TabBar, StickyFooter, ActiveBar) must be scoped to `#app-shell`, NOT to the viewport. Use `position: absolute` within the shell where viewport-fixed behaviour is needed.

### Desktop nudge banner (MVP — temporary)
On viewports wider than 768px, show a persistent dismissible banner inside the app shell:

```
[banner — background #111827, color #fff, padding 12px 16px, font-size 13px]
  "TradePad is designed for your phone — for the best experience, open it on mobile."
  [✕ dismiss button — right side, 28×28px, stores dismiss in localStorage]
```

- Banner appears at the top of every screen on desktop
- Dismissed state persists in `localStorage` key `tp_desktop_nudge_dismissed`
- This is a **temporary MVP measure** — replace with proper desktop UI in Phase 2
- Sign-up (Auth + Onboarding) still works fully on desktop via the shell

---

## 18. Error States & Recovery

Every error must offer a recovery path within 2 taps.

| Error | Recovery |
|---|---|
| No network | Show "Offline — changes saved locally" toast. No blocking UI. |
| Supabase sync failed | Retry silently in background. Show "Syncing…" badge if >30s behind. |
| Empty required field | Inline red border + "Required" label below field. Block CTA, no modal. |
| Business name missing at quote send | Show nudge below [Send] button: "Add your business name in Settings first." |
| Quote amount field empty | Highlight field red, block "Preview" button, show "Enter an amount or remove this item" |

---

## 19. Offline Behaviour

- **Reads**: Always from Dexie (local). Never wait for network.
- **Writes**: Write to Dexie immediately, queue sync to Supabase.
- **Sync queue**: Table `sync_queue` in Dexie. Process on reconnect.
- **Conflict resolution**: Last-write-wins. Most recent `updated_at` timestamp wins.
- **User-visible**: "Saved on device" badge if offline. "Synced" when caught up.

---

## 20. Deferred — Phase 2 (DO NOT BUILD IN MVP)

These are explicitly out of scope. Do not reference them in MVP code.

| Feature | Phase |
|---|---|
| Stripe payment links | Phase 2 (Pro tier) |
| PDF quote generation | Phase 2 |
| Hosted quote link (URL) | Phase 2 |
| Postcode lookup API | Phase 2 |
| Auto-pull from call log | Phase 2 (PWA cannot access) |
| Evidence pack PDF (dispute) | Phase 2 |
| Dispute management screen | Phase 2 |
| CIS tax tracking | Phase 2 |
| Accountant / HMRC export | Phase 2 |
| Rate card / saved line items | Phase 2 |
| Customer database / lookup | Phase 2 |
| Activity feed screen | Phase 2 |
| Auto-follow-up SMS (quotes, invoices) | Phase 2 |
| Google review request | Phase 2 |
| Open Banking integration | Phase 3 |
| Voice-to-quote | Phase 3 |
| Subcontractor coordination | Phase 3 |
| Multi-device real-time sync UI | Phase 3 |

---

*End of MASTER-PRD.md — Version 1.0*
