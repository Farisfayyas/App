# Swoon

A swipe-to-shop fashion app built with Expo. Browse curated looks, swipe to like or add to cart, share with friends, and get recommendations that learn your style over time.

---

## Features

- **Swipe feed** — right to like, left to pass, up to add to cart. Share any item via the native share sheet.
- **Search** — grid layout with category filters and keyword search.
- **Cart** — manage sizes and quantities; liked items scroll below your bag.
- **Item detail** — full-screen gallery, size selector, and add-to-bag action.
- **Chat** — message friends and share pieces you love.
- **Profile** — style preferences, saved sizes, and account settings.
- **Recommendation-ready** — every swipe is recorded with denormalized metadata so a ranking algorithm can plug in without schema changes.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 54 (React Native 0.81) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript (strict) |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Animations | React Native Reanimated 4 |
| Gestures | React Native Gesture Handler 2 |
| Fonts | EB Garamond · Inter Tight · JetBrains Mono |

---

## Project Structure

```
app/
  (tabs)/           # Tab screens — Home, Search, Cart, Chat, Profile
  item/[id].tsx     # Item detail (modal)
  _layout.tsx       # Root layout — fonts, gesture root, stack screens

components/
  swipe/            # SwipeCard, SwipeStack, SwipeOverlay
  ui/               # CustomTabBar and shared UI primitives

constants/
  tokens.ts         # Design tokens (colors, fonts, spacing)
  mockData.ts       # 22 mock fashion items + mock users

store/
  useSwipeStore.ts  # Swipe history + preference profile
  useCartStore.ts   # Cart + liked items
  useAuthStore.ts   # Supabase auth
  useChatStore.ts   # Conversations + messages

services/
  supabase.ts       # Typed Supabase client

types/
  index.ts          # All shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI — `npm install -g expo-cli`
- Expo Go on your phone, or an iOS/Android simulator

### Install

```bash
git clone https://github.com/Farisfayyas/App.git
cd App
npm install
```

### Environment variables

Create a `.env` file in the project root (never committed — already in `.gitignore`):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If you haven't set up Supabase yet, the app runs on mock data and the env file is not required.

### Supabase setup (optional — app works on mock data without it)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the **Project URL** and **anon/public key** into `.env`
3. Run the full SQL schema from the plan file at `~/.claude/plans/i-want-to-build-rosy-hollerith.md` in the Supabase SQL editor
4. Enable Row Level Security policies (included in the same file)

### Run

```bash
npx expo start
```

Press `i` for iOS simulator, `a` for Android, or scan the QR code with Expo Go.

---

## EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for production
eas build --platform ios
eas build --platform android
```

EAS project ID: `82124b74-b141-4fdb-968d-f8e4a684054e`  
Owner: `farisfayyas`

---

## Lint

```bash
npx expo lint
```

A pre-commit hook runs this automatically — commits are blocked if there are warnings.

---

## Collaborators

- Faris Fayyas
