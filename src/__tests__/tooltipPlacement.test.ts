import {
  getTooltipTop,
  TOOLTIP_EDGE_MARGIN,
  TOOLTIP_TARGET_GAP,
} from '../utils/tooltipPlacement';

const SCREEN_HEIGHT = 640;
const TOOLTIP_HEIGHT = 180;

describe('getTooltipTop', () => {
  it('places the tooltip below a target near the top of the screen', () => {
    // Header icon: plenty of room below.
    const top = getTooltipTop(40, 44, TOOLTIP_HEIGHT, SCREEN_HEIGHT);
    expect(top).toBe(40 + 44 + TOOLTIP_TARGET_GAP);
  });

  it('places the tooltip above a target near the bottom of the screen', () => {
    // FAB: plenty of room above.
    const top = getTooltipTop(560, 56, TOOLTIP_HEIGHT, SCREEN_HEIGHT);
    expect(top).toBe(560 - TOOLTIP_HEIGHT - TOOLTIP_TARGET_GAP);
  });

  it('centers the tooltip on screen when the target is too tall for either side', () => {
    // The reported bug: a 400px tall card starting near the top leaves
    // no room above or below, so the tooltip rendered off-screen bottom.
    const targetY = 143;
    const targetHeight = 400;

    // Sanity check: both sides genuinely overflow in this setup.
    expect(targetY - TOOLTIP_HEIGHT - TOOLTIP_TARGET_GAP).toBeLessThan(
      TOOLTIP_EDGE_MARGIN
    );
    expect(
      targetY + targetHeight + TOOLTIP_TARGET_GAP + TOOLTIP_HEIGHT
    ).toBeGreaterThan(SCREEN_HEIGHT - TOOLTIP_EDGE_MARGIN);

    const top = getTooltipTop(
      targetY,
      targetHeight,
      TOOLTIP_HEIGHT,
      SCREEN_HEIGHT
    );
    expect(top).toBe((SCREEN_HEIGHT - TOOLTIP_HEIGHT) / 2);
  });

  it('keeps the tooltip fully inside the viewport when centered', () => {
    const top = getTooltipTop(143, 400, TOOLTIP_HEIGHT, SCREEN_HEIGHT);
    expect(top).toBeGreaterThanOrEqual(TOOLTIP_EDGE_MARGIN);
    expect(top + TOOLTIP_HEIGHT).toBeLessThanOrEqual(
      SCREEN_HEIGHT - TOOLTIP_EDGE_MARGIN
    );
  });

  it('falls back to the opposite side when the preferred side overflows', () => {
    // Heuristic wants "below" (target top-half) but below overflows while
    // above fits: target lower than usual with a small tooltip.
    // targetY=250, height=200, tooltip=120 on 640 screen:
    // below top = 470, 470+120=590 <= 628 fits... so force overflow:
    // targetY=250, height=360 → below top = 630 → overflow; above top = 110 → fits.
    const top = getTooltipTop(250, 360, 120, SCREEN_HEIGHT);
    expect(top).toBe(250 - 120 - TOOLTIP_TARGET_GAP);
  });
});
