# Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.7] - 2026-10-21

### Changed

- Example app upgraded to Expo SDK 58, React Native 0.88, and React 19.3.
- Development stack aligned with Reanimated 4.7 and `react-native-worklets` 0.13.
- Peer dependency for `react-native-worklets` raised to `>=0.5.0`.
- Jest migrated to `@react-native/jest-preset` (required by React Native 0.88).
- TypeScript upgraded to 6.0 for the library and example.

### Fixed

- Per-step spring overrides compatible with Reanimated 4's mutually exclusive `SpringConfig` type.

### Docs

- Documented `react-native-worklets` in installation requirements.

---

## [1.1.6] - 2026-07-26

### Added

- `followTarget` config to track the zone/tooltip while scrolling (#13).

### Fixed

- Tooltip viewport overflow when the target is too tall (#12).
- Spotlight entrance animation not replaying after `stop()` → `start()` (#11).

---

## [1.1.5] - 2026-06-13

### Fixed

- Reanimated "Reading from `value` during component render" warning (#10).

---

## [1.1.4] - 2026-04-08

### Fixed

- Pop Up Delay and Flickering (#7)

---

## [1.1.3] - 2026-04-02

### Fixed

- Steps not working on non scrollview screen (#6)

---

## [1.1.2] - 2026-03-17

### Added

- Added `SECURITY.md`.

### Fixed

- Merged community fix for background overlay on Android.

---

## [1.1.1] - 2025-03-08

### Added

- Fade In/Out effect for better UX.

### Fixed

- Fixed an issue "Highlight misalignment on scroll".

---

## [1.1.0] - 2025-02-22

### Added

- **Glow Effect** — New `enableGlow` option in `TourConfig` with per-step controls (`zoneGlowColor`, `zoneGlowRadius`, `zoneGlowSpread`, `zoneGlowOffsetX`, `zoneGlowOffsetY`).
- **Step Enforcement** — `required` and `completed` props on `TourZone` to gate tour progression.
- **Multi-Screen Tours** — Support for screen-grouped `stepsOrder` (`Record<string, string[]>`) to run tours across multiple navigator screens.
- **Persistence** — `TourPersistenceConfig` with auto-detect storage (MMKV v4 or AsyncStorage), `autoResume`, `clearOnComplete`, and `maxAge` options.
- `useTourScrollView` hook for auto-scrolling support with `Animated.ScrollView`.

### Changed

- `TourProvider` now accepts `stepsOrder` as either a flat `string[]` or a screen-grouped `Record<string, string[]>`.
- Updated minimum `react-native-reanimated` peer dependency to `^3.0.0`.

### Fixed

- Fixed pill-shaped zone cutout rendering.

---

## [1.0.0] - 2025-01-26

### Added

- Initial release of React Native Lumen.
- `TourProvider`, `TourZone`, `TourTooltip`, and `TourOverlay` components.
- `useTour` hook for programmatic tour control (`start`, `stop`, `next`, `prev`).
- Three zone shapes: `rounded-rect`, `circle`, and `pill`.
- Built-in spring animation presets: `SnappySpringConfig`, `GentleSpringConfig`, `WigglySpringConfig`, `Reanimated3DefaultSpringConfig`.
- Custom tooltip renderer via `renderCard` in `TourConfig`.
- Per-step custom tooltip via `renderCustomCard` on `TourZone`.
- Expo and bare React Native support.
