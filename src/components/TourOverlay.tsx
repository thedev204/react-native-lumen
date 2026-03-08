import { memo, type ComponentType, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTour } from '../hooks/useTour';
import type { InternalTourContextType } from '../types';
import { DEFAULT_ZONE_STYLE } from '../constants/defaults';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.View as unknown as ComponentType<any>;

// SVG rounded-rect path with a cutout hole (fillRule="evenodd")
const createRoundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  'worklet';
  const radius = Math.min(r, w / 2, h / 2);
  return `
    M ${x + radius}, ${y}
    H ${x + w - radius}
    A ${radius} ${radius} 0 0 1 ${x + w}, ${y + radius}
    V ${y + h - radius}
    A ${radius} ${radius} 0 0 1 ${x + w - radius}, ${y + h}
    H ${x + radius}
    A ${radius} ${radius} 0 0 1 ${x}, ${y + h - radius}
    V ${y + radius}
    A ${radius} ${radius} 0 0 1 ${x + radius}, ${y}
    Z
  `;
};

export const TourOverlay = memo(() => {
  const {
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    targetRadius,
    opacity,
    zoneBorderWidth,
    config,
    currentStep,
    steps,
    currentZoneStyle,
  } = useTour() as InternalTourContextType;

  const zoneStyle = useMemo(() => {
    return {
      ...DEFAULT_ZONE_STYLE,
      ...config?.zoneStyle,
      ...currentZoneStyle,
    };
  }, [config?.zoneStyle, currentZoneStyle]);

  // Backdrop SVG: full-screen rect minus the highlight cutout
  const animatedProps = useAnimatedProps(() => {
    const holePath = createRoundedRectPath(
      targetX.value,
      targetY.value,
      targetWidth.value,
      targetHeight.value,
      targetRadius.value
    );

    const path = `
      M 0,0 
      H ${SCREEN_WIDTH} 
      V ${SCREEN_HEIGHT} 
      H 0 
      Z 
      ${holePath}
    `;

    return {
      d: path,
      fillOpacity: opacity.value,
    };
  });

  const step = currentStep ? steps[currentStep] : null;
  const isClickable = step?.clickable ?? false;

  // When preventInteraction is true, the SVG blocks touches outside the hole.
  // A transparent view covers the hole to block touches inside it when clickable=false.
  const shouldBlockOutside =
    step?.preventInteraction ?? config?.preventInteraction ?? false;

  const containerPointerEvents =
    shouldBlockOutside && currentStep ? 'box-none' : 'none';

  const blockerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: targetX.value,
      top: targetY.value,
      width: targetWidth.value,
      height: targetHeight.value,
      borderRadius: targetRadius.value,
    };
  });

  // Border/glow ring tracks the highlight and fades with the backdrop
  const zoneBorderStyle = useAnimatedStyle(() => {
    const isGlowEnabled = config?.enableGlow === true;
    const borderW = zoneBorderWidth?.value ?? zoneStyle.borderWidth;

    return {
      position: 'absolute' as const,
      left: targetX.value,
      top: targetY.value,
      width: targetWidth.value,
      height: targetHeight.value,
      borderRadius: targetRadius.value,
      borderWidth: borderW,
      borderColor: zoneStyle.borderColor,
      backgroundColor: 'transparent',
      opacity: opacity.value,
      ...(isGlowEnabled && {
        boxShadow: `${zoneStyle.glowOffsetX}px ${zoneStyle.glowOffsetY}px ${zoneStyle.glowRadius}px ${zoneStyle.glowSpread}px ${zoneStyle.glowColor}`,
      }),
    };
  });

  const showBorder = config?.enableGlow === true || zoneStyle.borderWidth > 0;

  return (
    <AnimatedView
      pointerEvents={containerPointerEvents}
      style={StyleSheet.absoluteFill}
    >
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <AnimatedPath
          animatedProps={animatedProps as any}
          fill="black"
          fillRule="evenodd"
          onPress={() => {}}
        />
      </Svg>
      {shouldBlockOutside && !isClickable && currentStep && (
        <AnimatedView style={blockerStyle} pointerEvents="auto" />
      )}
      {showBorder && currentStep && (
        <AnimatedView style={zoneBorderStyle} pointerEvents="none" />
      )}
    </AnimatedView>
  );
});
