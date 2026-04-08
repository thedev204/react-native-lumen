import React, {
  useEffect,
  useLayoutEffect,
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
  withTiming,
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

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

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
    registerScrollEndCallback,
    unregisterScrollEndCallback,
    opacity,
    backdropOpacity,
  } = useTour() as InternalTourContextType;

  const viewRef = useAnimatedRef<any>();
  const isActive = currentStep === stepKey;

  const isScrolling = useSharedValue(false);

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

  // Lock the frame callback synchronously after commit so it can't read
  // stale off-screen coordinates in the gap before the scroll pipeline starts.
  useLayoutEffect(() => {
    if (isActive) {
      isScrolling.value = true;
    }
  }, [isActive, isScrolling]);

  // Reads the element's final screen position and updates the overlay.
  // onComplete fires after updateStepLayout succeeds — used to fade back in
  // after a scroll-induced fade-out.
  const measureJS = useCallback(
    (onComplete?: () => void) => {
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

                  isScrolling.value = false;
                  if (onComplete) {
                    onComplete();
                  } else {
                    // No scroll path — fade in now that position is confirmed
                    opacity.value = withTiming(backdropOpacity, {
                      duration: 300,
                    });
                  }
                }
              }
            );
          }
        );
      }
    },
    [
      containerRef,
      isActive,
      isScrolling,
      stepKey,
      updateStepLayout,
      viewRef,
      opacity,
      backdropOpacity,
    ]
  );

  useEffect(() => {
    if (!isActive || !viewRef.current) {
      return;
    }

    // No ScrollView present — measure immediately without any scroll logic.
    if (!scrollViewRef?.current) {
      let cancelled = false;
      let attemptCount = 0;
      const maxAttempts = 5;

      const tryMeasure = (delay: number) => {
        const timeoutId = setTimeout(() => {
          if (cancelled) return;
          attemptCount++;

          const view = viewRef.current as any;
          const container = containerRef.current as any;

          if (!view || !container) return;

          view.measure(
            (
              _x: number,
              _y: number,
              mw: number,
              mh: number,
              px: number,
              py: number
            ) => {
              if (cancelled) return;
              if (mw > 0 && mh > 0 && !isNaN(px) && !isNaN(py)) {
                measureJS();
              } else if (attemptCount < maxAttempts) {
                tryMeasure(150);
              }
            }
          );
        }, delay);

        return timeoutId;
      };

      const initialTimeout = tryMeasure(50);

      return () => {
        cancelled = true;
        clearTimeout(initialTimeout);
      };
    }

    // ScrollView is present — run the full scroll-check + measure logic.
    let cancelled = false;
    let attemptCount = 0;
    const maxAttempts = 5;
    let hasInitiatedScroll = false;
    let fallbackTimeoutId: ReturnType<typeof setTimeout> | null = null;

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

                              // Hide immediately before scrolling so the user
                              // never sees the predicted (potentially wrong) interim position.
                              opacity.value = 0;

                              try {
                                scroll.scrollTo({ y: scrollY, animated: true });
                              } catch (e) {
                                console.error(e);
                              }

                              // Fade back in once the scroll settles and the position is accurate.
                              const fadeIn = () => {
                                opacity.value = withTiming(backdropOpacity, {
                                  duration: 220,
                                });
                              };

                              // Primary: fire as soon as onMomentumScrollEnd is received.
                              registerScrollEndCallback(() => {
                                if (!cancelled) {
                                  if (fallbackTimeoutId !== null) {
                                    clearTimeout(fallbackTimeoutId);
                                    fallbackTimeoutId = null;
                                  }
                                  measureJS(fadeIn);
                                }
                              });

                              // Fallback: if onMomentumScrollEnd never fires.
                              fallbackTimeoutId = setTimeout(() => {
                                if (!cancelled) {
                                  unregisterScrollEndCallback();
                                  measureJS(fadeIn);
                                }
                              }, 1500);
                            }
                          );
                        },
                        () => {
                          // measureLayout unavailable — degrade to timed fallback.
                          fallbackTimeoutId = setTimeout(() => {
                            if (!cancelled) {
                              measureJS(() => {
                                opacity.value = withTiming(backdropOpacity, {
                                  duration: 220,
                                });
                              });
                            }
                          }, 800);
                        }
                      );
                    }
                  }
                );
              } else {
                // No scroll needed — element is already on screen.
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
      if (fallbackTimeoutId !== null) clearTimeout(fallbackTimeoutId);
      // Ensure no stale callback fires after this step is deactivated
      unregisterScrollEndCallback();
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
    registerScrollEndCallback,
    unregisterScrollEndCallback,
    opacity,
    backdropOpacity,
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
