# FlashcardMobile — Progress

## 🎯 Ürün
Basit, kullanışlı İngilizce kelime öğrenme uygulaması.
TR→EN listeler, favoriler, SRS (spaced repetition) ve çoktan seçmeli quiz.

**Stack:** Expo SDK 54 · React Native 0.81 · JavaScript · React Navigation v7 · Redux Toolkit · Supabase · Reanimated 4

---

## ✅ Bu oturumda yapılanlar

### Güvenlik / Konfig
- `src/supabase/config.js` içinden **hardcoded anon key** kaldırıldı. Artık `.env` üzerinden `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` okunuyor.
- `.env` + `.env.example` eklendi; `.gitignore` `.env` dosyasını ekleyecek şekilde güncellendi.
- **⚠️ Uyarı:** mevcut anon key daha önce repoya commit edilmişti — Supabase dashboard'dan **rotate etmen** şart.

### Deploy
- `eas.json` eklendi (`development` / `preview` / `production` profilleri).
- `app.json` → `ios.bundleIdentifier = com.aeren.flashcardmobile`, Android `package = com.aeren.flashcardmobile`, scheme `flashcardmobile`, `userInterfaceStyle: automatic`.

### Supabase
- `supabase/migrations/0002_rls_and_srs.sql`:
  - Tüm tablolarda **RLS açık** + policy'ler (lists, words, favorites, profiles).
  - `profiles` tablosu + `auth.users → profiles` trigger'ı.
  - **SRS:** `word_progress` (ease, interval_days, repetitions, due_at, lapses) — SM-2 light.
  - `study_sessions` (mode, total_words, correct, duration_sec).
  - `v_due_words` view'ı.
- `src/supabase/progress.js` → `recordReview`, `getDueCount`, `startSession`, `finishSession`, `getStudyStats`.
- `src/lib/srs.js` → `nextProgress(prev, grade)` — SM-2 light.

### UI / UX altyapısı
- **ThemeContext** (`src/contexts/ThemeContext.js`) — sistem tercihi + manual light/dark toggle, `AsyncStorage` persist.
- `src/themes/darkColors.js` — dark palette.
- **ToastContext** (`src/contexts/ToastContext.js`) — animasyonlu top-toast, `Alert.alert` yerine.
- **ErrorBoundary** (`src/components/ErrorBoundary.js`) — crash fallback UI.
- **EmptyState** component (empty/no-data ekranları için).
- `App.js` → ErrorBoundary → Redux → GestureHandler → SafeArea → Theme → Toast → Navigation sırasıyla wrap.
- Tab bar temaya uyar: aktif rengi primary, dark modda uygun arkaplan.

### Özellikler (yeni ekranlar)
- **StudyScreen** (SRS modu) — 3D flip'li kart, `Again / Zor / İyi / Kolay` butonları, `expo-haptics` titreşim, ilerleme barı, session kaydı.
- **QuizScreen** — çoktan seçmeli (4 opsiyon), doğru/yanlış feedback, haptic, reanimated geçişler.
- **AnimatedFlashcard** — perspective/rotateY flip animasyonu + `expo-speech` telaffuz butonu (🔊).
- FlashcardDetailScreen'a **"🧠 Çalış (SRS)"** + **"🧩 Quiz"** CTA'ları eklendi.

### Kod kalitesi
- ESLint (`eslint-config-expo` + prettier plugin) + Prettier config'i.
- `npm run lint`, `npm run lint:fix`, `npm run format` script'leri.

### Paketler (yeni)
`react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `expo-speech`, `expo-linear-gradient`, `expo-constants`, `lottie-react-native`, `eslint-config-expo`, `prettier`, `eslint-plugin-prettier`, `eslint-config-prettier`.

- `babel.config.js` eklendi (Reanimated plugin).

---

## 🟡 Senin yapman gerekenler

1. **Supabase anon key'i rotate et** (dashboard → Settings → API → "Refresh anon key") ve `.env`'i güncelle. Eski key repoya commit edildiği için güvenlik riski.
2. Supabase SQL Editor'da **`supabase/migrations/0002_rls_and_srs.sql`** dosyasını çalıştır.
3. `words` tablosuna henüz yoksa `UNIQUE` / `NOT NULL` kısıtları zaten vardır, migration ek şey bozmaz.
4. `.claude/settings.json` permission'ları aktif → CI olmadan local'de lint/format hemen çalışır.

---

## 🔴 Hâlâ yapılacaklar (roadmap)

- [ ] **Email verification** production için aç (`AuthContext.signUp` — şu an auto sign-in var).
- [ ] **Push notification** — günlük "çalışma vakti" reminder (`expo-notifications` + Supabase pg_cron).
- [ ] **Home hero** + **maskot** (Lottie yüklü, animasyon dosyası gerekiyor).
- [ ] **Offline cache** — lists/words için AsyncStorage TTL cache.
- [ ] **Streak rozeti** — `getStudyStats()` zaten streak döndürüyor, UI'a yerleşecek.
- [ ] **Listeleri Redux'a taşı** (şu an useState).
- [ ] **Dark mode toggle UI** — settings ekranı yok, Profile'a toggle eklenecek.
- [ ] **Sentry + PostHog** (crash + analytics).
- [ ] **TypeScript'e kademeli geçiş** (isteğe bağlı).
- [ ] **Jest + testing-library** setup.
- [ ] **Store assets** (1024x1024 icon, feature graphic, screenshot'lar).
- [ ] **EAS project ID** — `eas init` sonrası `app.json → extra.eas.projectId`'e yazılacak.

---

## 🚀 Hızlı başlangıç

```bash
cd /c/Users/A.Eren/Desktop/FLASHCARD-APP/FlashcardMobile

# 1) .env (zaten var)
# 2) Supabase SQL editor'da migration çalıştır: supabase/migrations/0002_rls_and_srs.sql
# 3) Geliştir:
npm start
# veya
npm run android / ios / web

# Deploy:
npm install -g eas-cli
eas login
eas build:configure      # extra.eas.projectId'i yazar
eas build --profile preview --platform ios
```

---

## 📦 Yeni dosyalar / dizinler

```
.env                              # gitignored
.env.example
.eslintrc.js
.prettierrc
babel.config.js
eas.json
supabase/migrations/0002_rls_and_srs.sql
src/
├── lib/
│   └── srs.js
├── contexts/
│   ├── ThemeContext.js           # (yeni)
│   └── ToastContext.js           # (yeni)
├── themes/
│   └── darkColors.js             # (yeni)
├── components/
│   ├── AnimatedFlashcard.js      # (yeni)
│   ├── EmptyState.js             # (yeni)
│   └── ErrorBoundary.js          # (yeni)
├── screens/study/
│   ├── StudyScreen.js            # (yeni)
│   └── QuizScreen.js             # (yeni)
└── supabase/
    └── progress.js               # (yeni)
```

---

---

## 🌗 Paket A — Dark mode gerçekten çalışıyor (2026-04-22)

- `ThemedScreen` + `Skeleton` + `ListSkeleton` component'leri eklendi
- 14 eski ekran `useTheme()`'e migrate edildi — arkaplanlar, metinler, border'lar, loading/empty state'ler tema-uyumlu
- **ProfileScreen tamamen yenilendi:**
  - Görünüm segmented control: `Sistem / Açık / Koyu` (AsyncStorage persist)
  - Çalışma istatistikleri kartı: Seri 🔥 / Kelime / Seans (gerçek `getStudyStats()` verisi)
  - Daha temiz menü + çıkış
- `AuthContext`: her yeni kullanıcıya `createDefaultLists` çağrısı **kaldırıldı** — artık public seed listeler ortak
- `AnimatedFlashcard` HTML entity bug fix (`&ldquo;` → `"`)

---

## 🎮 Paket B + D + E (2026-04-22)

### B — Oyunlaştırma
- `lib/badges.js` → 7 seri rozeti (Kıvılcım→Galaksi) + 5 kelime rozeti (Filiz→Usta)
- `components/DailyGoalBar.js` → Home'da günlük hedef barı (AsyncStorage persist, DB'den bugün çalışılan kelime)
- `screens/streak/StreakScreen.js` → seri hero, rozet ızgarası, "sonraki rozete X gün"
- QuizScreen → **confetti** (≥%80 doğru olunca), success haptic
- Profile → stats kartları Streak ekranına linkli

### D — Offline + Push
- `lib/cache.js` → AsyncStorage TTL cache (`get`/`set`/`swr`)
- `lib/cachedApi.js` → `fetchPublicLists`, `fetchListWords` (stale-while-revalidate)
- `lib/notifications.js` → `scheduleDailyReminder(hour, minute)` local notification (server-less)
- Profile'a "Günlük hatırlatıcı" toggle'ı (20:00 varsayılan)

### E — Zor kelimeler + günlük challenge
- `supabase/migrations/0002_views.sql` → `v_hard_words` (lapses≥2 veya ease<2.0) + `v_daily_challenge` (bugün due olan + yeni eklenenlerden 10 kelime)
- `src/supabase/views.js` → `getHardWords`, `getDailyChallenge`
- `screens/hard/HardWordsScreen.js` → zor kelimeleri listeler, "Bunları çalış" CTA'sı ile StudyScreen'e gönderir
- `components/DailyChallengeCard.js` → Home'un tepesinde linear gradient kart, tap → Quiz preset mode
- StudyScreen + QuizScreen artık **presetWords + presetTitle + presetMode** parametrelerini destekliyor (list-agnostic çalışıyor)

### Çalıştırman gereken
**`supabase/migrations/0002_views.sql`** dosyasını Supabase SQL Editor'a yapıştır ve çalıştır (iki view oluşuyor).

### Leaderboard (ertelendi)
Arkadaş/invite sistemi gerektirdiği için backlog'a atıldı. Yerine günlük challenge + zor kelimeler geldi.

_Son güncelleme: 2026-04-22_
