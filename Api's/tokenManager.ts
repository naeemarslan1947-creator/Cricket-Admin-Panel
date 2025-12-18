/**
 * Token Manager for handling authentication tokens
 * Manages token storage, retrieval, and updates
 */

class TokenManager {
  private static instance: TokenManager;
  private currentToken: string | null = null;
  private tokenListeners: Set<(token: string | null) => void> = new Set();

  private constructor() {
    // Load token from localStorage on initialization
    this.loadTokenFromStorage();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Set token from API response
   * @param token - Token from response (could be null/undefined to keep current token)
   * @param shouldPersist - Whether to persist token in localStorage
   */
  public setToken(token: string | null | undefined, shouldPersist: boolean = true): void {
    const newToken = token || null;
    
    // Only update if token actually changed
    if (this.currentToken !== newToken) {
      this.currentToken = newToken;
      
      if (shouldPersist && newToken) {
        localStorage.setItem('auth_token', newToken);
      } else if (!newToken) {
        localStorage.removeItem('auth_token');
      }
      
      // Notify all listeners about token change
      this.notifyTokenChange();
    }
  }


  /**
   * Get current authentication token
   * @returns Current token or null
   */
  public getToken(): string | null {
    // Debug logging
    console.log('TokenManager getToken:', {
      currentToken: this.currentToken,
      localStorageToken: localStorage.getItem('auth_token')
    });
    return this.currentToken;
  }

  /**
   * Clear token (logout)
   */
  public clearToken(): void {
    this.currentToken = null;
    localStorage.removeItem('auth_token');
    this.notifyTokenChange();
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if token exists
   */
  public isAuthenticated(): boolean {
    return !!this.currentToken;
  }

  /**
   * Add listener for token changes
   * @param callback - Function to call when token changes
   */
  public addTokenListener(callback: (token: string | null) => void): void {
    this.tokenListeners.add(callback);
  }

  /**
   * Remove token change listener
   * @param callback - Function to remove from listeners
   */
  public removeTokenListener(callback: (token: string | null) => void): void {
    this.tokenListeners.delete(callback);
  }



  /**
   * Extract token from API response data
   * @param responseData - Response data from API
   * @returns Extracted token or null
   */
  public extractTokenFromResponse(responseData: unknown): string | null {
    if (!responseData || typeof responseData !== 'object') return null;
    
    // Type assertion for responseData
    const data = responseData as Record<string, unknown>;
    
    // Check common token field names at root level
    const tokenFields = ['token', 'accessToken', 'authToken', 'bearerToken', 'jwt'];
    
    for (const field of tokenFields) {
      if (data[field] && typeof data[field] === 'string') {
        return data[field] as string;
      }
    }
    
    // Check nested in data object
    if (data.data && typeof data.data === 'object') {
      const nestedData = data.data as Record<string, unknown>;
      for (const field of tokenFields) {
        if (nestedData[field] && typeof nestedData[field] === 'string') {
          return nestedData[field] as string;
        }
      }
      
      // Check deeper nesting in result object
      if (nestedData.result && typeof nestedData.result === 'object') {
        const resultData = nestedData.result as Record<string, unknown>;
        for (const field of tokenFields) {
          if (resultData[field] && typeof resultData[field] === 'string') {
            return resultData[field] as string;
          }
        }
      }
      
      // Check for item object nesting
      if (nestedData.item && typeof nestedData.item === 'object') {
        const itemData = nestedData.item as Record<string, unknown>;
        for (const field of tokenFields) {
          if (itemData[field] && typeof itemData[field] === 'string') {
            return itemData[field] as string;
          }
        }
      }
    }
    
    // Check direct result object
    if (data.result && typeof data.result === 'object') {
      const resultData = data.result as Record<string, unknown>;
      for (const field of tokenFields) {
        if (resultData[field] && typeof resultData[field] === 'string') {
          return resultData[field] as string;
        }
      }
    }
    
    return null;
  }

  /**
   * Process API response and update token if available
   * @param responseData - Response data from API
   * @returns Updated token
   */
  public updateTokenFromResponse(responseData: unknown): string | null {
    const newToken = this.extractTokenFromResponse(responseData);
    if (newToken) {
      this.setToken(newToken);
      return newToken;
    }
    return this.currentToken;
  }

  private loadTokenFromStorage(): void {
    try {
      const storedToken = localStorage.getItem('auth_token');
      this.currentToken = storedToken;
    } catch (error) {
      console.warn('Failed to load token from localStorage:', error);
      this.currentToken = null;
    }
  }

  private notifyTokenChange(): void {
    this.tokenListeners.forEach(callback => {
      try {
        callback(this.currentToken);
      } catch (error) {
        console.error('Error in token listener:', error);
      }
    });
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export utility functions
export const getAuthToken = (): string | null => tokenManager.getToken();

export const setAuthToken = (token: string | null | undefined): void => 
  tokenManager.setToken(token);

export const clearAuthToken = (): void => tokenManager.clearToken();

export const isAuthenticated = (): boolean => tokenManager.isAuthenticated();
