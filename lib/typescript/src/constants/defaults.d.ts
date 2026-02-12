import type { WithSpringConfig } from 'react-native-reanimated';
import type { SpotlightStyle } from '../types';
export declare const DEFAULT_SPRING_CONFIG: WithSpringConfig;
export declare const DEFAULT_BACKDROP_OPACITY = 0.5;
export declare const DEFAULT_LABELS: {
    next: string;
    previous: string;
    finish: string;
    skip: string;
};
/**
 * Default spotlight style configuration.
 * These values are used when no custom style is provided.
 */
export declare const DEFAULT_SPOTLIGHT_STYLE: Required<SpotlightStyle>;
/**
 * Merges global and per-step spotlight styles with defaults.
 */
export declare function resolveSpotlightStyle(globalStyle?: SpotlightStyle, stepStyle?: SpotlightStyle): Required<SpotlightStyle>;
//# sourceMappingURL=defaults.d.ts.map