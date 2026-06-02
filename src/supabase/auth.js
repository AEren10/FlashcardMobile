/**
 * Supabase Authentication Functions
 * Handles all authentication-related operations
 */

import supabase from "./client";

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} Authentication result
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Additional user data
      },
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Sign up error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Sign in error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} Sign out result
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get the current user session
 * @returns {Promise<Object>} Current session
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    return { success: true, session };
  } catch (error) {
    console.error("Get session error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get the current user
 * @returns {Promise<Object>} Current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    return { success: true, user };
  } catch (error) {
    console.error("Get user error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Reset password for user
 * @param {string} email - User's email
 * @returns {Promise<Object>} Reset password result
 */
export const resetPassword = async (email) => {
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
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Update password result
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Update profile result
 */
export const updateProfile = async (updates) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error.message);
    return { success: false, error: error.message };
  }
};
