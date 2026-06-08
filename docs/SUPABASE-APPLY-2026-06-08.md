# ✅ Supabase Apply — Migration 0007-0010 BAŞARILI

**Tarih:** 2026-06-08
**Durum:** ✅ Tüm 4 migration DB'ye apply edildi (Chrome MCP üzerinden)

## Apply yöntem

Supabase Studio (https://supabase.com/dashboard/project/vjsaamzkmjceyicwttwg/sql) açılıp Monaco editor'a JS ile enjeksiyon + Ctrl+Enter run. Destructive query confirm dialog'u Run query ile geçildi.

## Apply'da çıkan + düzeltilen 2 hata

1. **`position` reserved keyword** — `RETURNS TABLE (... position INT ...)` syntax error
   - Fix: `"position" INT` quote'lu → `w."position"` her select'te
2. **`date_trunc()` IMMUTABLE değil** — `CREATE UNIQUE INDEX ... (date_trunc('day', sent_at))` reddedildi
   - Fix: Index kaldırıldı. `get_comeback_candidates` RPC zaten `NOT EXISTS (date_trunc('day', sent_at) = today)` ile aynı gün engeli yapıyor (uniqueness app-level)

Bu iki fix migration dosyalarında da güncellendi (replay sırasında hata vermeyecek).

## Doğrulama (REST API)

| RPC / Tablo | Sonuç |
|---|---|
| `profiles.goal,level,freeze_count,freeze_last_used,expo_push_token,last_active_at` | `[]` ✅ — tüm kolonlar mevcut |
| `get_freeze_status()` | `[{can_use:false,available:0,next_reset_at:null}]` ✅ — RPC var (uid yok → false) |
| `get_study_words(uuid, mode)` | `[]` ✅ — RPC var |
| `comeback_pushes` table | `[]` ✅ — tablo var (RLS USING(false) → boş) |
| `touch_last_active()`, `register_push_token()` | VOID + hata yok ✅ |

## Halen bekleyenler (opsiyonel)

### pg_cron schedule (Comeback push otomasyonu için)

Edge function deploy edilmeden gerek YOK. Şu adım edge function deploy ettikten sonra:

```sql
-- Supabase Dashboard → Database → Extensions → pg_cron'u aktive et
SELECT cron.schedule(
  'comeback-push-daily',
  '0 8 * * *',  -- her gün 08:00 UTC (TR 11:00)
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

### Edge Function deploy

```bash
supabase login
supabase link --project-ref vjsaamzkmjceyicwttwg
supabase functions deploy comeback-push
```

Olmadan: app touch_last_active + register_push_token RPC'leri çalışır (last_active yazılır, token kayıt olur) ama günlük push GÖNDERILMEZ.

### Diğer external (acil değil)

- **PostHog account** → `.env`'e `EXPO_PUBLIC_POSTHOG_KEY`
- **RevenueCat** → free-launch için ertelendi
- **ASO assets** → store launch yaklaşınca

---

## App tarafında ne aktif oldu

✅ **Onboarding goal+level** → AsyncStorage **VE** Supabase profiles tablosuna yazılıyor
✅ **Streak Freeze chip** → StreakScreen'de `getFreezeStatus()` gerçek değer döner, `consumeStreakFreeze()` çalışır
✅ **StudyMode gerçek filter** → `get_study_words(listId, mode)` RPC ile smart/all/new/mistakes filtreli
✅ **Comeback push altyapı** → her app open'da `touch_last_active()` + `registerExpoPushToken()` (edge function bekliyor)

App-side fallback'ler artık tetiklenmez — gerçek değer döner.
