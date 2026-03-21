import {
  getMovieCards,
  getMovieDetails,
  getMovieEpisodes,
  searchMovieCards
} from '@/services/uakino.service';
import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { createContext } from 'react';

export type CategoryType = {
  title: string;
  source: string;
};

export type AppContextType = {
  name: string;
  baseUrl: string;
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards: (baseUrl: string, source: string, page?: number) => Promise<MovieProps[]>;
  searchMovieCards: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails: (baseUrl: string, source: string) => Promise<MovieProps | null>;
  getMovieEpisodes: (baseUrl: string, source: string) => Promise<EpisodeProps[]>;
};

const CATEGORIES: CategoryType[] = [
  { title: 'Фільми - останні додані', source: 'https://uakino.best/filmy' },
  { title: 'Фільми - дивляться зараз', source: 'https://uakino.best/filmy/online' },
  { title: 'Найкращі фільми українською', source: 'https://uakino.best/filmy/best' },
  { title: 'Серіали - останні додані', source: 'https://uakino.best/seriesss' },
  { title: 'Серіали - дивляться зараз', source: 'https://uakino.best/seriesss/online' },
  { title: 'Найкращі серіали українською', source: 'https://uakino.best/seriesss/best' },
  { title: 'Мультфільми - останні додані', source: 'https://uakino.best/cartoon' },
  { title: 'Мультфільми - дивляться зараз', source: 'https://uakino.best/cartoon/online' },
  { title: 'Найкращі мультфільми українською', source: 'https://uakino.best/cartoon/best' }
];

export const AppContextValue: AppContextType = {
  name: 'uakino.best',
  baseUrl: 'https://uakino.best',
  searchUrl: 'https://uakino.best',
  categories: CATEGORIES,
  getMovieCards,
  searchMovieCards,
  getMovieDetails,
  getMovieEpisodes
};

export const AppContext = createContext<AppContextType>({
  name: '',
  baseUrl: '',
  searchUrl: '',
  categories: [],
  getMovieCards: async () => [],
  searchMovieCards: async () => [],
  getMovieDetails: async () => null,
  getMovieEpisodes: async () => []
});
