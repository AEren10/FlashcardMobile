// Comeback Push Edge Function
// Cron ile günde 1 kez çağırılır (pg_cron — migration 0009'da örnek).
// SECURITY: service-role key gerek; pg_cron çağrısında Authorization header'da geçer.
//
// Akış:
//   1. get_comeback_candidates() — 3-8 gün absent, expo_push_token'ı olan, bugün gönderilmemiş user'lar
//   2. Her birine kişiselleştirilmiş mesaj — streak/days_absent'a göre
//   3. Expo Push API'ye batch gönder (max 100 mesaj/request)
//   4. comeback_pushes'a kayıt (idempotency)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface Candidate {
  user_id: string;
  push_token: string;
  days_absent: number;
  display_name: string | null;
  streak_days: number;
}

function pickMessage(c: Candidate): { title: string; body: string; kind: string } {
  const name = c.display_name?.split(" ")[0] || null;
  const greet = name ? `${name}, ` : "";

  if (c.streak_days >= 3 && c.days_absent <= 4) {
    return {
      kind: "streak_risk",
      title: "🔥 Serini kaybetme",
      body: `${greet}${c.streak_days} günlük serini koruyabilirsin — 2 dakikan yeter.`,
    };
  }
  if (c.days_absent >= 7) {
    return {
      kind: "long_absent",
      title: "👋 Eksikliğin hissediliyor",
      body: `${greet}Yeni listeler eklendi — dönmek için iyi bir an.`,
    };
  }
  if (c.days_absent >= 5) {
    return {
      kind: "mid_absent",
      title: "📚 Kelimelerin bekliyor",
      body: `${greet}Listende tamamlamadığın kart var — birkaç dakika ayır.`,
    };
  }
  return {
    kind: "early_absent",
    title: "💭 Bugünün kelimesini gör",
    body: `${greet}5 dakika çalışmak alışkanlığı tetikler.`,
  };
}

async function sendBatch(payloads: any[]): Promise<any[]> {
  if (payloads.length === 0) return [];
  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloads),
  });
  const json = await res.json();
  return json?.data || [];
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Adayları çek
  const { data: candidates, error } = await sb.rpc("get_comeback_candidates");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  if (!candidates || candidates.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  // Mesajları hazırla
  const messages = (candidates as Candidate[]).map((c) => {
    const m = pickMessage(c);
    return {
      payload: {
        to: c.push_token,
        sound: "default",
        title: m.title,
        body: m.body,
        data: { kind: m.kind },
      },
      kind: m.kind,
      user_id: c.user_id,
      days_absent: c.days_absent,
    };
  });

  // Batch'le gönder (Expo max 100/req)
  const chunks: typeof messages[] = [];
  for (let i = 0; i < messages.length; i += 100) chunks.push(messages.slice(i, i + 100));

  let sent = 0;
  let failed = 0;
  const insertRows: any[] = [];

  for (const chunk of chunks) {
    const results = await sendBatch(chunk.map((m) => m.payload));
    chunk.forEach((m, i) => {
      const r = results[i];
      const ok = r?.status === "ok";
      if (ok) sent++;
      else failed++;
      insertRows.push({
        user_id: m.user_id,
        days_absent: m.days_absent,
        message_kind: m.kind,
        delivered: ok,
      });
    });
  }

  // Logla
  if (insertRows.length > 0) {
    await sb.from("comeback_pushes").insert(insertRows);
  }

  return new Response(JSON.stringify({ sent, failed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
