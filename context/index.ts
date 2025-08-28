import { createContext } from 'react';

type AppContextType = {
  api?: string;
  version?: string;
  datetime?: string;
  countMovies?: number;
  defaultGenres?: string[];
  uniqueGenres?: string[];
};

export const AppContext = createContext<AppContextType>({
  api: '',
  version: '',
  datetime: '',
  countMovies: 0,
  defaultGenres: [],
  uniqueGenres: []
});
