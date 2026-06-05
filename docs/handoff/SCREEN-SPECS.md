# TradePad — Screen Specifications
## Version 1.0 — All Screens, All States

> **How to use this document**
> Each screen is fully specified here: all states, all visible elements, all CTAs, all business logic. The wireframe HTML file is the visual reference; this document is the functional reference. Both must be satisfied. When in conflict, this document wins.
>
> Wireframe files are at: `/Users/niravarvinda/Workspace/projects/TradePad/wireframes/`

---

## Screen Index

1. Auth (Phone OTP sign-in)
2. Onboarding (4 screens)
3. Home (Today tab + Tasks tab — 12 states)
4. Job Detail (12 states)
5. Quote Flow (8 screens)
6. Jobs List (3 states)
7. Settings (3 states)

---

## Screen 1: Auth

**File:** `src/screens/Auth.tsx`
**Wireframe:** none (simple single screen)
**Tab bar:** hidden

### State: Sign In
```
[TradePad logo/wordmark — center, 28px bold]
[headline — "Enter your mobile number" — 22px, 700]
[sub — "We'll send you a code" — 14px, #9CA3AF]

[phone input — 48px min, border 1.5px #E5E7EB, border-radius 12px]
  [+44 prefix — fixed, 15px, #111827]
  [number input — flex 1, inputmode="tel", 15px]

[Continue button — primary, 52px]

[note — "UK mobile numbers only" — 12px, #9CA3AF, center]
```

### State: OTP Entry
```
[headline — "Check your messages" — 22px, 700]
[sub — "Sent to +44 7XXX XXXXXX" — 14px, #9CA3AF]

[6-digit OTP input — single input, inputmode="numeric", large 32px, tracking 8px, center]

[Verify button — primary, 52px]

[Resend link — "Resend code" — ghost, center, 13px, after 30s countdown]
```

### Business rules
- Validate UK mobile format: `^(\+44|0)7\d{9}$`
- Strip leading 0, normalise to `+44` format before Supabase call
- On verify success: check if `profiles` row exists for this auth.uid
  - If yes: navigate to Home
  - If no: navigate to Onboarding (Screen 2)

---

## Screen 2: Onboarding

**File:** `src/screens/Onboarding/index.tsx` (manages 4 sub-screens)
**Wireframe:** `onboarding.html`
**Tab bar:** hidden

### S1 — Welcome (mandatory)
```
[ProgressDots total=4 current=1]

[headline — "Hi, what's your name?" — 26px, 800]
[sub — "Just you for now — you can add your team later." — 15px, #9CA3AF]

[Your name field — mandatory]
[Your phone number field — mandatory, pre-filled from auth, read-only]

[StickyFooter]
  [Continue → button — primary — disabled until name is filled]
```

**Business rules:**
- Phone field pre-filled from auth, non-editable (user can update in Settings)
- [Continue] blocked until `full_name.trim().length > 0`
- On continue: write to Dexie profiles + sync queue

### S2 — Business (optional, skippable)
```
[ProgressDots total=4 current=2]

[headline — "Tell us about your business" — 26px, 800]
[sub — "This appears on quotes. You can update it any time." — 15px, #9CA3AF]

[Business name field — optional, placeholder "Dave's Plumbing & Heating"]
[Trade type grid — 2×2, Plumber / Electrician / Builder / Other]
  — only one selectable at a time

[StickyFooter]
  [Continue → button — primary]
  [Skip link — "Skip — I'll set this up later" — ghost, center]
```

**Business rules:**
- Trade type: at most one selected. Tap again to deselect (but selection encouraged)
- [Continue] enabled even if fields empty (this screen is optional)

### S3 — Defaults (optional, skippable)
```
[ProgressDots total=4 current=3]

[headline — "Set your defaults" — 26px, 800]
[sub — "Saves you time on every job. Change any time in Settings." — 15px, #9CA3AF]

[Callout charge field — £, numeric, default £75]
  [side note — "Charged when customer not home"]

[Default payment terms — SegmentedControl]
  options: On completion / Deposit / Invoice
  default: "On completion"

[Quote valid for — numeric field, days, default 30]
  [side note — "After this, quote expires automatically"]

[StickyFooter]
  [Continue → button — primary]
  [Skip link — ghost]
```

### S4 — Done
```
[ProgressDots total=4 current=4]

[centered layout — full screen]
  [checkmark circle — 80px, background #F0FDF4, border-radius 50%, ✓ #15803D]
  [title — "You're all set, {first_name}" — 26px, 800]
  [sub — "Log a missed call or create your first quote to get started." — 15px, #6B7280]

[StickyFooter]
  [Go to home → button — primary]
```

**Business rules:**
- Write complete profile to Dexie + sync queue on reaching S4
- [Go to home] navigates to Home (Today tab)

---

## Screen 3: Home

**File:** `src/screens/Home/index.tsx`
**Wireframe:** `home.html`
**Tab bar:** visible

### Header (all states)
```
[16px top padding]
["TradePad" wordmark — left, 20px, 800, #111827]
[+ New Quote button — right, 13px, 600, border 1px #E5E7EB, border-radius 8px, padding 8px 12px]
```

### HomeTabSwitcher
```
[Today | Tasks] — always visible below header
```

---

### TODAY TAB STATES

#### S1 — Next Up (job booked for today, none active)
```
[HomeTabSwitcher — "Today" active]
[JobCard — isNextUp=true]
  customer name + job title
  address (if set) + scheduled time
  line items total
  [Running late] secondary + [I'm here] primary CTAs
[TodayStrip — if 2+ jobs today]
```

#### S2 — Running Late Sheet (sheet over S1)
```
[BottomSheet over S1]
  [title — "Let {customerName} know you're running late"]
  [pre-filled message — editable]
    "Hi {customerName}, just a heads up — I'm running a bit late.
    I should be with you around {estimated time}. Sorry for any inconvenience!"
  [WhatsApp button — primary]
    icon: MessageCircle
    label: "Send via WhatsApp"
    action: open `https://wa.me/{phone}?text={encoded_message}`
  [SMS button — secondary]
    label: "Send via SMS"
    action: open `sms:{phone}?body={encoded_message}`
  [Cancel link — ghost]
```

**Business rules:**
- Message is editable before sending (textarea, pre-filled)
- After send: close sheet, show "customer notified" log entry in work log
- Write `work_log` entry: type=`customer_notified`, description = "Customer notified via WhatsApp · {time}"

#### S3 — Customer Notified (after Running Late sent)
```
[HomeTabSwitcher]
[JobCard — same as S1 BUT]
  [below meta row — green log line]
    Check icon 12px #15803D + "Customer notified · {time}" 12px #15803D
  [same CTAs — Running late / I'm here]
```

#### S4 — I'm Here / In Progress (job started)
```
[ActiveBar — full width]
  pulse dot + "{customerName} · {jobTitle}" + elapsed time
[JobCard for next booked job — if any, no CTAs shown — tap only]
[TodayStrip for remaining jobs after next — if any]
[+ Log missed call FAB — bottom right, 52px circle, background #111827]
  Plus icon, white
```

**Business rules:**
- "I'm here" tap:
  1. Updates job.status = 'in_progress'
  2. Sets job.actual_start = now()
  3. Writes work_log: type='status_change', description='Job started'
  4. Home transitions to S4

#### S5 — Mark Done Sheet (no deposit on this job)
```
[BottomSheet]
  [title — "How were you paid?"]
  [sub — "for {customerName} · {jobTitle}"]
  [Sheet rows]
    [💵 Cash — SheetRow]
    [🏦 Bank Transfer — SheetRow]
    [Other — SheetRow + "Entered manually" sublabel]
    [Not yet — SheetRow — "Chase later" sublabel, destructive style]
```

**Business rules:**
- Cash / Bank Transfer / Other:
  1. Create payment: type='full', method=selection, amount=job_total
  2. Update job.status = 'paid'
  3. Update job.actual_end = now()
  4. Write work_log: type='status_change', description='Payment recorded — {method} £{amount}'
- Not yet:
  1. Update job.status = 'awaiting_payment'
  2. Update job.invoice_sent_at = now() (invoice clock starts)
  3. Create chase task in Tasks tab (L3)
  4. Write work_log: type='status_change', description='Job completed — payment pending'

#### S6 — Mark Done Sheet (with deposit)
```
[BottomSheet — same structure as S5 but]
  [hero card at top]
    "Balance to collect" label
    "£{total - deposit_amount}" hero amount
    "£{deposit_amount} deposit already paid" sub
  [same payment method rows — but no Bank Transfer for cash-deposit jobs]
```

**Business rules:**
- Deposit amount = job.deposit_pct / 100 × job_total
- Payment type = 'balance' (not 'full')
- [Bank Transfer] shown only if payment_terms != 'deposit' (because deposit was likely cash)

#### S7 — All Clear (no jobs today)
```
[HomeTabSwitcher — Today active]
[empty card — dashed border 2px #E5E7EB, border-radius 12px, padding 32px]
  [center]
    "No jobs today" — 15px, 600, #9CA3AF
    "Enjoy the break, or add a new quote." — 13px, #9CA3AF, margin-top 4px
[+ New Quote button — secondary, below empty card]
```

#### S8 — No Jobs Today (vs All Clear)
S7 and S8 are the same state. "No Jobs Today" = no jobs scheduled. "All Clear" = all jobs for today are completed. Display is identical — show the empty card.

#### S9 — Multi-day Job Active
```
[ActiveBar — "Day 2" instead of elapsed time]
  job.is_multi_day = true, calculate day number from actual_start
[rest as per S4]
```

---

### TASKS TAB STATES

#### S10 — Tasks Tab (L2 + L3 items)
```
[HomeTabSwitcher — Tasks active]
[L2 section — "CAN'T IGNORE" label — if any L2 items]
  [TaskCard for each overdue / urgent_new / no_show item]
[L3 section — "WHEN YOU GET A MINUTE" label — if any L3 items]
  [TaskCard for each chase / stale_quote / missed_call item]
[Empty state — if no tasks]
  "Nothing to do 👍" — 15px, center, #9CA3AF
```

#### Task card types and their actions:

**Overdue (Awaiting Payment >30 days)**
```
FlagBadge: overdue
Text: "{customerName} · {jobTitle}"
Sub: "Invoice sent {n} days ago · £{amount}"
Actions: [Send reminder] [Mark as paid] [Write off]
```

**Chase (Awaiting Payment 1-29 days)**
```
FlagBadge: chase
Text: "{customerName} · {jobTitle}"
Sub: "Invoice sent {n} days ago · £{amount}"
Actions: [Send reminder] [Mark as paid]
```

**Urgent New (Enquiry <2h old)**
```
FlagBadge: urgent_new
Text: "{phone}" or "{name} · {phone}"
Sub: "Missed call · {time ago}"
Actions: [Call back] [Create quote] [Dismiss]
```

**No-Show**
```
FlagBadge: no_show
Text: "{customerName} · {jobTitle}"
Sub: "{date} · {time}"
Actions: [Reschedule] [Charge callout] [Cancel]
```

**Stale Quote**
```
FlagBadge: stale
Text: "{customerName} · {jobTitle}"
Sub: "Quote sent {n} days ago"
Actions: [Follow up] [Mark as booked] [Cancel]
```

**Missed Call (Enquiry, created from "Log missed call")**
```
FlagBadge: urgent_new (if <2h) or none (if older)
Text: "{phone}" or "{name}"
Sub: "Missed call · {time ago}"
Actions: [Call back] [Create quote] [Dismiss]
```

---

## Screen 4: Job Detail

**File:** `src/screens/JobDetail/index.tsx`
**Wireframe:** `job-detail.html`
**Tab bar:** hidden

### Header (all states — CONSTANT)
```
[back button — ChevronLeft icon, "← Back", min-height 44px, left]
[center]
  customer.name — 18px, 800, #111827
  job.title — 13px, #6B7280
[right — contact buttons (active states only)]
  [Phone button — 40×40px icon] → dial customer.phone
  [MessageCircle button — 40×40px icon] → SMS/WhatsApp deep link to customer.phone
```

**HEADER RULE (non-negotiable):**
- Shows: customer name + job title ONLY
- Does NOT show: address, amount, status badge, date

**CONTACT BUTTONS RULE:**
- Show on: booked, in_progress, awaiting_payment, no_show
- Hide on: paid, cancelled, written_off, enquiry, quoted

---

### S1 — Booked
```
[Header — name + title + contact buttons]

[StatusBadge — "Booked" blue pill — below header, left-aligned]

[MapPreview — 120px height, address, tap to open maps]

[Info card — background #F9FAFB, border 1px #E5E7EB, border-radius 12px, padding 16px]
  [row] Clock icon + scheduled_start formatted + scheduled_end
  [row] CreditCard icon + payment terms label
  [row — if deposit_pct] Banknote icon + "Deposit: {pct}% (£{amount})"

[Invoice section label — "INVOICE"]
  [InvoiceItemRow for each line_item — showRemove=true, onRemove → remove line item]
  [+ Add item link — underlined]
  [Total row — always shown]

[StickyFooter]
  [Edit details button — secondary]
    opens bottom sheet with editable fields
  [Cancel job link — ghost, destructive colour]
    opens Cancel sheet (S2)
```

**Amount rule:** Amount shown ONCE — in the invoice items total row. Not in header, not in info card.

**Address rule:** Address shown ONLY in MapPreview. Not in header.

### S2 — Cancel Sheet
```
[BottomSheet]
  [title — "Why are you cancelling?"]
  [SheetRow — "Customer cancelled"]
    onTap → set cancellation_reason='customer_cancelled', status='cancelled'
  [SheetRow — "I need to cancel"]
    onTap → set cancellation_reason='dave_cancelled', status='cancelled'
  [SheetRow — "Keep the job" — keeps sheet open, does nothing, closes sheet]
```

### S3 — In Progress
```
[Header — name + title + contact buttons]
[StatusBadge — "In Progress" green pill]
[ActiveBar pill variant — "Started {time}" or "Day {n}"]

[Work Log section — "WORK LOG" label]
  [WorkLogEntry for each work_log entry, newest at top]
    type=note: Clock icon + time + description
    type=charge: Clock icon + time + description + amount (green)
    type=status_change: text log entry (grey, smaller)
  [+ Add note link — underlined]
  [+ Add charge link — underlined, below Add note]

[Invoice section — "INVOICE" label]
  [InvoiceItemRow for each — showRemove=true, isAddedOnSite=item.added_on_site]
  [Total row]

[StickyFooter]
  [Mark Done button — primary]
    opens payment sheet (S5 or S6)
  ["Customer not home?" link — ghost, below button, muted, underlined]
    opens No-Show flow
```

### S4 — Add Charge Sheet
```
[BottomSheet]
  [title — "Add a charge"]
  [Description field — text input, placeholder "What did you do?"]
  [Amount field — £ prefix, inputmode="decimal", placeholder "0.00"]
  [Add to invoice button — primary, disabled until both fields filled]
```

**On Add:**
1. Create line_item: { description, amount, added_on_site: true }
2. Create work_log: { type='charge', description="{desc} — £{amount}", amount, line_item_id }
3. Invoice total updates live in parent screen

### S5 — Mark Done Sheet
Same as Home S5 and S6 — see Home screen specs.

### S6 — Awaiting Payment
```
[Header — name + title + contact buttons]
[StatusBadge — "Awaiting Payment" amber pill]

[AmountCard — hero amount display]
  "Amount due" label
  "£{job_total}" hero — 32px, 800
  "for {customerName}" sub
  [Overdue badge — if invoice_sent_at is 30+ days ago]

[Invoice section — "INVOICE" label]
  [InvoiceItemRow for each — showRemove=false (locked)]
  [Total row]

[StickyFooter]
  [Mark as Paid button — primary]
    opens payment method sheet
  [Send Reminder button — secondary]
    opens S7 Send Reminder sheet
```

**Invoice locked rule:** No add/remove from Awaiting Payment onwards.

### S7 — Send Reminder Sheet
```
[BottomSheet]
  [title — "Send a reminder"]
  [pre-filled message — editable textarea]
    "Hi {customerName}, just a reminder about the invoice for {jobTitle}.
    Amount due: £{amount}.
    Thanks, {dave_name}"
  [WhatsApp button — primary]
  [SMS button — secondary]
  [Copy to clipboard link — ghost]
```

**On send:**
- Write work_log: type='status_change', description='Reminder sent via {method}'
- Update job.invoice_sent_at = now() (resets the chase clock)

### S8 — No-Show
```
[Header — name + title + contact buttons]
[StatusBadge — "No-Show" orange pill]

[Record card — background #FEF3C7 (amber tint), border-radius 12px, padding 16px]
  "Customer wasn't home" — 15px, 600, #92400E
  "{date} · {scheduled_time}" — 13px, #92400E

[StickyFooter]
  [Reschedule button — secondary]
    opens date picker → updates scheduled_start, sets status='booked'
  [Charge callout button — secondary]
    opens S9 Callout sheet
  [Cancel / write off link — ghost, destructive]
    opens Cancel sheet (S2 variant for no-show)
```

### S9 — Callout Charge Sheet
```
[BottomSheet]
  [title — "Create a callout invoice"]
  [Description field — pre-filled "Callout charge", editable]
  [Amount field — pre-filled with profile.callout_charge (e.g. £75), editable]
  [Create invoice button — primary]
```

**On create:**
1. Create a NEW job (separate from original): status='awaiting_payment', title='Callout charge', customer_id=same customer
2. Create one line_item for that new job: { description, amount }
3. Set new job.invoice_sent_at = now()
4. Navigate to that new job's detail screen (Awaiting Payment state)
5. Original job remains in No-Show status

### S10 — Paid (read-only)
```
[Header — name + title — NO contact buttons]
[StatusBadge — "Paid" green pill]

[Payment record card — background #F0FDF4, border-radius 12px, padding 16px]
  ✓ icon + "Paid" — 15px, 700, #15803D
  "{method} · £{amount}" — 13px, #6B7280
  "Recorded {date}" — 12px, #9CA3AF

[Work Log section — "WORK LOG" label — all entries, collapsed after 3 items]
  [Show more link if >3 entries]

[Invoice section — "INVOICE" label — all items expanded by default]
  [InvoiceItemRow for each — showRemove=false]
  [Total row]

[No sticky footer — read only]
```

**Invoice number display:** "INV-1001" shown as section header, small text, 12px, #9CA3AF.

### S11 — Cancelled (read-only)
```
[Header — name + title — NO contact buttons]
[StatusBadge — "Cancelled" grey pill]

[Record card — background #F9FAFB, border-radius 12px, padding 16px]
  "Cancelled" — 15px, 600, #374151
  cancellation_reason displayed human-readable
  "{date}" — 13px, #9CA3AF
  
[Notes field — expanded by default (not collapsible)]
  label: "NOTES"
  content: job.notes or empty placeholder
  [read-only text area]

[No sticky footer — read only]
```

### S12 — Written Off (read-only)
```
[Header — name + title — NO contact buttons]
[StatusBadge — "Written Off" grey pill]

[Record card — background #F9FAFB, padding 16px]
  "Written off" — 15px, 600, #374151
  "£{job_total} — {jobTitle}" — 13px, #6B7280
  "{date}" — 12px, #9CA3AF

[Invoice section — all items expanded by default]

[No sticky footer — read only]
```

---

## Screen 5: Quote Flow

**File:** `src/screens/Quote/index.tsx`
**Wireframe:** `quote.html`
**Tab bar:** hidden

### Entry points
- **Entry A:** Home "Log Missed Call" → QF-1 → QF-2 (task card in Tasks tab) → tap "Create quote" on task → QF-3
- **Entry B:** Home "+ New Quote" → QF-3 directly

### QF-1 — Log Missed Call
```
[Step header]
  [← Back] / [✕ Cancel]
  title: "Missed call"

[Phone number field — mandatory, inputmode="tel"]
[Name field — optional]

[StickyFooter]
  [Save & call back button — primary]
    saves enquiry + dials immediately via `tel:{phone}` link
  [Save only button — secondary]
    saves enquiry, navigates back to Home (Tasks tab)
```

**On save:**
1. Create customer: { name: name||'Unknown', phone }
2. Create job: { customer_id, status='enquiry', title='Missed call' }
3. Create work_log: { type='status_change', description='Missed call logged' }
4. Task card appears in Home Tasks tab as L3 (or L2 if <2h old)

### QF-2 — Missed Call Task Card
(This appears in the Tasks tab, not a full screen. Spec is in Home S10 Task cards section.)

### QF-3 — Customer Details
```
[Step header]
  [← Back]
  title: "Customer details"

[Customer strip — if returning from missed call, pre-filled]
  name + phone + "Edit" link

[Name field — mandatory, pre-filled if from missed call]
[Phone field — mandatory, pre-filled if from missed call]
[Address field — optional, plain text, placeholder "e.g. 12 Oak Street, London, SW1A 1AA"]

[StickyFooter]
  [Next → button — primary — disabled until name + phone filled]
```

### QF-4 — Quote Builder
```
[Step header]
  [← Back]
  title: "Quote"
  [Save draft link — right, ghost]

[Customer strip — name + phone + "Edit" link]

[Job title field — mandatory, placeholder "e.g. New boiler installation"]

[Date & time field — optional]
  native datetime-local input, styled as field-input

[Line items section — "WHAT'S INCLUDED" label]
  [InvoiceItemRow (form variant) for each item]
    description input (flexible width) + amount input (£, inputmode="decimal") + × remove
  [+ Add item link — underlined]
  [Validation: each amount field required — red border if empty]
  [Total bar — live updates]

[Payment terms section]
  [SegmentedControl — On completion / Deposit / Invoice]
  [if Deposit selected]
    [depositSection — auto-scrolls into view]
    label: "DEPOSIT %"
    [% options row — 10% / 20% / 25% / 50% / Custom]
    [if Custom: amount input, inputmode="decimal"]
    [calc display: "Deposit: £{X} · Balance on completion: £{Y}"]

[StickyFooter]
  [Preview Quote button — primary]
    disabled if any amount field empty OR job title empty
```

**Business rules:**
- All line item amounts are required (no TBC items)
- [Preview Quote] blocked if any amount is empty
- Auto-scroll: `depositSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on Deposit select
- "Save draft": saves job as status='enquiry' without transitioning to Quoted

### QF-5 — Deposit Variant
Same as QF-4 with Deposit segment selected. Not a separate screen.

### QF-6 — Quote Preview
```
[Step header]
  [← Back]
  title: "Preview"

[QuotePreviewCard — full spec in COMPONENT-LIBRARY.md §10]
  businessName, customerName, quoteNumber (auto-generated), jobTitle
  lineItems, paymentTerms, depositPct, quoteValidDays

[Business name gate — if business_name is empty]
  [amber nudge banner]
    AlertTriangle icon + "Add your business name before sending"
    [→ Settings link]
  [Send button — disabled]
```

### QF-7 — Send Sheet
```
[BottomSheet]
  [title — "Send to {customerName}"]
  [message preview — editable textarea]
    "Hi {customerName}, here's your quote for {jobTitle}:
    
    {each line item: "• {description} — £{amount}"}
    
    Total: £{total}
    {if deposit: "Deposit: £{depositAmount}"}
    Payment: {payment_terms_label}
    Quote valid for {quote_valid_days} days.
    
    {businessName}"
  [WhatsApp button — primary, icon MessageCircle]
    `https://wa.me/{phone}?text={encoded}`
  [SMS button — secondary]
    `sms:{phone}?body={encoded}`
  [Copy to clipboard link — ghost]
  [Save as draft link — ghost]
```

**On send (WhatsApp/SMS/Copy):**
1. Update job: status='quoted', quote_sent_at=now(), quote_expires_at=now()+validDays
2. Write work_log: type='status_change', description='Quote sent via {method}'
3. Navigate to QF-8

**Save as draft:**
- Job remains in 'enquiry' status
- Navigate back to Home

### QF-8 — Sent
```
[full screen]
  [✓ circle — 64px, background #F0FDF4, border-radius 50%]
  [title — "Quote sent!" — 22px, 800]
  [sub — "Saved as Quoted. Mark as Booked when {customerFirstName} confirms." — 14px, #6B7280]
  
  [next steps card — background #F9FAFB, border-radius 12px, padding 16px]
    "• You'll see this in Jobs under Quoted"
    "• Mark it as Booked when the customer confirms verbally"

[StickyFooter]
  [Done button — primary]
    navigates to Home (Today tab)
  [View job button — secondary]
    navigates to Job Detail for this job (Booked state)
```

---

## Screen 6: Jobs List

**File:** `src/screens/Jobs/index.tsx`
**Wireframe:** `jobs.html`
**Tab bar:** visible

### Header
```
[title — "Jobs" — 22px, 800]
[filter chips row]
  [All chip] [Active chip] [Unpaid chip]
  active chip: background #111827, white text, border-radius 999px
  inactive: background #F3F4F6, #6B7280 text
```

### S1 — All Jobs (grouped by status)
Groups appear in this order (only if group has items):
1. In Progress
2. Booked
3. Quoted
4. Awaiting Payment
5. No-Show
6. **Paid** — collapsed (tap header to expand)
7. **Cancelled** — collapsed
8. **Written Off** — collapsed

```
[Group header — status name + count]
  status label — 11px, 700, uppercase, #9CA3AF
  count — 11px, #9CA3AF (right)

[Job row — for each job in group]
  min-height: 56px
  [left — status dot 8px + flex 1]
    "{customerName} · {jobTitle}" — 14px, 600, #111827
    [contextual sub-line — 12px, #9CA3AF]
      In Progress: "Started {time ago}"
      Booked: "{date} · {time}"
      Quoted: "Sent {n} days ago"
      Awaiting Payment: "Invoice sent {n} days ago"
      No-Show: "{date} · {time}"
      Paid: "Paid {date}"
  [right]
    [FlagBadge if applicable]
    "£{job_total}" — 14px, 700, #111827 (if amount is relevant)
    ChevronRight 16px #9CA3AF
```

**Collapsed group behaviour:**
- Terminal groups (Paid, Cancelled, Written Off) collapsed by default
- Tap group header → expand/collapse
- Show "Paid (12)" count when collapsed

### S2 — Unpaid Filter
```
[filter chips — "Unpaid" chip active]
[single group — "AWAITING PAYMENT" label]
[jobs sorted by urgency]
  overdue (oldest first)
  then chase (oldest first)
[each row — same as above]
  amount displayed prominently
  overdue flag badge inline
```

### S3 — Empty State
```
[filter chips row]
[center — padding 60px 0]
  Briefcase icon 40px, #E5E7EB
  "No jobs yet" — 15px, 600, #9CA3AF
  "Log a missed call or create a quote to get started." — 13px, #9CA3AF, center
[+ New Quote button — secondary, margin-top 20px]
```

---

## Screen 7: Settings

**File:** `src/screens/Settings/index.tsx`
**Wireframe:** `settings.html`
**Tab bar:** visible

### Header
```
[title — "Settings" — 22px, 800]
```

### S1 — Settings (filled profile)
```
[Business name nudge banner — if business_name is null or empty]
  background: #FEF3C7
  AlertTriangle icon + "Add your business name to send quotes" — 13px, #92400E
  [→ tap nudge row to focus business name field]

[Section: BUSINESS PROFILE]
  [InlineEditRow — "Your name" — value: profile.full_name]
  [InlineEditRow — "Business name" — value: profile.business_name || "" — placeholder "e.g. Dave's Plumbing"]
    highlighted red if empty
  [InlineEditRow — "Phone" — value: profile.phone — inputType="tel"]
  [InlineEditRow — "Trade" — value: profile.trade]
    tap → opens BottomSheet with 4 trade options (not inline text edit)

[Section: QUOTE DEFAULTS]
  [InlineEditRow — "Payment terms" — value: profile.payment_terms]
    tap → opens BottomSheet with SegmentedControl
    show: "On completion" / "Deposit" / "Invoice"
  [InlineEditRow — "Quote valid for" — value: "{profile.quote_valid_days} days" — inputType="number"]

[Section: JOB DEFAULTS]
  [InlineEditRow — "Callout charge" — value: "£{profile.callout_charge}" — inputMode="decimal"]

[Section: ABOUT]
  [row — "Version" — value: "1.0.0"]
  [row — "Privacy policy" — ChevronRight → open URL]
  [row — "Terms" — ChevronRight → open URL]
  [row — "Log out" — destructive colour, #DC2626]
    onTap → confirm dialog → supabase.auth.signOut() → navigate to Auth
```

### S2 — Business Name Empty (nudge)
Same as S1, but business_name InlineEditRow has red border.

### S3 — Inline Edit Active
```
[when user taps a row value]
  — row expands: value becomes <input>, [Done] appears
  — all other rows stay in view state
  — auto-save on blur or Done tap
  — Dexie update + sync queue entry
```

**Auto-save trigger:**
- `onBlur` on the input
- Or tap [Done] button

**No separate save screen. No modal. Edit happens in-place.**

---

## Navigation Structure

```
Auth
  └─ Onboarding (if new user)
       └─ Home
            ├─ Today tab
            │    └─ Job Detail (push) ← tap any job
            │         └─ Quote Flow (push) ← "Create quote" CTA
            ├─ Tasks tab
            └─ + New Quote → Quote Flow (modal push)
  
Home ←→ Jobs ←→ Settings (TabBar)

Jobs
  └─ Job Detail (push)
```

**Tab bar:** shown only on Home, Jobs, Settings. Hidden on all pushed screens.

**Back navigation:** All detail screens have `← Back` in top-left (min-height 44px tap target).

**Job Detail → Quote Flow:** Only reached from a "Create quote" action on a missed call task card.

---

*End of SCREEN-SPECS.md — Version 1.0*
