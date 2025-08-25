import { createContext } from 'react';

export interface ApplicationContextType {
  isReady: boolean;

  orientation: 'portrait' | 'landscape' | undefined;

  apiBaseUrl: string | null;
  setApiBaseUrl: (value: string) => void;

  apiBaseToken: string | null;
  setApiBaseToken: (value: string) => void;

  history: string[];
  setHistory: (value: string[]) => void;

  bookmarks: string[];
  setBookmarks: (value: string[]) => void;

  categories: string[];
  setCategories: (value: string[]) => void;

  clearApiBase: () => void;
  clearHistory: () => void;
  clearBookmarks: () => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  isReady: false,

  orientation: undefined,

  apiBaseUrl: null,
  setApiBaseUrl: () => {},

  apiBaseToken: null,
  setApiBaseToken: () => {},

  history: [],
  setHistory: () => {},

  bookmarks: [],
  setBookmarks: () => {},

  categories: [],
  setCategories: () => {},

  clearApiBase: () => {},
  clearHistory: () => {},
  clearBookmarks: () => {}
});
