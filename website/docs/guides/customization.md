---
sidebar_position: 3
---

# Customization

## Zone Shapes

React Native Lumen supports three zone shapes for the overlay cutout:

```tsx
// Rounded rectangle (default)
<TourZone stepKey="card" shape="rounded-rect" borderRadius={12}>
  <MyCard />
</TourZone>

// Circle — ideal for FAB buttons
<TourZone stepKey="fab" shape="circle">
  <FloatingActionButton />
</TourZone>

// Pill — ideal for horizontal elements like tag rows
<TourZone stepKey="tags" shape="pill">
  <TagList />
</TourZone>
```

---

## Glow Effect

The glow effect draws a soft bloom around the highlighted zone. Enable it globally in `TourProvider`, then customize per step.

### 1. Enable Globally

```tsx
<TourProvider config={{ enableGlow: true }}>{/* App Content */}</TourProvider>
```

### 2. Customize Per Step

Use individual `zone*` props or the `zoneStyle` object:

```tsx
// Individual props
<TourZone
  stepKey="important"
  zoneGlowColor="rgba(255, 107, 107, 0.6)"
  zoneBorderColor="#FF6B6B"
  zoneGlowSpread={5}
  zoneGlowOffsetY={2}
  zonePadding={16}
>
  <ImportantFeature />
</TourZone>

// zoneStyle object
<TourZone
  stepKey="premium"
  zoneStyle={{
    shape: 'pill',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    borderColor: '#FFD700',
    borderWidth: 3,
  }}
>
  <PremiumBadge />
</TourZone>
```

---

## Custom Tooltip Card

### Global Custom Card

Replace the default tooltip for **all steps** using `renderCard` in the `TourProvider` config:

```tsx
import { TourProvider, CardProps } from 'react-native-lumen';

const CustomCard = ({
  step,
  next,
  prev,
  stop,
  isLast,
  currentStepIndex,
  totalSteps,
  required,
  completed,
}: CardProps) => (
  <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 20 }}>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{step.name}</Text>
    <Text>{step.description}</Text>
    <Text style={{ color: 'gray' }}>
      Step {currentStepIndex + 1} of {totalSteps}
    </Text>
    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      {!required && <Button onPress={stop} title="Close" />}
      <View style={{ flex: 1 }} />
      {!isLast ? (
        <Button onPress={next} title="Next" disabled={completed === false} />
      ) : (
        <Button onPress={next} title="Finish" disabled={completed === false} />
      )}
    </View>
  </View>
);

export default function App() {
  return (
    <TourProvider config={{ renderCard: (props) => <CustomCard {...props} /> }}>
      <AppContent />
    </TourProvider>
  );
}
```

### Per-Step Custom Card

Override the tooltip for a **specific step** using `renderCustomCard` on `TourZone`:

```tsx
<TourZone
  stepKey="special"
  renderCustomCard={({ step, next, stop, currentStepIndex, totalSteps }) => (
    <View style={styles.customCard}>
      <Text>{step.name}</Text>
      <Text>{step.description}</Text>
      <Text>
        {currentStepIndex + 1} / {totalSteps}
      </Text>
      <Button title="Continue" onPress={next} />
    </View>
  )}
>
  <SpecialFeature />
</TourZone>
```

---

## Animation Presets

React Native Lumen ships with built-in Reanimated spring configs:

| Preset                           | Feel                 |
| :------------------------------- | :------------------- |
| `Reanimated3DefaultSpringConfig` | Default Reanimated 3 |
| `WigglySpringConfig`             | Bouncy / playful     |
| `GentleSpringConfig`             | Smooth / slow        |
| `SnappySpringConfig`             | Fast & responsive    |

```tsx
import { TourProvider, WigglySpringConfig } from 'react-native-lumen';

<TourProvider config={{ springConfig: WigglySpringConfig }}>...</TourProvider>;
```

---

## Auto Scroll Support

React Native Lumen auto-scrolls to steps that are off-screen. It detects when the scroll animation finishes before snapping the highlight, ensuring smooth transitions.

Use the `useTourScrollView` hook and spread its props onto your scroll container:

```tsx
import { useTourScrollView } from 'react-native-lumen';
import Animated from 'react-native-reanimated';

const MyScrollableScreen = () => {
  const { scrollViewProps } = useTourScrollView({
    // Optional: disable user scrolling while the tour is active
    disableScrollDuringTour: true,
  });

  return (
    <Animated.ScrollView {...scrollViewProps}>
      {/* TourZone components */}
    </Animated.ScrollView>
  );
};
```

:::note
The scroll view must be an `Animated.ScrollView` from `react-native-reanimated`. Spreading `scrollViewProps` automatically wires up the `ref`, `scrollEnabled`, and the `onMomentumScrollEnd` handler for smooth scroll-end detection.
:::
