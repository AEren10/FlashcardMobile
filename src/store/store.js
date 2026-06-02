/**
 * Redux Store Configuration
 * Main store setup with Redux Toolkit
 */

import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import favoriteWordsReducer from "./favoriteWordsSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    favoriteWords: favoriteWordsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
      },
    }),
});
