---
sidebar_position: 2
---

# Getting Started

## Installation

Install React Native Lumen and its required peer dependencies:

```sh
npm install react-native-lumen react-native-reanimated react-native-svg react-native-gesture-handler react-native-worklets
```

Or with Yarn:

```sh
yarn add react-native-lumen react-native-reanimated react-native-svg react-native-gesture-handler react-native-worklets
```

> For a complete, running example showcasing different configurations and styles, check out the [`example`](https://github.com/thedev204/react-native-lumen/tree/main/example) folder in the repository.

---

## Quick Start

### 1. Wrap your app with `TourProvider`

Place `TourProvider` at the root of your application (or wherever you want the tour to be scoped).

```tsx
import { TourProvider, SnappySpringConfig } from 'react-native-lumen';

export default function App() {
  return (
    <TourProvider
      stepsOrder={['bio', 'prompt', 'poll']}
      config={{
        springConfig: SnappySpringConfig,
        enableGlow: true,
      }}
    >
      <YourApp />
    </TourProvider>
  );
}
```

### 2. Highlight elements with `TourZone`

Wrap any component you want to highlight in a tour step.

```tsx
import { TourZone } from 'react-native-lumen';

<TourZone
  stepKey="bio"
  name="Your Bio"
  description="Tap here to edit your bio and let others know about you."
  order={1}
  borderRadius={10}
>
  <BioCard />
</TourZone>;
```

### 3. Control the tour

Use the `useTour` hook to start, stop, and navigate the tour from anywhere in your component tree.

```tsx
import { useTour } from 'react-native-lumen';

const StartButton = () => {
  const { start } = useTour();
  return <Button title="Start Tour" onPress={() => start()} />;
};
```
