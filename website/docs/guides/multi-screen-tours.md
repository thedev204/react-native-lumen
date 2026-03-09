---
sidebar_position: 2
---

# Multi-Screen Tours

React Native Lumen supports tours that span multiple screens — for example, tabs in a bottom navigation bar.

## The Problem

When using a navigator (e.g. `BottomTabNavigator`, `CurvedBottomBar`), `TourZone` components on inactive screens are not mounted. If the tour advances to a step on an unmounted screen, it would fail because that step hasn't been registered or measured yet.

## The Solution: Screen-Grouped `stepsOrder`

Pass `stepsOrder` as an object where keys are screen names and values are arrays of step keys for that screen:

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
  }}
>
  <BottomTabNavigator />
</TourProvider>
```

This is logically equivalent to the flat array below, but carries screen-grouping metadata that the library uses to manage cross-screen transitions:

```tsx
stepsOrder={['bio', 'prompt', 'poll', 'filters', 'swipeableCards']}
```

### What Happens During a Screen Transition

When the tour advances to a step on a **different screen**:

1. The overlay hides automatically.
2. The tour enters a **pending** state, waiting for that step's `TourZone` to mount.
3. When the user navigates to the correct screen and the `TourZone` mounts, the tour resumes automatically.

## Flat Array (Also Cross-Screen Compatible)

You can still use a flat array for multi-screen tours. The behavior is identical — if the next step isn't mounted, the tour enters a pending state and resumes when it mounts:

```tsx
stepsOrder={['bio', 'prompt', 'poll', 'filters', 'swipeableCards']}
```

## Full Example

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

When the tour finishes the `ProfileSelf` steps and calls `next()` on the last step (`poll`), the overlay hides. Once the user navigates to `HomeSwipe`, the `filters` TourZone mounts and the tour automatically resumes.
