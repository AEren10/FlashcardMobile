/**
 * Supabase Configuration
 * Credentials read from environment (.env → EXPO_PUBLIC_*)
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Check your .env file."
  );
}

export const SUPABASE_CONFIG = {
  url: url ?? "",
  anonKey: anonKey ?? "",
};

export const TABLES = {
  LISTS: "lists",
  WORDS: "words",
  PROFILES: "profiles",
  FAVORITES: "favorites",
  WORD_PROGRESS: "word_progress",
  STUDY_SESSIONS: "study_sessions",
};

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  IMAGES: "images",
};

export const AUTH_CONFIG = {
  redirectTo: undefined,
  detectSessionInUrl: false,
  persistSession: true,
  autoRefreshToken: true,
};

// DEFAULT_LISTS kaldırıldı — public listeler artık Supabase migration 0001'de
// seed ediliyor ve runtime'da kullanıcının kendi listesine kopyalanmıyor.
// Yeni public listeler için: supabase/migrations/000X_seed_*.sql ekle.
