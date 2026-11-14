# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Vocab Space is a Vietnamese-language vocabulary app for a small group. It covers Chinese (HSK 3.0) and English (B1+), each with daily word sets, spaced repetition, flashcards and fill-in-the-blank exercises. An admin issues accounts. Members log in by picking their name and entering their password. Gamification: a TikTok-style streak flame, a UI accent colour that changes with the streak, milestone celebrations, and knight ranks mapped to HSK/CEFR levels. All UI text and meanings are in Vietnamese.

## Commands

```bash
npm run dev        # next dev (Turbopack) on http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run db:push    # sync src/db/schema.ts to Neon (drizzle-kit push, no migration files)
npm run db:seed    # create the first admin (if no users) + starter content; idempotent
```

`DATABASE_URL` (Neon Postgres) lives in `.env.local`, which is gitignored. Drizzle-kit and the seed script load `.env.local` themselves. `ADMIN_NAME` / `ADMIN_PASSWORD` can be set when seeding; otherwise the seed prints a random password. There is no test runner.

## Stack

These versions are newer than most training data. Check `node_modules/next/dist/docs/` before relying on remembered APIs.

- **Next.js 16.4** App Router under `src/app/`, **React 19.3**, TypeScript strict, path alias `@/*` → `src/*`. Middleware is called **Proxy** here (`src/proxy.ts`). It only checks that the session cookie exists and redirects to `/login`.
- **Tailwind v4**, CSS-first, loaded through `@tailwindcss/turbopack` in `next.config.ts` (no PostCSS, no tailwind config). Design tokens, button styles and animations are all in `src/app/globals.css`.
- **Drizzle ORM** over `@neondatabase/serverless` (HTTP driver). There are no interactive transactions, so batch work uses multi-row inserts and `on conflict`.

## Cache Components rules (these break the build or runtime if ignored)

`cacheComponents` and `partialPrefetching` are on. Practical consequences in this codebase:

- Every user-facing page is per-user. The `(app)` layout wraps the shell in `<Suspense>`, and **each page folder has its own `loading.tsx`**. Without one, dev reports "uncached data… outside of `<Suspense>`" for navigations into that page. Add a `loading.tsx` when you add a page.
- Code that reads the current time (`new Date()`) during render must first run `await connection()`. That is why `getUser`, `getToday`, `getStats` and `getReviewQuestions` call it. Server Actions are exempt.
- `getSettings()` (`src/lib/settings.ts`) is the only `"use cache"` function (tag `settings`). `saveSettings` calls `updateTag("settings")`.
- Server Actions call `refresh()` from `next/cache` after mutations, so the shell (streak, due count) re-renders.
- Never add `export const runtime` or old segment configs (`dynamic`, `revalidate`).

## Architecture

**Data model** (`src/db/schema.ts`): one `items` table holds all content, split by `kind`: `zh_word`, `zh_phrase` (daily phrases), `en_word`, `en_idiom` (kinds are defined in `src/lib/kinds.ts` so client code can import them without pulling in Drizzle). Other fields:

- `reading` holds pinyin or IPA, and `meaning` is Vietnamese.
- `prepositions` is English only, `;`-separated.
- `note` is a usage note.
- `letter` is precomputed for A–Z browsing. For Chinese it is the first pinyin letter without tones, set by `letterOf`.
- `examples` is a JSONB array of `{text, reading?, translation}`. **The target word in an example is wrapped in `[brackets]`.** Brackets drive highlighting (`components/example.tsx`) and blanking in exercises (`findTarget` in `src/lib/text.ts`).

Per-user state lives in `progress` (SRS fields, one row per user/item, created when an item is learned or first answered) and `activity` (one row per user per local day). Streaks are computed from `activity`. The day boundary uses the timezone from settings (`dayIn` in `src/lib/dates.ts`).

**Language config** (`src/lib/langs.ts`): `LANGS.zh` and `LANGS.en` map a language to its word kind, extra kind, levels, standard and speech locale. Pages under `src/app/(app)/[lang]/` are shared by both languages and branch on this config. Routes: `/[lang]` (today), `browse`, `expressions` (phrases/idioms), `flashcards`, `exercise`, `history`.

**Learning flow**:

- `lib/queries.ts` holds the read models: the daily set (items learned today plus the next unlearned items ordered by level, up to the quota), browse, history and quiz/cloze generation with random distractors.
- `lib/progress.ts` holds the writes:
  - `recordLearned` marks items learned.
  - `recordAnswers` grades answers through `lib/srs.ts`, a simplified SM-2. A wrong answer brings the item back in 10 minutes with `priority=true` until it is answered right twice in a row.
- Both writes return `Celebration[]`: a streak celebration on the first activity of a day when the streak is ≥2, and milestone crossings.
- Server Actions in `src/app/actions/learn.ts` wrap these. Client components pass the result to `useCelebrate().celebrate()` (`components/celebrate.tsx`, canvas-confetti plus a modal).

**Shell** (`components/app-frame.tsx`, client): it renders the sidebar, bottom nav, streak/rank badges and the floating review bubble (`components/floating-review.tsx`). It sets `data-tier` on the `.accent-scope` wrapper. CSS in `globals.css` maps each tier to `--accent`, which is registered with `@property` so it animates. Derived accent colours are declared on `.accent-scope` as well as `:root`, because custom properties resolve where they are declared.

**Gamification constants** (`lib/gamification.ts`): streak tiers, knight titles, and default rank scales (official HSK 3.0 cumulative word counts; CEFR estimates). Admins can override the scales, daily quotas, milestones and timezone at `/admin/settings`. These are stored as key/value rows in `settings` and merged over `DEFAULT_SETTINGS`.

**Admin** (`/admin`, guarded by `requireAdmin()` in the layout and in every admin action): accounts, item CRUD, bulk import (JSON, or one `|`-separated row per line; see `parseImport` in `actions/admin.ts`), and global settings.

**Auth** (`lib/auth.ts`): a random token in the `vs_session` httpOnly cookie, stored as a sha256 hash in `sessions`, with passwords hashed by bcryptjs. `getUser` is wrapped in React `cache()`. Resetting a password or locking an account deletes that user's sessions.

The `AGENTS.md` block is managed by `next dev` (`experimental.agentFeedback`). Do not edit it by hand.
