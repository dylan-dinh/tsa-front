# ClipFlow × ClipIt — Integration Notes

This pass restyles your Expo / React Native Web app to the **ClipFlow** design
system and wires the screens to your **real backend endpoints**. Everything is
plain React Native (renders on web via `react-native-web` and on iOS/Android),
so the same source drives **mobile and desktop**.

A clickable visual reference of the target design lives in `ClipFlow.dc.html`
(open it in the preview) — the RN screens below mirror it.

---

## How to apply

Copy the files in this `clipit/` folder over the matching paths in your repo,
then:

```bash
npm install          # @types/react-native removed; nothing new to add
npm run web          # desktop + mobile web (react-native-web)
npm run ios / android
```

---

## Files changed / added

| File | Change |
|---|---|
| `src/styles/theme.ts` | **Rewritten.** Killed the dead `@mui/material` theme (it was imported but `@mui` was never installed). Now exports ClipFlow tokens: `colors`, `gradients`, `radii`, `spacing`, `font`, `shadow`, and `fmtCount` / `fmtDuration`. |
| `src/data/categories.ts` | **New.** Categories = Twitch `game_id`s (the same ids sent to `/users/clips`). Helpers `getCategoryName`, `getCategoryHue`, `gradientFor`. |
| `src/services/preferences.ts` | **New.** Local persistence (via your existing `storage` service) for things the backend has no endpoint for yet: subscribed `game_id`s, saved clips, votes. |
| `src/services/api.ts` | **Rewritten, same endpoints.** Added an axios request interceptor that auto-attaches the auth token from storage (existing `token` params still work and override it). Added `getClipSlug()` / `getTwitchEmbedUrl()` helpers. |
| `src/components/ClipCard.tsx` | **Rewritten.** ClipFlow card; maps the real `Clip` shape (`Title`, `BroadcasterName`, `ViewCount`, `Duration`, `ThumbnailURL`, `GameID`). Thumbnail templates (`%{width}x%{height}`) are normalized. |
| `src/components/Home.tsx` | **Rewritten.** Real feed via the (previously unused) `useClips` hook → `GET /users/clips`. For You / Trending / Following sort clientside, infinite scroll, voting + saving. |
| `src/components/Discover.tsx` | **New.** Browse categories, subscribe/unsubscribe (persists `game_id`s that drive the feed), search, tap → category clips in Explore. |
| `src/components/Explore.tsx` | **Rewritten.** Immersive vertical pager on **real clips** (no more mock array). Twitch embed = real `<iframe>` on web, `WebView` on native, `parent` set from the host. |
| `src/components/SavedClips.tsx` | **New.** Saved tab, reads from local prefs + the clips cache. |
| `src/components/UserProfile.tsx` | **Rewritten.** Real user from `AuthContext` + `GET /user` refresh; favorite categories; logout. |
| `src/components/Landing.tsx` | **Rewritten.** ClipFlow dark hero; keeps the Twitch OAuth-callback detection; real Twitch redirect. |
| `src/components/Login.tsx` | **Rewritten.** Now calls the **real** `POST /users/login` → `AuthContext.login(token, user)` (was storing a dummy token). |
| `src/components/Register.tsx` | **Rewritten.** Real `POST /users/register`, then auto sign-in. |
| `src/components/AppNavBar.tsx` | **New.** Responsive custom tab bar: sidebar on desktop (≥1024px), bottom bar on mobile. |
| `src/components/Screen.tsx` | **New.** Dark background + desktop sidebar offset wrapper. |
| `App.tsx` | **Rewritten.** Stack(`Landing` → `Main` → `Explore`). `Main` is a **bottom-tab** navigator with `lazy:false` so screens stay mounted and **clip embeds keep playing while you navigate**. |
| `src/types/navigation.ts` | Updated routes (`Main`, `Explore` params). |
| `package.json` | Removed deprecated `@types/react-native` (types ship with `react-native` ≥0.71). |

Unchanged and still used as-is: `AuthContext`, `ModalContext`, `storage`,
`clipsStorage`, `useClips`, `useTwitchAuth`, `OAuthCallback`, `GoogleIcon`,
`types/index.ts`.

---

## Backend endpoints — where each is used

| Endpoint | Screen / file |
|---|---|
| `POST /api/users/login` | `Login.tsx` → `AuthContext` |
| `POST /api/users/register` | `Register.tsx` |
| `GET /api/users/login/twitch` (+ `/callback`) | `Landing.tsx`, `OAuthCallback.tsx` |
| `GET /api/users/clips?game_id=…&page=&limit=` | `useClips` → `Home.tsx`, `Explore.tsx` |
| `GET /api/user` | `UserProfile.tsx` (refresh) |
| `GET/POST/DELETE /api/streamers` | available in `api.ts` (not yet surfaced in UI — see below) |

---

## Assumptions & what's still missing on the backend

- **A "category" is a Twitch `game_id`.** Subscriptions are stored **locally**
  (`preferences.ts`) because there's no "subscribe to game" endpoint. The
  selected ids are what get passed to `/users/clips`. If you add a server-side
  preferences endpoint, only `preferences.ts` needs to change.
- **Votes & saved clips are local** for the same reason — no endpoints exist.
  Swap the bodies in `preferences.ts` when the API gains them.
- **Clips need an auth token.** `useClips` returns empty without one, so the
  "Skip → enter app (dev)" shortcut shows an empty feed until you actually log
  in. (You chose to keep the app open / ungated for now.)
- **Twitch embeds require a registered `parent` domain.** On web we pass
  `window.location.hostname`; that host must be whitelisted in your Twitch app
  for the player to load. Native uses `WebView` with `parent=localhost`.
- **`/streamers`** endpoints are wired in `api.ts` but I didn't build a
  "follow a channel" UI — tell me if you want it (e.g. add to Discover/Profile).
- **Web fonts:** ClipFlow uses *Hanken Grotesk* + *JetBrains Mono*. They fall
  back to system fonts unless you add this to your web `index.html` `<head>`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  ```

## Outdated libs

- `@mui/material` import in the old `theme.ts` — **removed** (dead import, not installed).
- `@types/react-native` — **removed** (deprecated; bundled with `react-native`).
- Everything else aligns with Expo 53 / RN 0.79 / React 19 and was left intact
  to avoid lockfile churn.
