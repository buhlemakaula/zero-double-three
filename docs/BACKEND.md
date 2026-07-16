# Glammified by Kwannz — Backend Guide (Supabase)

Everything the website remembers — bookings, clients, loyalty stamps, your
availability settings — lives in a **Supabase** database. Supabase is just a
hosted PostgreSQL database with a friendly dashboard. This guide walks you
through it step by step, in plain English.

You almost never need to touch the database directly: the **`/admin` dashboard
on the website is the day-to-day tool**. This guide is for the occasional deeper
task and for whoever maintains the site.

---

## 1. The project at a glance

| | |
|---|---|
| Project name | `glammified-by-kwannz` |
| Project URL | `https://tvtherrzunjcbiakmnqj.supabase.co` |
| Region | eu-west-1 (Ireland) |
| Plan | Free |
| Organisation | EduSeed |

---

## 2. Logging in to Supabase

1. Go to **https://supabase.com** and click **Sign in** (use the account the
   project was created under — `buhlemakaula@gmail.com`).
2. On the dashboard, open the **`glammified-by-kwannz`** project.
3. The left sidebar is your toolbox. The four you'll use:
   - **Table Editor** — see and edit the data (like a spreadsheet).
   - **SQL Editor** — run commands (only when this guide tells you to).
   - **Authentication** — not used; the admin dashboard uses a passcode instead.
   - **Project Settings → API** — where your connection keys live (Section 8).

---

## 3. How the data flows

```
Client books on the website
        │
        ▼
  book_appointment()  ── de-dupes the client by phone, saves a PENDING booking
        │
        ▼
   bookings table  ◄──────────────┐
        │                         │
 You open /admin  ── Confirm ──►  │  (status: confirmed)
        │                         │
        └── Mark complete ──►  a Glam Card STAMP is created automatically
                                   │
                                   ▼
                             stamps table
```

The important rule: **a loyalty stamp is only ever created when you mark a
booking "complete"** in the admin dashboard. Never at booking time, never at
payment. This is enforced inside the database itself, so it can't be gamed.

---

## 4. The tables (what each one holds)

Open **Table Editor** to see these.

| Table | What it stores |
|---|---|
| `bookings` | Every booking: service, date, time, price, deposit, client name/phone, status |
| `clients` | One row per person (de-duped by phone), their referral code, Trusted status, clean-streak counter |
| `stamps` | One row per stamp earned (with a reason: base / quiet / referral / callout-group) |
| `services` | Your price list — name, price, duration, description |
| `settings` | Your availability rules — hours, buffer, max per day, blackout dates, quiet slots, deposit % |
| `portfolio_images` | The photos in the Portfolio section |
| `referrals` | A record each time a referral code is used |
| `admin_config` | Your admin passcode (stored scrambled/hashed — you'll never see it in plain text) |

---

## 5. Everyday tasks (do these from `/admin`)

These are all point-and-tap in the dashboard at **yoursite.com/admin** — no
database needed:

- **See and manage bookings** → *Bookings* tab. Confirm, Mark complete,
  No-show, or Cancel.
- **Change your hours / days off / deposit %** → *Availability* tab.
- **Add a day off** → *Availability* → Days off → pick a date → Add.
- **Change your passcode** → *Availability* → Change passcode.

The rest of this guide is for tasks the dashboard doesn't cover yet.

---

## 6. Editing your price list (services)

The dashboard doesn't edit services yet, so do it in **Table Editor**:

1. Table Editor → **`services`**.
2. To change a price: click the `price` cell, type the new number (whole rand,
   e.g. `700`), press Enter.
3. To add a service: **Insert → Insert row**, then fill in:
   - `id` — a short lowercase label, no spaces (e.g. `bridal-trial`)
   - `category` — one of `makeup`, `hair`, or `callout`
   - `name`, `price`, `duration_min` (leave blank if no fixed time)
   - `description`, and optionally `highlight` / `caption`
   - `photo` — one of `/photos/hero-leather.jpg`, `/photos/glam-blue.jpg`,
     `/photos/glam-curly.jpg`, `/photos/glam-white.jpg`
4. Save. The website picks it up on the next page load.

---

## 7. Looking up a client's loyalty

To see how many stamps someone has:

1. SQL Editor → **New query**, paste this (change the phone number):

   ```sql
   select c.name, c.phone, c.trusted, c.clean_streak,
          coalesce(sum(s.count), 0) as stamps
   from clients c
   left join stamps s on s.client_id = c.id
        and s.expires_at > now()
   where c.phone = '0731234567'
   group by c.id;
   ```

2. Click **Run**. `stamps` is their valid (non-expired) total; every 6 unlocks a
   reward. `trusted = true` means they get the reduced 25% deposit.

---

## 8. Connection keys (for the website / Vercel)

The website connects to this database with two values. Find them in
**Project Settings → API**:

- **Project URL** → `https://tvtherrzunjcbiakmnqj.supabase.co`
- **anon public** key (a long string starting `eyJ…`) — this is safe to put in
  the website; it can only do what the security rules allow.

These go into the website's environment variables as `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` (see `docs/DEPLOY.md`).

> There's also a **service_role** key on that page. **Never** put that in the
> website or share it — it bypasses all security. It's only for trusted server
> tools.

---

## 9. Why your data is safe (the security model)

- The public website **cannot read** client names or phone numbers directly.
  When it needs to know which time slots are taken, it calls a function
  (`booked_slots`) that returns **only** busy times — no personal details.
- New bookings go through one function (`book_appointment`) that safely creates
  the record. The website can't read or edit the `bookings`, `clients`, or
  `stamps` tables directly at all.
- Everything an admin does is protected by your **passcode** (stored hashed in
  `admin_config`). Change it from the dashboard on first use.

---

## 10. Recreating the database from scratch

If you ever need to rebuild the database (new project, or a reset), run these in
the **SQL Editor** in order (files are in the `supabase/` folder of the code):

1. `supabase/migrations/0001_init.sql` — creates the tables + loyalty trigger
2. `supabase/migrations/0002_rpcs_and_admin.sql` — the booking + admin functions
3. `supabase/seed.sql` — fills in your services, portfolio, and default settings

Then set a real passcode:

```sql
select admin_set_passcode('CHANGE_ME_ON_FIRST_LOGIN', 'your-new-passcode');
```

---

## 11. Free-tier notes & backups

- The free plan is plenty for a solo business. It **pauses** the database after
  ~1 week of zero activity — a live website with visitors keeps it awake. If it
  ever pauses, open the project in the Supabase dashboard and click **Restore**.
- To back up your bookings, open Table Editor → `bookings` → **Export → CSV**
  now and then, or upgrade to a paid plan for automatic daily backups.

---

## 12. Quick troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Site shows no bookings / booking "fails" | The two env vars aren't set on the host, or the project is paused. Check Section 8 + restore. |
| `/admin` won't accept the passcode | It was changed. Reset it via SQL: `select admin_set_passcode('old', 'new');` (needs the old one). Lost it? Ask your developer to reset the `admin_config` row. |
| A slot won't show as available | Check *Availability*: hours for that weekday, blackout dates, max-per-day, and the 24-hour minimum lead time. |
| Prices look wrong on the site | Edit the `services` table (Section 6); the deposit is always half the price automatically. |
