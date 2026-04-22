# Shopping App — Claude Guide

## Project Overview
A cross-platform mobile shopping app built with **Expo (SDK 54)** and **Expo Router v6**.  
Targets iOS, Android, and Web from a single codebase.  
Two collaborators: Faris Fayyas (owner) and a partner.

## Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 54 (React Native 0.81) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript (strict) |
| Styling | React Native StyleSheet (no third-party CSS-in-JS) |
| Animations | React Native Reanimated 4 |
| Gestures | React Native Gesture Handler |
| Icons | `@expo/vector-icons` |
| Linting | `expo lint` (ESLint 9 + eslint-config-expo) |

## Folder Structure
```
app/              # Expo Router screens (file = route)
  (tabs)/         # Tab navigator group
components/       # Shared UI components
constants/        # Colors, spacing, fonts, and other static values
hooks/            # Custom React hooks
assets/           # Images, fonts, splash assets
scripts/          # Build/maintenance scripts
```

## Git Workflow

### When to commit directly to `main`
- Major architectural changes (new stores, new service layers, dependency upgrades)
- New full pages / screens (e.g. building out the Cart screen, Search screen)

### When to create a branch first
- Small, isolated features (a single new component, a helper function)
- Specific bug fixes
- Experimental UI changes that may be discarded

```
git checkout -b feature/<short-description>   # for branches
git checkout -b fix/<short-description>
```

- Keep branch names lowercase with hyphens: `feature/product-card`, `fix/cart-total-bug`.
- Both collaborators should pull `main` before branching to avoid conflicts.

## Code Style
- **Comments explain the flow in plain English** — write *why* and *what's happening*, not just *what*.
  ```tsx
  // Walk through each item in the cart and sum up the price × quantity
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  ```
- Prefer small, single-purpose components and hooks.
- No inline styles — define all styles in a `StyleSheet.create({})` block at the bottom of the file.
- Use `constants/` for any magic strings, colors, or numbers shared across screens.
- TypeScript: no `any`. Define prop types with `interface` or `type`.

## Before Every Commit
Run the linter and fix all warnings before committing:
```bash
npx expo lint
```
This is enforced automatically via a pre-commit hook.

## Adding Dependencies
- Prefer Expo-maintained packages (`expo install <pkg>`) so versions stay compatible with the SDK.
- Document *why* a new dependency was added in the PR description.

## Testing (to be set up later)
- Unit tests: Jest + `@testing-library/react-native`
- E2E: Maestro (Expo-friendly)

## Environment / EAS
- EAS project ID: `82124b74-b141-4fdb-968d-f8e4a684054e`
- Owner: `farisfayyas`
- Build profiles live in `eas.json` (to be created when builds are needed).
