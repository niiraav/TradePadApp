# Supabase Phone Auth + Twilio Setup Guide
## TradePad — Gate 1 Infrastructure

> **Goal:** Enable phone-number sign-in (SMS OTP) so tradesmen can authenticate without passwords or email.  
> **Supabase project:** `klprbojgvpdnjvxvmylh`  
> **Region:** EU (GDPR-compliant)  
> **Supabase free tier:** 50 SMS/month included (sufficient for pre-launch testing)

---

## 1. Twilio Account Setup

### 1.1 Create a Twilio account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up (use your business email, not personal)
3. Verify your identity (phone number + email)
4. You get ~£15 credit on trial — enough for testing

### 1.2 Buy a UK phone number
1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Filter: Country = **United Kingdom**, Capabilities = **SMS**
3. Choose a number (e.g., +44 7xxx xxx xxx)
4. Click **Buy** (~£1.15/month + £0.04/SMS sent)

### 1.3 Get your credentials
1. Go to **Account** → **API keys & tokens** in the console sidebar
2. Copy:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "Show" to reveal)
3. The phone number you bought is your **Messaging Service SID** (or just the phone number itself for basic setup)

---

## 2. Supabase Auth Configuration

### 2.1 Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your Supabase account
3. Select project: **TradePad** (ref: `klprbojgvpdnjvxvmylh`)

### 2.2 Enable Phone Auth
1. In the left sidebar, go to **Authentication** → **Providers**
2. Find **Phone** in the list
3. Toggle it **ON**
4. Under **SMS Provider**, select **Twilio**
5. Fill in:
   - **Twilio Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Twilio Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Twilio Message Service SID**: `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (or use the phone number SID: `PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Twilio Message Service (legacy)**: leave blank unless you have a legacy service
6. Click **Save**

### 2.3 Configure SMS Template (optional but recommended)
1. In the same Phone provider section, set the **SMS Message** template:
```
Your TradePad code is {{ .Code }}. Valid for 5 minutes. Don't share it with anyone.
```
2. Click **Save**

### 2.4 Enable Auto-Confirm (dev only)
**WARNING:** Only enable this for local development testing. Never for production.

1. Go to **Authentication** → **Policies** → **Email Templates** (not needed for phone)
2. Actually for phone: there's no auto-confirm needed — OTP is the verification itself

---

## 3. Environment Variables

Add these to your `.env` file (or `.env.local` for local dev):

```env
# Supabase (already configured)
VITE_SUPABASE_URL=https://klprbojgvpdnjvxvmylh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PostHog (already configured)
VITE_POSTHOG_KEY=phc_DnUJfwn8xtbSM3NCWBNda3Np4XdnTiccLPDUaYMVzh4g
VITE_POSTHOG_HOST=https://eu.posthog.com

# Twilio (server-side only — do NOT expose to client)
# These are for reference; Supabase handles the SMS sending internally
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+447700000000
```

**Note:** The Twilio credentials are configured in the Supabase dashboard, not in the app code. The app only calls `supabase.auth.signInWithOtp({ phone })` and Supabase handles the Twilio API call internally.

---

## 4. Testing Phone Auth (Local Dev)

### 4.1 Start the dev server
```bash
cd /Users/niravarvinda/Workspace/projects/TradePad
npm run dev
```

### 4.2 Test the flow
1. Open `http://localhost:5173/` in your browser
2. You should see the **Get started** screen with a phone number input
3. Enter a real UK mobile number (e.g., your own)
4. Tap **Send code**
5. Check your phone for the SMS
6. Enter the 6-digit code
7. Tap **Verify**
8. If new user → goes to Onboarding; if existing → goes to Home

### 4.3 Check Supabase Auth logs
If the SMS doesn't arrive:
1. Go to Supabase Dashboard → **Authentication** → **Logs**
2. Check for error messages from Twilio
3. Common issues:
   - Twilio trial account — must verify the destination number first in Twilio console
   - Insufficient Twilio balance
   - Wrong Auth Token or Account SID
   - Phone number not SMS-enabled

---

## 5. Before Production Launch

### 5.1 Upgrade Twilio from trial
- Trial accounts can only send SMS to verified numbers
- Upgrade to a paid account to send to any UK number
- Add a payment method in Twilio console
- Cost: ~£1.15/month per number + ~£0.04 per SMS

### 5.2 Rate limiting
- Supabase has built-in rate limiting on OTP sends (1 per 60 seconds per phone)
- The app enforces a 60-second countdown on the resend button
- Consider adding CAPTCHA if you see abuse (Supabase supports hCaptcha/Cloudflare Turnstile)

### 5.3 GDPR compliance
- Phone numbers are stored by Supabase in the EU region (already configured)
- Add to your privacy policy: "We use your phone number for authentication via SMS. Your number is stored securely and never shared with third parties for marketing."
- The Twilio phone number should be a UK number for UK users (GDPR data residency)

### 5.4 Fallback auth method
- Consider adding email/password as a fallback for users who can't receive SMS
- Or add passwordless email link as a secondary option
- For now, phone OTP is the primary and only method (keeps it simple for tradesmen)

---

## 6. Cost Estimate

| Item | Cost | Notes |
|------|------|-------|
| Twilio UK phone number | £1.15/month | One number needed |
| SMS per OTP | £0.04–£0.05 | Per message sent |
| Supabase free tier | £0 | 50 SMS/month included |
| Supabase Pro (if needed) | £19/month | After 50 SMS/month or when you need more |
| **Estimated monthly cost (100 users)** | ~£5–£8 | ~100 SMS sends |
| **Estimated monthly cost (1,000 users)** | ~£40–£50 | ~1,000 SMS sends |

---

## 7. Troubleshooting

### SMS not arriving
1. Check Twilio console → Monitor → Logs → Messaging for delivery errors
2. Common trial-account issue: destination number not verified
3. Verify the number in Twilio Console → Phone Numbers → Verified Caller IDs
4. Check Supabase Auth logs for API errors

### "Invalid phone number" error
1. The app auto-formats UK numbers (e.g., `07700 900000` → `+447700900000`)
2. If the number starts with `+`, it's passed through as-is
3. Make sure the number is a valid UK mobile (starts with 07 after +44)

### "Rate limit exceeded"
1. Supabase limits to 1 OTP per 60 seconds per phone number
2. The app shows a 60-second countdown before allowing resend
3. Wait and try again

### User already exists but gets onboarding again
1. Check if the profile exists in the `profiles` table (or Dexie local DB)
2. The app checks `db.profiles.get(userId)` after sign-in
3. If no profile → onboarding; if profile exists → home

---

## 8. Next Steps

1. [ ] Set up Twilio account and buy UK number
2. [ ] Configure Supabase Auth → Phone provider with Twilio credentials
3. [ ] Test phone sign-in with your own number
4. [ ] Verify onboarding captures phone correctly
5. [ ] Test mock sign-in (dev mode) still works for quick testing
6. [ ] Deploy app to production (e.g., Vercel/Netlify) with `app.tradepad.co.uk` domain
7. [ ] Update landing page CTAs to point to live app URL

---

*End of Supabase + Twilio Setup Guide*
