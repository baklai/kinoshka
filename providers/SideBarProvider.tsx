import { DrawerContext } from '@/context/DrawerContext';
import { ReactNode, useContext, useMemo, useState } from 'react';

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const contextValue = useMemo(() => ({ isOpen, toggleDrawer: setIsOpen }), [isOpen]);

  return <DrawerContext.Provider value={contextValue}>{children}</DrawerContext.Provider>;
};
