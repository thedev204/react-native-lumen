import React from 'react';
import type { TourConfig, StepsOrder } from '../types';
interface TourProviderProps {
    children: React.ReactNode;
    /**
     * Optional custom steps order. Supports two formats:
     *
     * **Flat array** (single-screen or simple multi-screen):
     * ```
     * stepsOrder={['bio', 'prompt', 'poll', 'filters', 'swipeableCards']}
     * ```
     *
     * **Screen-grouped object** (multi-screen tours):
     * ```
     * stepsOrder={{
     *   ProfileSelf: ['bio', 'prompt', 'poll'],
     *   HomeSwipe: ['filters'],
     *   SwipeableCards: ['swipeableCards'],
     * }}
     * ```
     *
     * When using the object format, steps are flattened in the order the screens appear.
     * The tour automatically waits when advancing to a step on an unmounted screen,
     * and resumes when that step's TourZone mounts.
     */
    stepsOrder?: StepsOrder;
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