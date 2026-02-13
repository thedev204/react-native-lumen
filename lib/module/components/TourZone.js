"use strict";

import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useTour } from "../hooks/useTour.js";
import { useAnimatedRef, measure, useFrameCallback, withSpring, default as Animated, useSharedValue } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
const {
  height: SCREEN_HEIGHT
} = Dimensions.get('window');
const AnimatedView = Animated.View;
export const TourZone = ({
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
  renderCustomCard
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
    config
  } = useTour();
  const viewRef = useAnimatedRef();
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
    const view = viewRef.current;
    const container = containerRef.current;
    if (view && container) {
      // 1. Measure the View in Screen Coordinates (PageX/PageY)
      view.measure((_x, _y, width, height, pageX, pageY) => {
        // 2. Measure the Container (TourOverlay) in Screen Coordinates
        // This handles cases where the Tour Overlay isn't exactly at 0,0 (e.g. inside a SafeAreaView)
        container.measure((_cx, _cy, _cw, _ch, containerPageX, containerPageY) => {
          if (width > 0 && height > 0 && !isNaN(pageX) && !isNaN(pageY)) {
            // Calculate final position relative to the Tour Overlay
            const finalX = pageX - containerPageX;
            const finalY = pageY - containerPageY;
            updateStepLayout(stepKey, {
              x: finalX,
              y: finalY,
              width,
              height
            });
          }
        });
      });
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
      const container = measure(containerRef);
      if (measured && container) {
        const x = measured.pageX - container.pageX;
        const y = measured.pageY - container.pageY;
        const width = measured.width;
        const height = measured.height;
        if (width > 0 && height > 0 && !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
          const springConfig = config?.springConfig ?? {
            damping: 100,
            stiffness: 100
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
    const view = viewRef.current;
    const scroll = scrollViewRef.current;
    const container = containerRef.current;
    let attemptCount = 0;
    const maxAttempts = 3;
    const attemptMeasurement = delay => {
      const timeoutId = setTimeout(() => {
        if (hasScrolled.current) return;
        attemptCount++;

        // 1. Check current visibility on screen
        view.measure((_mx, _my, mw, mh, px, py) => {
          if (mw > 0 && mh > 0 && !isNaN(px) && !isNaN(py)) {
            const viewportHeight = SCREEN_HEIGHT;
            const topBuffer = 100;
            const bottomBuffer = 150;

            // Check if element is out of the "safe" visual zone
            const needsScroll = py < topBuffer || py + mh > viewportHeight - bottomBuffer;
            if (needsScroll) {
              hasScrolled.current = true;
              isScrolling.value = true;

              // 2. Measure ScrollView to get its Screen Position (Offset from top)
              // This fixes the "upwards" bug by accounting for headers/safe-areas
              scroll.measure((_sx, _sy, _sw, _sh, scrollPx, scrollPy) => {
                // 3. Measure Element relative to ScrollView Content
                if (view.measureLayout) {
                  view.measureLayout(scroll, (contentX, contentY) => {
                    // Calculate target scroll position (center the element)
                    const centerY = contentY - viewportHeight / 2 + mh / 2 + 50;
                    const scrollY = Math.max(0, centerY);

                    // 4. Measure Container to map coordinates to Overlay space
                    container.measure((_cx, _cy, _cw, _ch, containerPx, containerPy) => {
                      // THE FIX: Add scrollPy (ScrollView's screen Y)
                      // Visual Y = ScrollViewScreenY + (ElementContentY - ScrollAmount)
                      const targetScreenY = scrollPy + contentY - scrollY - containerPy;

                      // X is simpler: ScrollViewScreenX + ElementContentX - ContainerScreenX
                      const targetScreenX = scrollPx + contentX - containerPx;
                      updateStepLayout(stepKey, {
                        x: targetScreenX,
                        y: targetScreenY,
                        width: mw,
                        height: mh
                      });
                      try {
                        scroll.scrollTo({
                          y: scrollY,
                          animated: true
                        });
                        // Wait for scroll animation
                        setTimeout(() => onScrollComplete(), 800);
                      } catch (e) {
                        console.error(e);
                        onScrollComplete();
                      }
                    });
                  });
                }
              });
            } else {
              // Element is already visible - just sync position
              container.measure((_cx, _cy, _cw, _ch, cPx, cPy) => {
                const finalX = px - cPx;
                const finalY = py - cPy;
                updateStepLayout(stepKey, {
                  x: finalX,
                  y: finalY,
                  width: mw,
                  height: mh
                });
              });
            }
          } else if (attemptCount < maxAttempts) {
            attemptMeasurement(150 * attemptCount);
          }
        });
      }, delay);
      return timeoutId;
    };
    const timeoutId = attemptMeasurement(150);
    return () => clearTimeout(timeoutId);
  }, [isActive, scrollViewRef, viewRef, stepKey, isScrolling, onScrollComplete, containerRef, updateStepLayout]);

  // Standard onLayout handler (uses the unified measureJS)
  const onLayout = () => {
    measureJS();
  };

  // Build the spotlight style from individual props or the spotlightStyle object
  // Memoize to satisfy exhaustive-deps and prevent unnecessary re-renders
  const resolvedSpotlightStyle = useMemo(() => ({
    ...spotlightStyle,
    // Individual props override spotlightStyle object
    ...(spotlightPadding !== undefined && {
      padding: spotlightPadding
    }),
    ...(spotlightPaddingTop !== undefined && {
      paddingTop: spotlightPaddingTop
    }),
    ...(spotlightPaddingRight !== undefined && {
      paddingRight: spotlightPaddingRight
    }),
    ...(spotlightPaddingBottom !== undefined && {
      paddingBottom: spotlightPaddingBottom
    }),
    ...(spotlightPaddingLeft !== undefined && {
      paddingLeft: spotlightPaddingLeft
    }),
    ...(spotlightBorderWidth !== undefined && {
      borderWidth: spotlightBorderWidth
    }),
    ...(spotlightBorderColor !== undefined && {
      borderColor: spotlightBorderColor
    }),
    ...(spotlightGlowColor !== undefined && {
      glowColor: spotlightGlowColor
    }),
    ...(spotlightGlowOpacity !== undefined && {
      glowOpacity: spotlightGlowOpacity
    }),
    ...(spotlightGlowRadius !== undefined && {
      glowRadius: spotlightGlowRadius
    }),
    // Shape: prefer spotlightShape, fall back to legacy shape prop conversion
    shape: spotlightShape ?? (shape === 'circle' ? 'circle' : 'rounded-rect'),
    borderRadius
  }), [spotlightStyle, spotlightPadding, spotlightPaddingTop, spotlightPaddingRight, spotlightPaddingBottom, spotlightPaddingLeft, spotlightBorderWidth, spotlightBorderColor, spotlightGlowColor, spotlightGlowOpacity, spotlightGlowRadius, spotlightShape, shape, borderRadius]);

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
      meta: {
        shape: resolvedSpotlightStyle.shape,
        borderRadius
      },
      spotlightStyle: resolvedSpotlightStyle,
      renderCustomCard
    });
    return () => unregisterStep(stepKey);
  }, [stepKey, name, description, order, borderRadius, registerStep, unregisterStep, clickable, required, completed, resolvedSpotlightStyle, renderCustomCard]);
  return /*#__PURE__*/_jsx(AnimatedView, {
    ref: viewRef,
    onLayout: onLayout,
    style: style,
    collapsable: false,
    children: children
  });
};
//# sourceMappingURL=TourZone.js.map