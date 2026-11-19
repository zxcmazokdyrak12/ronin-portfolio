# 浪人 The Way of the Ronin

**Live:** https://ronin-portfolio-olive.vercel.app

Full-stack developer portfolio styled as an ink-and-paper manga page, on top of an antique map of Japan (J. H. Colton, 1855). Available in **Russian, English and Japanese**.

## Projects

| Seal | Place | Project | Stack |
|---|---|---|---|
| 鋸 | Edo | [Chainsaw Chat](https://chainsaw-chat.vercel.app) — real-time messenger · [code](https://github.com/zxcmazokdyrak12/chainsaw-chat) | TypeScript, React, Socket.io, Express, PostgreSQL, Prisma |
| 剣 | Kyoto | [Vagabond Anime Tracker](https://vagabond-anime-tracker.vercel.app) — anime tracker · [code](https://github.com/zxcmazokdyrak12/vagabond-anime-tracker) | React, Express, PostgreSQL (raw SQL), Jikan API |
| 霊 | Mount Osore | [The Mandela Catalogue fan game](https://spookytake.itch.io/the-mandela-catalogue) — PSX horror · [code](https://github.com/zxcmazokdyrak12/the-mandela-catalogue) | Unity, URP, C# |

## What's inside

- **Each project card looks like the project itself.** Chainsaw Chat is a black-and-white manga page with speed lines and draggable manga stickers. The tracker card is washi paper and ink: hanging scrolls with app screenshots, manga panels, and a sword cut — drag the mouse across the card and it splits in two.
- **Three languages** (RU / EN / 日本語) with no i18n library: a small React context, a UI dictionary (`src/i18n/ui.js`) and localized project data (`src/data/projects.json`). The choice is saved in `localStorage`.
- **Workshop of live tools:** the hour in the old Japanese time system, a palette that repaints the site, Regex Blade (cuts debug junk out of code), a ronin-name generator, a reaction duel with a database leaderboard, and a scroll of my latest commits.
- Accessible modals (Esc, focus return, scroll lock), `prefers-reduced-motion` support, compressed WebP images.

## Backend

Two Vercel serverless functions live in `api/`:

- `api/duel.js` — the duel leaderboard. `GET` returns the ten best reactions, `POST` validates and stores a result in PostgreSQL (Neon) through `@neondatabase/serverless`. Reaction times outside 100–1500 ms, bad names and rapid repeats are rejected.
- `api/commits.js` — latest commits from my repositories via the GitHub API, cached on Vercel's CDN for 15 minutes.

Environment: `DATABASE_URL` (Neon connection string). Optional: `GITHUB_TOKEN` for a higher GitHub rate limit.

```sql
CREATE TABLE duel_scores (
  id serial PRIMARY KEY,
  name varchar(20) NOT NULL CHECK (char_length(name) BETWEEN 1 AND 20),
  ms integer NOT NULL CHECK (ms BETWEEN 100 AND 1500),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Stack

React 19, Vite, Tailwind CSS 4, Framer Motion, lucide-react · Vercel Functions, Neon PostgreSQL, GitHub API. Deployed on Vercel.

## Run locally

```bash
npm install
npm run dev        # frontend only
npx vercel dev     # frontend + api/ functions
```

Build: `npm run build` · lint: `npm run lint`.

## Adding a project

Add an object to `src/data/projects.json`. Text fields take `{ "ru": "...", "en": "...", "ja": "..." }`; `x` and `y` are the seal's position on the map in percent.

---

Map: J. H. Colton, 1855 (public domain). Chainsaw Man © Tatsuki Fujimoto. Vagabond © Takehiko Inoue. Fan art used for a non-commercial portfolio.
