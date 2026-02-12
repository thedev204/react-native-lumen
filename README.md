# React Native Lumen 💡

> A high-performance, fully customizable app tour library for React Native, powered by Reanimated 3.

![Banner](./assets/banner.png)

## Demo

<p>
  <img src="./assets/showcase.gif" width="220" alt="App Tour Demo" />
</p>

## Features

- ⚡ **High Performance**: Built with `react-native-reanimated` worklets for 60fps animations.
- 🎨 **Fully Customizable**: Custom Renderers for tooltips, customizable shapes, and backdrops.
- 📱 **Expo Compatible**: Works seamlessly with Expo and bare React Native projects.
- 🤸 **Smooth Transitions**: Fluid morphing animations between steps.
- ✨ **Animation Presets**: Ships with beautiful bouncy, gentle, and snappy spring presets.
- 📜 **Auto Scrolling**: Automatically scrolls to next steps.
- 👆 **Interaction Control**: Choose to block or allow interactions with the underlying app.

## Requirements

This library relies on strict peer dependencies to ensure performance:

- `react-native` >= 0.70.0
- `react-native-reanimated` >= 3.0.0
- `react-native-svg` >= 12.0.0
- `react-native-gesture-handler` >= 2.0.0

## Installation

```sh
npm install react-native-lumen react-native-reanimated react-native-svg react-native-gesture-handler react-native-worklets
```

## Usage

1.  **Wrap your App with `TourProvider`**:

```tsx
import { TourProvider } from 'react-native-lumen';

export default function App() {
  return (
    <TourProvider>
      <YourAppContent />
    </TourProvider>
  );
}
```

2.  **Highlight Elements with `TourZone`**:

```tsx
import { TourZone } from 'react-native-lumen';

<TourZone
  stepKey="step-1"
  name="My Feature"
  description="This is an awesome feature you should know about."
  order={1}
  borderRadius={10}
>
  <MyButton />
</TourZone>;
```

3.  **Control the Tour**:

```tsx
import { useTour } from 'react-native-lumen';

const MyComponent = () => {
  const { start } = useTour();
  return <Button title="Start Tour" onPress={() => start()} />;
};
```

## API Documentation

### `TourProvider`

The main context provider. Place this at the root of your application.

| Prop              | Type              | Default     | Description                                              |
| :---------------- | :---------------- | :---------- | :------------------------------------------------------- |
| `children`        | `React.ReactNode` | Required    | Application content.                                     |
| `stepsOrder`      | `string[]`        | `undefined` | Optional array of step keys to define a forced sequence. |
| `backdropOpacity` | `number`          | `0.5`       | Opacity of the dark background overlay (0-1).            |
| `config`          | `TourConfig`      | `undefined` | Global configuration options.                            |

### `TourZone`

Wrapper component to register an element as a tour step.

| Prop           | Type                 | Default     | Description                                     |
| :------------- | :------------------- | :---------- | :---------------------------------------------- |
| `stepKey`      | `string`             | Required    | Unique identifier for the step.                 |
| `name`         | `string`             | `undefined` | Title of the step.                              |
| `description`  | `string`             | Required    | Description text shown in the tooltip.          |
| `order`        | `number`             | `undefined` | Order of appearance (if `stepsOrder` not used). |
| `spotlightShape` | `'rounded-rect' \| 'circle' \| 'pill'` | `'rounded-rect'` | Shape of the spotlight cutout. |
| `borderRadius` | `number`             | `10`        | Border radius of the spotlight.                 |
| `clickable`    | `boolean`            | `false`     | If `true`, the step remains interactive.        |
| `style`        | `ViewStyle`          | `undefined` | Style for the wrapping container.               |
| `spotlightPadding` | `number`         | `8`         | Uniform padding around the spotlight.           |
| `spotlightBorderWidth` | `number`     | `2`         | Width of the spotlight border/glow ring.        |
| `spotlightBorderColor` | `string`     | `'#007AFF'` | Color of the spotlight border.                  |
| `spotlightGlowColor` | `string`       | `'#007AFF'` | Color of the outer glow effect.                 |
| `spotlightGlowOpacity` | `number`     | `0.4`       | Opacity of the glow effect (0-1).               |
| `spotlightStyle` | `SpotlightStyle`   | `undefined` | Complete spotlight style object.                |
| `renderCustomCard` | `(props) => ReactNode` | `undefined` | Custom render function for this step's card. |

### `TourConfig`

Configuration object needed for `TourProvider`.

```tsx
interface TourConfig {
  /**
   * Animation configuration for the spotlight movement.
   * You can use presets like WigglySpringConfig, GentleSpringConfig etc.
   */
  springConfig?: WithSpringConfig;
  /**
   * If true, prevents interaction with the underlying app while tour is active.
   */
  preventInteraction?: boolean;
  /**
   * Custom labels for buttons.
   */
  labels?: {
    next?: string;
    previous?: string;
    finish?: string;
    skip?: string;
  };
  /**
   * Custom renderer for the card/tooltip.
   */
  renderCard?: (props: CardProps) => React.ReactNode;
  /**
   * Initial overlay opacity. Default 0.5
   */
  backdropOpacity?: number;
  /**
   * Global spotlight style settings.
   * Can be overridden per-step via TourZone props.
   */
  spotlightStyle?: SpotlightStyle;
}
```

### `SpotlightStyle`

Customization options for the spotlight appearance.

```tsx
interface SpotlightStyle {
  padding?: number;           // Uniform padding around the element (default: 8)
  paddingTop?: number;        // Top padding override
  paddingRight?: number;      // Right padding override
  paddingBottom?: number;     // Bottom padding override
  paddingLeft?: number;       // Left padding override
  borderRadius?: number;      // Border radius for 'rounded-rect' shape (default: 10)
  shape?: 'rounded-rect' | 'circle' | 'pill';  // Spotlight shape (default: 'rounded-rect')
  borderWidth?: number;       // Border/glow ring width (default: 2)
  borderColor?: string;       // Border color (default: '#007AFF')
  glowColor?: string;         // Outer glow color (default: '#007AFF')
  glowOpacity?: number;       // Glow opacity 0-1 (default: 0.4)
  glowRadius?: number;        // Glow blur radius (default: 8)
  springDamping?: number;     // Per-step spring damping override
  springStiffness?: number;   // Per-step spring stiffness override
}
```

## Customization Guide

### Spotlight Shapes

React Native Lumen supports three spotlight shapes:

```tsx
// Rounded rectangle (default)
<TourZone stepKey="feature" spotlightShape="rounded-rect" borderRadius={12}>
  <MyComponent />
</TourZone>

// Circle - great for FAB buttons
<TourZone stepKey="action" spotlightShape="circle">
  <FloatingActionButton />
</TourZone>

// Pill - great for horizontal elements like tag rows
<TourZone stepKey="tags" spotlightShape="pill">
  <TagList />
</TourZone>
```

### Per-Step Spotlight Styling

Customize the spotlight appearance per-step using props or the `spotlightStyle` object:

```tsx
// Using individual props
<TourZone
  stepKey="important"
  spotlightGlowColor="#FF6B6B"
  spotlightBorderColor="#FF6B6B"
  spotlightGlowOpacity={0.6}
  spotlightPadding={16}
>
  <ImportantFeature />
</TourZone>

// Using spotlightStyle object
<TourZone
  stepKey="premium"
  spotlightStyle={{
    shape: 'pill',
    glowColor: '#FFD700',
    borderColor: '#FFD700',
    glowOpacity: 0.5,
    borderWidth: 3,
  }}
>
  <PremiumBadge />
</TourZone>
```

### Per-Step Custom Cards

Render custom tooltip cards for specific steps:

```tsx
<TourZone
  stepKey="special"
  renderCustomCard={({ step, next, stop, currentStepIndex, totalSteps }) => (
    <View style={styles.customCard}>
      <Text>{step.name}</Text>
      <Text>{step.description}</Text>
      <Button title="Continue" onPress={next} />
    </View>
  )}
>
  <SpecialFeature />
</TourZone>
```

### Animation Presets

React Native Lumen comes with built-in Reanimated spring configs for easy usage.

```tsx
import { TourProvider, WigglySpringConfig } from 'react-native-lumen';

<TourProvider config={{ springConfig: WigglySpringConfig }}>...</TourProvider>;
```

### Auto Scroll Support

React Native Lumen supports auto-scrolling to steps that are off-screen. To enable this, simply attach the `scrollViewRef` provided by the hook to your scroll container.

```tsx
import { useTour } from 'react-native-lumen';
import Animated from 'react-native-reanimated';

const MyScrollableScreen = () => {
  const { scrollViewRef } = useTour();

  return (
    <Animated.ScrollView ref={scrollViewRef}>
      {/* ... content with TourZones ... */}
    </Animated.ScrollView>
  );
};
```

> **Note:** The scroll view must be compatible with Reanimated refs (e.g. `Animated.ScrollView`).

Available presets:

- `Reanimated3DefaultSpringConfig`
- `WigglySpringConfig` (Bouncy)
- `GentleSpringConfig` (Smooth)
- `SnappySpringConfig` (Fast & Responsive)
- `and more!`

### Persistence (Resume Tours)

React Native Lumen supports saving tour progress so users can resume where they left off. The library auto-detects available storage (MMKV v4 or AsyncStorage).

```tsx
import { TourProvider } from 'react-native-lumen';

export default function App() {
  return (
    <TourProvider
      config={{
        persistence: {
          enabled: true,
          tourId: 'onboarding-v1', // Unique ID for this tour
          autoResume: true,        // Auto-resume from saved step (default: true)
          clearOnComplete: true,   // Clear progress when tour finishes (default: true)
          maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: expire after 7 days
        },
      }}
    >
      <AppContent />
    </TourProvider>
  );
}
```

#### Storage Support

The library automatically detects and uses:
- **MMKV v4** (`react-native-mmkv` ^4.0.0) - Fastest, recommended
- **AsyncStorage** (`@react-native-async-storage/async-storage`) - Fallback

No additional setup required if either package is installed.

#### Custom Storage

You can provide a custom storage adapter:

```tsx
import { TourProvider, type StorageAdapter } from 'react-native-lumen';

const customStorage: StorageAdapter = {
  getItem: (key) => myStorage.get(key),
  setItem: (key, value) => myStorage.set(key, value),
  removeItem: (key) => myStorage.remove(key),
};

<TourProvider
  config={{
    persistence: {
      enabled: true,
      tourId: 'my-tour',
      storage: customStorage,
    },
  }}
>
  ...
</TourProvider>
```

#### Persistence API

```tsx
const { start, clearProgress, hasSavedProgress } = useTour();

// Check if there's saved progress
if (hasSavedProgress) {
  // Show "Resume Tour" button
}

// Start tour (auto-resumes if enabled)
start();

// Clear saved progress manually
await clearProgress();
```

### Custom Tooltip Card

You can fully replace the default tooltip with your own beautiful UI using the `renderCard` prop in `config`.

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
}: CardProps) => (
  <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 20 }}>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{step.name}</Text>
    <Text>{step.description}</Text>
    <Text style={{ color: 'gray' }}>
      Step {currentStepIndex + 1} of {totalSteps}
    </Text>

    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      <Button onPress={stop} title="Close" />
      <View style={{ flex: 1 }} />
      {!isLast ? (
        <Button onPress={next} title="Next" />
      ) : (
        <Button onPress={stop} title="Finish" />
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

## License

MIT
