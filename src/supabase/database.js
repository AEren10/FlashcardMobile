/**
 * Supabase Database Functions
 * Handles all database operations for lists and words
 */

import supabase from "./client";
import { TABLES } from "./config";

// ==================== LISTS OPERATIONS ====================

/**
 * Get all lists for the current user
 * Only returns lists created by the authenticated user
 * For guest users, returns empty array
 * @returns {Promise<Object>} Lists data
 */
export const getLists = async () => {
  try {
    // Önce kullanıcı oturumunu kontrol et
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Misafir kullanıcılar için boş liste döndür
    if (userError || !user) {
      return { success: true, data: [] };
    }

    // Normal kullanıcılar için sadece kendi listelerini göster
    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .select("*, words(count)")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Error fetching lists for user:", error);
      throw error;
    }

    const lists = (data || []).map((l) => ({
      ...l,
      word_count: l.words?.[0]?.count ?? 0,
    }));

    return { success: true, data: lists };
  } catch (error) {
    console.error("getLists error:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all public lists (for HomeScreen - shows only public lists)
 * If is_public column doesn't exist, returns all lists
 * @returns {Promise<Object>} Lists data
 */
export const getAllPublicLists = async () => {
  try {
    // Get lists with word count
    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .select("*, words(count)")
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Error fetching all public lists:", error);
      throw error;
    }

    // Filter by is_public if column exists and is set to true
    // If column doesn't exist, all lists will have is_public as undefined/null
    // So we'll return all lists in that case
    const publicLists =
      data
        ?.filter((list) => {
          if (list.hasOwnProperty("is_public")) {
            return list.is_public === true;
          }
          return true;
        })
        .map((list) => ({
          ...list,
          word_count: list.words?.[0]?.count ?? 0,
        })) || [];

    return { success: true, data: publicLists };
  } catch (error) {
    console.error("getAllPublicLists error:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get a specific list by ID
 * @param {string} listId - List ID
 * @returns {Promise<Object>} List data
 */
export const getList = async (listId) => {
  try {
    const { data, error } = await supabase.from(TABLES.LISTS).select("*").eq("id", listId).single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Get list error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check if current user is the owner of a list
 * @param {string} listId - List ID
 * @returns {Promise<Object>} Ownership check result
 */
export const checkListOwnership = async (listId) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        isOwner: false,
        error: "User not authenticated",
      };
    }

    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .select("user_id")
      .eq("id", listId)
      .single();

    if (error) throw error;

    const isOwner = data?.user_id === user.id;
    return { success: true, isOwner };
  } catch (error) {
    console.error("Check list ownership error:", error.message);
    return { success: false, isOwner: false, error: error.message };
  }
};

/**
 * Create a new list
 * @param {Object} listData - List data
 * @returns {Promise<Object>} Created list
 */
export const createList = async (listData) => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .insert([
        {
          ...listData,
          user_id: user.id,
          inserted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Create list error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Update a list
 * @param {string} listId - List ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated list
 */
export const updateList = async (listId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .update(updates)
      .eq("id", listId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Update list error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a list
 * @param {string} listId - List ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteList = async (listId) => {
  try {
    const { error } = await supabase.from(TABLES.LISTS).delete().eq("id", listId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete list error:", error.message);
    return { success: false, error: error.message };
  }
};

// ==================== WORDS OPERATIONS ====================

/**
 * Get all words for a specific list
 * @param {string} listId - List ID
 * @returns {Promise<Object>} Words data
 */
export const getListWords = async (listId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORDS)
      .select("*")
      .eq("list_id", listId)
      .order("inserted_at", { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Get list words error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get a specific word by ID
 * @param {string} wordId - Word ID
 * @returns {Promise<Object>} Word data
 */
export const getWord = async (wordId) => {
  try {
    const { data, error } = await supabase.from(TABLES.WORDS).select("*").eq("id", wordId).single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Get word error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Create a new word
 * @param {Object} wordData - Word data
 * @returns {Promise<Object>} Created word
 */
export const createWord = async (wordData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORDS)
      .insert([
        {
          ...wordData,
          inserted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Create word error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Update a word
 * @param {string} wordId - Word ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated word
 */
export const updateWord = async (wordId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORDS)
      .update(updates)
      .eq("id", wordId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Update word error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a word
 * @param {string} wordId - Word ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteWord = async (wordId) => {
  try {
    const { error } = await supabase.from(TABLES.WORDS).delete().eq("id", wordId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete word error:", error.message);
    return { success: false, error: error.message };
  }
};

// ==================== USER INITIALIZATION ====================

/**
 * Create default lists for a new user
 * This function should be called after user registration
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Creation result
 */
// DEPRECATED: createDefaultLists kaldırıldı.
// Public seed listeler artık supabase/migrations/0001_schema.sql'de.
// Yeni kullanıcılara public listeler "Keşfet" sekmesinden zaten görünür.
export const createDefaultLists = async () => {
  return { success: true, data: [] };
};

/**
 * Check if user has any lists (to determine if default lists should be created)
 * @returns {Promise<Object>} Check result
 */
export const checkUserHasLists = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, hasLists: false };

    const { data, error } = await supabase
      .from(TABLES.LISTS)
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .limit(1);

    if (error) throw error;

    return { success: true, hasLists: data && data.length > 0 };
  } catch (error) {
    console.error("Check user lists error:", error.message);
    return { success: false, error: error.message, hasLists: false };
  }
};

// ==================== FAVORITES OPERATIONS ====================

/**
 * Get all favorites for the current user
 * @returns {Promise<Object>} Favorites data
 */
export const getFavorites = async () => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "User not authenticated", data: [] };
    }

    const { data, error } = await supabase
      .from(TABLES.FAVORITES)
      .select(
        `
        *,
        lists (*)
      `
      )
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Get favorites error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Add a list to favorites
 * @param {string} listId - List ID to favorite
 * @returns {Promise<Object>} Favorite data
 */
export const addFavorite = async (listId) => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from(TABLES.FAVORITES)
      .select("id")
      .eq("user_id", user.id)
      .eq("list_id", listId)
      .single();

    if (existing) {
      return { success: true, data: existing };
    }

    // Add to favorites
    const { data, error } = await supabase
      .from(TABLES.FAVORITES)
      .insert([
        {
          user_id: user.id,
          list_id: listId,
          inserted_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        lists (*)
      `
      )
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Add favorite error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a list from favorites
 * @param {string} listId - List ID to unfavorite
 * @returns {Promise<Object>} Delete result
 */
export const removeFavorite = async (listId) => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from(TABLES.FAVORITES)
      .delete()
      .eq("user_id", user.id)
      .eq("list_id", listId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Remove favorite error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a list is favorited by the current user
 * @param {string} listId - List ID to check
 * @returns {Promise<Object>} Check result
 */
export const isListFavorited = async (listId) => {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, isFavorited: false };
    }

    const { data, error } = await supabase
      .from(TABLES.FAVORITES)
      .select("id")
      .eq("user_id", user.id)
      .eq("list_id", listId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      throw error;
    }

    return { success: true, isFavorited: !!data };
  } catch (error) {
    console.error("Check favorite error:", error.message);
    return { success: false, error: error.message, isFavorited: false };
  }
};
