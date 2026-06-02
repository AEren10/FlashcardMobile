/**
 * Typed Redux Hooks
 * Pre-typed hooks for use in components
 */

import { useDispatch, useSelector } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

