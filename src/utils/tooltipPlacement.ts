/**
 * Pure placement math for the tour tooltip.
 * Kept separate from TourTooltip so it can be unit-tested
 * and called from the Reanimated worklet (hence the 'worklet' directive).
 */

/** Minimum distance from the screen edges. */
export const TOOLTIP_EDGE_MARGIN = 12;
/** Vertical gap between the highlighted target and the tooltip. */
export const TOOLTIP_TARGET_GAP = 20;

/**
 * Computes the `top` position for the tooltip.
 *
 * Preference order:
 * 1. The side (above/below the target) chosen by the existing heuristic.
 * 2. The opposite side, if the preferred side would overflow the viewport.
 * 3. Vertically centered on screen, when neither side fits
 *    (e.g. the highlighted element is too tall and there is no room
 *    above or below without rendering off-screen).
 */
export const getTooltipTop = (
  targetY: number,
  targetHeight: number,
  tooltipHeight: number,
  screenHeight: number
): number => {
  'worklet';

  const spaceAbove = targetY;
  const spaceBelow = screenHeight - (targetY + targetHeight);

  const shouldPlaceAbove =
    (spaceAbove > spaceBelow && spaceAbove > tooltipHeight + 30) ||
    (targetY > screenHeight / 2 && spaceAbove > tooltipHeight + 20);

  const aboveTop = targetY - tooltipHeight - TOOLTIP_TARGET_GAP;
  const belowTop = targetY + targetHeight + TOOLTIP_TARGET_GAP;

  // A side only fits if the ENTIRE tooltip rect stays inside the viewport.
  // (A target scrolled off-screen must not drag the tooltip off with it.)
  const fitsAbove =
    aboveTop >= TOOLTIP_EDGE_MARGIN &&
    aboveTop + tooltipHeight <= screenHeight - TOOLTIP_EDGE_MARGIN;
  const fitsBelow =
    belowTop >= TOOLTIP_EDGE_MARGIN &&
    belowTop + tooltipHeight <= screenHeight - TOOLTIP_EDGE_MARGIN;

  if (shouldPlaceAbove && fitsAbove) return aboveTop;
  if (!shouldPlaceAbove && fitsBelow) return belowTop;
  if (fitsBelow) return belowTop;
  if (fitsAbove) return aboveTop;

  // Neither side fits: center vertically within the viewport.
  return Math.max(TOOLTIP_EDGE_MARGIN, (screenHeight - tooltipHeight) / 2);
};
