import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_SESSION_COUNT = "@fc:sessionCount";
const KEY_RATED = "@fc:hasRated";
const TRIGGER_AFTER = 5;

export async function maybeRequestReview() {
  try {
    const rated = await AsyncStorage.getItem(KEY_RATED);
    if (rated === "true") return;

    const raw = await AsyncStorage.getItem(KEY_SESSION_COUNT);
    const count = (parseInt(raw, 10) || 0) + 1;
    await AsyncStorage.setItem(KEY_SESSION_COUNT, String(count));

    if (count >= TRIGGER_AFTER && (await StoreReview.isAvailableAsync())) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(KEY_RATED, "true");
    }
  } catch {}
}
