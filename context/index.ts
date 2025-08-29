import { MovieProps } from '@/types/movie.type';
import { createContext } from 'react';

export type CategoryType = {
  limit: number;
  title: string;
  source: string;
};

export type AppContextType = {
  name: string;
  baseUrl: string;
  categories: CategoryType[];
  getMovieCards?: (baseUrl: string, source: string) => Promise<MovieProps[]>;
  getMovieDetails?: (source: string) => Promise<MovieProps | null>;
};

export const AppContext = createContext<AppContextType>({
  name: '',
  baseUrl: '',
  categories: [],
  getMovieCards: async () => [],
  getMovieDetails: async () => null
});
