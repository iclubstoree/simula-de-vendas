import { useState, useEffect, useCallback } from 'react';

// Type for localStorage hook return value
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}

// Configuration options for localStorage hook
export interface UseLocalStorageOptions<T> {
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  onError?: (error: Error) => void;
  syncAcrossTabs?: boolean;
}

/**
 * Custom hook for managing localStorage with TypeScript support
 *
 * @param key - The localStorage key
 * @param options - Configuration options
 * @returns Object with value, setValue, removeValue, isLoading, and error
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): UseLocalStorageReturn<T> {
  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError,
    syncAcrossTabs = true
  } = options;

  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const parsedValue = deserialize(item);
        setValue(parsedValue);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read from localStorage';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [key, deserialize, onError]);

  // Set value function
  const setStoredValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      const serializedValue = serialize(valueToStore);
      localStorage.setItem(key, serializedValue);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to write to localStorage';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [key, serialize, value, onError]);

  // Remove value function
  const removeStoredValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from localStorage';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [key, defaultValue, onError]);

  // Listen for storage changes across tabs
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          setValue(newValue);
          setError(null);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to sync from other tab';
          setError(errorMessage);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed in another tab
        setValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, deserialize, onError, syncAcrossTabs]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    isLoading,
    error
  };
}

// Specialized hooks for common data types

/**
 * Hook for storing arrays in localStorage
 */
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
): UseLocalStorageReturn<T[]> & {
  addItem: (item: T) => void;
  removeItem: (predicate: (item: T) => boolean) => void;
  updateItem: (predicate: (item: T) => boolean, updater: (item: T) => T) => void;
  clearArray: () => void;
} {
  const storageResult = useLocalStorage(key, { defaultValue });

  const addItem = useCallback((item: T) => {
    storageResult.setValue(prev => [...prev, item]);
  }, [storageResult]);

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    storageResult.setValue(prev => prev.filter(item => !predicate(item)));
  }, [storageResult]);

  const updateItem = useCallback((predicate: (item: T) => boolean, updater: (item: T) => T) => {
    storageResult.setValue(prev =>
      prev.map(item => predicate(item) ? updater(item) : item)
    );
  }, [storageResult]);

  const clearArray = useCallback(() => {
    storageResult.setValue([]);
  }, [storageResult]);

  return {
    ...storageResult,
    addItem,
    removeItem,
    updateItem,
    clearArray
  };
}

/**
 * Hook for storing recent searches
 */
export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: string;
  results?: number;
}

export function useRecentSearches(
  key: string,
  maxItems: number = 10
): {
  searches: RecentSearchItem[];
  addSearch: (query: string, results?: number) => void;
  removeSearch: (id: string) => void;
  clearSearches: () => void;
  isLoading: boolean;
  error: string | null;
} {
  const { value, setValue, isLoading, error } = useLocalStorage<RecentSearchItem[]>(key, {
    defaultValue: []
  });

  const addSearch = useCallback((query: string, results?: number) => {
    const searchItem: RecentSearchItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date().toISOString(),
      results
    };

    setValue(prev => {
      // Remove existing search with same query
      const filtered = prev.filter(item =>
        item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new search at beginning and limit to maxItems
      return [searchItem, ...filtered].slice(0, maxItems);
    });
  }, [setValue, maxItems]);

  const removeSearch = useCallback((id: string) => {
    setValue(prev => prev.filter(item => item.id !== id));
  }, [setValue]);

  const clearSearches = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return {
    searches: value,
    addSearch,
    removeSearch,
    clearSearches,
    isLoading,
    error
  };
}

/**
 * Hook for storing user preferences
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  itemsPerPage?: number;
  defaultStore?: string;
  defaultCardMachine?: string;
  [key: string]: unknown;
}

export function useUserPreferences(
  key: string = 'user-preferences'
): UseLocalStorageReturn<UserPreferences> & {
  setPreference: <K extends keyof UserPreferences>(
    preferenceKey: K,
    value: UserPreferences[K]
  ) => void;
  getPreference: <K extends keyof UserPreferences>(
    preferenceKey: K,
    defaultValue?: UserPreferences[K]
  ) => UserPreferences[K];
} {
  const storageResult = useLocalStorage<UserPreferences>(key, {
    defaultValue: {}
  });

  const setPreference = useCallback(<K extends keyof UserPreferences>(
    preferenceKey: K,
    value: UserPreferences[K]
  ) => {
    storageResult.setValue(prev => ({
      ...prev,
      [preferenceKey]: value
    }));
  }, [storageResult]);

  const getPreference = useCallback(<K extends keyof UserPreferences>(
    preferenceKey: K,
    defaultValue?: UserPreferences[K]
  ) => {
    return storageResult.value[preferenceKey] ?? defaultValue;
  }, [storageResult.value]);

  return {
    ...storageResult,
    setPreference,
    getPreference
  };
}

// Utility functions for localStorage management
export const localStorageUtils = {
  /**
   * Get all keys from localStorage with optional prefix filter
   */
  getAllKeys: (prefix?: string): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  },

  /**
   * Clear all localStorage items with optional prefix filter
   */
  clearAll: (prefix?: string): void => {
    const keys = localStorageUtils.getAllKeys(prefix);
    keys.forEach(key => localStorage.removeItem(key));
  },

  /**
   * Get localStorage usage information
   */
  getUsageInfo: (): { used: number; total: number; percentage: number } => {
    let totalSize = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Most browsers limit localStorage to 5-10MB
    const estimatedLimit = 5 * 1024 * 1024; // 5MB

    return {
      used: totalSize,
      total: estimatedLimit,
      percentage: Math.round((totalSize / estimatedLimit) * 100)
    };
  },

  /**
   * Test if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};