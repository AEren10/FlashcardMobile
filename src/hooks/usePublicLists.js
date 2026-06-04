/**
 * usePublicLists — cache-backed (SWR) public lists source.
 * 4 ekran paylaşır: Home, MyLists, FavoritesScreen, ListExplorer.
 * İlk açılışta cache'i hemen döner, arkada fresh fetch + cache update.
 * invalidate() — liste create/delete sonrası TTL'ı sıfırlar.
 */
import { useCallback, useEffect, useState } from "react";
import { fetchPublicLists } from "../lib/cachedApi";
import { remove as removeCache } from "../lib/cache";

const CACHE_KEY = "public_lists";

export default function usePublicLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (opts = {}) => {
    if (!opts.silent) setLoading(true);
    setError(null);
    let gotData = false;
    try {
      await fetchPublicLists((data, isStale) => {
        if (Array.isArray(data)) {
          setLists(data);
          gotData = true;
        }
        if (!isStale) setLoading(false);
      });
    } catch (e) {
      // Cache de yoksa kullanıcıya error göster, varsa stale gösteriyoruz
      if (!gotData) setError(e?.message || "Listeler yüklenemedi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await removeCache(CACHE_KEY); // TTL'ı geçersiz kıl
    await load({ silent: true });
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return { lists, loading, refreshing, refresh, reload: load, error };
}

/** Liste create/delete sonrası diğer ekranlar bunu çağırsın */
export async function invalidatePublicLists() {
  await removeCache(CACHE_KEY);
}
