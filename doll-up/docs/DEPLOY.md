# Deploying to Vercel

The site is a Vite + React app that builds to static files. Vercel hosts it for
free. The cleanest setup is to connect your GitHub repo once — after that, every
push auto-deploys.

## Option A — Connect GitHub (recommended, ~3 minutes)

1. Go to **https://vercel.com** and sign in (your "Buhle" team already exists).
2. Click **Add New… → Project**.
3. **Import** the GitHub repo `buhlemakaula/zero-double-three`.
   (If GitHub isn't linked yet, Vercel will prompt you to connect it — allow
   access to this repo.)
4. Vercel auto-detects **Vite**. Leave the build settings as they are
   (`vercel.json` in the repo already sets them: build `npm run build`, output
   `dist`, and the `/book` + `/admin` routes).
5. Open **Environment Variables** and add these two (get the values from
   Supabase → Project Settings → API):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://tvtherrzunjcbiakmnqj.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | the **anon public** key (long string starting `eyJ…`) |

6. Click **Deploy**. In ~1 minute you'll get a live URL like
   `doll-up-hair-and-nail-art.vercel.app`.

That's it. From now on, any push to the `main` branch redeploys automatically.

> **Important:** if you skip step 5, the site still loads but runs in demo mode
> (no real bookings). The two env vars are what make it live.

### Which branch deploys?
Vercel deploys your **production branch** (usually `main`). The current work is
on `claude/glammified-kwannz-booking-qan4s7` — merge it into `main` (or set that
branch as Production in Vercel → Settings → Git) so the booking site is what goes
live.

## Option B — Vercel CLI (from your own computer)

If you'd rather deploy from your machine:

```bash
npm i -g vercel           # once
cd <the project folder>
vercel                    # first run links/creates the project
# add the env vars:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod             # deploy to production
```

## After deploying

- Visit `yoursite.vercel.app` — book a test appointment.
- Visit `yoursite.vercel.app/admin`, log in, and **change the passcode**
  immediately (Availability → Change passcode).
- Mark your test booking **complete** and confirm a stamp appears (Supabase →
  Table Editor → `stamps`).

## Custom domain (optional)
In Vercel → your project → **Settings → Domains**, add a domain like
`dollup.co.za` and follow the DNS steps.
