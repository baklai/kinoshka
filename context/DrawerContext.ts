import { createContext } from 'react';

export interface DrawerContextType {
  isOpen: boolean;
  toggleDrawer: (isOpen: boolean) => void;
}

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
