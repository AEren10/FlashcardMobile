/**
 * Supabase API Service
 * Replaces the old axios-based API service with Supabase operations
 * This service provides a clean interface for all data operations
 */

import {
  getLists as supabaseGetLists,
  getAllPublicLists as supabaseGetAllPublicLists,
  getList as supabaseGetList,
  checkListOwnership as supabaseCheckListOwnership,
  getListWords as supabaseGetListWords,
  createList as supabaseCreateList,
  updateList as supabaseUpdateList,
  deleteList as supabaseDeleteList,
  getWord as supabaseGetWord,
  createWord as supabaseCreateWord,
  updateWord as supabaseUpdateWord,
  deleteWord as supabaseDeleteWord,
  createDefaultLists as supabaseCreateDefaultLists,
  checkUserHasLists as supabaseCheckUserHasLists,
} from "../supabase/database";

import {
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getCurrentSession as supabaseGetCurrentSession,
  getCurrentUser as supabaseGetCurrentUser,
  resetPassword as supabaseResetPassword,
  updatePassword as supabaseUpdatePassword,
  updateProfile as supabaseUpdateProfile,
} from "../supabase/auth";

class SupabaseApiService {
  // ==================== AUTHENTICATION ====================

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    const { email, password, ...metadata } = userData;
    return await supabaseSignUp(email, password, metadata);
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    const { email, password } = credentials;
    return await supabaseSignIn(email, password);
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    return await supabaseSignOut();
  }

  /**
   * Get current user session
   * @returns {Promise<Object>} Current session
   */
  async getCurrentSession() {
    return await supabaseGetCurrentSession();
  }

  /**
   * Get current user
   * @returns {Promise<Object>} Current user
   */
  async getCurrentUser() {
    return await supabaseGetCurrentUser();
  }

  /**
   * Reset user password
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(email) {
    return await supabaseResetPassword(email);
  }

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Update result
   */
  async updatePassword(newPassword) {
    return await supabaseUpdatePassword(newPassword);
  }

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(updates) {
    return await supabaseUpdateProfile(updates);
  }

  // ==================== LISTS ====================

  /**
   * Get all lists for the current user
   * @returns {Promise<Object>} Lists data
   */
  async getLists() {
    return await supabaseGetLists();
  }

  /**
   * Get all public lists (for HomeScreen - shows all available lists)
   * @returns {Promise<Object>} Lists data
   */
  async getAllPublicLists() {
    return await supabaseGetAllPublicLists();
  }

  /**
   * Get a specific list by ID
   * @param {string} id - List ID
   * @returns {Promise<Object>} List data
   */
  async getList(id) {
    return await supabaseGetList(id);
  }

  /**
   * Check if current user owns a list
   * @param {string} id - List ID
   * @returns {Promise<Object>} Ownership check result
   */
  async checkListOwnership(id) {
    return await supabaseCheckListOwnership(id);
  }

  /**
   * Create a new list
   * @param {Object} listData - List data
   * @returns {Promise<Object>} Created list
   */
  async createList(listData) {
    return await supabaseCreateList(listData);
  }

  /**
   * Update a list
   * @param {string} id - List ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated list
   */
  async updateList(id, updates) {
    return await supabaseUpdateList(id, updates);
  }

  /**
   * Delete a list
   * @param {string} id - List ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteList(id) {
    return await supabaseDeleteList(id);
  }

  // ==================== WORDS ====================

  /**
   * Get a specific word by ID
   * @param {string} id - Word ID
   * @returns {Promise<Object>} Word data
   */
  async getWord(id) {
    return await supabaseGetWord(id);
  }

  /**
   * Create a new word
   * @param {Object} wordData - Word data
   * @returns {Promise<Object>} Created word
   */
  async createWord(wordData) {
    return await supabaseCreateWord(wordData);
  }

  /**
   * Update a word
   * @param {string} id - Word ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated word
   */
  async updateWord(id, updates) {
    return await supabaseUpdateWord(id, updates);
  }

  /**
   * Delete a word
   * @param {string} id - Word ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteWord(id) {
    return await supabaseDeleteWord(id);
  }

  // ==================== USER SETUP ====================

  /**
   * Create default lists for a new user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Creation result
   */
  async createDefaultLists(userId) {
    return await supabaseCreateDefaultLists(userId);
  }

  /**
   * Check if user has any lists
   * @returns {Promise<Object>} Check result
   */
  async checkUserHasLists() {
    return await supabaseCheckUserHasLists();
  }

  // ==================== COMPATIBILITY METHODS ====================
  // These methods maintain compatibility with the old API interface

  /**
   * Legacy method - maps to getListWords
   * @param {string} id - List ID
   * @returns {Promise<Object>} Words data
   */
  async getListWords(id) {
    return await supabaseGetListWords(id);
  }
}

// Create and export singleton instance
const supabaseApiService = new SupabaseApiService();
export default supabaseApiService;

// Named exports for convenience
export const {
  // Auth
  register,
  login,
  logout,
  getCurrentSession,
  getCurrentUser,
  resetPassword,
  updatePassword,
  updateProfile,
  
  // Lists
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  
  // Words
  getListWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
  
  // User setup
  createDefaultLists,
  checkUserHasLists,
} = supabaseApiService;
