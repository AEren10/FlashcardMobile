/**
 * TTS helper — Speech.speak çağrılarını tek elden geçirir.
 *
 * Sorunlar (gerçek hayat):
 *   - iOS silent mode (yan butonda kapalı) → ses gelmez
 *   - expo-av audio mode init yapılmadan Speech.speak → silent
 *   - Speech.stop() async ama await edilmiyor → race ile yeni speak abort
 *   - Engine init hatası → sessizce yutuluyor, kullanıcı niye sessiz bilmiyor
 *
 * Çözüm:
 *   - Her speak() çağrısından ÖNCE ensureAudioMode (idempotent ama emin ol)
 *   - await Speech.stop() (race fix)
 *   - try/catch + console.warn ki Sentry yakalasın
 */
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

/**
 * Hot reload audio mode'u sıfırlar ama modül değişkeni kalır → sessizlik.
 * Çözüm: her speak() öncesi DAIMA setAudioModeAsync çağır (idempotent, ~1ms).
 */
async function ensureAudioMode() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // DUCK_OTHERS
    });
  } catch (err) {
    console.warn("[tts] audio mode init failed", err?.message);
  }
}

/**
 * Kelime/cümle seslendir. Default: İngilizce, makul tempo.
 * options.onStart — ses başladığında
 * options.onDone  — ses bittiğinde (veya hata olursa)
 * @returns {Promise<boolean>} ses gerçekten başlatıldıysa true
 */
export async function speak(text, options = {}) {
  if (!text || typeof text !== "string") return false;

  try {
    // 1) Audio mode (iOS silent mode bypass + Android duck)
    await ensureAudioMode();

    // 2) Önceki speech'i bekletmeden iptal
    try {
      await Speech.stop();
    } catch {
      /* zaten durmuş olabilir */
    }

    // 3) Yeni speech
    Speech.speak(String(text), {
      language: options.language || "en-US",
      pitch: options.pitch ?? 1.0,
      rate: options.rate ?? 0.92,
      onStart: () => {
        options.onStart?.();
      },
      onDone: () => {
        options.onDone?.();
      },
      onStopped: () => {
        options.onDone?.();
      },
      onError: (err) => {
        console.warn("[tts] onError", err?.message || err);
        options.onDone?.();
      },
    });
    return true;
  } catch (err) {
    console.warn("[tts] speak failed", err?.message);
    options.onDone?.();
    return false;
  }
}

/**
 * Şu an konuşuyor mu? Bazı UI'larda animasyon için.
 */
export async function isSpeaking() {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return false;
  }
}

export async function stop() {
  try {
    await Speech.stop();
  } catch {}
}
