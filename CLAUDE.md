# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Vocab Space is a Vietnamese-language vocabulary app for a small group. It covers Chinese (HSK 3.0), English (B1+), Korean (TOPIK 1–6) and Japanese (JLPT N5–N1), each with daily word sets, spaced repetition, flashcards and fill-in-the-blank exercises. Each member chooses which languages they learn. An admin issues accounts. Members log in by picking their name and entering their password. Gamification: a TikTok-style streak flame, a UI accent colour that changes with the streak, milestone celebrations, and knight ranks mapped to HSK/CEFR/TOPIK/JLPT levels. All UI text and meanings are in Vietnamese.

## Commands

```bash
npm run dev        # next dev (Turbopack) on http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run db:push    # sync src/db/schema.ts to Neon (drizzle-kit push, no migration files)
npm run db:seed    # create the first admin (if no users) + starter content; idempotent
```

`DATABASE_URL` (Neon Postgres) lives in `.env.local`, which is gitignored. Optional `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` turn on neural voices through `/api/tts`; without them the browser's speech engine is used. Drizzle-kit and the seed script load `.env.local` themselves. `ADMIN_NAME` / `ADMIN_PASSWORD` can be set when seeding; otherwise the seed prints a random password. There is no test runner.

## Stack

These versions are newer than most training data. Check `node_modules/next/dist/docs/` before relying on remembered APIs.

- **Next.js 16.4** App Router under `src/app/`, **React 19.3**, TypeScript strict, path alias `@/*` → `src/*`. Middleware is called **Proxy** here (`src/proxy.ts`). It only checks that the session cookie exists and redirects to `/login`.
- **Tailwind v4**, CSS-first, loaded through `@tailwindcss/turbopack` in `next.config.ts` (no PostCSS, no tailwind config). Design tokens, button styles and animations are all in `src/app/globals.css`. Component classes (`.btn`, `.card`, `.chip`, `.field`) sit in `@layer components` so utilities on the same element win; keep new component classes there, since an unlayered rule beats every utility.
- **Drizzle ORM** over `@neondatabase/serverless` (HTTP driver). There are no interactive transactions, so batch work uses multi-row inserts and `on conflict`.

## Cache Components rules (these break the build or runtime if ignored)

`cacheComponents` and `partialPrefetching` are on. Practical consequences in this codebase:

- Every user-facing page is per-user. The `(app)` layout wraps the shell in `<Suspense>`, and **each page folder has its own `loading.tsx`**. Without one, dev reports "uncached data… outside of `<Suspense>`" for navigations into that page. Add a `loading.tsx` when you add a page.
- Code that reads the current time (`new Date()`) during render must first run `await connection()`. That is why `getUser`, `getToday`, `getStats` and `getReviewQuestions` call it. Server Actions are exempt.
- `getSettings()` (`src/lib/settings.ts`) is the only `"use cache"` function (tag `settings`). `saveSettings` calls `updateTag("settings")`.
- Server Actions call `refresh()` from `next/cache` after mutations, so the shell (streak, due count) re-renders.
- Never add `export const runtime` or old segment configs (`dynamic`, `revalidate`).

## Architecture

**Data model** (`src/db/schema.ts`): one `items` table holds all content, split by `kind`: `zh_word`, `zh_phrase` (daily phrases), `en_word`, `en_idiom`, `ko_word`, `ko_phrase`, `ja_word`, `ja_phrase`. Kinds and language codes are defined in `src/lib/kinds.ts` so client code can import them without pulling in Drizzle; `kind` is a plain text column, so adding a kind needs no migration. Other fields:

- `reading` holds pinyin (zh), IPA (en), Revised Romanization (ko) or `kana · romaji` (ja; romaji alone for kana-only words). `meaning` is Vietnamese.
- `prepositions` is English only, `;`-separated.
- `note` is a usage note. Korean/Japanese/Chinese seed words put the Sino-Vietnamese reading here.

Content beyond the hand-written starter sets comes from two generated files in `src/db/seed-data/`: `zh-hsk30.json` (the full official HSK 3.0 list, 11,092 words merged to 10,944 terms) and `en-cefr.json` (CEFR B1–C2 from CEFR-J 1.5 + Octanove C1/C2, CC BY-SA 4.0) and `ja-jlpt.json` (JLPT N5–N1 from open-anki-jlpt-decks, MIT; romaji generated from kana). Their Vietnamese meanings, IPA, Hán Việt readings and the HSK 1–3 / B1 / N5–N4 examples were machine-written, so admins may correct individual items. List rows use `sortOrder` 10000+ so hand-written words come first within a level; the seed also syncs existing Chinese words to their official HSK 3.0 level. See the header of `seed.ts` for row formats and sources.
- `letter` is precomputed for browsing by `letterOf(term, reading, lang)`: A–Z (Chinese uses the first pinyin letter without tones), the initial consonant ㄱ ㄴ ㄷ… for Korean, and the kana row あ か さ… for Japanese.
- `examples` is a JSONB array of `{text, reading?, translation}`. **The target word in an example is wrapped in `[brackets]`.** Brackets drive highlighting (`components/example.tsx`) and blanking in exercises (`findTarget` in `src/lib/text.ts`).

`users.langs` (jsonb, default `["zh","en"]`) lists the languages a member learns. It drives the nav, dashboard, rank badges, `dueTotal` and the review queue (`getReviewQuestions(userId, langs)`); learned totals, ranks and milestones still count every language. Members toggle it on `/account` (`setLanguages` in `actions/learn.ts`); pages of a disabled language still work and show a banner to re-enable it. `users.daily` (jsonb, default `{}`) holds a member's own daily quota per kind, set on `/account` (`setDailyGoals`); a missing kind falls back to the admin default through `quotaFor` in `lib/settings.ts`. That is why `getDailyItems` and the practice queries take the session user rather than a bare id.

Per-user state lives in `progress` (SRS fields, one row per user/item, created when an item is learned or first answered) and `activity` (one row per user per local day). Streaks are computed from `activity`. The day boundary uses the timezone from settings (`dayIn` in `src/lib/dates.ts`).

**Language config** (`src/lib/langs.ts`): `LANGS[lang]` maps a language to its word kind, extra kind, levels, standard, speech locale, font class (`han`, `ja`, `ko` in `globals.css`; Japanese needs its own font stack so kanji are not drawn with Chinese glyphs) and all language-specific UI copy. Pages under `src/app/(app)/[lang]/` are shared by every language and read from this config; do not branch on `lang === "zh"`. Helpers: `fontOfKind`, `speechOfKind`, `kindsOf(langs)`. `LEVEL_ORDER` in `queries.ts` sorts levels easy → hard for every standard. Routes: `/[lang]` (today), `browse`, `expressions` (phrases/idioms), `flashcards`, `exercise`, `history`.

**Learning flow**:

- `lib/queries.ts` holds the read models: the daily set (items learned today plus the next unlearned items, up to the quota, returned in curriculum order rather than grouped by status), browse, history and quiz/cloze generation with random distractors.
- Fill-in-the-blank has two styles, picked by `LANGS[lang].cloze`. `"term"` asks for the dictionary form, so it tests meaning only. `"grammar"` (English) builds questions in `lib/en-grammar.ts`: it blanks either the preposition after the word or the inflected word. Choices mix wrong forms that the words before the blank rule out (after "will", "has", "was"…), word-family members of another part of speech (arrival for arrived) and another word in the same form. Each question also has a Vietnamese grammar note. Answers are checked against `ClozeQuestion.correct`.
- Lists of word cards render through `components/word-grid.tsx`. It keeps on-screen order across the `refresh()` that follows marking/unmarking, so cards never jump or vanish (e.g. under the "Chưa học" filter); give it a `key` that changes with filters/page.
- `lib/progress.ts` holds the writes:
  - `recordLearned` marks items learned.
  - `recordAnswers` grades answers through `lib/srs.ts`, a simplified SM-2. A wrong answer brings the item back in 10 minutes with `priority=true` until it is answered right twice in a row.
- Both writes return `Celebration[]`: a streak celebration on the first activity of a day when the streak is ≥2, and milestone crossings.
- Server Actions in `src/app/actions/learn.ts` wrap these. Client components pass the result to `useCelebrate().celebrate()` (`components/celebrate.tsx`, canvas-confetti plus a modal).

**Speech** (`components/speak.tsx`, `lib/voices.ts`): `VOICES[lang]` lists four voices per language (two female, two male; ids are Azure neural voice names). The member's choice and reading speed are stored per device in localStorage (`vs-voice`) and picked on `/account` (`components/voice-picker.tsx`). `speak(text, locale)` plays `/api/tts` audio when the server has Azure configured (the layout passes `ttsConfigured()` to the shell), and falls back to `speechSynthesis`, where `pickDeviceVoice` takes the same voice in Edge or the best local voice of the same gender and accent. Words go through `spokenForm` first, so Japanese kanji words are spoken from their kana reading. Example sentences get a read-aloud button through `ExampleLine`/`ExampleBox` (`components/example.tsx`) when given a `speech` locale.

**Shell** (`components/app-frame.tsx`, client): it renders the sidebar, bottom nav, streak/rank badges and the floating review bubble (`components/floating-review.tsx`). It sets `data-tier` on the `.accent-scope.streak-theme` wrapper and on `<html>`. CSS in `globals.css` maps each tier to `--accent`, which is registered with `@property` so it animates, plus `--tint`/`--tint-line`, which tint `--bg`, `--surface`, `--line`, `--chrome` (header, bottom nav) and `--glow` from the neutral `--*-base` colours. Derived accent colours are declared on `.accent-scope` as well as `:root`, because custom properties resolve where they are declared. Small `.accent-scope` elements (tier list, celebration chip) only change the accent, not the page tint.

**Gamification constants** (`lib/gamification.ts`): streak tiers, knight titles, and default rank scales (official HSK 3.0 cumulative word counts; CEFR estimates). Admins can override the scales, daily quotas, milestones and timezone at `/admin/settings`. These are stored as key/value rows in `settings` and merged over `DEFAULT_SETTINGS`.

**Admin** (`/admin`, guarded by `requireAdmin()` in the layout and in every admin action): accounts, item CRUD, bulk import (JSON, or one `|`-separated row per line; see `parseImport` in `actions/admin.ts`), and global settings.

**Auth** (`lib/auth.ts`): a random token in the `vs_session` httpOnly cookie, stored as a sha256 hash in `sessions`, with passwords hashed by bcryptjs. `getUser` is wrapped in React `cache()`. Resetting a password or locking an account deletes that user's sessions.

The `AGENTS.md` block is managed by `next dev` (`experimental.agentFeedback`). Do not edit it by hand.
