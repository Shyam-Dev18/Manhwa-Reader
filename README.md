# Manhwa Reader

A modern manhwa reading platform with a public reader experience and an admin panel for managing titles and chapters.

**Live**
`manhwa.shyamdarshanam.me`

**What This App Does**
1. Home page with latest updates and top-rated carousel.
2. Search by title, alternate titles, or genres.
3. Manhwa detail pages with metadata and chapter list.
4. Chapter reader with navigation and dropdown chapter switcher.
5. Admin dashboard to manage manhwa content.
6. Auth with role-based access for `/admin`.
7. SEO: sitemap, robots, metadata, and JSON-LD structured data.

**Tech Stack (Purpose)**
1. Next.js 16 (App Router): Server components, routing, SEO, and API routes.
2. React 19 + TypeScript: UI and type safety.
3. Tailwind CSS v4: Styling and design system utility classes.
4. MongoDB + Mongoose: Persistent storage for users, manhwa, chapters, and rate limits.
5. NextAuth (Auth.js v4): Credentials auth and session management.
6. Bcrypt: Password hashing.
7. Zod: Schema validation for admin inputs.
8. React Hook Form + @hookform/resolvers: Form state + validation wiring.
9. Radix UI: Accessible UI primitives.
10. Embla Carousel: Hero carousel on the home page.
11. Sonner: Toast notifications.
12. clsx + class-variance-authority + tailwind-merge: Conditional class composition.
13. tsx + dotenv: Local scripts and seeding.

**Setup**
1. Install dependencies:
```
npm install
```
2. Create `.env.local` (copy from `.env.example`) and fill:
```
MONGODB_URI=
NEXT_PUBLIC_SITE_URL=
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```
3. Run the dev server:
```
npm run dev
```
4. Optional: seed sample data and admin user:
```
npm run seed
```

**Footprints (What I Built)**
1. App Router structure with `(site)` and `(admin)` segments.
2. Admin-only access enforced via `middleware.ts` role checks.
3. Credentials login with rate-limit lockout logic.
4. MongoDB models for users, manhwa, chapters, and login rate limits.
5. Reader UX with chapter navigation, dropdown, and structured data.
6. ISR caching on key pages for performance and freshness.
7. SEO utilities, sitemap, and robots handling.
