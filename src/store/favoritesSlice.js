/**
 * Favorites Slice
 * Redux Toolkit slice for managing favorite lists
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../supabase/database";

// Async thunks for API calls
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getFavorites();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async ({ listId, isFavorite }, { rejectWithValue }) => {
    try {
      if (isFavorite) {
        // Remove from favorites
        const result = await removeFavorite(listId);
        if (result.success) {
          return { listId, action: "remove" };
        } else {
          return rejectWithValue({ listId, isFavorite, error: result.error });
        }
      } else {
        // Add to favorites
        const result = await addFavorite(listId);
        if (result.success) {
          return { listId, action: "add", data: result.data };
        } else {
          return rejectWithValue({ listId, isFavorite, error: result.error });
        }
      }
    } catch (error) {
      return rejectWithValue({ listId, isFavorite, error: error.message });
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favoriteListIds: [], // Array of list IDs that are favorited
    favoriteLists: [], // Full list objects
    loading: false,
    error: null,
  },
  reducers: {
    // Clear favorites when user logs out
    clearFavorites: (state) => {
      state.favoriteListIds = [];
      state.favoriteLists = [];
      state.error = null;
    },
    // Set favorites from local storage or cache
    setFavorites: (state, action) => {
      state.favoriteListIds = action.payload.ids || [];
      state.favoriteLists = action.payload.lists || [];
    },
  },
  extraReducers: (builder) => {
    // Fetch favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteLists = action.payload || [];
        state.favoriteListIds = action.payload?.map((fav) => fav.list_id) || [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle favorite — OPTIMISTIC: UI'da hemen güncelle, fail olursa rollback
    builder
      .addCase(toggleFavorite.pending, (state, action) => {
        // Optimistic update — server'ı beklemeden state'i değiştir
        state.error = null;
        const { listId, isFavorite } = action.meta.arg;
        if (isFavorite) {
          // Was favorite, removing
          state.favoriteListIds = state.favoriteListIds.filter((id) => id !== listId);
          state.favoriteLists = state.favoriteLists.filter((fav) => fav.list_id !== listId);
        } else {
          // Was not favorite, adding (placeholder until server confirms data)
          if (!state.favoriteListIds.includes(listId)) {
            state.favoriteListIds.push(listId);
          }
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // Server confirmed — sadece "add" case'inde data ile favoriteLists'i güncelle
        const { listId, action: favoriteAction, data } = action.payload;
        if (favoriteAction === "add" && data) {
          if (!state.favoriteLists.find((fav) => fav.list_id === listId)) {
            state.favoriteLists.push(data);
          }
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        // ROLLBACK — optimistic update'i geri al
        const payload = action.payload || {};
        const { listId, isFavorite } = payload;
        state.error = payload.error || "Favori güncellenemedi";
        if (listId == null) return;
        if (isFavorite) {
          // Remove had failed — geri ekle
          if (!state.favoriteListIds.includes(listId)) {
            state.favoriteListIds.push(listId);
          }
        } else {
          // Add had failed — geri çıkar
          state.favoriteListIds = state.favoriteListIds.filter((id) => id !== listId);
          state.favoriteLists = state.favoriteLists.filter((fav) => fav.list_id !== listId);
        }
      });
  },
});

export const { clearFavorites, setFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavoriteListIds = (state) => state.favorites.favoriteListIds;
export const selectFavoriteLists = (state) => state.favorites.favoriteLists;
export const selectIsFavorite = (state, listId) =>
  state.favorites.favoriteListIds.includes(listId);
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;

