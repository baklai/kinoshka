import { createContext, useContext } from 'react';

export interface DrawerContextType {
  isOpen: boolean;
  toggleDrawer: (isOpen: boolean) => void;
}

export const DrawerContext = createContext<DrawerContextType>({
  isOpen: true,
  toggleDrawer: () => {}
});

export const useDrawerContext = () => useContext(DrawerContext);
