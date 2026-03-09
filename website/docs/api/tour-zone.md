---
sidebar_position: 2
---

# TourZone

`TourZone` is a wrapper component that registers an element as a step in the tour. It measures the wrapped element and uses its position to drive the highlight overlay.

```tsx
import { TourZone } from 'react-native-lumen';

<TourZone
  stepKey="feature-button"
  name="Feature"
  description="Tap this button to activate the feature."
  order={1}
  shape="rounded-rect"
  borderRadius={12}
>
  <MyButton />
</TourZone>;
```

## Props

### Core

| Prop          | Type        | Default     | Description                                                       |
| :------------ | :---------- | :---------- | :---------------------------------------------------------------- |
| `stepKey`     | `string`    | Required    | Unique identifier for this step.                                  |
| `name`        | `string`    | `undefined` | Title shown in the tooltip.                                       |
| `description` | `string`    | Required    | Description text shown in the tooltip.                            |
| `order`       | `number`    | `undefined` | Step order (used when `stepsOrder` is not set on `TourProvider`). |
| `style`       | `ViewStyle` | `undefined` | Style for the wrapping container.                                 |

### Zone Shape & Appearance

| Prop                | Type                                   | Default          | Description                                      |
| :------------------ | :------------------------------------- | :--------------- | :----------------------------------------------- |
| `shape`             | `'rounded-rect' \| 'circle' \| 'pill'` | `'rounded-rect'` | Shape of the cutout in the overlay.              |
| `borderRadius`      | `number`                               | `10`             | Border radius (applies to `rounded-rect` shape). |
| `zonePadding`       | `number`                               | `0`              | Uniform padding around the highlighted element.  |
| `zonePaddingTop`    | `number`                               | `undefined`      | Top padding override.                            |
| `zonePaddingRight`  | `number`                               | `undefined`      | Right padding override.                          |
| `zonePaddingBottom` | `number`                               | `undefined`      | Bottom padding override.                         |
| `zonePaddingLeft`   | `number`                               | `undefined`      | Left padding override.                           |
| `zoneBorderWidth`   | `number`                               | `0`              | Width of the border ring around the zone.        |
| `zoneBorderColor`   | `string`                               | `'transparent'`  | Color of the border ring.                        |

### Glow Effect

These props require `enableGlow: true` in the `TourProvider` config.

| Prop              | Type     | Default     | Description                                      |
| :---------------- | :------- | :---------- | :----------------------------------------------- |
| `zoneGlowColor`   | `string` | `'#FFFFFF'` | Color of the glow (supports `rgba` for opacity). |
| `zoneGlowRadius`  | `number` | `10`        | Blur radius of the glow.                         |
| `zoneGlowSpread`  | `number` | `5`         | Spread radius of the glow.                       |
| `zoneGlowOffsetX` | `number` | `0`         | Horizontal offset of the glow.                   |
| `zoneGlowOffsetY` | `number` | `0`         | Vertical offset of the glow.                     |

### Interaction & Enforcement

| Prop                 | Type      | Default     | Description                                                               |
| :------------------- | :-------- | :---------- | :------------------------------------------------------------------------ |
| `clickable`          | `boolean` | `false`     | If `true`, the highlighted element remains interactive during the tour.   |
| `preventInteraction` | `boolean` | `undefined` | Overrides the global `preventInteraction` setting for this step.          |
| `required`           | `boolean` | `false`     | If `true`, the Skip button is hidden for this step.                       |
| `completed`          | `boolean` | `undefined` | If `false`, the Next/Finish button is disabled until this becomes `true`. |

### Grouping Props via `zoneStyle`

All zone appearance props can be grouped into a single `zoneStyle` object:

| Prop        | Type        | Description                                                                |
| :---------- | :---------- | :------------------------------------------------------------------------- |
| `zoneStyle` | `ZoneStyle` | Object containing all zone appearance options. Overrides individual props. |

### Custom Render

| Prop               | Type                              | Description                                                                        |
| :----------------- | :-------------------------------- | :--------------------------------------------------------------------------------- |
| `renderCustomCard` | `(props: CardProps) => ReactNode` | Custom tooltip renderer for this specific step. Overrides the global `renderCard`. |

---

## `ZoneStyle` Object

```tsx
interface ZoneStyle {
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  borderRadius?: number;
  shape?: 'rounded-rect' | 'circle' | 'pill';
  borderWidth?: number;
  borderColor?: string;
  glowColor?: string; // requires enableGlow: true
  glowRadius?: number; // requires enableGlow: true
  glowSpread?: number; // requires enableGlow: true
  glowOffsetX?: number; // requires enableGlow: true
  glowOffsetY?: number; // requires enableGlow: true
  springDamping?: number; // Per-step spring damping override
  springStiffness?: number; // Per-step spring stiffness override
}
```

---

## Examples

### Shape Variants

```tsx
// Rounded rectangle (default)
<TourZone stepKey="card" shape="rounded-rect" borderRadius={12}>
  <MyCard />
</TourZone>

// Circle — ideal for FAB buttons
<TourZone stepKey="fab" shape="circle">
  <FloatingActionButton />
</TourZone>

// Pill — ideal for horizontal tag rows
<TourZone stepKey="tags" shape="pill">
  <TagList />
</TourZone>
```

### Glow + Border Styling

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
