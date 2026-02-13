import type { WithSpringConfig, SharedValue } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle, TextStyle } from 'react-native';
/**
 * Shape variants for the spotlight cutout.
 */
export type SpotlightShape = 'rounded-rect' | 'circle' | 'pill';
/**
 * Customization options for the spotlight appearance.
 * Can be set globally via TourConfig or per-step via TourStep/TourZone.
 */
export interface SpotlightStyle {
    /**
     * Uniform padding around the highlighted element.
     * @default 8
     */
    padding?: number;
    /**
     * Top padding (overrides `padding` for top side).
     */
    paddingTop?: number;
    /**
     * Right padding (overrides `padding` for right side).
     */
    paddingRight?: number;
    /**
     * Bottom padding (overrides `padding` for bottom side).
     */
    paddingBottom?: number;
    /**
     * Left padding (overrides `padding` for left side).
     */
    paddingLeft?: number;
    /**
     * Border radius of the spotlight (for 'rounded-rect' shape).
     * @default 10
     */
    borderRadius?: number;
    /**
     * Shape of the spotlight cutout.
     * - 'rounded-rect': Standard rounded rectangle (default)
     * - 'circle': Circular spotlight that encompasses the element
     * - 'pill': Pill/capsule shape with fully rounded ends
     * @default 'rounded-rect'
     */
    shape?: SpotlightShape;
    /**
     * Width of the border/glow ring around the spotlight.
     * Set to 0 to disable.
     * @default 2
     */
    borderWidth?: number;
    /**
     * Color of the border/glow ring.
     * @default '#007AFF'
     */
    borderColor?: string;
    /**
     * Color of the outer glow effect.
     * @default '#007AFF'
     */
    glowColor?: string;
    /**
     * Opacity of the glow effect (0-1).
     * @default 0.4
     */
    glowOpacity?: number;
    /**
     * Blur radius for the glow effect.
     * @default 8
     */
    glowRadius?: number;
    /**
     * Spring damping for spotlight animations (per-step override).
     */
    springDamping?: number;
    /**
     * Spring stiffness for spotlight animations (per-step override).
     */
    springStiffness?: number;
}
export interface TourStep {
    /**
     * Unique key for this step.
     */
    key: string;
    /**
     * Optional display name/label for this step.
     */
    name?: string;
    /**
     * Description text to show in the tooltip.
     */
    description: string;
    /**
     * Optional order index. If not provided, registration order is used (or explicit ordering in context).
     */
    order?: number;
    /**
     * Optional data for custom tooltip rendering
     */
    meta?: any;
    /**
     * If true, allows user interaction with the target element.
     * If false, interactions are blocked (default behavior depends on global config).
     */
    clickable?: boolean;
    /**
     * If true, the skip button is hidden for this step (user must complete or press next).
     * @default false
     */
    required?: boolean;
    /**
     * Controls whether the next/finish button is enabled.
     * - `undefined`: No enforcement, next button always enabled (default).
     * - `false`: Next button is disabled (grayed out, non-pressable).
     * - `true`: Next button is enabled.
     *
     * Use this to gate progression until the user completes an action.
     */
    completed?: boolean;
    /**
     * Per-step spotlight style overrides.
     * Merged with global spotlightStyle from TourConfig.
     */
    spotlightStyle?: SpotlightStyle;
    /**
     * Custom render function for this step's tooltip/card.
     * Overrides the global renderCard from TourConfig.
     */
    renderCustomCard?: (props: CardProps) => React.ReactNode;
}
export interface MeasureResult {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type StepMap = Record<string, TourStep>;
/**
 * Steps order can be either:
 * - A flat array of step keys (single-screen tour): `['bio', 'prompt', 'poll']`
 * - A screen-grouped object (multi-screen tour): `{ ProfileSelf: ['bio', 'prompt'], HomeSwipe: ['filters'] }`
 */
export type StepsOrder = string[] | Record<string, string[]>;
export interface TourLabels {
    next?: string;
    previous?: string;
    finish?: string;
    skip?: string;
}
export interface TooltipStyles {
    /**
     * Background color of the tooltip
     */
    backgroundColor?: string;
    /**
     * Border radius of the tooltip (for shape customization)
     */
    borderRadius?: number;
    /**
     * Text color for the title
     */
    titleColor?: string;
    /**
     * Text color for the description
     */
    descriptionColor?: string;
    /**
     * Background color for the primary button
     */
    primaryButtonColor?: string;
    /**
     * Text color for the primary button
     */
    primaryButtonTextColor?: string;
    /**
     * Border radius for the primary button
     */
    primaryButtonBorderRadius?: number;
    /**
     * Text color for the skip button
     */
    skipButtonTextColor?: string;
    /**
     * Custom style for the tooltip container
     */
    containerStyle?: ViewStyle;
    /**
     * Custom style for the title text
     */
    titleStyle?: TextStyle;
    /**
     * Custom style for the description text
     */
    descriptionStyle?: TextStyle;
    /**
     * Custom style for the primary button
     */
    primaryButtonStyle?: ViewStyle;
    /**
     * Custom style for the primary button text
     */
    primaryButtonTextStyle?: TextStyle;
    /**
     * Custom style for the skip button
     */
    skipButtonStyle?: ViewStyle;
    /**
     * Custom style for the skip button text
     */
    skipButtonTextStyle?: TextStyle;
}
export interface CardProps {
    step: TourStep;
    currentStepIndex: number;
    totalSteps: number;
    next: () => void;
    prev: () => void;
    stop: () => void;
    isFirst: boolean;
    isLast: boolean;
    labels?: TourLabels;
    /**
     * Whether the step is required (skip button should be hidden).
     */
    required?: boolean;
    /**
     * Whether the step's completion condition is met.
     * - `undefined`: No enforcement, next button always enabled.
     * - `false`: Next button should be disabled.
     * - `true`: Next button should be enabled.
     */
    completed?: boolean;
}
/**
 * Storage adapter interface for tour persistence.
 * Compatible with MMKV v4 and AsyncStorage APIs.
 */
export interface StorageAdapter {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
}
/**
 * Configuration for tour progress persistence.
 */
export interface TourPersistenceConfig {
    /**
     * Enable persistence. When true, the library will auto-detect available storage
     * (MMKV v4 or AsyncStorage) and save/restore tour progress.
     * @default false
     */
    enabled: boolean;
    /**
     * Unique identifier for this tour. Used as the storage key.
     * Required when persistence is enabled.
     * @example 'onboarding-tour' or 'feature-tour-v2'
     */
    tourId: string;
    /**
     * Custom storage adapter. If not provided, the library will auto-detect
     * MMKV v4 or AsyncStorage.
     */
    storage?: StorageAdapter;
    /**
     * If true, automatically resume the tour from the saved step when start() is called
     * without a specific step key.
     * @default true
     */
    autoResume?: boolean;
    /**
     * If true, clear saved progress when the tour is completed (reaches the last step).
     * @default true
     */
    clearOnComplete?: boolean;
    /**
     * Maximum age (in milliseconds) for saved progress. Progress older than this
     * will be ignored and cleared.
     * @default undefined (no expiration)
     * @example 7 * 24 * 60 * 60 * 1000 // 7 days
     */
    maxAge?: number;
}
export interface TourConfig {
    /**
     * Animation configuration for the spotlight movement.
     */
    springConfig?: WithSpringConfig;
    /**
     * If true, prevents interaction with the underlying app while tour is active.
     * Default: false (interactions allowed outside the tooltip, but overlay might block them depending on implementation).
     */
    preventInteraction?: boolean;
    /**
     * Custom labels for buttons.
     */
    labels?: TourLabels;
    /**
     * Custom renderer for the card/tooltip.
     */
    renderCard?: (props: CardProps) => React.ReactNode;
    /**
     * Backdrop opacity. Default 0.5
     */
    backdropOpacity?: number;
    /**
     * Custom styles for the tooltip appearance
     */
    tooltipStyles?: TooltipStyles;
    /**
     * Global spotlight style settings.
     * Can be overridden per-step via TourStep.spotlightStyle or TourZone props.
     */
    spotlightStyle?: SpotlightStyle;
    /**
     * Persistence configuration for saving/restoring tour progress.
     * Supports MMKV v4 and AsyncStorage out of the box.
     */
    persistence?: TourPersistenceConfig;
}
export interface TourContextType {
    /**
     * Starts the tour at the first step or a specific step (by key).
     * If persistence is enabled and autoResume is true, will resume from saved progress.
     */
    start: (stepKey?: string) => void;
    /**
     * Stops the tour and hides the overlay.
     * Does NOT clear saved progress (use clearProgress for that).
     */
    stop: () => void;
    /**
     * Advances to the next step.
     */
    next: () => void;
    /**
     * Goes back to the previous step.
     */
    prev: () => void;
    /**
     * Registers a zone/step.
     */
    registerStep: (step: TourStep) => void;
    /**
     * Unregisters a zone/step.
     */
    unregisterStep: (key: string) => void;
    /**
     * Updates the layout of a specific step.
     * This is called by TourZone on layout/mount.
     */
    updateStepLayout: (key: string, measure: MeasureResult) => void;
    /**
     * The current active step key, or null if tour is inactive.
     */
    currentStep: string | null;
    /**
     * Map of registered steps.
     */
    steps: StepMap;
    /**
     * Global tour configuration
     */
    config?: TourConfig;
    /**
     * Animated ref to attach to your ScrollView for auto-scrolling.
     * Use this ref directly on your ScrollView/Animated.ScrollView component.
     * For custom scroll view components, use the useTourScrollView hook instead.
     */
    scrollViewRef: React.RefObject<any>;
    /**
     * @deprecated Use scrollViewRef directly instead.
     * Registers the main ScrollView ref for auto-scrolling
     */
    setScrollViewRef: (ref: any) => void;
    /**
     * Clears any saved tour progress from storage.
     * Only available when persistence is enabled.
     */
    clearProgress: () => Promise<void>;
    /**
     * Whether there is saved progress available to resume.
     * Only meaningful when persistence is enabled.
     */
    hasSavedProgress: boolean;
    /**
     * The full ordered list of step keys for this tour.
     * Derived from stepsOrder prop or step registration order.
     * Includes all steps across all screens (for multi-screen tours).
     */
    orderedStepKeys: string[];
}
export interface InternalTourContextType extends TourContextType {
    targetX: SharedValue<number>;
    targetY: SharedValue<number>;
    targetWidth: SharedValue<number>;
    targetHeight: SharedValue<number>;
    targetRadius: SharedValue<number>;
    opacity: SharedValue<number>;
    /** Border width for the spotlight glow ring */
    spotlightBorderWidth: SharedValue<number>;
    containerRef: React.RefObject<any>;
    scrollViewRef: React.RefObject<any>;
    setScrollViewRef: (ref: any) => void;
    /** Resolved spotlight style for the current step */
    currentSpotlightStyle: SpotlightStyle | null;
}
//# sourceMappingURL=index.d.ts.map