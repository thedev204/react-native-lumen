---
sidebar_position: 1
---

# TourProvider

The main context provider that powers the tour. Place it at the root of your application (or your tour-scoped component tree).

```tsx
import { TourProvider } from 'react-native-lumen';

<TourProvider stepsOrder={['step1', 'step2']} config={{ enableGlow: true }}>
  <App />
</TourProvider>;
```

## Props

| Prop              | Type                                   | Default     | Description                                         |
| :---------------- | :------------------------------------- | :---------- | :-------------------------------------------------- |
| `children`        | `React.ReactNode`                      | Required    | Application content.                                |
| `stepsOrder`      | `string[] \| Record<string, string[]>` | `undefined` | Step ordering. Flat array or screen-grouped object. |
| `backdropOpacity` | `number`                               | `0.5`       | Opacity of the dark background overlay (0–1).       |
| `config`          | `TourConfig`                           | `undefined` | Global configuration options.                       |

## `TourConfig`

The `config` prop accepts a `TourConfig` object with the following fields:

```tsx
interface TourConfig {
  springConfig?: WithSpringConfig;
  preventInteraction?: boolean;
  labels?: {
    next?: string;
    previous?: string;
    finish?: string;
    skip?: string;
  };
  renderCard?: (props: CardProps) => React.ReactNode;
  backdropOpacity?: number;
  zoneStyle?: ZoneStyle;
  persistence?: TourPersistenceConfig;
  enableGlow?: boolean;
  tooltipStyles?: TooltipStyles;
}
```

| Field                | Type                              | Default     | Description                                                                          |
| :------------------- | :-------------------------------- | :---------- | :----------------------------------------------------------------------------------- |
| `springConfig`       | `WithSpringConfig`                | `undefined` | Reanimated spring config for zone animations. Use presets like `SnappySpringConfig`. |
| `preventInteraction` | `boolean`                         | `false`     | If `true`, blocks interaction with the app while the tour is active.                 |
| `labels`             | `object`                          | `undefined` | Custom labels for the Next, Previous, Finish, and Skip buttons.                      |
| `renderCard`         | `(props: CardProps) => ReactNode` | `undefined` | Fully custom tooltip renderer applied to all steps.                                  |
| `backdropOpacity`    | `number`                          | `0.5`       | Opacity of the overlay backdrop.                                                     |
| `zoneStyle`          | `ZoneStyle`                       | `undefined` | Global zone styling defaults (overridable per step).                                 |
| `persistence`        | `TourPersistenceConfig`           | `undefined` | Configuration for saving and resuming tour progress.                                 |
| `enableGlow`         | `boolean`                         | `false`     | Enables the glow effect around highlighted zones.                                    |
| `tooltipStyles`      | `TooltipStyles`                   | `undefined` | Custom styles for the default tooltip card.                                          |

## Animation Presets

React Native Lumen ships with built-in Reanimated spring configs:

| Preset                           | Description                 |
| :------------------------------- | :-------------------------- |
| `Reanimated3DefaultSpringConfig` | Default Reanimated 3 spring |
| `WigglySpringConfig`             | Bouncy, playful feel        |
| `GentleSpringConfig`             | Smooth, slow transitions    |
| `SnappySpringConfig`             | Fast and responsive         |

```tsx
import { TourProvider, SnappySpringConfig } from 'react-native-lumen';

<TourProvider config={{ springConfig: SnappySpringConfig }}>...</TourProvider>;
```
