import type { ZoneStyle } from '../types';

export interface ZoneFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

/**
 * Computes the highlight zone frame for an element, applying per-side padding
 * and the zone shape. Worklet-safe so it can run on the UI thread.
 *
 * Unlike TourProvider's computeZoneGeometry, this does NOT clamp to screen
 * bounds: tracking must be able to follow the element off-viewport.
 */
export const computeZoneFrame = (
  x: number,
  y: number,
  width: number,
  height: number,
  zoneStyle: ZoneStyle,
  borderRadius: number
): ZoneFrame => {
  'worklet';

  const zpt = zoneStyle.paddingTop ?? zoneStyle.padding ?? 0;
  const zpr = zoneStyle.paddingRight ?? zoneStyle.padding ?? 0;
  const zpb = zoneStyle.paddingBottom ?? zoneStyle.padding ?? 0;
  const zpl = zoneStyle.paddingLeft ?? zoneStyle.padding ?? 0;
  const zShape = zoneStyle.shape ?? 'rounded-rect';

  if (zShape === 'circle') {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const radius = Math.max(width, height) / 2 + (zoneStyle.padding ?? 0);
    return {
      x: cx - radius,
      y: cy - radius,
      width: radius * 2,
      height: radius * 2,
      radius,
    };
  }

  if (zShape === 'pill') {
    const w = width + zpl + zpr;
    const h = height + zpt + zpb;
    return { x: x - zpl, y: y - zpt, width: w, height: h, radius: h / 2 };
  }

  return {
    x: x - zpl,
    y: y - zpt,
    width: width + zpl + zpr,
    height: height + zpt + zpb,
    radius: borderRadius,
  };
};
