/**
 * ProfileContext — kullanıcı profil bilgilerinin tek doğru kaynağı.
 *
 * Akış:
 *   - Mount'ta Supabase'den getProfile çek, state'e koy
 *   - EditProfile save → patchOptimistic({ display_name, avatar_url }) çağırır
 *     → UI ANINDA güncellenir, sonra background DB sync
 *   - ProfileScreen useProfile() ile context'ten okur — useFocusEffect gerekmez
 *
 * Bu sayede EditProfile'dan goBack edince ProfileScreen zaten doğru veriye sahip.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "../supabase/profile";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext({
  profile: { display_name: null, avatar_url: null },
  loading: false,
  refresh: () => {},
  patchOptimistic: () => {},
});

export function ProfileProvider({ children }) {
  const { user, isGuestUser } = useAuth();
  const [profile, setProfile] = useState({ display_name: null, avatar_url: null });
  const [loading, setLoading] = useState(false);

  const userId = user?.id;
  const guest = isGuestUser?.();

  const refresh = useCallback(async () => {
    if (guest || !userId) return;
    setLoading(true);
    try {
      const res = await getProfile(userId);
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, guest]);

  // İlk yüklemede + userId değişince fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Optimistic patch — UI'ı hemen günceller.
   * EditProfile bunu çağırır, sonra background DB sync yapar.
   * DB başarısız olursa caller toast gösterir, isteğe bağlı rollback için
   * önceki değer döner.
   */
  const patchOptimistic = useCallback((patch) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  // useMemo — consumer re-render leak fix
  const value = useMemo(
    () => ({ profile, loading, refresh, patchOptimistic }),
    [profile, loading, refresh, patchOptimistic]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
