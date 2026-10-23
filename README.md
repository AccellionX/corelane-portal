# Corelane

Fictional SaaS demo - public marketing site, customer dashboard, and admin panel sharing one Zustand store (persisted to `localStorage`). No real backend.

Built with **Next.js 14** (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Sonner, jsPDF, and date-fns.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
```

## Demo controls

Use the floating **Demo** pill (bottom-right):

- Switch **Public / User Dashboard / Admin**
- Switch **product module** (Bookings / Orders / Subscriptions / Files)
- Switch **role** (Admin / Manager / Support) - enforces admin access
- Toggle **staging / production** environment
- **Restart tour** or **Reset demo** data

On first visit, a welcome modal offers a **60-second tour** (skippable; restartable from the Demo pill).

### Role access (admin)

| Role | Access |
|------|--------|
| **Admin** | Full admin access, including refunds |
| **Manager** | All admin areas except Roles & Permissions (lock screen). Payments viewable; refunds blocked |
| **Support** | Users (read-only) and Support only |

## Routes

### Public site (`/`)

| Route | Description |
|-------|-------------|
| `/` | Home - CMS hero, features, pricing preview, FAQ |
| `/about` | About |
| `/features` | Features (live from CMS) |
| `/pricing` | Plans with monthly/annual toggle |
| `/contact` | Contact form + validation toasts |
| `/faq` | FAQ accordion (CMS) |
| `/login` | Mock login → `/app` |
| `/signup` | Mock sign-up → `/app` |

### User dashboard (`/app`)

| Route | Description |
|-------|-------------|
| `/app` | Overview (adapts to core module) |
| `/app/module` | Adaptive core module (bookings / orders / subscriptions) |
| `/app/uploads` | File library + drag-and-drop |
| `/app/billing` | Plan, payment method, history |
| `/app/invoices` | Invoice table + PDF download |
| `/app/notifications` | Read/unread alerts |
| `/app/support` | Tickets + threads |
| `/app/settings` | Profile, password, prefs |

### Admin panel (`/admin`)

| Route | Description |
|-------|-------------|
| `/admin` | Analytics KPIs + charts + activity feed |
| `/admin/users` | Searchable/sortable user table + drawer |
| `/admin/roles` | Roles & permissions matrix |
| `/admin/plans` | Services & plans CRUD |
| `/admin/payments` | Transactions + refunds |
| `/admin/support` | Assign + resolve tickets |
| `/admin/content` | CMS draft/publish + version history |
| `/admin/logs` | Activity log + CSV export |
| `/admin/settings` | General · Core business model · System |

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Build settings (defaults are fine):
   - **Build Command:** `npm run build`
   - **Output Directory:** (leave empty - Next.js)
   - **Install Command:** `npm install`
5. No environment variables are required for this demo (all data is client-side).
6. Click **Deploy**.
7. After deploy, open the production URL and walk through the tour.

### CLI alternative

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Notes

- Demo credit in the footer: *Demo built for your Upwork post by AccellionX*
- Shared state key: `corelane-demo-v3` in `localStorage`
- Tour preference key: `corelane-tour-v1`
