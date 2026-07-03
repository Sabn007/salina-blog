# Salina Blog — Strapi CMS

Headless CMS backend for the Salina Journal lifestyle and travel blog.

## Content Types

| Collection | Description |
|---|---|
| **Post** | Blog posts with rich text, cover image, gallery, SEO fields, related posts, draft/publish |
| **Category** | Post categories with slug, description, cover image |
| **Tag** | Post tags with auto-generated slugs |
| **Author** | Author profiles with avatar and social links |
| **Newsletter Subscriber** | Email subscriptions from the frontend |
| **Contact Message** | Contact form submissions |

## Features

- Draft & publish workflow for posts
- Auto-generated slugs (UID fields)
- Auto-calculated reading time from content
- SEO metadata fields (title, description, image, canonical URL)
- Media library for cover images and galleries
- Related posts (many-to-many)
- Public API permissions configured automatically on bootstrap
- CORS configured for the Next.js frontend

## Local Development

```bash
# From the cms directory
cp .env.example .env   # Edit secrets if needed
npm run develop
```

Admin panel: **http://localhost:1337/admin**

On first launch, create your admin account, then:

1. Go to **Content Manager** and create Authors, Categories, and Tags
2. Create Posts with cover images and content
3. Use **Save** for drafts or **Publish** to make posts live
4. Preview drafts at `http://localhost:3000/blog/{slug}?preview=true` (requires `STRAPI_API_TOKEN` on the frontend)

## API Endpoints

| Method | Endpoint | Public |
|---|---|---|
| GET | `/api/posts` | Yes |
| GET | `/api/posts/:id` | Yes |
| GET | `/api/categories` | Yes |
| GET | `/api/tags` | Yes |
| GET | `/api/authors` | Yes |
| POST | `/api/newsletter-subscribers` | Yes |
| POST | `/api/contact-messages` | Yes |

### Example: Fetch published posts

```
GET http://localhost:1337/api/posts?populate[coverImage]=true&populate[author]=true&filters[publishedAt][$notNull]=true
```

## Production Deployment

### Environment Variables

Copy `.env.example` to `.env` and set:

- `APP_KEYS` — comma-separated random keys
- `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`
- `FRONTEND_URL` — your production frontend URL
- Database credentials (PostgreSQL recommended for production)

### PostgreSQL

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-host
DATABASE_PORT=5432
DATABASE_NAME=salina_blog
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password
DATABASE_SSL=true
```

### Build & Start

```bash
npm run build
npm run start
```

### Hosting Options

- [Railway](https://railway.app)
- [Render](https://render.com)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- Self-hosted VPS with PM2 or Docker

## Preview Mode

1. In Strapi admin, go to **Settings → API Tokens** and create a **Read-only** token
2. Add `STRAPI_API_TOKEN=<token>` to the Next.js `.env.local`
3. Preview unpublished posts: `http://localhost:3000/blog/your-slug?preview=true`
