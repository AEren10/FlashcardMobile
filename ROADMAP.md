# FlashcardMobile — Roadmap & Notlar

## 🔴 Yapılacaklar (Manuel)

- [ ] `EXPO_PUBLIC_SENTRY_DSN` env değişkenini tanımla (yoksa Sentry zaten init olmaz)
- [ ] `app.json` → `extra.eas.projectId` boş, EAS build öncesi doldur
- [ ] App icon yeniden tasarım (1024×1024)
- [ ] App Store screenshot'ları (iPhone 6.7" ve 6.5", 6 adet)
- [ ] TestFlight upload + internal testing
- [ ] App Store Connect → Privacy details formu
- [ ] Privacy Policy + ToS için public URL (in-app var ama metadata için web URL şart)
- [ ] Hazır public listelerin sayısını artır (YDS, TOEFL, IELTS, KPDS, business, travel, food, tech — toplam 20+)

## 🎨 Tasarım (Claude Design ile yenilenecek)

- [ ] Tüm tasarım sistemi (renk, font, spacing, component'ler)
- [ ] Maskot yeniden değerlendirme (kal ya da çıkar)
- [ ] App icon
- [ ] Onboarding görselleri
- [ ] Empty state'ler
- [ ] Splash screen

## ✨ Yeni Özellikler (Öncelik Sırası)

### Tier 1 — Düşük maliyet, yüksek değer

- [ ] **Storyboard mode** — kullanıcı liste kelimelerini kullanarak kısa hikaye yazsın, gamification puanı kazansın (AI gerek yok, sadece kelime sayım + paylaşılabilir output)
- [ ] **Reverse learning toggle** — EN→TR ve TR→EN'i tek butonla değiş, aynı kart farklı yön
- [ ] **Personal photo notes** — kullanıcı kelimeye telefon galerisinden kendi fotoğrafını ekleyebilsin (kişisel bağlam = güçlü hafıza, görsel kart sorununa çözüm)
- [ ] **Mood-based lists** — "bugün motiveysem", "üzgünsem", "yorgunsam" temalı küratörlü listeler
- [ ] **Crowdsourced emoji per word** — public listelerde her kelimeye topluluk emoji seçsin (oy çoğunluğu), free
- [ ] **Daily global challenge** — herkes aynı 10 kelimeyle yarışsın, günlük leaderboard
- [ ] **Sentence builder mini-game** — kelimeleri sürükle-bırak ile cümle kur (quiz alternatifi)
- [ ] **Liste paylaşımı deep link** — `flashcardmobile://list/{id}` zaten var, paylaş butonu UX'ini güçlendir

### Tier 2 — Orta maliyet, orta-yüksek değer

- [ ] **Görsel kelime kartları** (üç yöntem birleştir):
  - User upload (private listeler için, Supabase Storage 1GB free)
  - Crowdsourced emoji (public listeler için)
  - Openclipart.org / Wiktionary commons fetch (otomatik suggest)
- [ ] **Pronunciation practice** — `expo-speech` zaten yüklü, ters yönü ekle: STT ile kullanıcı söylesin, skor
- [ ] **iOS widget** — "Günün kelimesi" widget, retention için kritik
- [ ] **Apple Sign In** — iOS'ta zorunlu (mevcut email + Google auth varsa)
- [ ] **Friend system** — arkadaş ekleme, beraber çalışma, leaderboard

### Tier 3 — Yüksek maliyet, ileride

- [ ] **AI quiz generation** — kelimeye otomatik örnek cümle (OpenAI/Anthropic API)
- [ ] **Premium subscription** — sınırsız liste, AI quiz, gelişmiş istatistik
- [ ] **Topluluk listeleri** — onaylı moderasyonla public liste mağazası

## 🛡️ App Store Submission Checklist (kalan)

- [x] Trigger fix + view security_invoker
- [x] Test kullanıcısı oluştur
- [x] Auth password policy + rate limit
- [x] Privacy/ToS in-app
- [x] Hesap silme akışı (Apple 5.1.1(v))
- [x] GDPR consent modal (Sentry)
- [x] Refactor: HomeScreen + FlashcardDetailScreen
- [x] Theme consolidation
- [ ] Apple Sign In
- [ ] App icon final
- [ ] Screenshots (6 adet)
- [ ] EAS Build → TestFlight
- [ ] Privacy details (App Store Connect)
- [ ] Public Privacy Policy + ToS URL

## 📊 Bilinen Metrikler

- 6 tablo + 3 view (RLS aktif, 11 policy)
- Free tier (Nano compute, EU Frankfurt)
- Realtime disabled (sorun değil, app gerek duymuyor)
- 0 production user (henüz launch öncesi)

## 🧪 Test Kullanıcısı

- Email: `admin@gmail.com`
- Şifre: `admin123`
- UUID: `f32a440c-2d86-4783-9b66-a0a18c440df5`
- App Store review için bu hesap verilecek
