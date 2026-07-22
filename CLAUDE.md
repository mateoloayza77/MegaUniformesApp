# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Expo SDK 54 — verify APIs before writing code

Expo changes fast. This project is on **Expo SDK 54** (React Native 0.81, React 19).
Consult the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before using or
changing any Expo/React Native API — do not rely on memory of older SDKs.

## Commands

```bash
npm install            # install dependencies
npx expo start         # start Metro dev server (press a/i/w for android/ios/web)
npm run android        # start on Android
npm run ios            # start on iOS
npm run web            # start on web
npm run lint           # expo lint (eslint-config-expo)
npm run reset-project  # ⚠️ moves current app/ to app-example/ and scaffolds a blank app/ — do NOT run
```

There is no test runner configured. Type-check with `npx tsc --noEmit`.

**Firebase env.** Auth reads its config from `EXPO_PUBLIC_FIREBASE_*` vars in `.env` (git-ignored;
template in `.env.example`). Copy `.env.example` → `.env` and fill in real Firebase keys, then enable
Email/Password in the Firebase console. Until real keys are present, `isFirebaseConfigured` is `false`
and the login screen shows a warning instead of crashing.

## Architecture

MEGA UNIFORMES is a single-vendor storefront (school uniforms, Cuenca–Ecuador). The catalog is
**static data with no payment flow** — checkout hands off to WhatsApp. The one server-backed piece is
**Firebase Authentication** (email/password) for an *optional* login; the store still works fully
anonymously. All user-facing copy is in **Spanish** — keep it that way (route segments are Spanish
too, e.g. `producto/[id]`).

**Screens.** `index` (home), `categorias`, `colegios`, `contacto`, `carrito` (cart), `servicios`,
`login`, and `producto/[id]` (product detail). `login.tsx` is a full-screen auth card (login/register
toggle, show-password, forgot-password) presented modally (`slide_from_bottom`); reachable from the
`Header` person icon and the drawer's "CUENTA" section, and always dismissible ("Continuar sin
cuenta"). `servicios.tsx` is the only screen that touches native device APIs:
`expo-location` (GPS → distance to the store), `expo-notifications` (local test notification), and
"cómo llegar" (open native maps). It requests runtime permissions and degrades gracefully via
`Alert`; there is still no server involved.

**Routing (expo-router, file-based, typed routes enabled).** Screens live in `app/`. `app/_layout.tsx`
is a headless `Stack` (`headerShown: false`, `contentStyle` background `COLORS.surface`, default
`animation: 'slide_from_right'` — `login` overrides to `slide_from_bottom`) wrapped in
`GestureHandlerRootView` → `SafeAreaProvider` → `AuthProvider` → `CatalogProvider` → `CartProvider`
(`CartProvider` consumes both `useAuth` and `useCatalog`, so both must wrap it). The app renders its
own chrome instead of native headers:
- `components/ScreenLayout.tsx` — standard screen wrapper: renders `<Header/>` + a `ScrollView`
  (or a plain `View` with `noScroll`), applying safe-area insets. Use it for new screens.
- `components/Header.tsx` — sticky top bar with logo, cart icon (live `cartCount` badge), and a
  slide-in `Modal` nav drawer. `producto/[id].tsx` renders `<Header/>` directly (not via ScreenLayout)
  because it needs a custom scroll container.

**State.** Three contexts. `context/CartContext.tsx` holds cart items + favorites via `useState`.
Consume it with the `useCart()` hook, which throws if used outside `CartProvider`. Cart line identity
is the composite key `` `${productId}-${size}-${color}` `` (see `itemKey`); the same product in a
different size/color is a separate line. Items store only `productId` — resolve price/name/image
through `useCatalog().getProductById` at render time. **Persistence:** while logged out the cart lives
only in memory; on login `CartProvider` hydrates cart + favorites from Firestore (`users/{uid}`) and
writes changes back (debounced). A `hydratedUid` ref guards the save effect so it never overwrites the
stored doc with in-memory state before the remote read lands.

**Auth.** `context/AuthContext.tsx` (`useAuth()` hook) wraps Firebase Auth: exposes `user`,
`initializing`, and `signIn`/`signUp`/`resetPassword`/`logout`. It subscribes via `onAuthStateChanged`;
`authErrorMessage()` maps Firebase error codes to Spanish user-facing strings. `constants/firebase.ts`
initializes the app + auth with **AsyncStorage persistence** (`getReactNativePersistence`) so sessions
survive restarts — note that symbol only exists in the SDK's React-Native build (`firebase/auth` →
`dist/rn`), which Metro resolves automatically; TypeScript sees the web types, hence the
`@ts-expect-error` on the import.

**Firestore.** `constants/firebase.ts` also exports `db` (`initializeFirestore` with
`experimentalAutoDetectLongPolling` — the default WebChannel transport is unreliable on RN/Hermes).
Three collections, all guarded by `firestore.rules` (publish these in the console): `users/{uid}`
(per-user `{ favorites, cart }`, owner-only), `orders/{autoId}` (owner-only create/read; created on
checkout only when logged in — anonymous orders still go out via WhatsApp), and `products` (public
read, no client write). Access goes through thin service modules, **not** direct `db` calls in
components: `services/userData.ts` (load/save user doc), `services/orders.ts` (`createOrder` — the
caller passes items already resolved to name+price so the historical order is price-stable), and
`services/catalog.ts` (`fetchCatalog`).

**Data / catalog.** `data/products.ts` holds the static catalog + `categories`, `heroSlides`,
`schools`, `navCategoryLinks`. Products are **hybrid**: `context/CatalogContext.tsx` (`useCatalog()`
hook) starts from the static `products` array (instant, offline-capable fallback) and, if Firestore
has documents, replaces them. **Screens read products only through `useCatalog()`** (`products`,
`promotionProducts`, `getProductById`, `getProductsByCategory`) — never import product helpers from
`data/products.ts` directly (those remain as the fallback source + seed reference). `categories`,
`heroSlides`, `schools` stay static (config, not inventory). Seed Firestore from the static catalog
with `npm run seed:catalog` (`scripts/seed-catalog.mjs`, firebase-admin; needs a service-account key —
see the script header; `serviceAccountKey.json` is git-ignored). Product images are remote Unsplash
URLs (strings); hero/logo images are bundled `require(...)` assets. `utils/images.ts` bridges the two:
`toImageSource` wraps a URL string, `toHeroImageSource` handles string-or-`require`
(`HeroImageSource = number | string`).

**WhatsApp checkout.** `utils/whatsapp.ts#openWhatsApp` opens `wa.me/<number>?text=...` via `Linking`.
The target number lives in `constants/links.ts` as `WHATSAPP_NUMBER` (**currently a placeholder
`1234567890`** — must be set before release). Screens build the pre-filled Spanish order/enquiry
message themselves (see `carrito.tsx#buildWhatsAppMessage` and `producto/[id].tsx#handleWhatsApp`).
`constants/links.ts` also holds `CONTACT`, `SOCIAL`, and `STORE` (store name + placeholder
lat/long — **also must be set to the real address before release**).

**Device utils.** `utils/maps.ts#openMaps` opens native maps (Apple/Google) with a web fallback;
`utils/geo.ts` provides `distanceKm` (haversine) + `formatDistance`. Both are used only by `servicios.tsx`.

**Styling.** No UI library — everything is `StyleSheet.create` with the brand palette in
`constants/colors.ts` (`COLORS`: navy/gold/white/surface/muted/whatsapp/red). Import `COLORS` rather
than hardcoding hex values.

**Path alias.** `@/*` maps to the repo root (`tsconfig.json`), e.g. `@/components/Header`,
`@/context/CartContext`.

## Template leftovers — don't mistake these for app code

This started from the default Expo template. These are **unused by the real app** and safe to ignore
(or delete): `constants/theme.ts`, `hooks/use-color-scheme*.ts`, `hooks/use-theme-color.ts`, and the
lowercase-named components `themed-text.tsx`, `themed-view.tsx`, `parallax-scroll-view.tsx`,
`hello-wave.tsx`, `external-link.tsx`, `haptic-tab.tsx`, `collapsible.tsx`, `ui/icon-symbol*.tsx`.
The app's own components use PascalCase filenames (`Header.tsx`, `ProductCard.tsx`, `ScreenLayout.tsx`).
The app does **not** implement dark mode despite `userInterfaceStyle: automatic` in `app.json`.
