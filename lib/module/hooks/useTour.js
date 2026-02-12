"use strict";

import { useContext } from 'react';
import { TourContext } from "../context/TourContext.js";
export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
//# sourceMappingURL=useTour.js.map