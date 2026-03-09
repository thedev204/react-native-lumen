---
sidebar_position: 4
---

# Types Reference

## `CardProps`

Props passed to custom card render functions (`renderCard` on `TourProvider`, `renderCustomCard` on `TourZone`).

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
  required?: boolean; // If true, the skip button should be hidden
  completed?: boolean; // If false, the next button should be disabled
}
```

| Field              | Type         | Description                                              |
| :----------------- | :----------- | :------------------------------------------------------- |
| `step`             | `TourStep`   | The current step's data (key, name, description).        |
| `currentStepIndex` | `number`     | Zero-based index of the current step.                    |
| `totalSteps`       | `number`     | Total number of steps in the tour.                       |
| `next`             | `() => void` | Advance to the next step.                                |
| `prev`             | `() => void` | Go back to the previous step.                            |
| `stop`             | `() => void` | Stop/close the tour.                                     |
| `isFirst`          | `boolean`    | Whether the current step is the first step.              |
| `isLast`           | `boolean`    | Whether the current step is the last step.               |
| `labels`           | `TourLabels` | Button label overrides from `config.labels`.             |
| `required`         | `boolean`    | Whether the skip button should be hidden.                |
| `completed`        | `boolean`    | Whether the next button is enabled (`false` = disabled). |

---

## `TourPersistenceConfig`

Configuration for the persistence (resume) feature.

```tsx
interface TourPersistenceConfig {
  enabled: boolean;
  tourId: string;
  autoResume?: boolean;
  clearOnComplete?: boolean;
  maxAge?: number;
  storage?: StorageAdapter;
}
```

| Field             | Type             | Default     | Description                                                             |
| :---------------- | :--------------- | :---------- | :---------------------------------------------------------------------- |
| `enabled`         | `boolean`        | —           | Enables persistence.                                                    |
| `tourId`          | `string`         | —           | Unique identifier for this tour's saved state.                          |
| `autoResume`      | `boolean`        | `true`      | Automatically resume from the last saved step when `start()` is called. |
| `clearOnComplete` | `boolean`        | `true`      | Clear saved progress when the tour completes.                           |
| `maxAge`          | `number`         | `undefined` | Milliseconds before saved progress expires.                             |
| `storage`         | `StorageAdapter` | `undefined` | Custom storage adapter (defaults to MMKV v4 or AsyncStorage).           |

---

## `StorageAdapter`

Interface for providing a custom storage backend.

```tsx
interface StorageAdapter {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}
```

---

## `TourLabels`

Custom labels for the tour navigation buttons.

```tsx
interface TourLabels {
  next?: string;
  previous?: string;
  finish?: string;
  skip?: string;
}
```
