"use strict";

export const DEFAULT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 90
};
export const DEFAULT_BACKDROP_OPACITY = 0.5;
export const DEFAULT_LABELS = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  skip: 'Skip'
};

/**
 * Default spotlight style configuration.
 * These values are used when no custom style is provided.
 */
export const DEFAULT_SPOTLIGHT_STYLE = {
  padding: 8,
  paddingTop: 8,
  paddingRight: 8,
  paddingBottom: 8,
  paddingLeft: 8,
  borderRadius: 10,
  shape: 'rounded-rect',
  borderWidth: 2,
  borderColor: '#007AFF',
  glowColor: '#007AFF',
  glowOpacity: 0.4,
  glowRadius: 8,
  springDamping: 20,
  springStiffness: 90
};

/**
 * Merges global and per-step spotlight styles with defaults.
 */
export function resolveSpotlightStyle(globalStyle, stepStyle) {
  const merged = {
    ...DEFAULT_SPOTLIGHT_STYLE,
    ...globalStyle,
    ...stepStyle
  };

  // Handle individual padding overrides
  return {
    ...merged,
    paddingTop: stepStyle?.paddingTop ?? globalStyle?.paddingTop ?? merged.padding,
    paddingRight: stepStyle?.paddingRight ?? globalStyle?.paddingRight ?? merged.padding,
    paddingBottom: stepStyle?.paddingBottom ?? globalStyle?.paddingBottom ?? merged.padding,
    paddingLeft: stepStyle?.paddingLeft ?? globalStyle?.paddingLeft ?? merged.padding
  };
}
//# sourceMappingURL=defaults.js.map