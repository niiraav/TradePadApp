# Posthog Funnel Setup — Manual Steps (UI)

> The API key lacks the `query:read` / `insight:write` scope, so funnel creation must be done in the Posthog UI.

## Step 1: Open Posthog

Go to: https://eu.posthog.com/project/196651/insights/new

Or navigate: **Product Analytics → Insights → New insight**

## Step 2: Select Funnel

1. In the "Insight type" dropdown (top left), select **Funnel**.

## Step 3: Add Step 1 — user_signed_up

1. Under "Funnel steps", click **Add funnel step**
2. Set:
   - **Type:** Event
   - **Event:** `user_signed_up`
   - **Order:** Any order (or Step 1 if strict)
3. Click **Add filter** → `event_type` is not `internal` (optional, hides test events)

## Step 4: Add Step 2 — quote_sent

1. Click **Add another step**
2. Set:
   - **Type:** Event
   - **Event:** `quote_sent`
   - **Order:** Any order (or Step 2 if strict)
3. Click **Add filter** → `event_type` is not `internal` (optional)

## Step 5: Configure & Save

- **Name:** `Activation — signed up to quote sent`
- **Time period:** Last 30 days (or "All time" for now)
- **Conversion window:** 7 days (default is fine)
- Click **Save** (top right)

## Step 6: (Optional) Add to Dashboard

- After saving, click **Add to dashboard** → select the existing dashboard (ID: 733454)
- Or: **Dashboards → "Dashboard 1"** (created by wizard) → Edit → Add insight

## Step 7: Verify Events are Flowing

1. Go to: https://eu.posthog.com/project/196651/events/live
2. Use the app:
   - Sign up → should see `user_signed_up`
   - Log a missed call → should see `job_created`
   - Send a quote → should see `quote_sent`
3. Events should appear within 1-2 seconds

## Troubleshooting

- **No events showing?** Check the `.env` file has `VITE_POSTHOG_KEY` set, then rebuild (`npm run build`) and reload the app.
- **Events marked as $autocapture?** Our code disables autocapture — only explicit events fire. Look for `user_signed_up`, `job_created`, etc. in the event list, not `$autocapture`.
- **Anonymous events?** If you see `anonymous` in the person column, that's normal before `identifyUser()` is called. After sign-in, the user should be identified.

## API Key Scope Fix (for future automation)

If you want to create insights via API later:
1. Go to: https://eu.posthog.com/project/196651/settings/user-api-keys
2. Find your personal API key (`phx_FMYuHjZb...`)
3. Click **Edit scopes**
4. Add: `query:read`, `query:write`, `insight:read`, `insight:write`
5. Save

Then the `curl` automation will work.
