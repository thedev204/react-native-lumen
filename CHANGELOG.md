# Changelog

All notable changes to this project will be documented in this file.

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
