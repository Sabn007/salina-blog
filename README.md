# Salina Journal

A premium lifestyle and travel blog built with **Next.js** (App Router) and **Strapi 5** as a headless CMS. Original editorial design inspired by high-end travel publications — warm typography, magazine layouts, and a refined reading experience.

## Architecture

```
salina-blog/
├── app/                  # Next.js App Router pages
├── components/           # React UI components
├── lib/                  # Strapi client, SEO utilities
├── types/                # TypeScript types
├── cms/                  # Strapi 5 backend
│   └── src/api/          # Content types & controllers
└── public/               # Static assets
```

## Deployment (same repo)

| App | Platform | Folder |
|---|---|---|
| Frontend | **Vercel** | `/` (repo root) |
| Strapi CMS | **Render** | `/cms` |

Strapi cannot run on Vercel — it needs a persistent server. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide.

Quick start:
1. Push repo to GitHub
2. Render → **New Blueprint** → deploy `render.yaml` (CMS + database)
3. Vercel → import same repo → deploy root (frontend)
4. Connect env vars between both (see DEPLOYMENT.md)

## Features

### CMS (Strapi Admin)
- Create, edit, delete, and publish blog posts
- Draft & publish workflow with preview
- Cover images and photo galleries via media library
- Categories, tags, and authors
- SEO metadata (title, description, image, canonical URL)
- Auto-generated slugs
- Related posts
- Newsletter subscribers & contact messages

### Frontend (Next.js)
- Dynamic blog pages with SSG/ISR
- Full-text search
- Category and tag archives
- Reading progress indicator
- Related posts
- Newsletter signup
- Dark mode
- Responsive, mobile-first design
- SEO: Open Graph, Twitter cards, JSON-LD
- Sitemap, robots.txt, RSS feed
- Google AdSense placeholders
- Affiliate link components
- Optimized for Core Web Vitals (ISR, image optimization, font display swap)

## Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd cms && npm install && cd ..
```

### 2. Configure environment

```bash
# Frontend
cp .env.example .env.local

# Backend
cp cms/.env.example cms/.env
```

Generate Strapi secrets (run once):

```bash
cd cms
node -e "const c=require('crypto');const k=()=>c.randomBytes(16).toString('base64');console.log(['APP_KEYS='+[k(),k(),k(),k()].join(','),'API_TOKEN_SALT='+k(),'ADMIN_JWT_SECRET='+k(),'TRANSFER_TOKEN_SALT='+k(),'JWT_SECRET='+k(),'ENCRYPTION_KEY='+k()].join('\n'))"
```

Copy the output into `cms/.env`.

### 3. Start development servers

**Option A — both at once:**

```bash
npm run dev:all
```

**Option B — separate terminals:**

```bash
# Terminal 1: Strapi CMS
cd cms && npm run develop

# Terminal 2: Next.js frontend
npm run dev
```

- **Frontend:** http://localhost:3000
- **Strapi Admin:** http://localhost:1337/admin

On first Strapi launch, create your admin account.

### 4. Add content

1. Create **Authors**, **Categories**, and **Tags** in Strapi
2. Create a **Post** with title, content, cover image, and relations
3. Click **Publish** to make it live on the frontend
4. Use the **Preview** button in Strapi to preview drafts

## Content Workflow

| Action | How |
|---|---|
| Save draft | Click **Save** in Strapi (post stays unpublished) |
| Publish | Click **Publish** |
| Preview draft | Click **Preview** in Strapi admin, or visit `/blog/{slug}?preview=true` |
| Upload images | Use Strapi **Media Library** |
| SEO | Fill `seoTitle`, `seoDescription`, `seoImage` on each post |
| Related posts | Select posts in the **Related Posts** field |

### Draft Preview

1. Create an API token in Strapi: **Settings → API Tokens → Read-only**
2. Add to `.env.local`: `STRAPI_API_TOKEN=your-token`
3. Preview URL: `http://localhost:3000/blog/your-slug?preview=true`

## API Integration

The frontend consumes Strapi's REST API via `lib/strapi/client.ts` and `lib/strapi/queries.ts`.

Example:

```typescript
import { getPosts, getPostBySlug } from '@/lib/strapi/queries';

const { data: posts } = await getPosts(1, 12);
const post = await getPostBySlug('my-travel-story');
```

Populate parameters are pre-configured for images, authors, categories, tags, and related posts.

## Production Deployment

### Frontend (Vercel recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables from `.env.example`
4. Deploy

```bash
npm run build
npm run start
```

### Backend (Strapi)

1. Use PostgreSQL in production (update `cms/.env`)
2. Set `FRONTEND_URL` to your production domain
3. Build and start:

```bash
cd cms
npm run build
npm run start
```

Recommended hosts: Railway, Render, DigitalOcean, or a VPS with PM2.

### Environment Variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Frontend | Strapi API URL |
| `NEXT_PUBLIC_SITE_URL` | Frontend | Production site URL |
| `NEXT_PUBLIC_SITE_NAME` | Frontend | Site name for SEO |
| `STRAPI_API_TOKEN` | Frontend (server) | For draft preview |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Frontend | Google AdSense publisher ID |
| `FRONTEND_URL` | Strapi | Frontend URL for CORS & preview |
| `DATABASE_*` | Strapi | Database credentials |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run dev:cms` | Start Strapi dev server |
| `npm run dev:all` | Start both concurrently |
| `npm run build` | Build Next.js for production |
| `npm run build:cms` | Build Strapi admin panel |
| `npm run start` | Start Next.js production server |
| `npm run start:cms` | Start Strapi production server |

## Design System

- **Display font:** Cormorant Garamond
- **Body font:** DM Sans
- **Palette:** Cream, terracotta, sage green, warm charcoal
- **Style:** Editorial magazine layout with generous whitespace

## License

Private project. All rights reserved.
