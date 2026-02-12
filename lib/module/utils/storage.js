"use strict";

/**
 * Storage adapter for tour persistence.
 * Auto-detects available storage (MMKV v4 or AsyncStorage) and provides a unified interface.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

// ─── Storage Detection ───────────────────────────────────────────────────────

let cachedStorageType = null;
let cachedAdapter = null;

/**
 * Attempts to detect and return the MMKV v4 default instance.
 * Returns null if MMKV is not available.
 */
function tryGetMMKV() {
  try {
    // Try to require react-native-mmkv (v4 uses different API)

    const mmkvModule = require('react-native-mmkv');

    // MMKV v4 exports createMMKV function
    if (mmkvModule?.createMMKV) {
      const createMMKV = mmkvModule.createMMKV;
      // Create a dedicated instance for tour storage
      const storage = createMMKV({
        id: 'react-native-lumen-tour'
      });
      if (typeof storage.getString === 'function' && typeof storage.set === 'function' && typeof storage.remove === 'function') {
        return {
          getItem: key => storage.getString(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
          removeItem: key => storage.remove(key)
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Attempts to detect and return AsyncStorage.
 * Returns null if AsyncStorage is not available.
 */
function tryGetAsyncStorage() {
  try {
    // Try to require @react-native-async-storage/async-storage

    const asyncStorageModule = require('@react-native-async-storage/async-storage');
    const AsyncStorage = asyncStorageModule?.default || asyncStorageModule;
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function' && typeof AsyncStorage.setItem === 'function' && typeof AsyncStorage.removeItem === 'function') {
      return {
        getItem: key => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: key => AsyncStorage.removeItem(key)
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Detects the available storage type and returns an adapter.
 * Priority: MMKV v4 > AsyncStorage > none
 */
export function detectStorage() {
  // Return cached result if available
  if (cachedStorageType !== null) {
    return {
      type: cachedStorageType,
      adapter: cachedAdapter
    };
  }

  // Try MMKV first (fastest)
  const mmkvAdapter = tryGetMMKV();
  if (mmkvAdapter) {
    cachedStorageType = 'mmkv';
    cachedAdapter = mmkvAdapter;
    return {
      type: 'mmkv',
      adapter: mmkvAdapter
    };
  }

  // Try AsyncStorage
  const asyncStorageAdapter = tryGetAsyncStorage();
  if (asyncStorageAdapter) {
    cachedStorageType = 'async-storage';
    cachedAdapter = asyncStorageAdapter;
    return {
      type: 'async-storage',
      adapter: asyncStorageAdapter
    };
  }

  // No storage available
  cachedStorageType = 'none';
  cachedAdapter = null;
  return {
    type: 'none',
    adapter: null
  };
}

/**
 * Clears the cached storage detection result.
 * Useful for testing or when storage availability changes.
 */
export function clearStorageCache() {
  cachedStorageType = null;
  cachedAdapter = null;
}

// ─── Storage Key Generation ──────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = '@lumen_tour_';

/**
 * Generates a storage key for a specific tour.
 */
export function getTourStorageKey(tourId) {
  return `${STORAGE_KEY_PREFIX}${tourId}`;
}

// ─── Storage Operations ──────────────────────────────────────────────────────

/**
 * Saves the current tour progress to storage.
 */
export async function saveTourProgress(adapter, tourId, currentStepKey, stepIndex) {
  const state = {
    tourId,
    currentStepKey,
    stepIndex,
    timestamp: Date.now()
  };
  const key = getTourStorageKey(tourId);
  const value = JSON.stringify(state);
  await adapter.setItem(key, value);
}

/**
 * Loads the saved tour progress from storage.
 * Returns null if no progress is saved or if the data is invalid.
 */
export async function loadTourProgress(adapter, tourId) {
  try {
    const key = getTourStorageKey(tourId);
    const value = await adapter.getItem(key);
    if (!value) {
      return null;
    }
    const state = JSON.parse(value);

    // Validate the loaded state
    if (state.tourId !== tourId || typeof state.currentStepKey !== 'string' || typeof state.stepIndex !== 'number') {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

/**
 * Clears the saved tour progress from storage.
 */
export async function clearTourProgress(adapter, tourId) {
  const key = getTourStorageKey(tourId);
  await adapter.removeItem(key);
}

/**
 * Checks if there is saved progress for a tour.
 */
export async function hasTourProgress(adapter, tourId) {
  const progress = await loadTourProgress(adapter, tourId);
  return progress !== null;
}
//# sourceMappingURL=storage.js.map