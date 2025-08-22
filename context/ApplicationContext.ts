import { createContext } from 'react';

export interface ApplicationContextType {
  orientation: 'portrait' | 'landscape' | null;

  apiBaseUrl: string | null;
  setApiBaseUrl: (value: string) => void;

  apiBaseToken: string | null;
  setApiBaseToken: (value: string) => void;

  clearApiBase: () => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  orientation: null,

  apiBaseUrl: null,
  setApiBaseUrl: () => {},

  apiBaseToken: null,
  setApiBaseToken: () => {},

  clearApiBase: () => {}
});
