"use strict";

import { useCallback, useMemo } from 'react';
import { useTour } from "./useTour.js";
/**
 * Hook to simplify integrating custom scroll views with the tour system.
 *
 * @example
 * // Basic usage with Animated.ScrollView
 * const { scrollViewRef } = useTourScrollView();
 * return <Animated.ScrollView ref={scrollViewRef}>...</Animated.ScrollView>;
 *
 * @example
 * // With scroll disabled during tour
 * const { scrollViewProps } = useTourScrollView({ disableScrollDuringTour: true });
 * return <Animated.ScrollView {...scrollViewProps}>...</Animated.ScrollView>;
 *
 * @example
 * // Custom scroll view wrapper (forwardRef pattern)
 * const MyScrollView = forwardRef((props, ref) => {
 *   const { scrollViewRef } = useTourScrollView();
 *   useImperativeHandle(ref, () => ({
 *     getScrollRef: () => scrollViewRef.current,
 *   }));
 *   return <Animated.ScrollView ref={scrollViewRef} {...props} />;
 * });
 */
export function useTourScrollView(options = {}) {
  const {
    disableScrollDuringTour = false
  } = options;

  // Get the tour context - use type assertion since we know the internal structure
  const tour = useTour();
  const {
    scrollViewRef,
    currentStep
  } = tour;
  const isTourActive = currentStep !== null;
  const scrollEnabled = disableScrollDuringTour ? !isTourActive : true;
  const scrollTo = useCallback(opts => {
    try {
      if (scrollViewRef?.current?.scrollTo) {
        scrollViewRef.current.scrollTo({
          x: opts.x ?? 0,
          y: opts.y ?? 0,
          animated: opts.animated !== false
        });
      }
    } catch {
      // Silently ignore scroll errors
    }
  }, [scrollViewRef]);
  const scrollViewProps = useMemo(() => {
    const props = {
      ref: scrollViewRef
    };
    if (disableScrollDuringTour) {
      props.scrollEnabled = scrollEnabled;
    }
    return props;
  }, [scrollViewRef, disableScrollDuringTour, scrollEnabled]);
  return {
    scrollViewRef,
    isTourActive,
    scrollEnabled,
    scrollTo,
    scrollViewProps
  };
}
//# sourceMappingURL=useTourScrollView.js.map