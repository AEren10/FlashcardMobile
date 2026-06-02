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
          return rejectWithValue(result.error);
        }
      } else {
        // Add to favorites
        const result = await addFavorite(listId);
        if (result.success) {
          return { listId, action: "add", data: result.data };
        } else {
          return rejectWithValue(result.error);
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
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

    // Toggle favorite
    builder
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        const { listId, action: favoriteAction, data } = action.payload;

        if (favoriteAction === "add") {
          // Add to favorites
          if (!state.favoriteListIds.includes(listId)) {
            state.favoriteListIds.push(listId);
          }
          if (data && !state.favoriteLists.find((fav) => fav.list_id === listId)) {
            state.favoriteLists.push(data);
          }
        } else if (favoriteAction === "remove") {
          // Remove from favorites
          state.favoriteListIds = state.favoriteListIds.filter(
            (id) => id !== listId
          );
          state.favoriteLists = state.favoriteLists.filter(
            (fav) => fav.list_id !== listId
          );
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

