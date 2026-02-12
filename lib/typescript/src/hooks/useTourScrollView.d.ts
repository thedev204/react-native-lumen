export interface TourScrollViewOptions {
    /**
     * If true, scrolling will be disabled while the tour is active.
     * @default false
     */
    disableScrollDuringTour?: boolean;
}
export interface TourScrollViewResult {
    /**
     * Animated ref to attach to your ScrollView/Animated.ScrollView.
     * This is the same ref as `scrollViewRef` from useTour().
     */
    scrollViewRef: React.RefObject<any>;
    /**
     * Whether the tour is currently active (a step is being shown).
     */
    isTourActive: boolean;
    /**
     * Whether scrolling should be enabled based on tour state.
     * Only relevant if disableScrollDuringTour option is true.
     */
    scrollEnabled: boolean;
    /**
     * Helper function to scroll to a specific position.
     * Wraps the scrollTo method with error handling.
     */
    scrollTo: (options: {
        x?: number;
        y?: number;
        animated?: boolean;
    }) => void;
    /**
     * Props to spread onto your ScrollView for full tour integration.
     * Includes ref and scrollEnabled (if disableScrollDuringTour is true).
     */
    scrollViewProps: {
        ref: React.RefObject<any>;
        scrollEnabled?: boolean;
    };
}
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
export declare function useTourScrollView(options?: TourScrollViewOptions): TourScrollViewResult;
//# sourceMappingURL=useTourScrollView.d.ts.map