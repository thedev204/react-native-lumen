---
sidebar_position: 3
---

# useTour

The `useTour` hook provides full programmatic control over the tour lifecycle. It must be called inside a component that is a descendant of `TourProvider`.

```tsx
import { useTour } from 'react-native-lumen';

const {
  start,
  stop,
  next,
  prev,
  currentStep,
  steps,
  orderedStepKeys,
  clearProgress,
  hasSavedProgress,
  scrollViewRef,
} = useTour();
```

## Return Values

| Value              | Type                         | Description                                                                   |
| :----------------- | :--------------------------- | :---------------------------------------------------------------------------- |
| `start`            | `(stepKey?: string) => void` | Start or resume the tour. Optionally start at a specific step.                |
| `stop`             | `() => void`                 | Stop the tour and hide the overlay. Does **not** clear saved progress.        |
| `next`             | `() => void`                 | Advance to the next step. Ignored if `completed={false}` on the current step. |
| `prev`             | `() => void`                 | Go back to the previous step.                                                 |
| `currentStep`      | `string \| null`             | Key of the currently active step, or `null` if the tour is inactive.          |
| `steps`            | `Map<string, TourStep>`      | Map of all registered steps.                                                  |
| `orderedStepKeys`  | `string[]`                   | Full ordered list of step keys derived from `stepsOrder`.                     |
| `clearProgress`    | `() => Promise<void>`        | Clears all saved tour progress from storage.                                  |
| `hasSavedProgress` | `boolean`                    | Whether there is saved progress available to resume.                          |
| `scrollViewRef`    | `AnimatedRef`                | Attach this to an `Animated.ScrollView` to enable auto-scrolling.             |

---

## `start(stepKey?: string)`

Starts or resumes the tour.

- **No arguments** — Starts at the first step. If persistence is enabled with `autoResume: true`, resumes from the last saved step.
- **With `stepKey`** — Jumps directly to the specified step. If that step is not yet mounted (e.g. on a different screen), the tour enters a pending state and resumes automatically when the step mounts.

```tsx
// Start from the beginning (or resume if autoResume is on)
start();

// Jump to a specific step
start('filters');
```

## `stop()`

Stops the tour and hides the overlay. Saved progress is **preserved** — the user can resume later by calling `start()` again.

```tsx
stop();
```

## `next()`

Advances to the next step. If the current step has `completed={false}`, the call is ignored. If the next step is on an unmounted screen, the overlay hides and the tour waits for that step to mount. On the last step, calling `next()` ends the tour (and clears progress if `clearOnComplete: true`).

## `prev()`

Goes back to the previous step. If the previous step is on an unmounted screen, the overlay hides and the tour waits for it to mount.

## `clearProgress()`

Manually clears all saved tour progress from storage. Useful for a "Reset Tour" button or during logout.

```tsx
const { clearProgress } = useTour();

const handleResetTour = async () => {
  await clearProgress();
};
```

## `hasSavedProgress`

Check this before showing a "Resume Tour" button in your UI.

```tsx
const { start, hasSavedProgress } = useTour();

return hasSavedProgress ? (
  <Button title="Resume Tour" onPress={() => start()} />
) : (
  <Button title="Start Tour" onPress={() => start()} />
);
```

## `scrollViewRef`

Attach this ref to an `Animated.ScrollView` to enable auto-scrolling to off-screen steps. See [Auto Scrolling](../guides/customization.md#auto-scroll-support) for details.
