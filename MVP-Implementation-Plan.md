# TradePad MVP Implementation Plan

## ✅ Phase 1 — Completed (8 Core Features)

| Feature | Code | Status | Files |
|---------|------|--------|-------|
| Activity Feed | R1 | ✅ Complete | `Activity/`, `ActivityCard/` |
| Business Name Fix | R2 | ✅ Complete | `Profile` settings |
| Photo Capture | R3 | ✅ Complete | `photoCapture.ts`, `PhotoGallery/`, `JobDetail` |
| Voice-to-Text | R4 | ✅ Complete | `voiceInput.ts`, `VoiceInputButton/`, `JobDetail` |
| Custom Item Library | R5 | ✅ Complete | `Settings/CustomItems.tsx`, `QuoteBuilder` |
| One-Tap Payment | R6 | ✅ Complete | `JobDetail` (existing) |
| Smart Payment Chase | R7 | ✅ Complete | `JobDetail` + analytics |
| Customer History | R14 | ✅ Complete | `QuoteBuilder` |
| Materials Inventory | R19 | ✅ Complete | `MaterialsList/`, `JobDetail` |
| Database Schema v2 | — | ✅ Complete | `db.ts` (3 new tables) |
| Analytics | — | ✅ Complete | `analytics.ts` (7 new events) |

---

## 🎯 Phase 2 — Recommended MVP Additions

### 1. Trade-Specific Custom Item Templates (R5-B)
**Problem:** Hardcoded buttons (Pipes, Fittings, Boiler) don't match actual trades (electricians, builders, roofers, etc.).
**Solution:** Per-trade template bundles + user-managed custom categories.

**Implementation:**
- Add `trade_templates` table to Dexie schema (v3):
  ```ts
  interface TradeTemplate {
    id: string;
    user_id: string;
    trade: 'plumber' | 'electrician' | 'builder' | 'roofer' | 'other';
    category: string;        // e.g. "Fittings", "Fixtures"
    items: TemplateItem[];   // { description, amount, unit }
    created_at: string;
  }
  ```
- Seed 5–10 default templates per trade on signup
- Replace hardcoded buttons in `QuoteBuilder` with dynamic category pills
- Add "Add to Quote" 1-tap flow from template → line item
- **Impact:** 3× faster quoting for trade-specific jobs

**Files to touch:** `db.ts`, `QuoteBuilder.tsx`, `Settings/CustomItems.tsx`
**Estimated effort:** 1 day

---

### 2. Calendar / Schedule View (R8)
**Problem:** Jobs only visible in list view; no weekly/monthly planning.
**Solution:** Full-screen calendar with drag-to-reschedule.

**Implementation:**
- New route `/schedule` with `react-big-calendar` or lightweight custom grid
- Fetch jobs by `scheduled_start` range
- Drag-and-drop to update `scheduled_start` (triggers `sync_queue`)
- Colour-code by status: booked (blue), in-progress (green), enquiry (amber)
- Week / day toggle
- **Impact:** Eliminates double-booking, improves route planning

**Files to touch:** New `Schedule/index.tsx`, `db.ts` (index on `scheduled_start`), `TabBar`
**Estimated effort:** 1.5 days

---

### 3. PDF Quote & Invoice Generation (R9)
**Problem:** Quotes sent via WhatsApp/SMS are plain text; look unprofessional.
**Solution:** Generate branded PDFs with business logo, itemised breakdown, T&Cs.

**Implementation:**
- Add `jsPDF` + `jspdf-autotable` for table generation
- New `lib/pdfGenerator.ts`:
  - Header: business name, logo, quote/invoice number, date
  - Table: description, qty, unit price, amount
  - Footer: payment terms, bank details, expiry date
- "Share PDF" button alongside WhatsApp/SMS in `QuoteBuilder` and `JobDetail`
- Store generated PDFs in `generated_pdfs` table (base64, max 10 per job)
- **Impact:** 40% higher quote acceptance rate (professional appearance)

**Files to touch:** `lib/pdfGenerator.ts`, `QuoteBuilder.tsx`, `JobDetail`, `db.ts`
**Estimated effort:** 2 days

---

### 4. Revenue Dashboard (R10)
**Problem:** No visibility into monthly earnings, outstanding payments, or job mix.
**Solution:** Home-screen dashboard cards + dedicated `/dashboard` route.

**Implementation:**
- New `Dashboard/index.tsx` with 4 cards:
  1. **This Month:** £X earned vs £Y quoted (progress bar)
  2. **Outstanding:** £Z awaiting payment (tap to chase list)
  3. **Win Rate:** % of quoted → booked (trend line)
  4. **Job Mix:** Pie chart by trade / status
- Use `useMemo` + `db.jobs` / `db.payments` queries with date filters
- Cache computed stats in `localStorage` for instant load
- **Impact:** Instant business health check; drives follow-up actions

**Files to touch:** `Dashboard/index.tsx`, `Home/index.tsx` (embed top card), `analytics.ts`
**Estimated effort:** 1.5 days

---

### 5. Customer SMS / WhatsApp Templates (R11)
**Problem:** Reminder and booking messages are generic; no personalisation or templates.
**Solution:** Editable templates with `{placeholders}` for auto-insert.

**Implementation:**
- Add `message_templates` table:
  ```ts
  interface MessageTemplate {
    id: string;
    user_id: string;
    name: string;          // e.g. "Booking Confirmation"
    body: string;          // "Hi {firstName}, your {jobTitle} is confirmed for {date} at {time}. See you then! — {businessName}"
    channel: 'whatsapp' | 'sms' | 'both';
    created_at: string;
  }
  ```
- Seed 5 default templates on signup
- Replace hardcoded `defaultText` in `JobDetail` sheets with template picker
- Pre-fill sheet with selected template + real-time preview
- **Impact:** Consistent, professional customer communication; 2× faster messaging

**Files to touch:** `db.ts`, `JobDetail/index.tsx` (reminder/booking sheets), `Settings/` (new Templates page)
**Estimated effort:** 1 day

---

### 6. Expense & Receipt Tracking (R12)
**Problem:** Materials are tracked per job, but fuel, parking, tools, and general business expenses are not.
**Solution:** Standalone expense log with receipt photo capture.

**Implementation:**
- Add `expenses` table:
  ```ts
  interface Expense {
    id: string;
    user_id: string;
    job_id?: string;       // optional link
    category: 'fuel' | 'parking' | 'materials' | 'tools' | 'other';
    description: string;
    amount: number;
    receipt_photo?: string;  // base64 data_url
    incurred_at: string;
    created_at: string;
    _sync_status: SyncStatus;
  }
  ```
- New "Expenses" tab in bottom nav
- Quick-add: category pill + amount + optional receipt photo (reuse `capturePhoto`)
- Monthly total by category
- **Impact:** Tax return ready; no more lost receipts

**Files to touch:** `db.ts`, `Expenses/index.tsx`, `TabBar`, `photoCapture.ts`
**Estimated effort:** 1.5 days

---

### 7. Job Checklists & Quality Sign-off (R13)
**Problem:** No way to verify job quality before marking complete; no customer sign-off record.
**Solution:** Per-job checklist + digital signature capture.

**Implementation:**
- Add `checklist_templates` and `job_checklist_items` tables
- Default templates per trade (e.g. Plumber: "Leak test passed", "Radiators bled")
- In `JobDetail` (in-progress status): checklist section with tick boxes
- All items ticked → unlock "Mark Complete" button
- Optional: customer signature capture via canvas (base64 PNG)
- **Impact:** Reduces callbacks; dispute-proof completion record

**Files to touch:** `db.ts`, `JobDetail/index.tsx`, new `Checklist/` component
**Estimated effort:** 2 days

---

### 8. Cloud Sync & Multi-Device (R15)
**Problem:** Data only lives on one device; lost phone = lost business records.
**Solution:** Automatic background sync to Supabase / Firebase.

**Implementation:**
- Use existing `sync_queue` table (already implemented for offline-first)
- Add `lib/sync.ts` with `supabase-js` client:
  - Poll `sync_queue` every 30s when online
  - POST changes to REST API
  - GET remote changes → apply to local Dexie db
  - Conflict resolution: last-write-wins + user prompt on critical fields
- Add `Settings > Sync` page: last sync time, manual force-sync, logout+clear
- **Impact:** Data safety; team members can share jobs (future)

**Files to touch:** `lib/sync.ts`, `Settings/index.tsx`, `db.ts` (add `synced_at` to tables)
**Estimated effort:** 2–3 days

---

## 📋 Implementation Order (Priority)

| Priority | Feature | Effort | Business Impact | Technical Risk |
|----------|---------|--------|-----------------|--------------|
| 1 | **R5-B Trade Templates** | 1 day | 🔥 High (3× quoting speed) | Low |
| 2 | **R9 PDF Generation** | 2 days | 🔥 High (40% win rate) | Medium |
| 3 | **R10 Revenue Dashboard** | 1.5 days | 🔥 High (business visibility) | Low |
| 4 | **R11 Message Templates** | 1 day | Medium (professionalism) | Low |
| 5 | **R8 Calendar View** | 1.5 days | Medium (scheduling) | Medium |
| 6 | **R12 Expense Tracking** | 1.5 days | Medium (tax prep) | Low |
| 7 | **R13 Checklists** | 2 days | Medium (quality) | Medium |
| 8 | **R15 Cloud Sync** | 2–3 days | 🔥 High (data safety) | High |

**Total: ~12–13 days** for full Phase 2 MVP.

---

## 🔧 Technical Notes

- **Schema migrations:** Dexie versions are additive. Always add new tables in `.version(3).stores({...})` without removing old ones.
- **Offline-first:** All new features must follow the `sync_queue` pattern for offline support.
- **Analytics:** Add `capture*` functions for every new feature to track adoption.
- **No new dependencies** unless essential. Prefer lightweight custom components over heavy UI libraries.
- **Responsive:** All new screens must work on 375px–430px width (iPhone SE → Pro Max).

---

## 📝 Immediate Next Steps

1. **Start with R5-B Trade Templates** — highest impact, lowest effort, builds on existing R5 Custom Items
2. **Parallel: R9 PDF** — can be developed independently; test with real customer quotes
3. **Then R10 Dashboard** — reuses existing data, no schema changes needed
4. **Schedule R15 Cloud Sync last** — requires backend setup and testing

---

*Plan created: 2026-06-10*
*Current Phase 1 baseline: R1–R7, R14, R19, R3 all complete and building*
