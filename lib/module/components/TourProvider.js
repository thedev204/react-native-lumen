"use strict";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, useAnimatedRef, default as Animated } from 'react-native-reanimated';
import { StyleSheet, Dimensions } from 'react-native';
import { TourContext } from "../context/TourContext.js";
import { TourOverlay } from "./TourOverlay.js";
import { TourTooltip } from "./TourTooltip.js";
import { DEFAULT_BACKDROP_OPACITY, DEFAULT_SPRING_CONFIG, DEFAULT_SPOTLIGHT_STYLE, resolveSpotlightStyle } from "../constants/defaults.js";
import { detectStorage, saveTourProgress, loadTourProgress, clearTourProgress } from "../utils/storage.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = Dimensions.get('window');

/**
 * Computes the spotlight geometry based on element bounds and spotlight style.
 * Handles different shapes: rounded-rect, circle, pill.
 */
function computeSpotlightGeometry(element, style) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    shape,
    borderRadius
  } = style;
  let sx, sy, sw, sh, sr;
  switch (shape) {
    case 'circle':
      {
        // Create a circular spotlight that encompasses the element
        const cx = element.x + element.width / 2;
        const cy = element.y + element.height / 2;
        const radius = Math.sqrt(element.width ** 2 + element.height ** 2) / 2 + style.padding;
        sx = cx - radius;
        sy = cy - radius;
        sw = radius * 2;
        sh = radius * 2;
        sr = radius;
        break;
      }
    case 'pill':
      {
        // Pill shape with fully rounded ends
        sx = element.x - paddingLeft;
        sy = element.y - paddingTop;
        sw = element.width + paddingLeft + paddingRight;
        sh = element.height + paddingTop + paddingBottom;
        sr = sh / 2; // Fully rounded based on height
        break;
      }
    case 'rounded-rect':
    default:
      {
        sx = element.x - paddingLeft;
        sy = element.y - paddingTop;
        sw = element.width + paddingLeft + paddingRight;
        sh = element.height + paddingTop + paddingBottom;
        sr = borderRadius;
        break;
      }
  }

  // Clamp to screen bounds
  sx = Math.max(0, Math.min(sx, SCREEN_WIDTH - sw));
  sy = Math.max(0, Math.min(sy, SCREEN_HEIGHT - sh));
  sw = Math.min(sw, SCREEN_WIDTH - sx);
  sh = Math.min(sh, SCREEN_HEIGHT - sy);

  // Ensure minimum size
  const minSize = 40;
  sw = Math.max(sw, minSize);
  sh = Math.max(sh, minSize);
  return {
    x: sx,
    y: sy,
    width: sw,
    height: sh,
    borderRadius: sr
  };
}
const AnimatedView = Animated.View;
export const TourProvider = ({
  children,
  stepsOrder: initialStepsOrder,
  backdropOpacity = DEFAULT_BACKDROP_OPACITY,
  config
}) => {
  const [steps, setSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  // ref to access latest measurements without causing re-renders
  const measurements = useRef({});
  const containerRef = useAnimatedRef();

  // ─── Persistence Setup ─────────────────────────────────────────────────────
  const persistenceConfig = config?.persistence;
  const isPersistenceEnabled = persistenceConfig?.enabled ?? false;
  const tourId = persistenceConfig?.tourId ?? 'default';
  const autoResume = persistenceConfig?.autoResume ?? true;
  const clearOnComplete = persistenceConfig?.clearOnComplete ?? true;
  const maxAge = persistenceConfig?.maxAge;

  // Get storage adapter (custom or auto-detected)
  const storageAdapter = useMemo(() => {
    if (!isPersistenceEnabled) return null;
    if (persistenceConfig?.storage) return persistenceConfig.storage;
    const detected = detectStorage();
    return detected.adapter;
  }, [isPersistenceEnabled, persistenceConfig?.storage]);

  // Check for saved progress on mount
  useEffect(() => {
    if (!isPersistenceEnabled || !storageAdapter) {
      setHasSavedProgress(false);
      return;
    }
    const checkSavedProgress = async () => {
      try {
        const savedProgress = await loadTourProgress(storageAdapter, tourId);
        if (savedProgress) {
          // Check if progress is expired
          if (maxAge && Date.now() - savedProgress.timestamp > maxAge) {
            await clearTourProgress(storageAdapter, tourId);
            setHasSavedProgress(false);
          } else {
            setHasSavedProgress(true);
          }
        } else {
          setHasSavedProgress(false);
        }
      } catch {
        setHasSavedProgress(false);
      }
    };
    checkSavedProgress();
  }, [isPersistenceEnabled, storageAdapter, tourId, maxAge]);

  // --- Shared Values for Animations (Zero Bridge Crossing) ---
  // Initialize off-screen or 0
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const targetWidth = useSharedValue(0);
  const targetHeight = useSharedValue(0);
  const targetRadius = useSharedValue(10); // Default border radius
  const opacity = useSharedValue(0); // 0 = hidden, 1 = visible
  const spotlightBorderWidth = useSharedValue(DEFAULT_SPOTLIGHT_STYLE.borderWidth);

  // Track current step's resolved spotlight style
  const currentSpotlightStyle = useMemo(() => {
    if (!currentStep) return null;
    const step = steps[currentStep];
    if (!step) return null;
    return resolveSpotlightStyle(config?.spotlightStyle, step.spotlightStyle);
  }, [currentStep, steps, config?.spotlightStyle]);

  // Helper to get spring config for a step (supports per-step overrides)
  const getSpringConfigForStep = useCallback(stepKey => {
    const step = steps[stepKey];
    const stepStyle = step?.spotlightStyle;
    const baseConfig = config?.springConfig ?? DEFAULT_SPRING_CONFIG;

    // Allow per-step spring overrides
    if (stepStyle?.springDamping !== undefined || stepStyle?.springStiffness !== undefined) {
      return {
        damping: stepStyle.springDamping ?? baseConfig.damping,
        stiffness: stepStyle.springStiffness ?? baseConfig.stiffness,
        mass: baseConfig.mass,
        overshootClamping: baseConfig.overshootClamping,
        restDisplacementThreshold: baseConfig.restDisplacementThreshold,
        restSpeedThreshold: baseConfig.restSpeedThreshold
      };
    }
    return baseConfig;
  }, [steps, config?.springConfig]);

  // Helper to animate to a specific step's layout
  const animateToStep = useCallback(stepKey => {
    const measure = measurements.current[stepKey];
    if (measure) {
      // Validate measurements before animating
      if (!measure.width || !measure.height || measure.width <= 0 || measure.height <= 0 || isNaN(measure.x) || isNaN(measure.y) || isNaN(measure.width) || isNaN(measure.height)) {
        console.warn('[TourProvider] Invalid measurements for step:', stepKey, measure);
        return;
      }
      const step = steps[stepKey];
      const resolvedStyle = resolveSpotlightStyle(config?.spotlightStyle, step?.spotlightStyle);
      const springConfig = getSpringConfigForStep(stepKey);

      // Compute spotlight geometry based on style (handles shapes and padding)
      const geo = computeSpotlightGeometry(measure, resolvedStyle);
      targetX.value = withSpring(geo.x, springConfig);
      targetY.value = withSpring(geo.y, springConfig);
      targetWidth.value = withSpring(geo.width, springConfig);
      targetHeight.value = withSpring(geo.height, springConfig);
      targetRadius.value = withSpring(geo.borderRadius, springConfig);
      spotlightBorderWidth.value = withSpring(resolvedStyle.borderWidth, springConfig);

      // Ensure overlay is visible
      opacity.value = withTiming(backdropOpacity, {
        duration: 300
      });
    } else {
      console.warn('[TourProvider] No measurements found for step:', stepKey);
    }
  }, [backdropOpacity, targetX, targetY, targetWidth, targetHeight, targetRadius, spotlightBorderWidth, opacity, getSpringConfigForStep, steps, config?.spotlightStyle]);
  const registerStep = useCallback(step => {
    setSteps(prev => ({
      ...prev,
      [step.key]: step
    }));
    // If this step was pending (waiting for cross-screen mount), activate it
    if (pendingStepRef.current === step.key) {
      pendingStepRef.current = null;
      setCurrentStep(step.key);
      // Overlay opacity will be set by updateStepLayout when measurement arrives
    }
  }, []);
  const unregisterStep = useCallback(key => {
    setSteps(prev => {
      const newSteps = {
        ...prev
      };
      delete newSteps[key];
      return newSteps;
    });
  }, []);
  const updateStepLayout = useCallback((key, measure) => {
    // Validate measurements before storing
    if (!measure.width || !measure.height || measure.width <= 0 || measure.height <= 0 || isNaN(measure.x) || isNaN(measure.y) || isNaN(measure.width) || isNaN(measure.height) || !isFinite(measure.x) || !isFinite(measure.y) || !isFinite(measure.width) || !isFinite(measure.height)) {
      console.warn('[TourProvider] Invalid measurement update for step:', key, measure);
      return;
    }
    measurements.current[key] = measure;
    // If this step is currently active (e.g. scroll happened or resize), update shared values on the fly
    if (currentStep === key) {
      const step = steps[key];
      const resolvedStyle = resolveSpotlightStyle(config?.spotlightStyle, step?.spotlightStyle);
      const springConfig = getSpringConfigForStep(key);

      // Compute spotlight geometry based on style
      const geo = computeSpotlightGeometry(measure, resolvedStyle);
      targetX.value = withSpring(geo.x, springConfig);
      targetY.value = withSpring(geo.y, springConfig);
      targetWidth.value = withSpring(geo.width, springConfig);
      targetHeight.value = withSpring(geo.height, springConfig);
      targetRadius.value = withSpring(geo.borderRadius, springConfig);
      spotlightBorderWidth.value = withSpring(resolvedStyle.borderWidth, springConfig);

      // Ensure overlay is visible (fixes race condition where start() was called before measure)
      opacity.value = withTiming(backdropOpacity, {
        duration: 300
      });
    }
  }, [currentStep, targetX, targetY, targetWidth, targetHeight, targetRadius, spotlightBorderWidth, opacity, backdropOpacity, getSpringConfigForStep, config?.spotlightStyle, steps]);

  // Flatten stepsOrder (supports both string[] and Record<string, string[]>)
  const flatStepsOrder = useMemo(() => {
    if (!initialStepsOrder) return undefined;
    if (Array.isArray(initialStepsOrder)) return initialStepsOrder;
    // Object format: flatten values in key order
    return Object.values(initialStepsOrder).flat();
  }, [initialStepsOrder]);
  const getOrderedSteps = useCallback(() => {
    if (flatStepsOrder) return flatStepsOrder;
    // If order property exists on steps, sort by it.
    const stepKeys = Object.keys(steps);
    if (stepKeys.length > 0) {
      // Check if any step has order
      const hasOrder = stepKeys.some(key => typeof steps[key]?.order === 'number');
      if (hasOrder) {
        return stepKeys.sort((a, b) => (steps[a]?.order ?? 0) - (steps[b]?.order ?? 0));
      }
    }
    return stepKeys;
  }, [flatStepsOrder, steps]);

  // Pending step for cross-screen navigation
  // When next/prev targets a step that isn't mounted yet, we store it here
  // and resume when that step's TourZone registers.
  const pendingStepRef = useRef(null);

  // Save progress when step changes
  useEffect(() => {
    if (!isPersistenceEnabled || !storageAdapter || !currentStep) return;
    const ordered = getOrderedSteps();
    const stepIndex = ordered.indexOf(currentStep);
    if (stepIndex >= 0) {
      saveTourProgress(storageAdapter, tourId, currentStep, stepIndex).catch(() => {
        // Silently ignore save errors
      });
    }
  }, [currentStep, isPersistenceEnabled, storageAdapter, tourId, getOrderedSteps]);
  const start = useCallback(async stepKey => {
    const ordered = getOrderedSteps();
    let targetStep = stepKey;

    // If no specific step and autoResume is enabled, try to restore from storage
    if (!targetStep && isPersistenceEnabled && storageAdapter && autoResume) {
      try {
        const savedProgress = await loadTourProgress(storageAdapter, tourId);
        if (savedProgress) {
          // Check if progress is expired
          if (maxAge && Date.now() - savedProgress.timestamp > maxAge) {
            await clearTourProgress(storageAdapter, tourId);
            setHasSavedProgress(false);
          } else if (ordered.includes(savedProgress.currentStepKey)) {
            // Verify the saved step still exists in order
            targetStep = savedProgress.currentStepKey;
          }
        }
      } catch {
        // Ignore load errors, start from beginning
      }
    }
    const firstStep = targetStep || ordered[0];
    if (firstStep) {
      // Check if the target step is registered (mounted)
      if (steps[firstStep]) {
        setCurrentStep(firstStep);
        setTimeout(() => animateToStep(firstStep), 0);
      } else {
        // Step not mounted yet (on a different screen) - set as pending
        pendingStepRef.current = firstStep;
        // Don't set currentStep or opacity - wait for TourZone to mount
      }
    }
  }, [getOrderedSteps, animateToStep, steps, isPersistenceEnabled, storageAdapter, autoResume, tourId, maxAge]);
  const stop = useCallback(() => {
    setCurrentStep(null);
    opacity.value = withTiming(0, {
      duration: 300
    });
    // Note: We do NOT clear progress on stop - only on complete or explicit clearProgress
  }, [opacity]);

  // Clear progress helper
  const clearProgress = useCallback(async () => {
    if (!isPersistenceEnabled || !storageAdapter) return;
    try {
      await clearTourProgress(storageAdapter, tourId);
      setHasSavedProgress(false);
    } catch {
      // Silently ignore clear errors
    }
  }, [isPersistenceEnabled, storageAdapter, tourId]);
  const next = useCallback(() => {
    if (!currentStep) return;

    // Block navigation if current step has completed === false
    const currentStepData = steps[currentStep];
    if (currentStepData?.completed === false) {
      return;
    }
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex < ordered.length - 1) {
      const nextStepKey = ordered[currentIndex + 1];
      if (nextStepKey) {
        // Check if the next step is registered (mounted)
        if (steps[nextStepKey]) {
          setCurrentStep(nextStepKey);
          // Don't call animateToStep here - it uses cached measurements that may be stale
          // after scroll. The useFrameCallback in TourZone will handle position tracking
          // using measure() with correct screen coordinates (pageX/pageY).
          // Just ensure the overlay is visible.
          opacity.value = withTiming(backdropOpacity, {
            duration: 300
          });
        } else {
          // Step not mounted yet (on a different screen) - set as pending
          pendingStepRef.current = nextStepKey;
          setCurrentStep(null);
          opacity.value = withTiming(0, {
            duration: 300
          });
          // Persist pending step so it can be resumed
          if (isPersistenceEnabled && storageAdapter) {
            const stepIndex = ordered.indexOf(nextStepKey);
            saveTourProgress(storageAdapter, tourId, nextStepKey, stepIndex).catch(() => {});
          }
        }
      } else {
        stop();
      }
    } else {
      // End of tour - clear progress if configured
      if (isPersistenceEnabled && clearOnComplete && storageAdapter) {
        clearTourProgress(storageAdapter, tourId).then(() => setHasSavedProgress(false)).catch(() => {});
      }
      stop();
    }
  }, [currentStep, steps, getOrderedSteps, stop, opacity, backdropOpacity, isPersistenceEnabled, clearOnComplete, storageAdapter, tourId]);
  const prev = useCallback(() => {
    if (!currentStep) return;
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStepKey = ordered[currentIndex - 1];
      if (prevStepKey) {
        // Check if the previous step is registered (mounted)
        if (steps[prevStepKey]) {
          setCurrentStep(prevStepKey);
          // Don't call animateToStep - let useFrameCallback handle position tracking
          opacity.value = withTiming(backdropOpacity, {
            duration: 300
          });
        } else {
          // Step not mounted (on a different screen) - set as pending
          pendingStepRef.current = prevStepKey;
          setCurrentStep(null);
          opacity.value = withTiming(0, {
            duration: 300
          });
        }
      }
    }
  }, [currentStep, steps, getOrderedSteps, opacity, backdropOpacity]);
  const scrollViewRef = useAnimatedRef();
  const setScrollViewRef = useCallback(_ref => {
    // If user passes a ref, we might want to sync it?
    // Or we just provide this function for them to give us the ref.
    // With useAnimatedRef, we can assign it if it's a function or object?
    // Actually, safest is to let them assign our ref to their component.
    // But they might have their own ref.
    // Let's assume they call this with their ref.
    // BUT useAnimatedRef cannot easily accept an external ref object to "become".
    // Pattern: They should use the ref we give them, OR we wrap their component?
    // Simpler: We just expose 'scrollViewRef' from context, and they attach it.
    // So 'setScrollViewRef' might be redundant if we just say "here is the ref, use it".
    // But if they have their own, they can't usage two refs easily without merging.
    // Let's stick to exposing `scrollViewRef` from context that they MUST use.
    // But wait, the interface says `setScrollViewRef`.
    // Let's keep `setScrollViewRef` as a no-op or a way to manually set it if needed (not RecAnimated friendly).
    // Actually, let's just expose `scrollViewRef` and `registerScrollView` which essentially does nothing if we expect them to use the ref object.
    // Let's make `setScrollViewRef` actually do something if possible, or just document "Use exposed scrollViewRef".
    // For now, let's just return the `scrollViewRef` we created.
  }, []);

  // Expose ordered step keys for tooltip and external use
  const orderedStepKeys = useMemo(() => getOrderedSteps(), [getOrderedSteps]);
  const value = useMemo(() => ({
    start,
    stop,
    next,
    prev,
    registerStep,
    unregisterStep,
    updateStepLayout,
    currentStep,
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    targetRadius,
    opacity,
    spotlightBorderWidth,
    steps,
    config,
    containerRef,
    scrollViewRef,
    setScrollViewRef,
    currentSpotlightStyle,
    clearProgress,
    hasSavedProgress,
    orderedStepKeys
  }), [start, stop, next, prev, registerStep, unregisterStep, updateStepLayout, currentStep, targetX, targetY, targetWidth, targetHeight, targetRadius, opacity, spotlightBorderWidth, steps, config, containerRef, scrollViewRef, setScrollViewRef, currentSpotlightStyle, clearProgress, hasSavedProgress, orderedStepKeys]);
  return /*#__PURE__*/_jsx(TourContext.Provider, {
    value: value,
    children: /*#__PURE__*/_jsxs(AnimatedView, {
      ref: containerRef,
      style: styles.container,
      collapsable: false,
      children: [children, /*#__PURE__*/_jsx(TourOverlay, {}), /*#__PURE__*/_jsx(TourTooltip, {})]
    })
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=TourProvider.js.map