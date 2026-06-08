# 🔴 Supabase Apply — Migration 0007-0010 + Edge Function

**Tarih:** 2026-06-08
**Durum:** ❌ DB'de YOK — hiç apply edilmemiş (REST API ile doğrulandı)

## Doğrulama sonucu

```
GET /rest/v1/profiles?select=goal,level,freeze_count → "column profiles.goal does not exist"
POST /rest/v1/rpc/get_freeze_status → "Could not find the function"
POST /rest/v1/rpc/get_study_words → "Could not find the function"
```

App halen çalışır — fallback'ler mevcut:
- `studyWords.js` → RPC yoksa `getListWords` fallback
- `streakFreeze.js` → RPC yoksa "Kullanılamadı" mesaj (kullanıcı için silinmiş freeze chip görür)
- `onboarding goal+level` → AsyncStorage'a yazar, profile sync sessizce hata yutar

---

## ✅ Apply adımları (5 dakika)

### 1. Supabase Studio → SQL Editor

Tek sefer hepsini koşmak için aşağıdaki 4 dosyayı **sırayla** çalıştır:

| # | Dosya | İçerik |
|---|---|---|
| 1 | `supabase/migrations/0007_profile_goal_level.sql` | `profiles.goal + level` kolonları + CHECK + index |
| 2 | `supabase/migrations/0008_streak_freeze.sql` | `profiles.freeze_count + freeze_last_used` + 2 RPC |
| 3 | `supabase/migrations/0009_comeback_push.sql` | `profiles.expo_push_token + last_active_at` + `comeback_pushes` tablo + 3 RPC |
| 4 | `supabase/migrations/0010_get_study_words.sql` | `get_study_words(list_id, mode, limit)` RPC |

### 2. CLI ile alternatif (eğer Supabase CLI kurulu ise)

```bash
supabase db push
```

Hepsini sırayla otomatik apply eder.

### 3. pg_cron schedule (Comeback push için)

Migration 0009'un altında yorum satırı olarak var. Supabase Studio → Database → Extensions → pg_cron'u aktive et, sonra çalıştır:

```sql
SELECT cron.schedule(
  'comeback-push-daily',
  '0 8 * * *',
  $$
    SELECT net.http_post(
      url := 'https://vjsaamzkmjceyicwttwg.supabase.co/functions/v1/comeback-push',
      headers := jsonb_build_object(
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
        'Content-Type', 'application/json'
      )
    );
  $$
);
```

`<SERVICE_ROLE_KEY>` → Supabase Settings → API → service_role key

### 4. Edge Function deploy

```bash
supabase functions deploy comeback-push
```

Function deploy edilince pg_cron'un yukarıda schedule ettiği URL aktif olur.

---

## Doğrulama (apply sonrası)

```bash
# Tüm yeni kolonlar var mı?
curl -s "https://vjsaamzkmjceyicwttwg.supabase.co/rest/v1/profiles?select=goal,level,freeze_count,expo_push_token,last_active_at&limit=1" \
  -H "apikey: <ANON_KEY>"

# RPC'ler hazır mı?
curl -s -X POST "https://vjsaamzkmjceyicwttwg.supabase.co/rest/v1/rpc/get_freeze_status" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>" -H "Content-Type: application/json" -d "{}"
```

İkincisi `{"can_use": false, "available": 0, ...}` döndürüyorsa OK (auth.uid() yok diye false).
Anonymous yetki yoksa `401` da OK — RPC var demektir.

---

## Acil değil ama önerilir

- **PostHog account** (https://eu.posthog.com) → `.env`'e `EXPO_PUBLIC_POSTHOG_KEY` ekle
- **RevenueCat** → free-launch için ertelendi (rapor 4.3'e bakın)
- **ASO assets** → store launch yaklaşınca yapılır

---

**App çalışıyor — fallback'ler iş görüyor.** Migration apply olunca tüm yeni feature'lar (Streak Freeze chip aktif, StudyMode gerçek filtreleme, Onboarding goal+level kaydı, Comeback push backend) tam fonksiyonel olur.
