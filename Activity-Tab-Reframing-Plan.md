# Activity Tab — Strategic Reframe & Implementation Plan

## 1. The Core Problem

Everything in the app is **manual**. Dave does every action. There are no automatic events.

The current Activity tab dumps every `work_log` entry into a single feed. This means Dave sees:
- "Job started" — he knows, he clicked it 10 seconds ago
- "Quote copied to clipboard" — UI noise, not a business event
- "Payment recorded — Cash · £2,452" — he just entered this himself

**The Activity tab as currently conceived is a mirror of Dave's own actions. It has no new information.**

---

## 2. The Strategic Reframe

### What Activity Should Be

A **business journal** — not "what happened" but **"what did my business day look like?"**

Dave opens Activity for three reasons:
1. **End-of-day review** — "How much did I earn today? What did I actually do?"
2. **Verification** — "Did I mark that job as paid? Did I record the payment?" (memory check)
3. **Tax/admin catch-up** — "What was my total revenue this week?"

### What Activity Should NOT Be

- A real-time feed of Dave's own clicks (no value, he was there)
- A duplicate of the Job Detail work log (that's per-job context)
- A notification center (nothing happens automatically)

---

## 3. UX Design Principles

### Principle 1: Group by Day, Not by Event

A list of 50 individual events is overwhelming. A day summary is scannable.

```
TODAY — Wed, 10 Jun
  ├─ £2,452 — Richard's Boiler (paid)
  ├─ £180 — Sarah's Kitchen tap (paid)
  ├─ 1 quote sent — Mike's Bathroom
  └─ 1 new enquiry — Nirav Arvinda

TUESDAY, 9 Jun
  ├─ £890 — John's Heating (paid)
  ├─ 1 job booked — Lisa's Leak
  └─ 1 job cancelled — Dave's Roof
```

### Principle 2: Show Money Prominently

For a self-employed tradesperson, the most important question is **"How much did I earn?"** The Activity tab should answer this at the top of every day group.

### Principle 3: Surface-Level = Summary, Drill-Down = Detail

Tap a day group → see individual events. Tap an event → go to the job. Don't show every individual event in the main scroll.

### Principle 4: Empty State is a Prompt, Not a Failure

```
No activity today
Start a job or record a payment to see it here
```

This is a positive nudge, not a sad empty state.

---

## 4. Event Classification

### SHOW in Activity (Business Milestones)

| Event | Type | Description Pattern | Why |
|-------|------|---------------------|-----|
| Payment recorded | `status_change` | `Payment recorded — Cash/Bank/Other · £X` | Money in. The #1 thing Dave cares about. |
| Job marked complete (awaiting payment) | `status_change` | `Job completed — payment pending` | Work done, revenue recognised but not yet collected. |
| Job booked | `status_change` | `Quote accepted — marked as booked` | New confirmed work. Future revenue. |
| Quote sent | `status_change` | `Quote sent via WhatsApp/SMS` | Customer contacted. Follow-up clock starts. |
| New enquiry | `status_change` | `Missed call logged` | New lead. Potential work. |
| Job cancelled | `status_change` | `Customer cancelled` / `I cancelled` | Schedule freed. Negative event but important. |
| Customer not home | `status_change` | `Customer not home — no-show logged` | Wasted time. Negative event. |

### HIDE from Activity (Internal / Transitional)

| Event | Type | Why |
|-------|------|-----|
| Quote copied to clipboard | `status_change` | Internal UI action. Zero business meaning. |
| Job started | `status_change` | Transitional. Dave knows he started it. |
| Status changed from X to Y | `status_change` | Generic transition. Already captured by milestone events. |
| Payment method updated | `status_change` | Correction to existing record. Low value in feed. |
| Note added | `note` | Internal record. Belongs in Job Detail work log. |
| Charge added | `charge` | Already reflected in job total. Redundant in feed. |
| Rescheduled | `note` | Detail-level. Belongs in Job Detail. |
| Running late sent | `customer_notified` | One-way message. Dave already sent it. |
| Reminder sent | `customer_notified` | Same as above. |

### Edge Case: Quote Copied

The current code uses `status_change` for quote sent with description `Quote copied to clipboard` or `Quote sent via WhatsApp/SMS`. This is **overloaded** — one type carries two very different meanings.

**Fix:** Create a dedicated `quote_sent` type with `method: 'copy' | 'whatsapp' | 'sms'`. Then Activity can filter `quote_sent` where `method !== 'copy'`.

---

## 5. Screen Design

### Layout

```
┌─────────────────────────────┐
│  Activity                   │  ← Fixed header, no border
├─────────────────────────────┤
│  TODAY                      │  ← Day group header
│  ┌─────────────────────────┐│
│  │ 💰 £2,632 earned       ││  ← Day summary card
│  │ 3 jobs completed       ││
│  │ 1 quote sent           ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ Richard's Boiler        ││  ← Individual event (optional)
│  │ £2,452 · Cash · 2:30pm  ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ Sarah's Kitchen         ││
│  │ £180 · Bank · 11:00am  ││
│  └─────────────────────────┘│
│                             │
│  YESTERDAY                  │  ← Day group header
│  ┌─────────────────────────┐│
│  │ 💰 £890 earned         ││
│  │ 1 job completed        ││
│  │ 1 job booked           ││
│  │ 1 job cancelled        ││
│  └─────────────────────────┘│
│                             │
│  TUESDAY, 9 JUN             │
│  ...                        │
└─────────────────────────────┘
```

### Day Group Header

- "TODAY" for today
- "YESTERDAY" for yesterday
- "MONDAY, 9 JUN" for older days
- Sticky? No — scrollable. Dave rarely has more than 7 days of activity.

### Day Summary Card (collapsible)

Top of each day group. Collapsed by default shows:
- Total earned (£X)
- Count of jobs completed
- Count of quotes sent
- Count of new enquiries
- Count of jobs cancelled

Tap to expand → see individual events.

### Individual Event Card (inside expanded group)

- **Payment events**: 💰 Green icon, amount bold, payment method, customer name, time
- **Quote sent**: 📤 Blue icon, customer name, method, time
- **Job booked**: 📥 Blue icon, customer name, job title, time
- **New enquiry**: 📥 Amber icon, customer name, "Missed call", time
- **Job cancelled**: ⚠️ Red icon, customer name, reason, time
- **Customer not home**: ⚠️ Amber icon, customer name, time

---

## 6. Data Model Changes

### 6.1 Add `quote_sent` WorkLogType

```typescript
// In db.ts
export type WorkLogType = 'note' | 'charge' | 'status_change' | 'customer_notified' | 'running_late' | 'quote_sent';
```

### 6.2 Update Quote Send Logging

In `src/screens/Quote/index.tsx`, change the work_log entry from `type: 'status_change'` to `type: 'quote_sent'`:

```typescript
await db.work_log.add({
  id: workLogId,
  job_id: jobId,
  type: 'quote_sent',
  description: isCopy ? 'Quote copied to clipboard' : `Quote sent via ${method === 'whatsapp' ? 'WhatsApp' : 'SMS'}`,
  amount: undefined, // no amount for quote sent
  created_at: n,
  _sync_status: 'pending',
});
```

**Dexie schema note:** `WorkLogType` is a TypeScript type, not a database constraint. No schema migration needed. The existing `work_log` table stores `type` as a string. Old records with `type: 'status_change'` will still exist and work fine. New records will use `type: 'quote_sent'`.

### 6.3 Activity Filter Logic

```typescript
// Activity screen query filter
const ACTIVITY_DESCRIPTION_PATTERNS = [
  /^Payment recorded/,           // Payment events
  /^Job completed/,              // Job done (awaiting payment)
  /^Quote accepted/,             // Job booked
  /^Quote sent via/,             // Quote sent (not copy)
  /^Missed call logged/,         // New enquiry
  /^Customer cancelled/,         // Cancellation
  /^I cancelled/,                // Cancellation
  /^Customer not home/,           // No-show
];

const isActivityEvent = (log: WorkLogEntry): boolean => {
  if (log.type === 'quote_sent') {
    return !log.description.includes('copied to clipboard');
  }
  return ACTIVITY_DESCRIPTION_PATTERNS.some(pattern => pattern.test(log.description));
};
```

---

## 7. Implementation Steps

### Step 1: Add `quote_sent` type (15 min)

**File:** `src/lib/db.ts`
- Add `'quote_sent'` to `WorkLogType` union
- No schema migration needed (string field)

### Step 2: Update quote send logging (15 min)

**File:** `src/screens/Quote/index.tsx`
- Change `type: 'status_change'` → `type: 'quote_sent'` in `handleSendQuote`
- Update sync_queue payload to match

### Step 3: Rewrite Activity screen (2-3 hours)

**File:** `src/screens/Activity/index.tsx`

#### 3a. Query + Filter
```typescript
const load = async () => {
  const allJobs = await db.jobs.where('user_id').equals(userId).toArray();
  const jobIds = allJobs.map(j => j.id);
  if (jobIds.length === 0) { setDays([]); setLoading(false); return; }

  const logs = await db.work_log.where('job_id').anyOf(jobIds).toArray();
  
  // Filter to business milestones only
  const activityLogs = logs.filter(isActivityEvent);
  
  // Sort by date descending
  activityLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  // Group by day
  const grouped = groupByDay(activityLogs);
  
  // Enrich with job/customer data
  const enriched = await enrichDays(grouped, allJobs);
  
  setDays(enriched);
  setLoading(false);
};
```

#### 3b. Group by day function
```typescript
interface DayGroup {
  date: Date;           // midnight of that day
  dateLabel: string;    // "TODAY", "YESTERDAY", "MONDAY, 9 JUN"
  events: EnrichedActivity[];
  totalEarned: number;
  jobsCompleted: number;
  quotesSent: number;
  newEnquiries: number;
  jobsCancelled: number;
  noShows: number;
}

function groupByDay(logs: WorkLogEntry[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  
  for (const log of logs) {
    const date = new Date(log.created_at);
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const key = midnight.toISOString();
    
    if (!map.has(key)) {
      map.set(key, {
        date: midnight,
        dateLabel: getDayLabel(midnight),
        events: [],
        totalEarned: 0,
        jobsCompleted: 0,
        quotesSent: 0,
        newEnquiries: 0,
        jobsCancelled: 0,
        noShows: 0,
      });
    }
    
    const group = map.get(key)!;
    group.events.push(log);
    
    // Accumulate stats
    if (log.description.startsWith('Payment recorded')) {
      group.totalEarned += log.amount || 0;
      group.jobsCompleted++;
    } else if (log.description === 'Job completed — payment pending') {
      group.jobsCompleted++;
    } else if (log.type === 'quote_sent' && !log.description.includes('copied')) {
      group.quotesSent++;
    } else if (log.description === 'Missed call logged') {
      group.newEnquiries++;
    } else if (log.description === 'Customer cancelled' || log.description === 'I cancelled') {
      group.jobsCancelled++;
    } else if (log.description === 'Customer not home — no-show logged') {
      group.noShows++;
    } else if (log.description === 'Quote accepted — marked as booked') {
      // Job booked — not a completion, just a commitment
    }
  }
  
  return Array.from(map.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
}

function getDayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.getTime() === today.getTime()) return 'TODAY';
  if (date.getTime() === yesterday.getTime()) return 'YESTERDAY';
  
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();
}
```

#### 3c. Enrich with job/customer data
```typescript
async function enrichDays(
  days: DayGroup[],
  allJobs: Job[]
): Promise<EnrichedDayGroup[]> {
  const jobMap = new Map(allJobs.map(j => [j.id, j]));
  const customerIds = [...new Set(allJobs.map(j => j.customer_id))];
  const customers = await db.customers.bulkGet(customerIds);
  const customerMap = new Map(customers.filter(Boolean).map(c => [c!.id, c!]));
  
  return days.map(day => ({
    ...day,
    events: day.events.map(event => {
      const job = jobMap.get(event.job_id);
      const customer = job ? customerMap.get(job.customer_id) : undefined;
      return {
        id: event.id,
        type: event.type,
        description: event.description,
        amount: event.amount,
        timestamp: event.created_at,
        jobId: event.job_id,
        jobTitle: job?.title,
        customerName: customer?.name,
      };
    }),
  }));
}
```

### Step 4: Rewrite ActivityCard for new design (1 hour)

**File:** `src/components/ActivityCard/index.tsx` → or create new `DaySummaryCard`

Two components:
1. `DaySummaryCard` — collapsible day group header with stats
2. `ActivityEventCard` — individual event (shown when expanded)

### Step 5: Update Activity screen layout (1 hour)

Remove the current list-of-cards approach. Replace with grouped-by-day layout:

```tsx
<div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
  {days.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="space-y-6">
      {days.map(day => (
        <DayGroup key={day.date.toISOString()} day={day} />
      ))}
    </div>
  )}
</div>
```

---

## 8. Edge Cases

### 8.1 Multiple Events on Same Job in One Day

**Scenario:** Dave starts a job, adds a charge, marks it complete, and records payment — all on the same day.

**Current behavior:** 4 separate events in the feed. "Job started", "Charge added", "Job completed", "Payment recorded".

**Desired behavior:** Only "Payment recorded · £X" appears (the milestone). The charge and start are transitional. If the job is marked "completed — payment pending" (not yet paid), only that appears.

**Fix:** The filter already handles this. Only payment/completed events are shown. If multiple payment events exist for the same job (e.g., deposit then balance), both show.

### 8.2 Job Cancelled After Payment

**Scenario:** Dave records a payment, then later the customer cancels and Dave marks the job as cancelled.

**Current behavior:** Both "Payment recorded" and "Customer cancelled" appear.

**Desired behavior:** Both show. The payment is still real (refund handled separately). The cancellation is a separate business event.

**Fix:** No change needed. Both are valid milestones.

### 8.3 Payment Method Changed

**Scenario:** Dave marks payment as Cash, then realises it was Bank Transfer. He updates the payment method.

**Current behavior:** "Payment recorded — Cash · £X" and "Payment method updated: Cash → Bank Transfer" both appear.

**Desired behavior:** The method change is low-value noise. Only the original payment should appear.

**Fix:** Add "Payment method updated" to the HIDE list. The description pattern `/^Payment method updated/` is already transitional/internal.

### 8.4 Quote Sent Then Copied

**Scenario:** Dave sends a quote via WhatsApp, then later copies the message to clipboard for records.

**Current behavior:** Both events appear as `status_change` with descriptions "Quote sent via WhatsApp" and "Quote copied to clipboard".

**Desired behavior:** Only "Quote sent via WhatsApp" appears. "Copied to clipboard" is UI noise.

**Fix:** After Step 2 (adding `quote_sent` type), filter `type === 'quote_sent' && !description.includes('copied')`.

### 8.5 Rescheduled Job

**Scenario:** Dave reschedules a booked job to next week.

**Current behavior:** "Rescheduled to Friday 12 Jun · 2:00pm" appears as a `note`.

**Desired behavior:** Not shown in Activity. This is a detail-level change. The job is still booked. Activity only shows the original booking event.

**Fix:** `note` type is already excluded from Activity.

### 8.6 Very First Day (No History)

**Scenario:** Dave installs the app, creates a job, marks it as paid.

**Current behavior:** Activity shows one day with one payment event.

**Desired behavior:** Same, but with a warm empty state if he opens Activity before any events.

**Fix:** Empty state already handles this.

### 8.7 Long History (100+ Days)

**Scenario:** Dave has been using the app for 6 months. 200+ days of activity.

**Current behavior:** All days load at once. Slow.

**Desired behavior:** Lazy loading or max 30 days shown. Dave rarely needs to look back more than a month for tax/admin.

**Fix:** Limit to 30 days in the query. Add "Load more" button if needed (future enhancement).

### 8.8 Same Job, Multiple Payments

**Scenario:** Dave takes a deposit, then later the balance. Two separate payment events.

**Current behavior:** "Payment recorded — Cash · £50" (deposit) and "Payment recorded — Bank Transfer · £200" (balance).

**Desired behavior:** Both show. The total for the day is £250.

**Fix:** The `totalEarned` accumulator already sums all payment amounts for the day. Correct.

---

## 9. Testing Scenarios

### Test 1: Fresh Install
1. Open Activity
2. Verify: "No activity today" empty state
3. Create a job → mark as paid → £100 Cash
4. Open Activity
5. Verify: One day group "TODAY" with summary £100 earned, 1 job completed
6. Tap summary → expand → see individual event with customer name, amount, method, time

### Test 2: Multiple Events in One Day
1. Create 3 jobs
2. Mark Job A as paid → £100 Cash
3. Mark Job B as paid → £200 Bank Transfer
4. Send quote for Job C via WhatsApp
5. Log missed call (new enquiry)
6. Open Activity
7. Verify: Summary shows £300 earned, 2 jobs completed, 1 quote sent, 1 new enquiry
8. Verify: Individual events shown when expanded

### Test 3: Events Across Days
1. Yesterday: mark job as paid → £150
2. Today: mark job as paid → £200
3. Open Activity
4. Verify: Two day groups — "TODAY" (£200) and "YESTERDAY" (£150)
5. Verify: Correct date labels

### Test 4: Filtered Events (Hidden)
1. Start a job (should NOT appear)
2. Add a note (should NOT appear)
3. Add a charge (should NOT appear)
4. Copy quote to clipboard (should NOT appear)
5. Open Activity
6. Verify: None of these appear in the feed

### Test 5: Job Detail Work Log Still Complete
1. Open Job Detail for any job
2. Verify: Work log shows ALL events (started, notes, charges, etc.)
3. Verify: Activity tab only shows milestones for this job

### Test 6: Payment Method Change
1. Mark job as paid → Cash
2. Change payment method to Bank Transfer
3. Open Activity
4. Verify: Only original "Payment recorded — Cash" appears
5. Verify: "Payment method updated" does NOT appear

---

## 10. Summary of Files to Change

| File | Change | Effort |
|------|--------|--------|
| `src/lib/db.ts` | Add `'quote_sent'` to `WorkLogType` | 5 min |
| `src/screens/Quote/index.tsx` | Change quote send log type to `quote_sent` | 10 min |
| `src/screens/Activity/index.tsx` | Full rewrite: grouped by day, summary cards, filter | 2-3 hours |
| `src/components/ActivityCard/index.tsx` | Rewrite or split into `DaySummaryCard` + `ActivityEventCard` | 1 hour |
| `src/lib/activityFilter.ts` | New file: `isActivityEvent`, `groupByDay`, `getDayLabel` | 30 min |

**Total effort: ~4 hours**

---

## 11. Future Enhancements (Post-MVP)

1. **Weekly/Monthly summary** — toggle between day view and week view for tax admin
2. **Revenue chart** — simple bar chart of daily earnings
3. **Filter by type** — "Show only payments" or "Show only new enquiries"
4. **Export** — "Export this week to CSV" for accountant
5. **Search** — "Find all payments from Richard" (rarely needed but useful)

---

## 12. Acceptance Criteria

- [ ] Activity tab shows only business milestone events (payments, completions, bookings, quotes sent, enquiries, cancellations, no-shows)
- [ ] Events are grouped by day with clear date labels (TODAY, YESTERDAY, MONDAY 9 JUN)
- [ ] Each day shows a summary card: total earned, jobs completed, quotes sent, new enquiries, cancellations
- [ ] Day groups are collapsible/expandable
- [ ] Tapping an event navigates to the associated job detail
- [ ] Empty state shows friendly prompt, not "coming soon"
- [ ] Internal events (job started, notes, charges, clipboard copies) do NOT appear
- [ ] Job Detail work log still shows ALL events (complete audit trail)
- [ ] Works offline (reads from IndexedDB)
- [ ] Performance: loads in <1s for 30 days of activity
