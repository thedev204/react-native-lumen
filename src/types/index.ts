import type { WithSpringConfig, SharedValue } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

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
}

export interface MeasureResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type StepMap = Record<string, TourStep>;

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
}

export interface TourContextType {
  /**
   * Starts the tour at the first step or a specific step (by key).
   */
  start: (stepKey?: string) => void;
  /**
   * Stops the tour and hides the overlay.
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
   * Registers the main ScrollView ref for auto-scrolling
   */
  setScrollViewRef: (ref: any) => void;
}

export interface InternalTourContextType extends TourContextType {
  targetX: SharedValue<number>;
  targetY: SharedValue<number>;
  targetWidth: SharedValue<number>;
  targetHeight: SharedValue<number>;
  targetRadius: SharedValue<number>;
  opacity: SharedValue<number>;
  containerRef: React.RefObject<any>;
  scrollViewRef: React.RefObject<any>;
  setScrollViewRef: (ref: any) => void;
}
