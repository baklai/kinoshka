import { useContext } from 'react';

import { AppContext } from '@/context/app.context';

export function useAppContext() {
  return useContext(AppContext);
}
