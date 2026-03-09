---
sidebar_position: 1
---

# Step Enforcement

React Native Lumen lets you control how users progress through the tour using the `required` and `completed` props on `TourZone`. This is useful for onboarding flows where users must perform an action before moving forward.

## `required` — Hide the Skip Button

When `required={true}`, the Skip button is hidden. The user must either complete the step or press Next to continue.

```tsx
<TourZone
  stepKey="bio"
  order={1}
  description="Edit your bio before continuing."
  required={true}
>
  <BioCard user={user} />
</TourZone>
```

## `completed` — Gate the Next Button

When `completed={false}`, the Next/Finish button is disabled (grayed out, non-pressable). Once your condition is met and `completed` becomes `true`, the button enables automatically.

```tsx
const [bioUpdated, setBioUpdated] = useState(false);

<TourZone
  stepKey="bio"
  order={1}
  description="Double tap to edit your bio and tell others about yourself."
  completed={bioUpdated}
>
  <BioCard
    user={user}
    onUpdateBio={(newBio) => {
      updateBio(newBio);
      setBioUpdated(true);
    }}
  />
</TourZone>;
```

## Combining Both Props

Use `required` and `completed` together for full enforcement:

- `required={true}` — No Skip button. The user cannot bypass the step.
- `completed={false → true}` — Next button is disabled until the user completes the action.

```tsx
const [tourComplete, setTourComplete] = useState(false);

<TourZone
  stepKey="bio"
  order={1}
  description="Edit your bio to continue."
  required={true}
  completed={tourComplete}
>
  <BioCard
    user={user}
    onUpdateBio={(newBio) => {
      updateBio(newBio);
      setTourComplete(true);
    }}
  />
</TourZone>;
```

## Enforcement in Custom Cards

When using `renderCard` or `renderCustomCard`, the `required` and `completed` values are passed through `CardProps`. Use them to control your custom UI:

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
