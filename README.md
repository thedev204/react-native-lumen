# React Native Lumen 💡

> A high-performance, fully customizable app tour library for React Native, powered by Reanimated 3.

![Banner](./assets/banner.png)

## Demo

<p>
  <img src="./assets/showcase1.gif" width="220" alt="App Tour Demo" />
  <img src="./assets/showcase2.gif" width="220" alt="App Tour Demo" />
</p>

## Features

- ⚡ **High Performance**: Built with `react-native-reanimated` worklets for 60fps animations.
- 🎨 **Fully Customizable**: Custom Renderers for tooltips, customizable shapes, and backdrops.
- 🌟 **Glow Effects**: Beautiful, customizable glow effects around your highlighted elements.
- 📱 **Expo Compatible**: Works seamlessly with Expo and bare React Native projects.
- 🤸 **Smooth Transitions**: Fluid morphing animations between steps.
- ✨ **Animation Presets**: Ships with beautiful bouncy, gentle, and snappy spring presets.
- 📜 **Auto Scrolling**: Automatically scrolls to next steps.
- 👆 **Interaction Control**: Choose to block or allow interactions with the underlying app.
- 🔒 **Step Enforcement**: Gate step progression with `required` and `completed` props.
- 📱 **Multi-Screen Tours**: Seamlessly run tours across multiple screens/tabs with screen-grouped step ordering.

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

> **Note**: For a complete, running example showcasing different configurations and styles, check out the `example` folder in this repository.

1.  **Wrap your App with `TourProvider`**:

```tsx
import { TourProvider, SnappySpringConfig } from 'react-native-lumen';

export default function App() {
  return (
    <TourProvider
      stepsOrder={['bio', 'prompt', 'poll']}
      config={{
        springConfig: SnappySpringConfig,
        enableGlow: true, // Enable the glow effect globally
        // See config details below
      }}
    >
      <YourComponentThatNeedsTouring />
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

| Prop              | Type                                   | Default     | Description                                           |
| :---------------- | :------------------------------------- | :---------- | :---------------------------------------------------- |
| `children`        | `React.ReactNode`                      | Required    | Application content.                                  |
| `stepsOrder`      | `string[] \| Record<string, string[]>` | `undefined` | Step ordering. Flat array or screen-grouped object.   |
| `backdropOpacity` | `number`                               | `0.5`       | Opacity of the dark background overlay (0-1).         |
| `config`          | `TourConfig`                           | `undefined` | Global configuration options, including `enableGlow`. |

### `TourZone`

Wrapper component to register an element as a tour step. All styling props can also be passed via the `zoneStyle` object prop.

| Prop                 | Type                                   | Default          | Description                                          |
| :------------------- | :------------------------------------- | :--------------- | :--------------------------------------------------- |
| `stepKey`            | `string`                               | Required         | Unique identifier for the step.                      |
| `name`               | `string`                               | `undefined`      | Title of the step.                                   |
| `description`        | `string`                               | Required         | Description text shown in the tooltip.               |
| `order`              | `number`                               | `undefined`      | Order of appearance (if `stepsOrder` not used).      |
| `shape`              | `'rounded-rect' \| 'circle' \| 'pill'` | `'rounded-rect'` | Shape of the zone cutout.                            |
| `borderRadius`       | `number`                               | `10`             | Border radius of the zone (for rounded-rect).        |
| `clickable`          | `boolean`                              | `false`          | If `true`, the step remains interactive.             |
| `preventInteraction` | `boolean`                              | `undefined`      | Overrides global `preventInteraction` for this step. |
| `required`           | `boolean`                              | `false`          | If `true`, hides the skip button for this step.      |
| `completed`          | `boolean`                              | `undefined`      | If `false`, disables the next button until `true`.   |
| `style`              | `ViewStyle`                            | `undefined`      | Style for the wrapping container.                    |
| `zonePadding`        | `number`                               | `0`              | Uniform padding around the highlighted element.      |
| `zonePaddingTop`     | `number`                               | `undefined`      | Top padding override.                                |
| `zonePaddingRight`   | `number`                               | `undefined`      | Right padding override.                              |
| `zonePaddingBottom`  | `number`                               | `undefined`      | Bottom padding override.                             |
| `zonePaddingLeft`    | `number`                               | `undefined`      | Left padding override.                               |
| `zoneBorderWidth`    | `number`                               | `0`              | Width of the zone border.                            |
| `zoneBorderColor`    | `string`                               | `'transparent'`  | Color of the zone border.                            |
| `zoneGlowColor`      | `string`                               | `'#FFFFFF'`      | Color of the outer glow effect.                      |
| `zoneGlowRadius`     | `number`                               | `10`             | Blur radius of the glow effect.                      |
| `zoneGlowSpread`     | `number`                               | `5`              | Spread radius of the glow effect.                    |
| `zoneGlowOffsetX`    | `number`                               | `0`              | Horizontal offset of the glow effect.                |
| `zoneGlowOffsetY`    | `number`                               | `0`              | Vertical offset of the glow effect.                  |
| `zoneStyle`          | `ZoneStyle`                            | `undefined`      | Complete zone style object (groups above props).     |
| `renderCustomCard`   | `(props) => ReactNode`                 | `undefined`      | Custom render function for this step's card.         |

### `TourConfig`

Configuration object needed for `TourProvider`.

```tsx
import { SnappySpringConfig, WigglySpringConfig } from 'react-native-lumen';

interface TourConfig {
  /**
   * Animation configuration for the zone movement.
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
   * Global zone style settings.
   * Can be overridden per-step via TourZone props.
   */
  zoneStyle?: ZoneStyle;
  /**
   * Persistence configuration for saving/restoring tour progress.
   */
  persistence?: TourPersistenceConfig;
  /**
   * Defines whether to apply a shadow/glow effect to the active tour zone highlight.
   */
  enableGlow?: boolean;
  /**
   * Custom styles for the default tooltip appearance.
   */
  tooltipStyles?: TooltipStyles;
}
```

### `ZoneStyle`

Customization options for the zone appearance.

```tsx
interface ZoneStyle {
  padding?: number; // Uniform padding around the element
  paddingTop?: number; // Top padding override
  paddingRight?: number; // Right padding override
  paddingBottom?: number; // Bottom padding override
  paddingLeft?: number; // Left padding override
  borderRadius?: number; // Border radius for 'rounded-rect' shape
  shape?: 'rounded-rect' | 'circle' | 'pill'; // Zone shape
  borderWidth?: number; // Border ring width
  borderColor?: string; // Border color
  glowColor?: string; // Outer glow color (use rgba/hex-alpha for opacity) (requires enableGlow: true)
  glowRadius?: number; // Glow blur radius (requires enableGlow: true)
  glowSpread?: number; // Glow spread radius (requires enableGlow: true)
  glowOffsetX?: number; // Horizontal offset for the glow (requires enableGlow: true)
  glowOffsetY?: number; // Vertical offset for the glow (requires enableGlow: true)
  springDamping?: number; // Per-step spring damping override
  springStiffness?: number; // Per-step spring stiffness override
}
```

### `CardProps`

Props passed to custom card render functions (`renderCard`, `renderCustomCard`).

```tsx
interface CardProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  next: () => void;
  prev: () => void;
  stop: () => void;
  isFirst: boolean;
  isLast: boolean;
  labels?: TourLabels;
  required?: boolean; // Whether skip should be hidden
  completed?: boolean; // Whether next should be disabled (false = disabled)
}
```

## Step Enforcement

Use `required` and `completed` props on `TourZone` to control how users progress through the tour.

### `required` - Hide the Skip Button

When `required={true}`, the skip button is hidden. The user must complete the step or press next to continue.

```tsx
<TourZone
  stepKey="bio"
  order={1}
  description="Edit your bio before continuing."
  required={true}
>
  <Bio user={user} />
</TourZone>
```

### `completed` - Gate the Next Button

When `completed` is set to `false`, the next/finish button is disabled (grayed out, non-pressable). Once the condition is met and `completed` becomes `true`, the button enables.

```tsx
const [tourComplete, setTourComplete] = useState(false);

<TourZone
  stepKey="bio"
  order={1}
  description="Double tap to edit your bio and tell others about yourself."
  required={true}
  completed={tourComplete}
>
  <Bio
    user={User}
    onUpdateBio={(newBio) => {
      updateBio(newBio);
      setTourComplete(true);
    }}
  />
</TourZone>;
```

### Combining `required` and `completed`

Use both props together for full enforcement:

- `required={true}` - No skip button, user cannot bypass the step.
- `completed={tourComplete}` - Next button is disabled until `tourComplete` is `true`.

This is useful for onboarding flows where you need the user to perform an action (e.g., edit their bio, upload a photo) before proceeding.

### Enforcement in Custom Cards

When using `renderCard` or `renderCustomCard`, the `required` and `completed` values are passed through `CardProps`. You can use them to control your custom UI:

```tsx
const MyCustomCard = ({ step, next, stop, required, completed }: CardProps) => (
  <View style={styles.card}>
    <Text>{step.description}</Text>
    <View style={styles.buttons}>
      {!required && <Button onPress={stop} title="Skip" />}
      <Button
        onPress={next}
        title="Next"
        disabled={completed === false}
        color={completed === false ? '#ccc' : '#007AFF'}
      />
    </View>
  </View>
);
```

## Multi-Screen Tours

React Native Lumen supports tours that span multiple screens (e.g., tabs in a bottom navigation bar). This is common when your app has separate screens for profile, home, settings, etc.

### The Problem

When using a navigator (e.g., `BottomTabNavigator`, `CurvedBottomBar`), TourZones on inactive screens are not mounted. If the tour tries to advance to a step on an unmounted screen, it would fail because that step hasn't been registered or measured.

### The Solution: Screen-Grouped `stepsOrder`

Pass `stepsOrder` as an object where keys are screen names and values are arrays of step keys:

```tsx
<TourProvider
  stepsOrder={{
    ProfileSelf: ['bio', 'prompt', 'poll'],
    HomeSwipe: ['filters'],
    SwipeableCards: ['swipeableCards'],
  }}
  config={{
    springConfig: SnappySpringConfig,
    preventInteraction: true,
    persistence: {
      enabled: true,
      tourId: 'main-tour',
      autoResume: true,
      clearOnComplete: true,
    },
  }}
>
  <CurvedBottomBar.Navigator ...>
    {/* screens */}
  </CurvedBottomBar.Navigator>
</TourProvider>
```

This is equivalent to a flat array in terms of step ordering:

```tsx
stepsOrder={['bio', 'prompt', 'poll', 'filters', 'swipeableCards']}
```

But with the screen-grouped format, the library knows which steps belong to which screen. When the tour advances to a step on a different screen:

1. The overlay hides automatically.
2. The tour enters a **pending** state, waiting for that step's `TourZone` to mount.
3. When the user navigates to the correct screen and the `TourZone` mounts, the tour resumes automatically.

### Flat Array (Also Works Cross-Screen)

You can also use a flat array for multi-screen tours. The behavior is the same: if the next step isn't mounted, the tour waits for it:

```tsx
stepsOrder={['bio', 'prompt', 'poll', 'filters', 'swipeableCards']}
```

### Example: Multi-Screen Tour

```tsx
// App.tsx
<TourProvider
  stepsOrder={{
    ProfileSelf: ['bio', 'prompt', 'poll'],
    HomeSwipe: ['filters'],
    SwipeableCards: ['swipeableCards'],
  }}
  config={{ springConfig: SnappySpringConfig }}
>
  <BottomTabNavigator />
</TourProvider>

// ProfileSelf.tsx
<TourZone stepKey="bio" order={1} description="Edit your bio.">
  <Bio />
</TourZone>

<TourZone stepKey="prompt" order={2} description="Add prompts.">
  <PromptCard />
</TourZone>

<TourZone stepKey="poll" order={3} description="Create polls.">
  <PollCard />
</TourZone>

// HomeSwipe.tsx
<TourZone stepKey="filters" order={1} description="Filter your matches.">
  <FilterButton />
</TourZone>

// SwipeableCards.tsx
<TourZone stepKey="swipeableCards" order={1} description="Swipe to match!">
  <CardStack />
</TourZone>
```

When the tour finishes the ProfileSelf steps and calls `next()` on the last ProfileSelf step (`poll`), the overlay hides. Once the user navigates to HomeSwipe, the `filters` TourZone mounts and the tour automatically resumes.

## Tour Control (`useTour` Hook)

The `useTour` hook provides full control over the tour lifecycle.

```tsx
import { useTour } from 'react-native-lumen';

const {
  start, // Start or resume the tour
  stop, // Stop the tour (hides overlay, preserves progress)
  next, // Advance to the next step
  prev, // Go back to the previous step
  currentStep, // Currently active step key (null if inactive)
  steps, // Map of all registered steps
  orderedStepKeys, // Full ordered list of step keys
  clearProgress, // Clear saved progress from storage
  hasSavedProgress, // Whether there's saved progress to resume
  scrollViewRef, // Attach to your ScrollView for auto-scrolling
} = useTour();
```

### `start(stepKey?: string)`

Starts (or resumes) the tour.

- **No arguments**: Starts at the first step. If persistence is enabled with `autoResume: true`, resumes from the last saved step.
- **With `stepKey`**: Starts at the specified step.
- If the target step is not mounted yet (on a different screen), the tour enters a pending state and automatically resumes when the step's `TourZone` mounts.

```tsx
// Start from the beginning (or resume if autoResume is enabled)
start();

// Start at a specific step
start('filters');
```

### `stop()`

Stops the tour and hides the overlay. Does **NOT** clear saved progress. The user can resume later by calling `start()` again.

```tsx
stop();
```

### `next()`

Advances to the next step. If the current step has `completed={false}`, the call is ignored (the user must complete the step first).

If the next step is on an unmounted screen, the overlay hides and the tour waits for that step to mount.

On the last step, `next()` ends the tour and clears progress if `clearOnComplete: true`.

### `prev()`

Goes back to the previous step. If the previous step is on an unmounted screen, the overlay hides and the tour waits for it to mount.

### `clearProgress()`

Manually clears all saved progress from storage. Useful for a "Reset Tour" button.

```tsx
const { clearProgress } = useTour();

const handleResetTour = async () => {
  await clearProgress();
};
```

## Customization Guide

### Zone Shapes

React Native Lumen supports three zone shapes:

```tsx
// Rounded rectangle (default)
<TourZone stepKey="feature" shape="rounded-rect" borderRadius={12}>
  <MyComponent />
</TourZone>

// Circle - great for FAB buttons
<TourZone stepKey="action" shape="circle">
  <FloatingActionButton />
</TourZone>

// Pill - great for horizontal elements like tag rows
<TourZone stepKey="tags" shape="pill">
  <TagList />
</TourZone>
```

### Glow Styles & Per-Step Zone Styling

React Native Lumen features an optional glow effect around the highlighted zone, which can bring a beautiful focus to your UI elements.

**1. Enable Glow Globally**  
Set `enableGlow: true` in your `TourProvider` config. This allows the glow effect to render.

```tsx
<TourProvider config={{ enableGlow: true }}>{/* App Content */}</TourProvider>
```

**2. Customize Per-Step styles**  
You can customize the standard padding, border, and glow effects per-step using individual `zone*` props or the `zoneStyle` object:

```tsx
// Using individual props
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

// Using zoneStyle object
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
          autoResume: true, // Auto-resume from saved step (default: true)
          clearOnComplete: true, // Clear progress when tour finishes (default: true)
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
</TourProvider>;
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

#### Manually Clearing Storage

If you need to clear tour data directly from storage outside the tour context (e.g., during logout or a full app reset):

**MMKV v4:**

```tsx
import { createMMKV } from 'react-native-mmkv';

// The library uses a dedicated MMKV instance with this ID
const storage = createMMKV({ id: 'react-native-lumen-tour' });

// Clear a specific tour
storage.remove('@lumen_tour_onboarding-v1');

// Or clear all tour data - delete all keys starting with @lumen_tour_
const allKeys = storage.getAllKeys();
allKeys
  .filter((key) => key.startsWith('@lumen_tour_'))
  .forEach((key) => storage.remove(key));
```

**AsyncStorage:**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear a specific tour
await AsyncStorage.removeItem('@lumen_tour_onboarding-v1');

// Or clear all tour data
const allKeys = await AsyncStorage.getAllKeys();
const tourKeys = allKeys.filter((key) => key.startsWith('@lumen_tour_'));
await AsyncStorage.multiRemove(tourKeys);
```

The storage key format is `@lumen_tour_{tourId}` where `tourId` is the value you passed in `persistence.tourId`.

## License

MIT
