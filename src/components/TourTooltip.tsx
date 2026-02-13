import { useMemo, memo, useState, type ComponentType } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTour } from '../hooks/useTour';
import type {
  CardProps,
  InternalTourContextType,
  TooltipStyles,
} from '../types';
import { DEFAULT_LABELS } from '../constants/defaults';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const getDynamicStyles = (tooltipStyles?: TooltipStyles) => {
  const defaultStyles = {
    backgroundColor: tooltipStyles?.backgroundColor || 'white',
    borderRadius: tooltipStyles?.borderRadius || 12,
    titleColor: tooltipStyles?.titleColor || '#000',
    descriptionColor: tooltipStyles?.descriptionColor || '#444',
    primaryButtonColor: tooltipStyles?.primaryButtonColor || '#007AFF',
    primaryButtonTextColor: tooltipStyles?.primaryButtonTextColor || '#fff',
    primaryButtonBorderRadius: tooltipStyles?.primaryButtonBorderRadius || 25,
    skipButtonTextColor: tooltipStyles?.skipButtonTextColor || '#666',
  };

  return StyleSheet.create({
    cardStyle: {
      backgroundColor: defaultStyles.backgroundColor,
      borderRadius: defaultStyles.borderRadius,
      padding: 20,
      minHeight: 120,
      ...(tooltipStyles?.containerStyle || {}),
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: defaultStyles.titleColor,
      flex: 1,
      ...(tooltipStyles?.titleStyle || {}),
    },
    description: {
      fontSize: 15,
      color: defaultStyles.descriptionColor,
      marginBottom: 20,
      lineHeight: 22,
      ...(tooltipStyles?.descriptionStyle || {}),
    },
    buttonPrimary: {
      backgroundColor: defaultStyles.primaryButtonColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: defaultStyles.primaryButtonBorderRadius,
      ...(tooltipStyles?.primaryButtonStyle || {}),
    },
    primaryButtonText: {
      color: defaultStyles.primaryButtonTextColor,
      fontWeight: 'bold',
      fontSize: 14,
      ...(tooltipStyles?.primaryButtonTextStyle || {}),
    },
    skipText: {
      color: defaultStyles.skipButtonTextColor,
      fontWeight: '600',
      ...(tooltipStyles?.skipButtonTextStyle || {}),
    },
    buttonText: {
      padding: 8,
      ...(tooltipStyles?.skipButtonStyle || {}),
    },
  });
};

export const TourTooltip = memo(() => {
  const {
    targetX,
    targetY,
    targetWidth,
    targetHeight,
    currentStep,
    steps,
    next,
    prev,
    stop,
    opacity,
    config,
    orderedStepKeys,
  } = useTour() as InternalTourContextType;

  const currentStepData = currentStep ? steps[currentStep] : null;

  const tooltipHeight = useSharedValue(150);
  const [tooltipWidth] = useState(280);

  const dynamicStyles = useMemo(
    () => getDynamicStyles(config?.tooltipStyles),
    [config?.tooltipStyles]
  );

  // Use orderedStepKeys from context (consistent with TourProvider's ordering)
  const orderedSteps = orderedStepKeys;

  const currentIndex = currentStep ? orderedSteps.indexOf(currentStep) : -1;
  const totalSteps = orderedSteps.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  const tooltipStyle = useAnimatedStyle(() => {
    'worklet';

    const safeTargetX = targetX.value || 0;
    const safeTargetY = targetY.value || 0;
    const safeTargetWidth = Math.max(targetWidth.value || 0, 1);
    const safeTargetHeight = Math.max(targetHeight.value || 0, 1);
    const safeTooltipHeight = tooltipHeight.value || 150;

    // FIX: Aggressive Interpolation
    // Map the input value [0 -> 0.6] to output [0 -> 1].
    // This ensures that even if 'opacity.value' stops at 0.7 (backdrop level),
    // the tooltip is already fully opaque (1.0).
    const activeOpacity = interpolate(
      opacity.value,
      [0, 0.6],
      [0, 1],
      Extrapolation.CLAMP
    );

    const spaceAbove = safeTargetY;
    const spaceBelow = SCREEN_HEIGHT - (safeTargetY + safeTargetHeight);

    const shouldPlaceAbove =
      (spaceAbove > spaceBelow && spaceAbove > safeTooltipHeight + 30) ||
      (safeTargetY > SCREEN_HEIGHT / 2 && spaceAbove > safeTooltipHeight + 20);

    const horizontalCenter = safeTargetX + safeTargetWidth / 2;
    const left = horizontalCenter - tooltipWidth / 2;

    const clampedLeft = Math.max(
      12,
      Math.min(SCREEN_WIDTH - tooltipWidth - 12, left)
    );

    const style: any = {
      position: 'absolute',
      width: tooltipWidth,
      left: clampedLeft,
      opacity: activeOpacity,
      backgroundColor: config?.tooltipStyles?.backgroundColor || 'white',
      transform: [{ translateY: interpolate(activeOpacity, [0, 1], [10, 0]) }],
    };

    if (shouldPlaceAbove) {
      style.top = Math.max(10, safeTargetY - safeTooltipHeight - 20);
      style.bottom = undefined;
    } else {
      style.top = safeTargetY + safeTargetHeight + 20;
      style.bottom = undefined;
    }

    return style;
  });

  if (!currentStepData) return null;

  const AnimatedView = Animated.View as unknown as ComponentType<any>;

  const handleTooltipLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      tooltipHeight.value = height;
    }
  };

  // Build card props for custom renders
  const cardProps: CardProps = {
    step: currentStepData,
    currentStepIndex: currentIndex,
    totalSteps,
    next,
    prev,
    stop,
    isFirst,
    isLast,
    labels: config?.labels,
    required: currentStepData.required,
    completed: currentStepData.completed,
  };

  // Priority: Per-step custom card > Global custom card > Default card
  // 1. Per-step custom render (highest priority)
  if (currentStepData.renderCustomCard) {
    return (
      <AnimatedView
        style={[
          styles.container,
          tooltipStyle,
          // Reset styles for custom render so the user has full control
          styles.resetStyle,
        ]}
        onLayout={handleTooltipLayout}
      >
        {currentStepData.renderCustomCard(cardProps)}
      </AnimatedView>
    );
  }

  // 2. Global custom render
  if (config?.renderCard) {
    return (
      <AnimatedView
        style={[
          styles.container,
          tooltipStyle,
          // Reset styles for custom render so the user has full control
          styles.resetStyle,
        ]}
        onLayout={handleTooltipLayout}
      >
        {config.renderCard(cardProps)}
      </AnimatedView>
    );
  }

  // 3. Default Render
  const labels = { ...DEFAULT_LABELS, ...config?.labels };
  const labelNext = isLast ? labels.finish : labels.next;
  const labelSkip = labels.skip;

  const isRequired = currentStepData.required === true;
  const isNextDisabled = currentStepData.completed === false;

  return (
    <AnimatedView
      style={[styles.container, dynamicStyles.cardStyle, tooltipStyle]}
      onLayout={handleTooltipLayout}
    >
      <View style={styles.header}>
        <Text style={dynamicStyles.title}>
          {currentStepData.name || 'Step'}
        </Text>
        <Text style={styles.stepIndicator}>
          {currentIndex + 1} / {totalSteps}
        </Text>
      </View>
      <Text style={dynamicStyles.description}>
        {currentStepData.description}
      </Text>

      <View style={styles.footer}>
        {!isLast && !isRequired && (
          <TouchableOpacity onPress={stop} style={dynamicStyles.buttonText}>
            <Text style={dynamicStyles.skipText}>{labelSkip}</Text>
          </TouchableOpacity>
        )}
        {(isLast || isRequired) && <View style={styles.spacer} />}

        <TouchableOpacity
          onPress={isNextDisabled ? undefined : next}
          disabled={isNextDisabled}
          style={[
            dynamicStyles.buttonPrimary,
            isNextDisabled && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              dynamicStyles.primaryButtonText,
              isNextDisabled && styles.disabledButtonText,
            ]}
          >
            {labelNext}
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    // Shadow Props
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetStyle: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    padding: 0,
    borderRadius: 0,
  },
  spacer: {
    width: 10,
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});
