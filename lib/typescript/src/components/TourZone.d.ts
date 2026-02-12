import React from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import type { SpotlightStyle, SpotlightShape, CardProps } from '../types';
interface TourZoneProps {
    /** Unique identifier for this step */
    stepKey: string;
    /** Display name shown in tooltip */
    name?: string;
    /** Description text shown in tooltip */
    description: string;
    /** Order of appearance in the tour */
    order?: number;
    /**
     * @deprecated Use `spotlightShape` instead
     */
    shape?: 'rect' | 'circle';
    /**
     * Shape of the spotlight cutout.
     * - 'rounded-rect': Standard rounded rectangle (default)
     * - 'circle': Circular spotlight that encompasses the element
     * - 'pill': Pill/capsule shape with fully rounded ends
     */
    spotlightShape?: SpotlightShape;
    /** Border radius of the spotlight (for 'rounded-rect' shape) */
    borderRadius?: number;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    /** If true, allows user interaction with the target element */
    clickable?: boolean;
    /** Uniform padding around the highlighted element */
    spotlightPadding?: number;
    /** Top padding for the spotlight */
    spotlightPaddingTop?: number;
    /** Right padding for the spotlight */
    spotlightPaddingRight?: number;
    /** Bottom padding for the spotlight */
    spotlightPaddingBottom?: number;
    /** Left padding for the spotlight */
    spotlightPaddingLeft?: number;
    /** Width of the border/glow ring around the spotlight */
    spotlightBorderWidth?: number;
    /** Color of the border/glow ring */
    spotlightBorderColor?: string;
    /** Color of the outer glow effect */
    spotlightGlowColor?: string;
    /** Opacity of the glow effect (0-1) */
    spotlightGlowOpacity?: number;
    /** Blur radius for the glow effect */
    spotlightGlowRadius?: number;
    /** Complete spotlight style object (alternative to individual props) */
    spotlightStyle?: SpotlightStyle;
    /** Custom render function for this step's tooltip/card */
    renderCustomCard?: (props: CardProps) => React.ReactNode;
}
export declare const TourZone: React.FC<TourZoneProps>;
export {};
//# sourceMappingURL=TourZone.d.ts.map