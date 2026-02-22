import React, {
  useEffect,
  useCallback,
  useMemo,
  type ComponentType,
} from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import { useTour } from '../hooks/useTour';
import {
  useAnimatedRef,
  measure,
  useFrameCallback,
  withSpring,
  default as Animated,
  type AnimatedRef,
  useSharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import type {
  InternalTourContextType,
  ZoneStyle,
  ZoneShape,
  CardProps,
} from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedView = Animated.View as unknown as ComponentType<any>;

interface TourZoneProps {
  stepKey: string;
  name?: string;
  description: string;
  order?: number;
  shape?: ZoneShape;
  borderRadius?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  clickable?: boolean;
  preventInteraction?: boolean;
  required?: boolean;
  completed?: boolean;
  zonePadding?: number;
  zonePaddingTop?: number;
  zonePaddingRight?: number;
  zonePaddingBottom?: number;
  zonePaddingLeft?: number;
  zoneBorderWidth?: number;
  zoneBorderColor?: string;
  zoneGlowColor?: string;
  zoneGlowRadius?: number;
  zoneGlowSpread?: number;
  zoneGlowOffsetX?: number;
  zoneGlowOffsetY?: number;
  zoneStyle?: ZoneStyle;
  renderCustomCard?: (props: CardProps) => React.ReactNode;
}

export const TourZone: React.FC<TourZoneProps> = ({
  stepKey,
  name,
  description,
  order,
  shape = 'rounded-rect',
  borderRadius = 10,
  children,
  style,
  clickable,
  preventInteraction,
  required,
  completed,
  zonePadding,
  zonePaddingTop,
  zonePaddingRight,
  zonePaddingBottom,
  zonePaddingLeft,
  zoneBorderWidth,
  zoneBorderColor,
  zoneGlowColor,
  zoneGlowRadius,
  zoneGlowSpread,
  zoneGlowOffsetX,
  zoneGlowOffsetY,
  zoneStyle,
  renderCustomCard,
}) => {
  const {
    registerStep,
    unregisterStep,
    updateStepLayout,
    currentStep,
    containerRef,
    scrollViewRef,
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    targetRadius,
    config,
  } = useTour() as InternalTourContextType;

  const viewRef = useAnimatedRef<any>();
  const isActive = currentStep === stepKey;

  // The critical lock for the UI thread
  const isScrolling = useSharedValue(false);

  console.log(`zoneGlowRadius ${stepKey}`, zoneGlowRadius);

  const resolvedZoneStyle: ZoneStyle = useMemo(
    () => ({
      ...zoneStyle,
      ...(zonePadding !== undefined && { padding: zonePadding }),
      ...(zonePaddingTop !== undefined && { paddingTop: zonePaddingTop }),
      ...(zonePaddingRight !== undefined && { paddingRight: zonePaddingRight }),
      ...(zonePaddingBottom !== undefined && {
        paddingBottom: zonePaddingBottom,
      }),
      ...(zonePaddingLeft !== undefined && { paddingLeft: zonePaddingLeft }),
      ...(zoneBorderWidth !== undefined && { borderWidth: zoneBorderWidth }),
      ...(zoneBorderColor !== undefined && { borderColor: zoneBorderColor }),
      ...(zoneGlowColor !== undefined && { glowColor: zoneGlowColor }),
      ...(zoneGlowRadius !== undefined && { glowRadius: zoneGlowRadius }),
      ...(zoneGlowSpread !== undefined && { glowSpread: zoneGlowSpread }),
      ...(zoneGlowOffsetX !== undefined && { glowOffsetX: zoneGlowOffsetX }),
      ...(zoneGlowOffsetY !== undefined && { glowOffsetY: zoneGlowOffsetY }),
      shape,
      borderRadius,
    }),
    [
      zoneStyle,
      zonePadding,
      zonePaddingTop,
      zonePaddingRight,
      zonePaddingBottom,
      zonePaddingLeft,
      zoneBorderWidth,
      zoneBorderColor,
      zoneGlowColor,
      zoneGlowRadius,
      zoneGlowSpread,
      zoneGlowOffsetX,
      zoneGlowOffsetY,
      shape,
      borderRadius,
    ]
  );

  /**
   * Captures the final, perfect coordinates and UNLOCKS the UI thread.
   * This is explicitly the ONLY function allowed to set isScrolling.value = false.
   */
  const measureJS = useCallback(() => {
    if (!isActive) return;

    const view = viewRef.current as any;
    const container = containerRef.current as any;

    if (view && container) {
      view.measure(
        (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          container.measure(
            (
              _cx: number,
              _cy: number,
              _cw: number,
              _ch: number,
              containerPageX: number,
              containerPageY: number
            ) => {
              if (width > 0 && height > 0 && !isNaN(pageX) && !isNaN(pageY)) {
                const finalX = pageX - containerPageX;
                const finalY = pageY - containerPageY;

                updateStepLayout(stepKey, {
                  x: finalX,
                  y: finalY,
                  width,
                  height,
                });

                // Unlock the UI thread to take over tracking
                isScrolling.value = false;
              }
            }
          );
        }
      );
    }
  }, [containerRef, isActive, isScrolling, stepKey, updateStepLayout, viewRef]);

  /**
   * Unified Pipeline: Measure -> Predict Scroll -> Scroll -> Measure Final -> Unlock
   * Replaces all independent timers to prevent race conditions on consecutive steps.
   */
  useEffect(() => {
    if (!isActive || !scrollViewRef?.current || !viewRef.current) {
      return;
    }

    let cancelled = false;
    let attemptCount = 0;
    const maxAttempts = 5;
    let hasInitiatedScroll = false;

    // 1. Lock immediately so the UI thread doesn't grab off-screen coordinates
    isScrolling.value = true;

    const checkAndScroll = (delay: number) => {
      const timeoutId = setTimeout(() => {
        if (cancelled || hasInitiatedScroll) return;
        attemptCount++;

        const view = viewRef.current as any;
        const scroll = scrollViewRef.current as any;
        const container = containerRef.current as any;

        view.measure(
          (
            _mx: number,
            _my: number,
            mw: number,
            mh: number,
            px: number,
            py: number
          ) => {
            if (cancelled) return;

            if (mw > 0 && mh > 0 && !isNaN(px) && !isNaN(py)) {
              const topBuffer = 100;
              const bottomBuffer = 150;
              const needsScroll =
                py < topBuffer || py + mh > SCREEN_HEIGHT - bottomBuffer;

              if (needsScroll) {
                hasInitiatedScroll = true;

                scroll.measure(
                  (
                    _sx: number,
                    _sy: number,
                    _sw: number,
                    _sh: number,
                    scrollPx: number,
                    scrollPy: number
                  ) => {
                    if (cancelled) return;

                    if (view.measureLayout) {
                      view.measureLayout(
                        scroll,
                        (contentX: number, contentY: number) => {
                          if (cancelled) return;

                          const centerY =
                            contentY - SCREEN_HEIGHT / 2 + mh / 2 + 50;
                          const scrollY = Math.max(0, centerY);

                          container.measure(
                            (
                              _cx: number,
                              _cy: number,
                              _cw: number,
                              _ch: number,
                              containerPx: number,
                              containerPy: number
                            ) => {
                              if (cancelled) return;

                              // Calculate predictive screen coordinates so the zone smoothly jumps
                              // to the destination *while* the screen is scrolling.
                              const targetScreenY =
                                scrollPy + contentY - scrollY - containerPy;
                              const targetScreenX =
                                scrollPx + contentX - containerPx;

                              updateStepLayout(stepKey, {
                                x: targetScreenX,
                                y: targetScreenY,
                                width: mw,
                                height: mh,
                              });

                              try {
                                scroll.scrollTo({ y: scrollY, animated: true });
                              } catch (e) {
                                console.error(e);
                              }

                              // Wait for the scroll animation to settle, then verify exact position
                              setTimeout(() => {
                                if (!cancelled) measureJS();
                              }, 800);
                            }
                          );
                        },
                        () => {
                          // Fallback if measureLayout is unavailable
                          setTimeout(() => {
                            if (!cancelled) measureJS();
                          }, 800);
                        }
                      );
                    }
                  }
                );
              } else {
                // No scroll needed, just get the perfect coordinates and unlock
                measureJS();
              }
            } else if (attemptCount < maxAttempts) {
              checkAndScroll(150);
            }
          }
        );
      }, delay);

      return timeoutId;
    };

    const initialTimeout = checkAndScroll(50);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
    };
  }, [
    isActive,
    scrollViewRef,
    viewRef,
    containerRef,
    stepKey,
    updateStepLayout,
    measureJS,
    isScrolling,
  ]);

  // UI Thread tracking
  useFrameCallback(() => {
    'worklet';
    if (!isActive || isScrolling.value) {
      return;
    }
    try {
      const measured = measure(viewRef);
      const container = measure(containerRef as AnimatedRef<any>);

      if (measured && container) {
        const x = measured.pageX - container.pageX;
        const y = measured.pageY - container.pageY;
        const width = measured.width;
        const height = measured.height;

        if (
          width > 0 &&
          height > 0 &&
          !isNaN(x) &&
          !isNaN(y) &&
          isFinite(x) &&
          isFinite(y)
        ) {
          const springConfig = config?.springConfig ?? {
            damping: 100,
            stiffness: 100,
          };

          const zpt =
            resolvedZoneStyle.paddingTop ?? resolvedZoneStyle.padding ?? 0;
          const zpr =
            resolvedZoneStyle.paddingRight ?? resolvedZoneStyle.padding ?? 0;
          const zpb =
            resolvedZoneStyle.paddingBottom ?? resolvedZoneStyle.padding ?? 0;
          const zpl =
            resolvedZoneStyle.paddingLeft ?? resolvedZoneStyle.padding ?? 0;
          const zShape = resolvedZoneStyle.shape ?? 'rounded-rect';

          let sx = x - zpl;
          let sy = y - zpt;
          let sw = width + zpl + zpr;
          let sh = height + zpt + zpb;
          let sr = borderRadius;

          if (zShape === 'circle') {
            const cx = x + width / 2;
            const cy = y + height / 2;
            const radius =
              Math.max(width, height) / 2 + (resolvedZoneStyle.padding ?? 0);
            sx = cx - radius;
            sy = cy - radius;
            sw = radius * 2;
            sh = radius * 2;
            sr = radius;
          } else if (zShape === 'pill') {
            sx = x - zpl;
            sy = y - zpt;
            sw = width + zpl + zpr;
            sh = height + zpt + zpb;
            sr = sh / 2;
          }

          targetX.value = withSpring(sx, springConfig);
          targetY.value = withSpring(sy, springConfig);
          targetWidth.value = withSpring(sw, springConfig);
          targetHeight.value = withSpring(sh, springConfig);
          targetRadius.value = withSpring(sr, springConfig);
        }
      }
    } catch {
      // Silently ignore measurement errors on UI thread
    }
  }, isActive);

  // Sync position if the element physically resizes, but strictly avoid
  // measuring if we are currently handling an orchestrated scroll.
  const onLayout = useCallback(() => {
    if (isActive && !isScrolling.value) {
      measureJS();
    }
  }, [isActive, isScrolling.value, measureJS]);

  useEffect(() => {
    registerStep({
      key: stepKey,
      name,
      description,
      order,
      clickable,
      preventInteraction,
      required,
      completed,
      meta: { shape: resolvedZoneStyle.shape, borderRadius },
      zoneStyle: resolvedZoneStyle,
      renderCustomCard,
    });
    return () => unregisterStep(stepKey);
  }, [
    stepKey,
    name,
    description,
    order,
    borderRadius,
    registerStep,
    unregisterStep,
    clickable,
    preventInteraction,
    required,
    completed,
    resolvedZoneStyle,
    renderCustomCard,
  ]);

  return (
    <AnimatedView
      ref={viewRef}
      onLayout={onLayout}
      style={style}
      collapsable={false}
    >
      {children}
    </AnimatedView>
  );
};
