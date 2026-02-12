import React from 'react';
import type { TourConfig } from '../types';
interface TourProviderProps {
    children: React.ReactNode;
    /**
     * Optional custom steps order. If provided, the tour will follow this array of keys.
     */
    stepsOrder?: string[];
    /**
     * Initial overlay opacity. Default 0.5
     */
    backdropOpacity?: number;
    /**
     * Global configuration for the tour.
     */
    config?: TourConfig;
}
export declare const TourProvider: React.FC<TourProviderProps>;
export {};
//# sourceMappingURL=TourProvider.d.ts.map