# FlashcardMobile — Roadmap & İlerleme

> Türkçe→İngilizce kelime öğrenme app'i. React Native (Expo SDK 54) + Supabase + SRS.

---

## ✅ YAPILANLAR

### 🏗️ Altyapı & Backend
- [x] Supabase schema (6 tablo + RLS politikaları)
- [x] Auth (email/password + guest + Apple Sign In hazır)
- [x] **Hesap silme** RPC (Apple 5.1.1(v) — `delete_user_account`)
- [x] **Storage buckets** (`avatars` + `images` + RLS)
- [x] SRS algoritması (SM-2 lite, `src/lib/srs.js`)
- [x] Offline queue (mutex'li, app kill'e dayanıklı)
- [x] **Cache layer** (SWR, AsyncStorage TTL) + invalidation
- [x] `favorite_words` tablo + RPC
- [x] `lists.kind` (mistakes/auto) + `word_progress.mistakes_streak`
- [x] `add_to_mistakes_list` + `remove_from_mistakes_list` RPC'leri
- [x] Push notification reminder (daily local)
- [x] GDPR/KVKK consent (Sentry opt-in)

### 🎨 UI / Design System
- [x] Claude Design v2 tokens (lime + cobalt + light mode)
- [x] Dark palette rafine (sofistike, az neon)
- [x] Light/dark/system theme switching + AsyncStorage persist
- [x] Tüm ekranlar `useTheme()` migrate (statik T → dynamic)
- [x] Inter (body) + Space Grotesk (num) + Instrument Serif (display)
- [x] Difficulty color system (5 seviye: mint/indigo/amber/coral/violet)
- [x] Skeleton primitives (8 farklı) — tüm loading state'lerinde
- [x] Empty states kişiselleştirilmiş + action butonlar
- [x] Offline banner (NetInfo)

### 📱 Ekranlar (Tamam)
- [x] Onboarding (3 slide, parallax + atla butonu)
- [x] Login / Register / ForgotPassword (Apple Sign In dahil)
- [x] Home — Hero (animated alev + radial daily) + LevelMiniCard + 7 discovery slider
- [x] Library / Kütüphane — segmented + sort + smart pins
- [x] Çalış / Favorites — Bugün kategoriler + Zor Kelimeler + Quiz
- [x] FlashcardDetail — 3D flip card + chevron nav
- [x] Study — SRS swipe, mistakes flow, sub-hook'lara split
- [x] Quiz — 2×2 grid + mode modal (Normal/Hızlı 10sn) + result
- [x] StudyResultScreen + QuizResultScreen — donut + favorile + retry mistakes
- [x] MistakesListModal — "Sana özel liste hazırladık"
- [x] Streak / İstatistikler — flame hero + Last30BarChart + rozetler
- [x] **Roadmap** — Duolingo path tarzı, 10 milestone, level sistem
- [x] FavoriteWords — kelime kartları + liste badge
- [x] ListExplorer — generic listing (popular/newest/category/search)
- [x] Profile — avatar + level chip + minimal entry
- [x] **EditProfile** — avatar pick + display_name
- [x] **Settings** — konsolide (Tema, Dil, Hatırlatıcı, Gizlilik, Hesap)
- [x] Language — TR/EN placeholder
- [x] Appearance — light/dark/system
- [x] Privacy Policy + Terms of Service + Privacy Settings
- [x] HardWordsScreen

### ⚙️ Modüler Mimari (Hook'lar & Helpers)
- [x] `useTheme`, `useAuth`, `useToast`, `useStudyEngine`, `useStudySwipe`
- [x] `usePublicLists` (cache-backed SWR)
- [x] `useUserLevel` (XP → seviye + ünvan)
- [x] `useCountUp`, `useDifficultyTint`, `useBadgeWatcher`
- [x] `useImageUpload`, `useListEditor` (bulk paste destekli)
- [x] Service layer: `wordFavorites.js`, `mistakesList.js`
- [x] Redux: `favoritesSlice`, `favoriteWordsSlice`

### 🎬 Animasyonlar (60fps native driver)
- [x] HeroDashboard: floating particles + radial donut + flame breathing
- [x] StreakChip / DailyGoalCard: pulse + shimmer + counter
- [x] SmartListCard: shimmer + press scale
- [x] BookmarkButton: ghost uçar
- [x] Quiz: spring pop / shake / dim fade
- [x] Study: swipe rotate + verdict badges + center pop + confetti
- [x] Roadmap: stagger entry + current node pulse
- [x] AnimatedFlame: 3-katmanlı ring pulse
- [x] AchievementModal: confetti + spring + waves
- [x] Last30BarChart: animated bars + today pulse
- [x] DonutChart: animated stroke
- [x] StaggerEnter, FlameRefreshControl

### 🚀 Modüler Kod Yapısı
- [x] StudyScreen 700→399 satır (sub-hook split)
- [x] HomeScreen modüler (HeroDashboard, LevelMiniCard, DiscoveryRow, HomeSearchBar)
- [x] FlashcardDetail modüler (Header, CardArea, CTAs, WordChipList)
- [x] Roadmap modüler (Header, Node)
- [x] CLAUDE.md kuralı: bileşen başına ~150 satır

### 📦 Hazır İçerik
- [x] 12+ seed public liste (YDS, TOEFL, IELTS, business, travel, tech, academic, food, health, phrasal verbs)
- [x] Toplu yapıştır (bulk paste) liste oluşturma

### 🔒 Compliance & Privacy
- [x] In-app account deletion (Apple 5.1.1(v))
- [x] Privacy Policy + ToS in-app ekranlar
- [x] KVKK/GDPR consent modal
- [x] Privacy manifest (iOS 17+)
- [x] RLS tüm tablolarda
- [x] `SECURITY DEFINER` view'lar `security_invoker=true`

---

## 🟡 YAPILACAKLAR (App Store öncesi BLOCKER)

### 🚨 Senin yapman (CLI / Dashboard)
- [ ] **EAS projectId** — `eas project:init` çalıştır, `app.json → extra.eas.projectId` doldur
- [ ] **Apple Developer Console** — bundle ID için "Sign In with Apple" capability aç, Service ID oluştur
- [ ] **Supabase Auth → Providers → Apple** — Service ID + Team ID + Key ID + .p8 key gir
- [ ] **App icon** — 1024×1024 PNG (şu an default olabilir)
- [ ] **Splash screen** — özelleştir
- [ ] **App Store screenshots** — iPhone 6.7" ve 6.5", 6+ adet
- [ ] **App Store Connect**:
  - Privacy details form
  - TR + EN açıklama
  - Keywords + Subtitle
- [ ] **TestFlight** internal beta
- [ ] Privacy Policy + ToS **public web URL** (in-app var ama metadata için web şart)

### 🛠️ Kod (opsiyonel cleanup)
- [ ] QuizScreen 583 satır → sub-hook'lara böl (StudyScreen pattern'ı)
- [ ] `console.log` cleanup (production'da spam yok ama best-practice)
- [ ] Magic numbers (paddingBottom:160 vs.) → token

---

## 💡 SONRAKİ FEATURE'LAR (önceliği sen seç)

### Tier 1 — Düşük maliyet, yüksek değer
- [ ] **Storyboard mode** — kullanıcı liste kelimelerini kullanarak kısa hikaye yazsın
- [ ] **Reverse learning toggle** — EN↔TR yön değiştir
- [ ] **Sentence builder mini-game**
- [ ] **Match mini-game** (Quizlet tarzı kelime-anlam sürükle)
- [ ] **Personal photo notes** — kelimeye telefon galerisinden fotoğraf
- [ ] **Mood-based lists** — küratörlü temalı

### Tier 2 — Orta efor
- [ ] **Apple Health 3-ring hero** — günlük 3 farklı hedef ring
- [ ] **Spotify Wrapped tarzı haftalık özet ekranı**
- [ ] iOS widget
- [ ] **Pronunciation practice** — STT scoring
- [ ] **Daily global challenge + leaderboard**
- [ ] Visual word cards (görsel ipucu — Memrise tarzı)
- [ ] Crowdsourced emoji per word

### Tier 3 — Uzun vadeli
- [ ] AI quiz generation (OpenAI/Claude)
- [ ] **Premium subscription** (StoreKit)
- [ ] Community marketplace (kullanıcı listesi paylaşımı)
- [ ] Friend system + social leaderboard
- [ ] Pull notification "X kelime hazır" (akıllı tetikleme)
- [ ] Memrise video clip (native speaker)

---

## 🧪 TEST HESABI

```
Email:    admin@gmail.com
Password: admin123
```

---

## 📐 Mimari Notlar

- **State:** Redux (favorites + favoriteWords) + Context (auth/theme/toast) + local
- **Data:** Supabase + cache layer (SWR pattern, AsyncStorage TTL 10dk)
- **Auth tokens:** SecureStore
- **Tercihler:** AsyncStorage
- **Push:** expo-notifications, daily 20:00 reminder
- **i18n:** Şimdilik TR-only, dil seçimi UI placeholder
- **Min iOS:** 15.1 (Expo 54 default)
- **Bundle:** Hermes + New Architecture (`newArchEnabled: true`)
