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
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards?: (baseUrl: string, source: string) => Promise<MovieProps[]>;
  searchMovieCards?: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails?: (baseUrl: string, source: string) => Promise<MovieProps | null>;
};

export const AppContext = createContext<AppContextType>({
  name: '',
  baseUrl: '',
  searchUrl: '',
  categories: [],
  getMovieCards: async () => [],
  searchMovieCards: async () => [],
  getMovieDetails: async () => null
});
