import React, {
  useEffect,
  useCallback,
  useRef,
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
  SpotlightStyle,
  SpotlightShape,
  CardProps,
} from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedView = Animated.View as unknown as ComponentType<any>;

interface TourZoneProps {
  /** Unique identifier for this step */
  stepKey: string;
  /** Display name shown in tooltip */
  name?: string;
  /** Description text shown in tooltip */
  description: string;
  /** Order of appearance in the tour */
  order?: number;
  /**
   * @deprecated Use `spotlightShape` instead
   */
  shape?: 'rect' | 'circle';
  /**
   * Shape of the spotlight cutout.
   * - 'rounded-rect': Standard rounded rectangle (default)
   * - 'circle': Circular spotlight that encompasses the element
   * - 'pill': Pill/capsule shape with fully rounded ends
   */
  spotlightShape?: SpotlightShape;
  /** Border radius of the spotlight (for 'rounded-rect' shape) */
  borderRadius?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** If true, allows user interaction with the target element */
  clickable?: boolean;
  /**
   * If true, the skip button is hidden for this step.
   * The user must press next (or complete the action) to proceed.
   */
  required?: boolean;
  /**
   * Controls whether the next/finish button is enabled for this step.
   * - `undefined` (default): No enforcement, next button always enabled.
   * - `false`: Next button is disabled until this becomes `true`.
   * - `true`: Next button is enabled.
   */
  completed?: boolean;
  // ─── Spotlight Style Props ─────────────────────────────────────────────
  /** Uniform padding around the highlighted element */
  spotlightPadding?: number;
  /** Top padding for the spotlight */
  spotlightPaddingTop?: number;
  /** Right padding for the spotlight */
  spotlightPaddingRight?: number;
  /** Bottom padding for the spotlight */
  spotlightPaddingBottom?: number;
  /** Left padding for the spotlight */
  spotlightPaddingLeft?: number;
  /** Width of the border/glow ring around the spotlight */
  spotlightBorderWidth?: number;
  /** Color of the border/glow ring */
  spotlightBorderColor?: string;
  /** Color of the outer glow effect */
  spotlightGlowColor?: string;
  /** Opacity of the glow effect (0-1) */
  spotlightGlowOpacity?: number;
  /** Blur radius for the glow effect */
  spotlightGlowRadius?: number;
  /** Complete spotlight style object (alternative to individual props) */
  spotlightStyle?: SpotlightStyle;
  /** Custom render function for this step's tooltip/card */
  renderCustomCard?: (props: CardProps) => React.ReactNode;
}

export const TourZone: React.FC<TourZoneProps> = ({
  stepKey,
  name,
  description,
  order,
  shape = 'rect',
  spotlightShape,
  borderRadius = 10,
  children,
  style,
  clickable,
  required,
  completed,
  // Spotlight style props
  spotlightPadding,
  spotlightPaddingTop,
  spotlightPaddingRight,
  spotlightPaddingBottom,
  spotlightPaddingLeft,
  spotlightBorderWidth,
  spotlightBorderColor,
  spotlightGlowColor,
  spotlightGlowOpacity,
  spotlightGlowRadius,
  spotlightStyle,
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

  // Track if we're currently scrolling to prevent position updates during scroll
  const isScrolling = useSharedValue(false);
  const hasScrolled = useRef(false);

  // Signal when scroll completes (from JS thread)
  const onScrollComplete = useCallback(() => {
    isScrolling.value = false;
  }, [isScrolling]);

  /**
   * UNIFIED MEASUREMENT FUNCTION (JS THREAD)
   * Always measures relative to SCREEN (Viewport), not Content.
   * This fixes the bug where measureLayout returned content-relative Y.
   */
  const measureJS = useCallback(() => {
    if (isScrolling.value || !isActive) {
      return;
    }

    const view = viewRef.current as any;
    const container = containerRef.current as any;

    if (view && container) {
      // 1. Measure the View in Screen Coordinates (PageX/PageY)
      view.measure(
        (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          // 2. Measure the Container (TourOverlay) in Screen Coordinates
          // This handles cases where the Tour Overlay isn't exactly at 0,0 (e.g. inside a SafeAreaView)
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
                // Calculate final position relative to the Tour Overlay
                const finalX = pageX - containerPageX;
                const finalY = pageY - containerPageY;

                updateStepLayout(stepKey, {
                  x: finalX,
                  y: finalY,
                  width,
                  height,
                });
              }
            }
          );
        }
      );
    }
  }, [containerRef, stepKey, updateStepLayout, viewRef, isScrolling, isActive]);

  // Initial measurement when step becomes active
  useEffect(() => {
    if (!isActive) return;

    // Small delay to ensure layout is ready
    const timeoutId = setTimeout(() => {
      measureJS();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isActive, measureJS]);

  // Reanimated Frame Callback (UI Thread Tracking)
  // This keeps the highlight sticky during manual user scrolling
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

          targetX.value = withSpring(x, springConfig);
          targetY.value = withSpring(y, springConfig);
          targetWidth.value = withSpring(width, springConfig);
          targetHeight.value = withSpring(height, springConfig);
          targetRadius.value = withSpring(borderRadius, springConfig);
        }
      }
    } catch {
      // Silently ignore measurement errors on UI thread
    }
  }, isActive);

  // Auto-scroll Effect
  useEffect(() => {
    if (!isActive || !scrollViewRef?.current || !viewRef.current) {
      return;
    }

    hasScrolled.current = false;
    const view = viewRef.current as any;
    const scroll = scrollViewRef.current as any;
    const container = containerRef.current as any;

    let attemptCount = 0;
    const maxAttempts = 3;

    const attemptMeasurement = (delay: number) => {
      const timeoutId = setTimeout(() => {
        if (hasScrolled.current) return;

        attemptCount++;

        // 1. Check current visibility on screen
        view.measure(
          (
            _mx: number,
            _my: number,
            mw: number,
            mh: number,
            px: number,
            py: number
          ) => {
            if (mw > 0 && mh > 0 && !isNaN(px) && !isNaN(py)) {
              const viewportHeight = SCREEN_HEIGHT;
              const topBuffer = 100;
              const bottomBuffer = 150;

              // Check if element is out of the "safe" visual zone
              const needsScroll =
                py < topBuffer || py + mh > viewportHeight - bottomBuffer;

              if (needsScroll) {
                hasScrolled.current = true;
                isScrolling.value = true;

                // 2. Measure ScrollView to get its Screen Position (Offset from top)
                // This fixes the "upwards" bug by accounting for headers/safe-areas
                scroll.measure(
                  (
                    _sx: number,
                    _sy: number,
                    _sw: number,
                    _sh: number,
                    scrollPx: number,
                    scrollPy: number
                  ) => {
                    // 3. Measure Element relative to ScrollView Content
                    if (view.measureLayout) {
                      view.measureLayout(
                        scroll,
                        (contentX: number, contentY: number) => {
                          // Calculate target scroll position (center the element)
                          const centerY =
                            contentY - viewportHeight / 2 + mh / 2 + 50;
                          const scrollY = Math.max(0, centerY);

                          // 4. Measure Container to map coordinates to Overlay space
                          container.measure(
                            (
                              _cx: number,
                              _cy: number,
                              _cw: number,
                              _ch: number,
                              containerPx: number,
                              containerPy: number
                            ) => {
                              // THE FIX: Add scrollPy (ScrollView's screen Y)
                              // Visual Y = ScrollViewScreenY + (ElementContentY - ScrollAmount)
                              const targetScreenY =
                                scrollPy + contentY - scrollY - containerPy;

                              // X is simpler: ScrollViewScreenX + ElementContentX - ContainerScreenX
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
                                // Wait for scroll animation
                                setTimeout(() => onScrollComplete(), 800);
                              } catch (e) {
                                console.error(e);
                                onScrollComplete();
                              }
                            }
                          );
                        }
                      );
                    }
                  }
                );
              } else {
                // Element is already visible - just sync position
                container.measure(
                  (
                    _cx: number,
                    _cy: number,
                    _cw: number,
                    _ch: number,
                    cPx: number,
                    cPy: number
                  ) => {
                    const finalX = px - cPx;
                    const finalY = py - cPy;

                    updateStepLayout(stepKey, {
                      x: finalX,
                      y: finalY,
                      width: mw,
                      height: mh,
                    });
                  }
                );
              }
            } else if (attemptCount < maxAttempts) {
              attemptMeasurement(150 * attemptCount);
            }
          }
        );
      }, delay);
      return timeoutId;
    };

    const timeoutId = attemptMeasurement(150);
    return () => clearTimeout(timeoutId);
  }, [
    isActive,
    scrollViewRef,
    viewRef,
    stepKey,
    isScrolling,
    onScrollComplete,
    containerRef,
    updateStepLayout,
  ]);

  // Standard onLayout handler (uses the unified measureJS)
  const onLayout = () => {
    measureJS();
  };

  // Build the spotlight style from individual props or the spotlightStyle object
  // Memoize to satisfy exhaustive-deps and prevent unnecessary re-renders
  const resolvedSpotlightStyle: SpotlightStyle = useMemo(
    () => ({
      ...spotlightStyle,
      // Individual props override spotlightStyle object
      ...(spotlightPadding !== undefined && { padding: spotlightPadding }),
      ...(spotlightPaddingTop !== undefined && {
        paddingTop: spotlightPaddingTop,
      }),
      ...(spotlightPaddingRight !== undefined && {
        paddingRight: spotlightPaddingRight,
      }),
      ...(spotlightPaddingBottom !== undefined && {
        paddingBottom: spotlightPaddingBottom,
      }),
      ...(spotlightPaddingLeft !== undefined && {
        paddingLeft: spotlightPaddingLeft,
      }),
      ...(spotlightBorderWidth !== undefined && {
        borderWidth: spotlightBorderWidth,
      }),
      ...(spotlightBorderColor !== undefined && {
        borderColor: spotlightBorderColor,
      }),
      ...(spotlightGlowColor !== undefined && {
        glowColor: spotlightGlowColor,
      }),
      ...(spotlightGlowOpacity !== undefined && {
        glowOpacity: spotlightGlowOpacity,
      }),
      ...(spotlightGlowRadius !== undefined && {
        glowRadius: spotlightGlowRadius,
      }),
      // Shape: prefer spotlightShape, fall back to legacy shape prop conversion
      shape: spotlightShape ?? (shape === 'circle' ? 'circle' : 'rounded-rect'),
      borderRadius,
    }),
    [
      spotlightStyle,
      spotlightPadding,
      spotlightPaddingTop,
      spotlightPaddingRight,
      spotlightPaddingBottom,
      spotlightPaddingLeft,
      spotlightBorderWidth,
      spotlightBorderColor,
      spotlightGlowColor,
      spotlightGlowOpacity,
      spotlightGlowRadius,
      spotlightShape,
      shape,
      borderRadius,
    ]
  );

  // Register step on mount and when enforcement props change
  useEffect(() => {
    registerStep({
      key: stepKey,
      name,
      description,
      order,
      clickable,
      required,
      completed,
      meta: { shape: resolvedSpotlightStyle.shape, borderRadius },
      spotlightStyle: resolvedSpotlightStyle,
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
    required,
    completed,
    resolvedSpotlightStyle,
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
