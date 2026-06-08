/* 
 * Authentication Context
  * Manages user authentication state and provides auth functions throughout the app
  */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../supabase/client";
import { store } from "../store/store";
import { fetchFavorites, clearFavorites } from "../store/favoritesSlice";
import {
  fetchFavoriteWordIds,
  clearFavoriteWords,
} from "../store/favoriteWordsSlice";

// Create the context
const AuthContext = createContext({});

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error.message);
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Public seed listeler migration'da hazır, yeni kullanıcıya özel
      // default liste üretmiyoruz. Kullanıcı istediğinde kendi listesini oluşturur.
      if (event === "SIGNED_IN" && session?.user) {
        store.dispatch(fetchFavorites());
        store.dispatch(fetchFavoriteWordIds());
      }

      // Clear favorites when user signs out
      if (event === "SIGNED_OUT") {
        store.dispatch(clearFavorites());
        store.dispatch(clearFavoriteWords());
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign up a new user
   * Email confirmation disabled - user can login immediately
   */
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      setIsGuest(false);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: "flashcardmobile://login",
        },
      });

      if (error) throw error;

      // If user is created successfully, sign them in automatically
      // Note: Supabase may require email confirmation in production
      // For development, we'll try to sign in immediately
      if (data.user) {
        try {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email, password });

          if (!signInError && signInData?.session) {
            return { success: true, data: signInData };
          }
        } catch (signInErr) {
          console.warn("Auto sign-in after signup failed:", signInErr.message);
        }
        // Email doğrulama kapalı — auto sign-in başarısız olursa yine de success dön
        return {
          success: true,
          data,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Sign up error:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setIsGuest(false);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Sign in error:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in as guest (no authentication required)
   */
  const signInAsGuest = () => {
    setIsGuest(true);
    setUser({ id: "guest", email: null, isGuest: true });
    setSession({ user: { id: "guest", email: null, isGuest: true } });
    setLoading(false);
    return { success: true };
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      setLoading(true);

      // If guest, just clear guest state
      if (isGuest) {
        setIsGuest(false);
        setUser(null);
        setSession(null);
        setLoading(false);
        store.dispatch(clearFavorites());
        store.dispatch(clearFavoriteWords());
        return { success: true };
      }

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setIsGuest(false);
      store.dispatch(clearFavorites());
      store.dispatch(clearFavoriteWords());
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error.message);
      return { success: false, error: error.message };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete the authenticated user's account (Apple Guideline 5.1.1(v) compliance).
   * Postgres RPC `delete_user_account` SECURITY DEFINER ile auth.uid()'nin auth.users
   * satırını siler; tüm ilişkili veriler ON DELETE CASCADE ile temizlenir.
   */
  const deleteAccount = async () => {
    try {
      if (isGuest) {
        return { success: false, error: "Misafir hesap silinemez." };
      }
      setLoading(true);
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;
      // Hesap silindiği için auth state otomatik temizlenir, yine de güvenli tarafta kal.
      await supabase.auth.signOut().catch(() => {});
      store.dispatch(clearFavorites());
      setIsGuest(false);
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Hesap silinemedi." };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is authenticated (including guest users)
   */
  const isAuthenticated = () => {
    return (!!user && !!session) || isGuest;
  };

  /**
   * Check if user is a guest
   */
  const isGuestUser = () => {
    return isGuest;
  };

  /**
   * Get user ID
   */
  const getUserId = () => {
    return user?.id || null;
  };

  /**
   * Get user email
   */
  const getUserEmail = () => {
    return user?.email || null;
  };

  // Context value — useMemo ile sarılı (perf raporu: 10+ consumer re-render leak fix).
  // Methods/helpers parent scope'tan, sadece state değişimi value'yu yeniler.
  const value = useMemo(
    () => ({
      // State
      user,
      session,
      loading,
      initializing,
      isGuest,
      // Methods
      signUp,
      signIn,
      signInAsGuest,
      signOut,
      resetPassword,
      updateProfile,
      deleteAccount,
      // Helpers
      isAuthenticated,
      isGuestUser,
      getUserId,
      getUserEmail,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, session, loading, initializing, isGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
