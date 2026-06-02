/**
 * Hard words + daily challenge fetcher'ları (view'lardan)
 */
import supabase from "./client";

export async function getHardWords() {
  const { data, error } = await supabase.from("v_hard_words").select("*").limit(100);
  if (error) {
    console.warn("getHardWords", error.message);
    return [];
  }
  return data ?? [];
}

export async function getDailyChallenge() {
  const { data, error } = await supabase.from("v_daily_challenge").select("*");
  if (error) {
    console.warn("getDailyChallenge", error.message);
    return [];
  }
  return data ?? [];
}
