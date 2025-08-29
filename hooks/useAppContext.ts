import { AppContext, AppContextType } from '@/context';
import { useContext } from 'react';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext должен использоваться внутри <AppContext.Provider>');
  }

  return context;
};
