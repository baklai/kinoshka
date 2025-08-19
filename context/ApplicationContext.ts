import { createContext } from 'react';

export interface ApplicationContextType {
  apiBaseUrl: string | null;
  setApiBaseUrl: (value: string) => void;

  apiBaseToken: string | null;
  setApiBaseToken: (value: string) => void;

  clearApiBase: () => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  apiBaseUrl: null,
  setApiBaseUrl: () => {},
  apiBaseToken: null,
  setApiBaseToken: () => {},
  clearApiBase: () => {}
});
