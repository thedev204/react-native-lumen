---
sidebar_position: 4
---

# Persistence

React Native Lumen supports saving tour progress so users can resume where they left off, even after closing the app.

## Setup

Pass a `persistence` config object to `TourProvider`:

```tsx
import { TourProvider } from 'react-native-lumen';

export default function App() {
  return (
    <TourProvider
      config={{
        persistence: {
          enabled: true,
          tourId: 'onboarding-v1', // unique ID for this tour
          autoResume: true, // auto-resume on next app open
          clearOnComplete: true, // clear progress when the tour finishes
          maxAge: 7 * 24 * 60 * 60 * 1000, // optional: expire after 7 days
        },
      }}
    >
      <AppContent />
    </TourProvider>
  );
}
```

## Storage Support

The library automatically detects and uses the best available storage:

| Package                                     | Priority     | Notes                |
| :------------------------------------------ | :----------- | :------------------- |
| `react-native-mmkv` ^4.0.0                  | First choice | Fastest, synchronous |
| `@react-native-async-storage/async-storage` | Fallback     | Asynchronous         |

No additional setup is required if either package is already installed.

## Custom Storage Adapter

Provide your own storage backend via the `storage` field:

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

## Persistence API

```tsx
const { start, clearProgress, hasSavedProgress } = useTour();

// Show a "Resume Tour" button if there's saved progress
if (hasSavedProgress) {
  // ...
}

// Start the tour (auto-resumes from saved step if autoResume is true)
start();

// Clear progress manually (e.g. on logout or "Reset Tour" button)
await clearProgress();
```

## Manually Clearing Storage

If you need to clear tour data directly from storage outside the tour context (e.g. during logout or a full app reset):

### MMKV v4

```tsx
import { createMMKV } from 'react-native-mmkv';

// The library uses a dedicated MMKV instance
const storage = createMMKV({ id: 'react-native-lumen-tour' });

// Clear a specific tour
storage.remove('@lumen_tour_onboarding-v1');

// Clear all tour data
const allKeys = storage.getAllKeys();
allKeys
  .filter((key) => key.startsWith('@lumen_tour_'))
  .forEach((key) => storage.remove(key));
```

### AsyncStorage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear a specific tour
await AsyncStorage.removeItem('@lumen_tour_onboarding-v1');

// Clear all tour data
const allKeys = await AsyncStorage.getAllKeys();
const tourKeys = allKeys.filter((key) => key.startsWith('@lumen_tour_'));
await AsyncStorage.multiRemove(tourKeys);
```

:::tip Storage Key Format
Keys are stored as `@lumen_tour_{tourId}` where `tourId` is the value you passed in `persistence.tourId`.
:::
