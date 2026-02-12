import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  type ComponentType,
} from 'react';
import {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedRef,
  default as Animated,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import type {
  TourStep,
  MeasureResult,
  TourConfig,
  InternalTourContextType,
} from '../types';
import { TourContext } from '../context/TourContext';
import { TourOverlay } from './TourOverlay';
import { TourTooltip } from './TourTooltip';
import {
  DEFAULT_BACKDROP_OPACITY,
  DEFAULT_SPRING_CONFIG,
} from '../constants/defaults';

interface TourProviderProps {
  children: React.ReactNode;
  /**
   * Optional custom steps order. If provided, the tour will follow this array of keys.
   */
  stepsOrder?: string[];
  /**
   * Initial overlay opacity. Default 0.5
   */
  backdropOpacity?: number;
  /**
   * Global configuration for the tour.
   */
  config?: TourConfig;
}

const AnimatedView = Animated.View as unknown as ComponentType<any>;

export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  stepsOrder: initialStepsOrder,
  backdropOpacity = DEFAULT_BACKDROP_OPACITY,
  config,
}) => {
  const [steps, setSteps] = useState<Record<string, TourStep>>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // ref to access latest measurements without causing re-renders
  const measurements = useRef<Record<string, MeasureResult>>({});
  const containerRef = useAnimatedRef<any>();

  // --- Shared Values for Animations (Zero Bridge Crossing) ---
  // Initialize off-screen or 0
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const targetWidth = useSharedValue(0);
  const targetHeight = useSharedValue(0);
  const targetRadius = useSharedValue(10); // Default border radius
  const opacity = useSharedValue(0); // 0 = hidden, 1 = visible

  // Helper to animate to a specific step's layout
  const animateToStep = useCallback(
    (stepKey: string) => {
      const measure = measurements.current[stepKey];
      if (measure) {
        // Validate measurements before animating
        if (
          !measure.width ||
          !measure.height ||
          measure.width <= 0 ||
          measure.height <= 0 ||
          isNaN(measure.x) ||
          isNaN(measure.y) ||
          isNaN(measure.width) ||
          isNaN(measure.height)
        ) {
          console.warn(
            '[TourProvider] Invalid measurements for step:',
            stepKey,
            measure
          );
          return;
        }

        const springConfig = config?.springConfig ?? DEFAULT_SPRING_CONFIG;

        targetX.value = withSpring(measure.x, springConfig);
        targetY.value = withSpring(measure.y, springConfig);
        targetWidth.value = withSpring(measure.width, springConfig);
        targetHeight.value = withSpring(measure.height, springConfig);

        // If measure result has radius or step meta has radius, use it.
        // For now defaulting to 10 or meta reading if we passed it back in measure?
        // Let's assume meta is in steps state.
        const step = steps[stepKey];
        const radius = step?.meta?.borderRadius ?? 10;
        targetRadius.value = withSpring(radius, springConfig);

        // Ensure overlay is visible
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      } else {
        console.warn('[TourProvider] No measurements found for step:', stepKey);
      }
    },
    [
      backdropOpacity,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      opacity,
      config?.springConfig,
      steps,
    ]
  );

  const registerStep = useCallback((step: TourStep) => {
    setSteps((prev) => ({ ...prev, [step.key]: step }));
  }, []);

  const unregisterStep = useCallback((key: string) => {
    setSteps((prev) => {
      const newSteps = { ...prev };
      delete newSteps[key];
      return newSteps;
    });
  }, []);

  const updateStepLayout = useCallback(
    (key: string, measure: MeasureResult) => {
      // Validate measurements before storing
      if (
        !measure.width ||
        !measure.height ||
        measure.width <= 0 ||
        measure.height <= 0 ||
        isNaN(measure.x) ||
        isNaN(measure.y) ||
        isNaN(measure.width) ||
        isNaN(measure.height) ||
        !isFinite(measure.x) ||
        !isFinite(measure.y) ||
        !isFinite(measure.width) ||
        !isFinite(measure.height)
      ) {
        console.warn(
          '[TourProvider] Invalid measurement update for step:',
          key,
          measure
        );
        return;
      }

      measurements.current[key] = measure;
      // If this step is currently active (e.g. scroll happened or resize), update shared values on the fly
      if (currentStep === key) {
        const springConfig = config?.springConfig ?? DEFAULT_SPRING_CONFIG;

        targetX.value = withSpring(measure.x, springConfig);
        targetY.value = withSpring(measure.y, springConfig);
        targetWidth.value = withSpring(measure.width, springConfig);
        targetHeight.value = withSpring(measure.height, springConfig);

        // Update radius if available
        const step = steps[key];
        const radius = step?.meta?.borderRadius ?? 10;
        targetRadius.value = withSpring(radius, springConfig);

        // Ensure overlay is visible (fixes race condition where start() was called before measure)
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      }
    },
    [
      currentStep,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      targetRadius,
      opacity,
      backdropOpacity,
      config?.springConfig,
      steps,
    ]
  );

  const getOrderedSteps = useCallback(() => {
    if (initialStepsOrder) return initialStepsOrder;
    // If order property exists on steps, sort by it.
    const stepKeys = Object.keys(steps);
    if (stepKeys.length > 0) {
      // Check if any step has order
      const hasOrder = stepKeys.some(
        (key) => typeof steps[key]?.order === 'number'
      );
      if (hasOrder) {
        return stepKeys.sort(
          (a, b) => (steps[a]?.order ?? 0) - (steps[b]?.order ?? 0)
        );
      }
    }
    return stepKeys;
  }, [initialStepsOrder, steps]);

  const start = useCallback(
    (stepKey?: string) => {
      const ordered = getOrderedSteps();
      const firstStep = stepKey || ordered[0];
      if (firstStep) {
        setCurrentStep(firstStep);
        // We need to wait for layout if it's not ready?
        // Assuming layout is ready since components are mounted.
        // But if we start immediately on mount, might be tricky.
        // For now assume standard flow.
        // requestAnimationFrame to ensure state update propagates if needed,
        // but simple call is usually fine.
        setTimeout(() => animateToStep(firstStep), 0);
      }
    },
    [getOrderedSteps, animateToStep]
  );

  const stop = useCallback(() => {
    setCurrentStep(null);
    opacity.value = withTiming(0, { duration: 300 });
  }, [opacity]);

  const next = useCallback(() => {
    if (!currentStep) return;
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex < ordered.length - 1) {
      const nextStep = ordered[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
        // Don't call animateToStep here - it uses cached measurements that may be stale
        // after scroll. The useFrameCallback in TourZone will handle position tracking
        // using measure() with correct screen coordinates (pageX/pageY).
        // Just ensure the overlay is visible.
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      } else {
        stop();
      }
    } else {
      stop(); // End of tour
    }
  }, [currentStep, getOrderedSteps, stop, opacity, backdropOpacity]);

  const prev = useCallback(() => {
    if (!currentStep) return;
    const ordered = getOrderedSteps();
    const currentIndex = ordered.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = ordered[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
        // Don't call animateToStep - let useFrameCallback handle position tracking
        opacity.value = withTiming(backdropOpacity, { duration: 300 });
      }
    }
  }, [currentStep, getOrderedSteps, opacity, backdropOpacity]);

  const scrollViewRef = useAnimatedRef<any>();

  const setScrollViewRef = useCallback((_ref: any) => {
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

  const value = useMemo<InternalTourContextType>(
    () => ({
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
      steps,
      config,
      containerRef,
      scrollViewRef,
      setScrollViewRef,
    }),
    [
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
      steps,
      config,
      containerRef,
      scrollViewRef,
      setScrollViewRef,
    ]
  );

  return (
    <TourContext.Provider value={value}>
      <AnimatedView
        ref={containerRef}
        style={styles.container}
        collapsable={false}
      >
        {children}
        <TourOverlay />
        <TourTooltip />
      </AnimatedView>
    </TourContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
