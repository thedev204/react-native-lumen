import { createContext } from 'react';
import type { InternalTourContextType } from '../types';

export const TourContext = createContext<InternalTourContextType | null>(null);
