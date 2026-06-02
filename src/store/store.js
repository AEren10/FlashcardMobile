/**
 * Redux Store Configuration
 * Main store setup with Redux Toolkit
 */

import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
      },
    }),
});
