/**
 * Storage adapter for tour persistence.
 * Auto-detects available storage (MMKV v4 or AsyncStorage) and provides a unified interface.
 */
export type StorageType = 'mmkv' | 'async-storage' | 'custom' | 'none';
export interface StorageAdapter {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
}
export interface TourStorageState {
    tourId: string;
    currentStepKey: string;
    stepIndex: number;
    timestamp: number;
}
/**
 * Detects the available storage type and returns an adapter.
 * Priority: MMKV v4 > AsyncStorage > none
 */
export declare function detectStorage(): {
    type: StorageType;
    adapter: StorageAdapter | null;
};
/**
 * Clears the cached storage detection result.
 * Useful for testing or when storage availability changes.
 */
export declare function clearStorageCache(): void;
/**
 * Generates a storage key for a specific tour.
 */
export declare function getTourStorageKey(tourId: string): string;
/**
 * Saves the current tour progress to storage.
 */
export declare function saveTourProgress(adapter: StorageAdapter, tourId: string, currentStepKey: string, stepIndex: number): Promise<void>;
/**
 * Loads the saved tour progress from storage.
 * Returns null if no progress is saved or if the data is invalid.
 */
export declare function loadTourProgress(adapter: StorageAdapter, tourId: string): Promise<TourStorageState | null>;
/**
 * Clears the saved tour progress from storage.
 */
export declare function clearTourProgress(adapter: StorageAdapter, tourId: string): Promise<void>;
/**
 * Checks if there is saved progress for a tour.
 */
export declare function hasTourProgress(adapter: StorageAdapter, tourId: string): Promise<boolean>;
//# sourceMappingURL=storage.d.ts.map