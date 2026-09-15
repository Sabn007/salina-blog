# Deployment Guide — Salina Blog (Monorepo)

This repo contains **two apps in one GitHub repository**:

```
salina-blog/
├── app/              → Next.js frontend  → deploy on Vercel
├── components/
├── lib/
├── package.json
└── cms/              → Strapi CMS        → deploy on Render
```

> **Important:** Strapi **cannot** run on Vercel. Vercel is serverless; Strapi needs a long-running Node server, PostgreSQL, and persistent storage. The frontend goes on **Vercel**; the CMS goes on **Render** (free) from the **same repo**.

---

## Architecture

| Service | Platform | Cost | URL |
|---|---|---|---|
| Next.js frontend | [Vercel](https://vercel.com) | Free | `https://salina-blog-mu.vercel.app` |
| Strapi CMS | [Render](https://render.com) | Free* | `https://salina-cms.onrender.com` |
| PostgreSQL | Render (via `render.yaml`) | Free* | Internal |

\*Free tiers sleep after inactivity and have monthly limits.

---

## Prerequisites

1. GitHub account with this repo pushed
2. [Vercel](https://vercel.com) account (sign in with GitHub)
3. [Render](https://render.com) account (sign in with GitHub)

---

## Part 1 — Deploy Strapi CMS (Render)

### Option A: Blueprint (recommended)

1. Push `render.yaml` to your repo
2. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint**
3. Connect your GitHub repo
4. Render creates:
   - PostgreSQL database (`salina-db`)
   - Web service (`salina-cms`) with `rootDir: cms`
5. After deploy, set **FRONTEND_URL** (you'll get the Vercel URL in Part 2) and the Cloudinary vars from the [Media uploads](#media-uploads-in-production-cloudinary) section:
   ```
   FRONTEND_URL=https://salina-blog-mu.vercel.app
   CLOUDINARY_NAME=...
   CLOUDINARY_KEY=...
   CLOUDINARY_SECRET=...
   ```
6. Note your CMS URL: `https://salina-cms.onrender.com`

### Option B: Manual setup

1. **New → PostgreSQL** (free) — copy connection string
2. **New → Web Service** → connect same repo
3. Settings:

   | Field | Value |
   |---|---|
   | Root Directory | `cms` |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm run start` |
   | Health Check | `/admin` |

4. Environment variables:

   ```env
   NODE_ENV=production
   HOST=0.0.0.0
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://...   # from Render/Neon
   DATABASE_SSL=true
   FRONTEND_URL=https://salina-blog-mu.vercel.app

   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=random-string
   ADMIN_JWT_SECRET=random-string
   JWT_SECRET=random-string
   TRANSFER_TOKEN_SALT=random-string
   ENCRYPTION_KEY=random-string

   CLOUDINARY_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret
   ```

   Generate secrets locally:
   ```bash
   cd cms
   node -e "const c=require('crypto');const k=()=>c.randomBytes(16).toString('base64');console.log(['APP_KEYS='+[k(),k(),k(),k()].join(','),'API_TOKEN_SALT='+k(),'ADMIN_JWT_SECRET='+k(),'JWT_SECRET='+k(),'TRANSFER_TOKEN_SALT='+k(),'ENCRYPTION_KEY='+k()].join('\n'))"
   ```

5. Wait for deploy (~5–10 min first time)
6. Open `https://salina-cms.onrender.com/admin` → create admin account
7. **Settings → Users & Permissions → Public** — ensure these are checked:
   - Post: `find`, `findOne`
   - Category: `find`, `findOne`
   - Tag: `find`, `findOne`
   - Author: `find`, `findOne`
   - Newsletter Subscriber: `create`
   - Contact Message: `create`

8. **Settings → API Tokens** → create Read-only token for draft preview

---

## Part 2 — Deploy Next.js Frontend (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your **same GitHub repo**
3. Vercel auto-detects Next.js. Confirm settings:

   | Field | Value |
   |---|---|
   | Root Directory | `.` (repo root — **not** `cms`) |
   | Framework | Next.js |
   | Build Command | `npm run build` |

   > `vercel.json` and `.vercelignore` already exclude `cms/` from the Vercel build.

4. **Environment Variables** (Production):

   ```env
   NEXT_PUBLIC_STRAPI_URL=https://salina-cms.onrender.com
   NEXT_PUBLIC_SITE_URL=https://salina-blog-mu.vercel.app
   NEXT_PUBLIC_SITE_NAME=Salina Journal
   NEXT_PUBLIC_SITE_DESCRIPTION=A premium lifestyle and travel journal
   # Optional — draft preview only. Public reads succeed without this.
   # Do not rely on a bad/expired token for homepage/blog fetches.
   # STRAPI_API_TOKEN=your-read-only-api-token
   ```

   `NEXT_PUBLIC_SITE_URL` is the **frontend** origin (canonical, `og:url`, JSON-LD). `NEXT_PUBLIC_STRAPI_URL` is the **CMS** origin. They must not be the same value.

5. Click **Deploy**

6. Copy your Vercel URL → go back to Render → set `FRONTEND_URL` → redeploy Strapi

---

## Part 3 — Connect & verify

1. **Vercel** `NEXT_PUBLIC_STRAPI_URL` → Render CMS URL
2. **Render** `FRONTEND_URL` → Vercel site URL
3. Create a test post in Strapi admin → **Publish**
4. Visit your Vercel site → post should appear
5. Test: `/blog`, `/categories`, `/feed.xml`, `/sitemap.xml`

---

## Custom domain (optional)

### Vercel (frontend)
1. Project → **Settings → Domains**
2. Add `www.yourdomain.com`
3. Update DNS at your registrar
4. Set `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com`

### Render (CMS)
1. Service → **Settings → Custom Domain**
2. Add `cms.yourdomain.com`
3. Update `NEXT_PUBLIC_STRAPI_URL=https://cms.yourdomain.com` on Vercel

---

## Media uploads in production (Cloudinary)

Render free-tier disk is **ephemeral**. Files stored under Strapi's local `/uploads` directory are deleted on every redeploy, while the database still references those URLs — cover images then 404.

This CMS uses `@strapi/provider-upload-cloudinary`. When `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are all set, the Media Library writes to Cloudinary instead of disk.

### 1. Create a free Cloudinary account

1. Sign up at [cloudinary.com](https://cloudinary.com/users/register/free) (the free tier is enough for this blog).
2. Open the **Dashboard** and copy **Cloud Name**, **API Key**, and **API Secret**.

Do **not** commit these values. Keep them in Render (and optionally a local `cms/.env`, which is gitignored).

### 2. Set env vars on Render

**Dashboard:** Web Service `salina-cms` → **Environment** → **Add Environment Variable**:

| Key | Value |
|---|---|
| `CLOUDINARY_NAME` | Cloudinary **Cloud Name** |
| `CLOUDINARY_KEY` | Cloudinary **API Key** |
| `CLOUDINARY_SECRET` | Cloudinary **API Secret** |

**Blueprint:** `render.yaml` declares these keys with `sync: false`. Paste the values in the Blueprint confirm screen or on the service Environment tab after the first deploy.

Save, then **Manual Deploy → Deploy latest commit** (or wait for the next git deploy) so Strapi picks up the new provider config.

### 3. Re-upload existing images

Switching provider does **not** migrate files already stored on disk. Rows that still point at `/uploads/...` will keep 404ing. In Strapi Admin, re-upload cover images (and any other media) so records use Cloudinary URLs (`https://res.cloudinary.com/...`).

Local development can omit the Cloudinary variables; Strapi then uses the local disk provider.

---

## One repo, two deploys

Every `git push` triggers:

| Changed files | Vercel | Render |
|---|---|---|
| `app/`, `components/`, `lib/` | ✅ Redeploys | ⏭ Skips (ignoreCommand) |
| `cms/` | ⏭ Skips | ✅ Redeploys |
| Both | ✅ | ✅ |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **Build fails: `typescript` not found** | Use `npm run render-build` (installs dev deps). Set `NPM_CONFIG_PRODUCTION=false` on Render. |
| **Build fails: `better-sqlite3` compile error** | Fixed — moved to `optionalDependencies` (production uses Postgres only). |
| **Build fails: JavaScript heap out of memory** | Render free tier has 512MB RAM; Strapi admin build needs more. Upgrade to **Starter** ($7/mo) OR set build command to `npm run render-build`. |
| **Build fails: cannot find module** | Ensure **Root Directory** is `cms` on Render. |
| Homepage empty / “No stories found yet” | True empty vs CMS error: if the CMS is sleeping, wait 30–60s and retry. One failed parallel fetch (e.g. featured) must not blank posts/categories. Check Vercel logs for `[strapi] 401/403`. |
| Canonical/OG point at the CMS | `NEXT_PUBLIC_SITE_URL` must be `https://salina-blog-mu.vercel.app`, not `https://salina-cms.onrender.com`. |
| CORS error | Set `FRONTEND_URL` on Render to exact Vercel URL |
| Images broken | Set `NEXT_PUBLIC_STRAPI_URL`; confirm media URLs are Cloudinary (`res.cloudinary.com`), not `/uploads` |
| Cover images 404 after Render redeploy | Set `CLOUDINARY_*` on Render, redeploy CMS, then re-upload media in Strapi Admin |
| 403 on API | Enable Public permissions in Strapi admin |
| Build fails on Vercel | Ensure Root Directory is `.` not `cms` |
| **Database connection failed** | Set `DATABASE_SSL=true` and `DATABASE_SSL_REJECT_UNAUTHORIZED=false` on Render |
| Draft preview fails | Add `STRAPI_API_TOKEN` on Vercel |

### Render manual build settings

If not using Blueprint, set these in the Render dashboard:

| Field | Value |
|---|---|
| Root Directory | `cms` |
| Build Command | `npm run render-build` |
| Start Command | `npm run start` |
| Node Version | `20.18.0` |

---

## Environment variable cheat sheet

### Vercel (frontend)
```
NEXT_PUBLIC_STRAPI_URL=https://salina-cms.onrender.com
NEXT_PUBLIC_SITE_URL=https://salina-blog-mu.vercel.app
NEXT_PUBLIC_SITE_NAME=Salina Journal
# STRAPI_API_TOKEN=<read-only-token>   # optional, draft preview only
```

### Render (cms)
```
DATABASE_CLIENT=postgres
DATABASE_URL=<postgres-connection-string>
DATABASE_SSL=true
FRONTEND_URL=https://salina-blog-mu.vercel.app
APP_KEYS=...
ADMIN_JWT_SECRET=...
API_TOKEN_SALT=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...
CLOUDINARY_NAME=<cloudinary-cloud-name>
CLOUDINARY_KEY=<cloudinary-api-key>
CLOUDINARY_SECRET=<cloudinary-api-secret>
```
