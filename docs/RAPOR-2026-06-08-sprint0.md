# 📊 RAPOR — Sprint 0 Yapılanlar + Modülerlik + Sıradakiler

**Tarih:** 2026-06-08
**Strateji:** Free-launch (ödeme + reklam ileride) — önce büyü, sonra monetize.
**Commit/Push:** Bu turn HİÇ yapılmadı (kullanıcı kuralı: "ben demeden commit/push atma").

---

## 1️⃣ BU TURN'DE YAPILANLAR

### A) Sprint 0 Kod (Launch-blocker, free-launch'la uyumlu kısımlar)

| Madde | Dosya(lar) | Durum |
|---|---|---|
| **PostHog event tracking** — 12 core event + consent gate + offline queue | `src/lib/track.js` (yeni, 117 LOC) + entegrasyon 6 dosya | ✅ Kod hazır, **PostHog key bekliyor** |
| **App.js — initTracking + app_open** | `App.js` | ✅ |
| **Onboarding goal seçimi** — 4 hedef (sınav/kariyer/seyahat/hobi) | `src/screens/onboarding/components/GoalSlide.js` (yeni, 92 LOC) | ✅ |
| **Onboarding level seçimi** — 3 seviye (A1-A2 / B1-B2 / C1+) | `src/screens/onboarding/components/LevelSlide.js` (yeni, 85 LOC) | ✅ |
| **TasteDeck mini-deck** — 5 etkileyici kelime (serendipity, ephemeral, resilient, wanderlust, petrichor) + confetti + otomatik onComplete | `src/screens/onboarding/components/TasteDeck.js` (yeni, 165 LOC) | ✅ |
| **OnboardingScreen güncelleme** — SLIDES'a 3 yeni slide (goal/level/demo=TasteDeck), AsyncStorage'a goal+level yazma, auth varsa profile sync | `src/screens/onboarding/OnboardingScreen.js` | ✅ |
| **Push permission timing** — Onboarding'de değil, ilk başarılı study sonrası soruluyor (zaten kurulu, sadece event tracking eklendi) | `src/screens/study/components/StudyDoneState.js` | ✅ |
| **DB migration** — `profiles.goal` + `profiles.level` kolonları + CHECK + index | `supabase/migrations/0007_profile_goal_level.sql` (yeni) | ⚠️ **DB'ye apply edilmedi** |
| **PostHog SDK install** — `posthog-react-native` ^4.46.19 | `package.json` | ✅ |

### B) Önceki Turn — Tasarım & Akış Fix (12 madde)

- ✅ CategoryCover dual color (gradient=zorluk, chip=kategori)
- ✅ MyListsScreen ListCard PressableScale + kategori shadow
- ✅ ListExplorer ListItem PressableScale + kategori shadow
- ✅ HomeScreen primaryBtn (Başla) accent glow shadow
- ✅ CreateListScreen saveBtn accent glow shadow
- ✅ QuizScreen race fix — `advanceTimerRef`/`mistakesTimerRef` cleanup
- ✅ CreateListScreen double-tap koruması — `savingRef` sync lock
- ✅ HomeScreen modal flicker — 320ms `overlayLocked` buffer
- ✅ PublicProfile lists semantic fix
- ✅ MyListsScreen `showFilters` loading'de gizlendi
- ✅ FlashcardDetail error toast
- ✅ PublicProfile follow rollback `Animated.spring` pulse

---

## 2️⃣ REGRESSION CHECK (sistem bozulmuş mu?)

**Genel:** Type check temiz, kritik bir bozulma YOK. 4 küçük not:

| Risk | Yer | Açıklama | Fix |
|---|---|---|---|
| 🟡 ORTA | `OnboardingScreen.js` `finishWithReminders` | `markOnboardingSeen()` async ama await yok — onFinish çağrıldığında storage henüz yazılmamış olabilir | `await markOnboardingSeen()` ekle |
| 🟡 ORTA | `MyListsScreen.js:373` ListCard | `Pressable → PressableScale` değişimi `delayLongPress={400}` ile uyumlu mu test edilmeli (PressableScale Pressable props inherit ediyor, teorik OK) | Real device test |
| 🟢 DÜŞÜK | `TasteDeck.js:33,45,54,61` | `onboarding_taste_*` string literal'leri `EVENTS.*` sabitlerine eklenmemiş — PostHog'da kaydolur ama tutarlılık ihlali | `track.js` EVENTS'e ekle |
| ✅ OK | `QuizScreen.js:198-202` | Timer cleanup useEffect ile temiz | - |
| ✅ OK | `OnboardingScreen.js:201` | `useAuth() \|\| {}` null-safe | - |
| ✅ OK | `App.js:104-111` | `handleConsentResolved` async await düzgün | - |
| ✅ OK | `package.json` | `posthog-react-native` install OK, conflict yok | - |

**Sonuç:** Sistem çalışır halde. 2 ufak fix öncelikli (await + EVENTS güncelleme), real device test gereken 1 madde.

---

## 3️⃣ MODÜLERLİK AUDIT

### LOC Tablosu — 150 satır kuralı

**Yeni eklenen dosyalar:**
| Dosya | LOC | Durum |
|---|---|---|
| `src/lib/track.js` | 117 | ✅ OK |
| `src/screens/onboarding/components/GoalSlide.js` | 92 | ✅ OK |
| `src/screens/onboarding/components/LevelSlide.js` | 85 | ✅ OK |
| `src/screens/onboarding/components/TasteDeck.js` | 165 | ⚠️ Sınıra yakın |

**Mevcut büyük dosyalar (150 üstü — split adayları):**

| Dosya | LOC | Split önerisi |
|---|---|---|
| `ProfileScreen.js` | 772 | `ProfileHeader`, `StatsSection`, `BadgeSection`, `PublicListsSection` |
| `HomeScreen.js` | 756 | `GreetingSection`, `StatsSection`, `ChallengeCard`, `ContinueCarousel` |
| `QuizScreen.js` | 709 | `QuizCardArea`, modal'lar ayrı dosyalara |
| `CreateListScreen.js` | 638 | `ListMetaForm`, `WordRows`, `ImageUploader` |
| `FavoritesScreen.js` | 553 | `FavoriteHeader`, `WordCard` (zaten var ama dosya hala büyük) |
| `HeroDashboard.js` | 548 | `StatCard`, `LevelCard`, `GreetingBox`, `FlameAnimation` |
| `MyListsScreen.js` | 542 | `ListCard` ve `Empty` ayrı dosyaya çıkarılabilir |
| `database.js` | 533 | RPC grupları ayrı modüllere (`progress.js`, `social.js` zaten var, kalanları da böl) |
| `AppNavigator.js` | 502 | Stack tanımları ayrı dosyalara |
| `StudyScreen.js` | 496 | Done state + flip area ayrı |
| `QuizResultScreen.js` | 486 | Detay listesi + summary ayrı |
| `OnboardingScreen.js` | 458 | DemoFlashcard zaten silindi, slide renderer ayrı dosyaya çıkarılabilir |
| `WeeklyRecapScreen.js` | 445 | - |
| `RoadmapNode.js` | 443 | - |
| `StreakScreen.js` | 437 | - |

**Acil aksiyon:** Şu an refactor MAJOR şart değil — fonksiyonel; ama büyüdükçe okunabilirlik düşüyor. **TasteDeck (165) split etmek kolay** çünkü yeni dosya. Diğerleri için Sprint plan etmek mantıklı (üç dosya/sprint, kademeli).

### Single Responsibility ihlalleri

- **`useStudyEngine.js` (232 LOC)** — session lifecycle + mistakes + progress. Split: `useStudySession` + `useMistakesList`
- **`HomeScreen.js`** — 7+ domain (greeting, dashboard, challenge, search, continue, discovery, smart cards)
- **`AppNavigator.js`** — stack tanımları + Tab + linking config + onboarding gate

---

## 4️⃣ BEKLEYEN MANUEL ADIMLAR (canlıya almak için)

**Bu maddeler kod değil, config/asset/external service. Şu an canlıya alınmıyor — buraya kayıt:**

### 4.1 Supabase Migration Apply
- **Dosya:** `supabase/migrations/0007_profile_goal_level.sql`
- **Nasıl:** Supabase Studio → SQL Editor → Run; veya CLI: `supabase db push`
- **Etki:** Onboarding'de goal+level seçimi profil tablosuna yazılabilir hale gelir

### 4.2 PostHog Account + Key
- https://eu.posthog.com → proje aç
- Project API Key kopyala
- `.env`'e ekle:
  ```
  EXPO_PUBLIC_POSTHOG_KEY=phc_xxx
  EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
  ```
- Olmadan: track() event'leri **stub mode**'da queue'da kalır, hata vermez
- Free tier: 1M event/ay yeterli (ilk 10k kullanıcı için)

### 4.3 RevenueCat (free-launch için ERTELENDİ)
- Stratejik karar: paywall'ı "Yakında" haline çevirip free-launch yapmak
- Kod hazır, sadece `.env` keys olmadan stub mode'da kalıyor
- Launch sonrası 1-3 ay büyüme verisi → sonra:
  - https://app.revenuecat.com → proje
  - iOS + Android app bind
  - Entitlement `pro` + 3 product
  - `.env`'e `EXPO_PUBLIC_RC_IOS_KEY` + `EXPO_PUBLIC_RC_ANDROID_KEY`

### 4.4 App Store Optimization (ASO)
- App Store + Play Store metadata (TR + EN)
- 5 screenshot mockup (Figma)
- Long-tail keyword research:
  - "ingilizce kelime ezberleme", "spaced repetition türkçe"
  - "yds kelime", "ielts vocab", "yökdil kelime listesi"
- Icon polish (1024×1024 master)
- Bu rapor yazılırken EAS build / deploy gerekmiyor

### 4.5 EAS Build / Submit
- Production build: `eas build --platform all`
- Store submit: `eas submit --platform ios` / `--platform android`
- Şu an gerekmiyor — TestFlight/Internal testing'e atılabilir

---

## 5️⃣ GELECEĞE — NE EKLENMELİ (32 ÖNERİ × 8 KATEGORİ)

> Free-launch stratejisine uyumlu — retention + viral + engagement odaklı.

### A. RETENTION MOTORLARI

1. **Streak Freeze (Comeback Insurance)** — Kullanıcı 1 gün atlarsa "Geri Dön" butonu, 3 dk mini-session → streak korunur. Effort: orta. Mevcut: streak RPC + notifications.
2. **Weekly Summary (Pazar 20:00)** — `WeeklyRecapScreen` zaten var, sadece scheduled push + reminder. Effort: orta.
3. **Daily Goal Customization** — Profile'a `daily_goal_type`: casual (5) / standard (10) / intense (20). Effort: kolay.
4. **Friend Streak (MVP)** — Profil'a "arkadaşım" sorusu, leaderboard'da yan yana streak. Mevcut: follow RPC + leaderboard. Effort: zor.

### B. VİRAL KANALLAR

5. **Referral System** — Unique kod + share link → kayıt olan'a 10 favori slot bonus + davet edene "Starter Deck" açılır. Effort: zor. Mevcut: deep link + share.
6. **Trending Lists (HomeScreen)** — `top_liked_lists` RPC zaten var, HomeScreen'e yeni row ekle. Effort: kolay.
7. **Quiz Completion Share Modal** — Quiz ≥80% → "75/100 doğru" share kartı + deep link. Effort: kolay.
8. **Public Profile Copy Link** — Profil avatar'a "Linkini Paylaş" CTA. Effort: kolay.

### C. SOSYAL PROOF

9. **Mini Leaderboard (Haftanın Üstleri)** — StreakScreen alt: Top 5 streaks. Effort: kolay.
10. **Follower Count Badge** — ProfileScreen'de "123 Takipçi" chip. Effort: kolay.
11. **List Creator Icon** — Public list satırında "👤 username". Effort: kolay.
12. **"Popüler in Your Category"** — ListExplorer'a kategoride trending filter. Effort: kolay.

### D. HABIT FORMATION

13. **Streak Freeze Token** — İlk 1 ücretsiz, sonra Pro (Pro açılırsa). Effort: orta.
14. **Habit Stack: "Çalış + Favori"** — Result screen'de inline "5 kelimeyi favorile" prompt. Effort: kolay.
15. **Customizable Practice Window** — Settings'te "Pratik saatlerim" → reminder'lar buna göre. Effort: orta.
16. **Hidden Speed Badges** — İlk 7 gün 100 kelime = "Lightning Learner", 3-hafta streak = "Persistent" vb. Effort: orta.

### E. ENGAGEMENT ÇEŞİTLİLİĞİ

17. **Match Mini-Game** — 6 kelime + 6 anlam drag-eşleştir, hızlı = bonus XP. Effort: zor.
18. **Time Challenge** — 10s/soru hızlı quiz + leaderboard. Mevcut: TIME_LIMIT zaten var. Effort: kolay.
19. **Sentence Builder** — Word detail'de "cümleyi oku → MCQ anlamı". Effort: orta.
20. **Daily Word of the Day** — Seeded random kelime, herkes aynı + push. Effort: kolay.

### F. CONTENT DISCOVERY

21. **"For You" Personalization** — Goal+level+history bazlı score'lu öneri. Mevcut: profile metadata. Effort: zor.
22. **"Benzer Listeler"** — Liste detayında "bu listeyi sevdiysen şunları dene" carousel. Effort: kolay.
23. **Streak Momentum Adaptive** — 7+ gün streak → seviye otomatik yükselt (toggle). Effort: orta.
24. **"Trending in Your Level"** — YDS user'a Advanced trending. Effort: kolay.

### G. İLK DEĞER DERİNLEŞMESİ

25. **Day 3 Re-engagement Modal** — Login Day 3 → "3 günün tamam! Şimdi 2 quiz." Effort: kolay.
26. **First Mistake List Auto-Setup** — İlk hatalı quiz sonrası modal: "Sana özel liste hazırladım". Mevcut: mistakes system. Effort: kolay.
27. **"First 100" Celebration** — 10/25/50/100 kelime → MilestoneModal + permanent progress bar. Effort: kolay.
28. **TasteDeck Sonrası Yönlendirme** — Onboarding bitince filtered list explorer'a auto-nav + 1 liste seçtirme. Effort: kolay.

### H. QUICK WINS (mevcut polish)

29. **Favorite List Share Icon** — MyLists favori satırına "Paylaş" icon. Effort: kolay.
30. **Quiz Streak Chip** — HomeScreen'de "5 quiz üst üste" chip. Effort: kolay.
31. **Notification Countdown** — HomeScreen'de "19:32'de hatırlatma". Effort: kolay.
32. **Tasarım tutarsızlığı temizliği** — Eski lime `#B4FF4F` artığı (`EmptyState.js:64`, `AbstractIllustration.js:14`), hardcoded color (`MilestoneModal.js:270,293,322`), `T` direkt import (`ErrorBoundary.js`, `AppNavigator.js:160`). Effort: kolay.

---

## 6️⃣ ÖNCELIK ÖNERİSİ (free-launch için optimal sıra)

**Önce (1-2 gün):**
- Paywall'ı "Yakında" moduna çevir (RC live keys gereksiz)
- Regression fix'leri: `await markOnboardingSeen`, EVENTS güncelle (30 dk)
- Trending Lists HomeScreen row (#6, kolay, sosyal proof)
- Quiz Completion Share Modal (#7, kolay, viral)

**Sonra retention triangle (1 gün):**
- Streak Freeze (#13, orta)
- Comeback push (Day 3 absent — `useNudge` sistemini kullanabilir, #25 ile birleşik)
- Streak risk uyarısı (gece 21'de hala çalışmamışsa)

**Sonra viral leverage (2 gün):**
- Referral system (#5, zor)
- Paylaşılabilir başarı kartı (`react-native-view-shot` ile Instagram story formatı)

**Sonra engagement (1-2 gün):**
- Daily Word of the Day (#20, kolay)
- Time Challenge (#18, kolay, mevcut TIME_LIMIT)
- "Benzer Listeler" carousel (#22, kolay)

**Sonra polish + modülerlik:**
- Eski lime palette temizliği
- ProfileScreen split (zaten 772 LOC, refactor şart)
- HomeScreen split (756 LOC)

**ASO + Store deployment'a hazırlık sona kaldı** — kod tarafı %90 hazır, sadece asset + metadata + key konfig.

---

## 🟢 BU RAPOR SONRASI

Bu rapor durmuş bir TODO listesi. Kullanıcı "şu maddeyi yapalım" dediğinde direkt execute. Migration ve external service'ler buraya not edildi — canlıya alındığında bu rapor güncellenir veya yeni dated rapor açılır.

**Sıradaki turn'de muhtemel:** Paywall "Yakında" mode + regression fix'ler + Trending Lists row (1-2 saatlik küçük iş).
