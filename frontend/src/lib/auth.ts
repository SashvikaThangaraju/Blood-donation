// src/lib/auth.ts

const TOKEN_KEY = 'admin_auth_token';

/**
 * Saves the JWT token to local storage.
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token to local storage", error);
  }
}

/**
 * Retrieves the JWT token from local storage.
 * @returns The token string, or null if it doesn't exist.
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving token from local storage", error);
    return null;
  }
}

/**
 * Removes the JWT token from local storage.
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token from local storage", error);
  }
}

