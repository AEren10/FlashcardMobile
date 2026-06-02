/**
 * Favorite Words Slice — kelime bazında favori (liste favorisinden ayrı).
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavoriteWordIds,
  addFavoriteWord,
  removeFavoriteWord,
} from "../supabase/wordFavorites";

export const fetchFavoriteWordIds = createAsyncThunk(
  "favoriteWords/fetchIds",
  async (_, { rejectWithValue }) => {
    const res = await getFavoriteWordIds();
    if (res.success) return res.data;
    return rejectWithValue(res.error);
  }
);

export const toggleFavoriteWord = createAsyncThunk(
  "favoriteWords/toggle",
  async ({ wordId, listId, isFavorite }, { rejectWithValue }) => {
    const res = isFavorite
      ? await removeFavoriteWord(wordId)
      : await addFavoriteWord(wordId, listId);
    if (res.success) {
      return { wordId, action: isFavorite ? "remove" : "add" };
    }
    return rejectWithValue(res.error);
  }
);

const slice = createSlice({
  name: "favoriteWords",
  initialState: {
    ids: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavoriteWords: (state) => {
      state.ids = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteWordIds.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchFavoriteWordIds.fulfilled, (s, a) => {
        s.loading = false;
        s.ids = a.payload || [];
      })
      .addCase(fetchFavoriteWordIds.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(toggleFavoriteWord.fulfilled, (s, a) => {
        const { wordId, action } = a.payload;
        if (action === "add") {
          if (!s.ids.includes(wordId)) s.ids.push(wordId);
        } else {
          s.ids = s.ids.filter((id) => id !== wordId);
        }
      });
  },
});

export const { clearFavoriteWords } = slice.actions;

export const selectFavoriteWordIds = (st) => st.favoriteWords.ids;
export const selectIsWordFavorite = (st, wordId) =>
  st.favoriteWords.ids.includes(wordId);

export default slice.reducer;
