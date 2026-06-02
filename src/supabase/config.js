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

export const DEFAULT_LISTS = [
  {
    title: "Günlük İngilizce",
    description: "Günlük hayatta kullanılan temel İngilizce kelimeler",
    level: "Beginner",
    image_url: null,
    words: [
      { word: "Hello", meaning: "Merhaba", example: "Hello, how are you?" },
      { word: "Thank you", meaning: "Teşekkür ederim", example: "Thank you for your help." },
      { word: "Please", meaning: "Lütfen", example: "Please help me." },
      { word: "Excuse me", meaning: "Affedersiniz", example: "Excuse me, where is the bathroom?" },
      { word: "Sorry", meaning: "Özür dilerim", example: "Sorry, I'm late." },
    ],
  },
  {
    title: "Sayılar",
    description: "Temel sayılar ve matematik terimleri",
    level: "Beginner",
    image_url: null,
    words: [
      { word: "One", meaning: "Bir", example: "I have one apple." },
      { word: "Two", meaning: "İki", example: "Two plus two equals four." },
      { word: "Three", meaning: "Üç", example: "I bought three books." },
      { word: "Four", meaning: "Dört", example: "There are four seasons." },
      { word: "Five", meaning: "Beş", example: "I have five fingers." },
    ],
  },
  {
    title: "Renkler",
    description: "Temel renkler ve tonları",
    level: "Beginner",
    image_url: null,
    words: [
      { word: "Red", meaning: "Kırmızı", example: "The apple is red." },
      { word: "Blue", meaning: "Mavi", example: "The sky is blue." },
      { word: "Green", meaning: "Yeşil", example: "The grass is green." },
      { word: "Yellow", meaning: "Sarı", example: "The sun is yellow." },
      { word: "Black", meaning: "Siyah", example: "The cat is black." },
    ],
  },
];
