import { createContext } from 'react';

import { BASE_URL, SEARCH_URL } from '@/constants/api.constant';
import {
  getMovieCards,
  getMovieDetails,
  getMovieEpisodes,
  searchMovieCards
} from '@/services/uakino.service';
import { EpisodeProps, MovieProps } from '@/types/movie.type';

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
  { title: 'Фільми - останні додані', source: `${BASE_URL}/filmy` },
  { title: 'Фільми - дивляться зараз', source: `${BASE_URL}/filmy/online` },
  { title: 'Найкращі фільми українською', source: `${BASE_URL}/filmy/best` },
  { title: 'Серіали - останні додані', source: `${BASE_URL}/seriesss` },
  { title: 'Серіали - дивляться зараз', source: `${BASE_URL}/seriesss/online` },
  { title: 'Найкращі серіали українською', source: `${BASE_URL}/seriesss/best` },
  { title: 'Мультфільми - останні додані', source: `${BASE_URL}/cartoon` },
  { title: 'Мультфільми - дивляться зараз', source: `${BASE_URL}/cartoon/online` },
  { title: 'Найкращі мультфільми українською', source: `${BASE_URL}/cartoon/best` }
];

export const AppContextValue: AppContextType = {
  name: 'uakino.best',
  baseUrl: BASE_URL,
  searchUrl: SEARCH_URL,
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
