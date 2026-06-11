# Features Log — TradePad MVP

> Record of features implemented, updated, and shipped. Dates are in UTC.

---

## 2026-06-10 — MVP Feature Batch (8 Features)

All features built, integrated, and verified with clean `tsc && vite build`.

| Feature | ID | Status | Files | Notes |
|---------|----|--------|-------|-------|
| Activity Feed | R1 | ✅ Shipped | `src/screens/Activity/index.tsx`, `src/components/ActivityCard/index.tsx` | Log of all job events with type badges, timestamps, and navigation |
| Business Name Fix | R2 | ✅ Shipped | `src/lib/db.ts` (Profile) | `business_name` field used throughout (quote header, booking confirmations, invoices) |
| Photo Capture | R3 | ✅ Shipped | `src/lib/photoCapture.ts`, `src/components/PhotoGallery/index.tsx`, `src/screens/JobDetail/index.tsx` | Camera capture → JPEG resize (max 800px, quality 0.7) → base64 storage. Max 10 per job. Full-screen viewer with swipe navigation. Integrated into all 9 job status views. |
| Voice-to-Text | R4 | ✅ Shipped | `src/lib/voiceInput.ts`, `src/components/VoiceInputButton/index.tsx`, `src/screens/JobDetail/index.tsx`, `src/screens/Quote/QuoteBuilder.tsx` | `webkitSpeechRecognition` with `en-GB` locale. Used on callout descriptions, notes, and edit fields. Fallback gracefully if unsupported. |
| Custom Item Library | R5 | ✅ Shipped | `src/screens/Settings/CustomItems.tsx`, `src/screens/Quote/QuoteBuilder.tsx`, `src/App.tsx` | Per-user library of reusable line items. Add/edit/delete/reorder. One-tap insert from quote builder. Syncs via `sync_queue`. |
| One-Tap Payment | R6 | ✅ Shipped | `src/screens/JobDetail/index.tsx` | Cash, Bank Transfer, Other, Not Yet. One-tap from "Complete" action. Already existed in prior build. |
| Smart Payment Chase | R7 | ✅ Shipped | `src/screens/JobDetail/index.tsx`, `src/lib/analytics.ts` | WhatsApp/SMS reminder with pre-filled message. `capturePaymentChase()` analytics event. Linked to tasks list for follow-up. |
| Customer History | R14 | ✅ Shipped | `src/screens/Quote/QuoteBuilder.tsx` | Fetches all prior jobs for the customer: total jobs, total quoted, total paid, last quote date. Displayed in quote builder sidebar. |
| Materials Inventory | R19 | ✅ Shipped | `src/components/MaterialsList/index.tsx`, `src/screens/JobDetail/index.tsx` | Inline add/edit/delete per job. Fields: description, quantity, unit cost, markup % → auto-calculated unit price & total. Quoted vs Actual comparison bar. Red warning if actual exceeds quoted by >10%. Syncs via `sync_queue`. |
| Database Schema v2 | — | ✅ Shipped | `src/lib/db.ts` | Dexie v2 migration: added `job_photos`, `custom_items`, `material_items` tables. Existing users auto-migrate. |
| Analytics | — | ✅ Shipped | `src/lib/analytics.ts` | 7 new events: `custom_item_added`, `custom_item_used`, `photo_added`, `voice_input_used`, `payment_chase`, `material_added`, `activity_viewed`. All PostHog-ready. |

### Build verification
```
$ npm run build
> tsc && vite build
✓ built in 2.18s
```
Zero TypeScript errors. Zero new dependencies.

---

## Pending / Phase 2 Candidates

| Feature | ID | Priority | Notes |
|---------|----|----------|-------|
| Trade-Specific Templates | R5-B | 🔥 High | Per-trade custom item bundles (Plumber, Electrician, Builder, Roofer) |
| Calendar / Schedule View | R8 | Medium | Weekly/monthly job planner with drag-to-reschedule |
| PDF Quote & Invoice | R9 | 🔥 High | Branded PDF generation with logo, itemised breakdown, T&Cs |
| Revenue Dashboard | R10 | 🔥 High | Monthly earnings, outstanding payments, win-rate trends |
| Message Templates | R11 | Medium | Editable templates with `{placeholders}` for auto-fill |
| Expense Tracking | R12 | Medium | Fuel, parking, tools, receipt photo capture |
| Job Checklists | R13 | Medium | Per-trade quality checklists + digital sign-off |
| Cloud Sync | R15 | 🔥 High | Multi-device sync via Supabase backend |

---

*Log maintained by: Codex (ai-coding)*
*Last updated: 2026-06-10*
