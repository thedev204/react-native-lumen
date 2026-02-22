import type { WithSpringConfig } from 'react-native-reanimated';
import type { ZoneStyle } from '../types';

export const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 90,
};

export const DEFAULT_BACKDROP_OPACITY = 0.5;

export const DEFAULT_LABELS = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  skip: 'Skip',
};

/**
 * Default zone style configuration.
 * These values are used when no custom style is provided.
 */
export const DEFAULT_ZONE_STYLE: Required<ZoneStyle> = {
  padding: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  borderRadius: 10,
  shape: 'rounded-rect',
  borderWidth: 0,
  borderColor: 'transparent',
  glowColor: '#FFFFFF',
  glowRadius: 10,
  glowSpread: 5,
  glowOffsetX: 0,
  glowOffsetY: 0,
  springDamping: 20,
  springStiffness: 90,
};

/**
 * Merges global and per-step zone styles with defaults.
 */
export function resolveZoneStyle(
  globalStyle?: ZoneStyle,
  stepStyle?: ZoneStyle
): Required<ZoneStyle> {
  const merged = {
    ...DEFAULT_ZONE_STYLE,
    ...globalStyle,
    ...stepStyle,
  };

  // Handle individual padding overrides
  return {
    ...merged,
    paddingTop:
      stepStyle?.paddingTop ?? globalStyle?.paddingTop ?? merged.padding,
    paddingRight:
      stepStyle?.paddingRight ?? globalStyle?.paddingRight ?? merged.padding,
    paddingBottom:
      stepStyle?.paddingBottom ?? globalStyle?.paddingBottom ?? merged.padding,
    paddingLeft:
      stepStyle?.paddingLeft ?? globalStyle?.paddingLeft ?? merged.padding,
  };
}
