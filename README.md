# FlashcardMobile

> Smart Turkish-to-English vocabulary learning app with SRS, premium animations, and a Claude-designed UI.

Built with **Expo SDK 54** + **React Native 0.81** + **Supabase**. Targets iOS & Android.

---

## ✨ Features

- **Spaced Repetition (SM-2 lite)** — words resurface at the perfect interval before you forget
- **Interactive Flashcards** — real 3D Y-axis flip, glint sweep, swipe-to-grade gestures, stack peek
- **Quiz Mode** — 2×2 multiple choice with spring/shake feedback and confetti on >80%
- **Result Celebration** — detailed end screen: animated counter, correct word chips, wrong word recap
- **Difficulty Color System** — every list tinted by difficulty (Beginner mint → Master violet), and the tint flows into the list's own study screen
- **Public/Private Lists** — share your own decks globally via deep link (`flashcardmobile://list/{id}`)
- **Light + Dark Mode** — full theme parity with adaptive accent and dynamic status bar
- **Premium Polish** — skeleton loaders, ambient animations (flame, breathe, shimmer, drift), haptic on every interaction, glass-blur floating tab bar, FAB pulse
- **Streak System** — animated flame with pulse+rotate+glow, 35-day GitHub-style contribution grid, achievement modal with confetti when a new badge unlocks
- **Onboarding** — three abstract-illustration slides (network / stack / graph) with parallax + breathe
- **App Store Ready** — GDPR consent modal, Privacy Policy + Terms screens, in-app account deletion (Apple Guideline 5.1.1(v))

---

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Expo SDK 54, React Native 0.81, Hermes |
| Navigation | `@react-navigation/native-stack` + bottom tabs (custom glass TabBar) |
| State | Redux Toolkit (favorites) + React Context (auth, theme, toast) |
| Backend | Supabase (Postgres + Auth + Storage + RLS) |
| Auth | Email/password via `expo-secure-store` |
| Animation | Reanimated 4 + Animated API + Lottie + `react-native-confetti-cannon` |
| Typography | Inter (body) · Space Grotesk (heading/num) · Instrument Serif Italic (display) |
| Storage | AsyncStorage (prefs) · SecureStore (tokens) |
| Offline | Custom queue (`src/lib/offlineQueue.js`) — survives app kill |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── design/          # PremiumButton, FlipCard, TabBar, Skeleton, AnimatedFlame...
│   ├── ConsentModal.js
│   ├── EmptyState.js
│   └── ErrorBoundary.js
├── contexts/            # AuthContext, ThemeContext, ToastContext
├── hooks/               # useDifficultyTint, useBadgeWatcher, useImageUpload...
├── lib/                 # SRS algorithm, offline queue, analytics consent, badges
├── navigation/          # AppNavigator (Home / Çalış / Kütüphane / Profil tabs)
├── screens/
│   ├── auth/            # Login, Register, ForgotPassword
│   ├── flashcard/       # Detail (preview list before study)
│   ├── home/            # Home tab
│   ├── favorites/       # → Çalış tab (segmented: Bugün / Zor / Quiz)
│   ├── mylists/         # → Kütüphane tab (segmented: Listelerim / Favoriler / Keşfet) + CreateList
│   ├── study/           # StudyScreen (SRS), QuizScreen
│   ├── streak/          # Stats screen
│   ├── profile/         # Profile + Appearance + Privacy
│   ├── onboarding/      # 3-slide first-launch flow
│   ├── settings/        # AppearanceScreen (light/dark/system toggle)
│   ├── legal/           # PrivacyPolicy, TermsOfService, PrivacySettings
│   └── hard/            # HardWordsScreen
├── services/            # supabaseApi.js
├── store/               # Redux slices
├── supabase/            # client, auth, database, progress, views
├── themes/              # tokens.js (single source) · difficulty.js · categories.js
└── utils/               # shuffle, rateApp, ...
supabase/
└── migrations/          # SQL: schema, views, counters
flashcard/               # Claude Design v2 handoff bundle (HTML/CSS/JS source of truth)
```

---

## 🚀 Local Development

```bash
# 1. install deps
npm install

# 2. add env (Supabase project)
cat > .env <<EOF
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
EOF

# 3. run
npx expo start -c
```

Then scan the QR code with Expo Go (iOS Camera / Android Expo Go app), or press `i` / `a` for simulators.

---

## 🧪 Test Account

```
Email:  admin@gmail.com
Password: admin123
```

Used for App Store review. Created via Supabase Management API.

---

## 🎨 Design System

The design lives in `flashcard/project/` (Claude Design v2 handoff — HTML/CSS/JS source). Tokens are mirrored in `src/themes/tokens.js`. Any color/spacing change should start there.

- **Dark accent:** `#B4FF4F` (lime) + `#5B7FFF` (cobalt) + `#FFB84D` (amber for streak)
- **Light accent:** `#4A8E1F` (deeper green) — neon swap to be eye-friendly
- **Difficulty colors:** mint / indigo / amber / coral / violet (see `src/themes/difficulty.js`)

---

## 🛡️ Compliance

- ✅ GDPR/KVKK consent modal (Sentry deferred until opt-in)
- ✅ In-app Privacy Policy + Terms of Service
- ✅ In-app account deletion (Postgres RPC `delete_user_account()`, cascades all user data)
- ✅ Password policy: min 8 chars, reauth required to change
- ✅ RLS enabled on all tables, 11 policies, no `auth.users` exposure
- ✅ SECURITY DEFINER views switched to `security_invoker = true`

---

## 📜 License

Private. © 2026 A. Eren Şıranlı. All rights reserved.
