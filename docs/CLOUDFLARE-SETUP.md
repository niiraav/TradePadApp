# TradePad → Cloudflare Setup

This doc covers deploying the **TradePad PWA** to Cloudflare and running a local tunnel for iPhone testing.

---

## 1. What I Found (App Audit)

| Layer | What TradePad Uses |
|-------|-------------------|
| **Stack** | Vite + React + PWA (vite-plugin-pwa) |
| **Backend** | Supabase (client-side SDK) — **no custom backend needed** |
| **Analytics** | PostHog (optional — silently fails without key) |
| **Offline** | Dexie (IndexedDB) + Service Worker (Workbox) |
| **Build output** | `dist/` (static SPA) |

### Environment Variables Needed
These are **baked at build time** by Vite (`import.meta.env`). You must set them in the Cloudflare Pages dashboard before deploying.

| Variable | Required? | Where to find it |
|----------|-----------|-----------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Your Supabase project → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Same page as above |
| `VITE_POSTHOG_KEY` | ❌ Optional | PostHog → Project Settings → Project API Key |
| `VITE_POSTHOG_HOST` | ❌ Optional | Defaults to `https://eu.posthog.com` |

> **Does it call a Cloudflare Worker API?** No. TradePad is a pure frontend SPA. It talks directly to Supabase from the browser. No Workers or backend API needed for the app itself.

### Landing Page vs App
- **App (PWA)**: `~/Workspace/projects/TradePad` → this is what you're deploying. Built to `dist/`, runs on `tradepad.co.uk`.
- **Landing page**: `~/Workspace/projects/tradepad-website` → static HTML site. Can be deployed to a separate Pages project or the same project under a path. I recommend separate: `tradepad-website` on `tradepad.co.uk` (root) and the app on `app.tradepad.co.uk`.

---

## 2. Cloudflare Pages — App Deployment

### Option A: Wrangler CLI (Recommended)

```bash
cd ~/Workspace/projects/TradePad

# 1. Add env vars to the Pages project (one-time setup)
#    Go to Cloudflare Dashboard → Workers & Pages → tradepad → Settings → Environment variables
#    Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_POSTHOG_KEY

# 2. Deploy
./scripts/deploy-cloudflare.sh
```

This script:
- Runs `npm run build`
- Copies `_redirects` and `_headers` into `dist/`
- Runs `npx wrangler@latest pages deploy dist --project-name=tradepad`

### Option B: Dashboard Direct Upload (No CLI)
1. Build locally: `npm run build`
2. Go to [Cloudflare Dashboard → Workers & Pages → Create → Pages → Direct Upload](https://dash.cloudflare.com)
3. Drag the `dist/` folder
4. Set environment variables in the project settings
5. On future updates, use "Create deployment" and drag `dist/` again

### Option C: Git Integration (Continuous Deploy)
1. Push `TradePad` repo to GitHub
2. Cloudflare Dashboard → Pages → Create → Connect to Git
3. Select the repo, set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables in the dashboard

### SPA Routing Config (Already Added)
I've added these files to `public/` (so they copy into `dist/` on build):

**`public/_redirects`**
```
/* /index.html 200
```
This ensures React Router paths (e.g., `/jobs`, `/quotes`) work on reload.

**`public/_headers`**
```
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

/manifest.json
  Cache-Control: no-cache, no-store, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
This prevents the service worker from being cached (critical for PWA updates) and gives long-term cache to hashed assets.

---

## 3. Cloudflare Tunnel — iPhone Local Testing

I've created a setup script for you.

### First-time setup (one-time)
```bash
# 1. Authenticate (opens browser)
cloudflared tunnel login

# 2. Run the setup script
./scripts/setup-tunnel.sh
```

This creates a tunnel named `tradepad-dev` and writes `~/.cloudflared/config.yml`.

### Daily use
```bash
cloudflared tunnel run tradepad-dev
```

You'll get a URL like `https://random-words.trycloudflare.com`. Open that on your iPhone. Your local Vite dev server runs on port 5173 (already configured in `vite.config.ts` with `host: '0.0.0.0'` and `allowedHosts: ['.trycloudflare.com']`).

---

## 4. Custom Domain (When You're Ready)

You said you don't have one yet. When you buy `tradepad.co.uk`:
1. Add it to Cloudflare as a zone (or transfer DNS)
2. In Pages → `tradepad` project → Custom Domains → Add `tradepad.co.uk`
3. For the app subdomain: Add `app.tradepad.co.uk` as a custom domain on the same project, or create a separate Pages project for the app.

**Recommended architecture:**
```
tradepad.co.uk       → Pages project: tradepad-website (landing page)
app.tradepad.co.uk   → Pages project: tradepad (the PWA app)
```

---

## 5. What You Need to Do Now

1. **[ ] Set environment variables** in Cloudflare Pages dashboard (Supabase URL + Anon Key)
2. **[ ] Run deploy** with `./scripts/deploy-cloudflare.sh` or drag `dist/` to dashboard
3. **[ ] Run tunnel** with `cloudflared tunnel run tradepad-dev` for iPhone testing

No backend code needed. No Workers needed. Supabase handles everything.
