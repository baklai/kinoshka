import { createContext } from 'react';

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

export type ServiceConfig = {
  id: string;
  name: string;
  baseUrl: string;
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards: (baseUrl: string, source: string, page?: number) => Promise<MovieProps[]>;
  searchMovieCards: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails: (baseUrl: string, source: string) => Promise<MovieProps | null>;
  getMovieEpisodes: (baseUrl: string, source: string) => Promise<EpisodeProps[]>;
};

export type AppContextType = ServiceConfig & {
  setService: (id: string) => void;
};

const UAKINO_BASE = 'https://uakino.best';

export const SERVICES: Record<string, ServiceConfig> = {
  uakino: {
    id: 'uakino',
    name: 'uakino.best',
    baseUrl: UAKINO_BASE,
    searchUrl: UAKINO_BASE,
    categories: [
      { title: 'Фільми - останні додані', source: `${UAKINO_BASE}/filmy` },
      { title: 'Фільми - дивляться зараз', source: `${UAKINO_BASE}/filmy/online` },
      { title: 'Найкращі фільми українською', source: `${UAKINO_BASE}/filmy/best` },
      { title: 'Серіали - останні додані', source: `${UAKINO_BASE}/seriesss` },
      { title: 'Серіали - дивляться зараз', source: `${UAKINO_BASE}/seriesss/online` },
      { title: 'Найкращі серіали українською', source: `${UAKINO_BASE}/seriesss/best` },
      { title: 'Мультфільми - останні додані', source: `${UAKINO_BASE}/cartoon` },
      { title: 'Мультфільми - дивляться зараз', source: `${UAKINO_BASE}/cartoon/online` },
      { title: 'Найкращі мультфільми українською', source: `${UAKINO_BASE}/cartoon/best` }
    ],
    getMovieCards,
    searchMovieCards,
    getMovieDetails,
    getMovieEpisodes
  }
};

export const DEFAULT_SERVICE_ID = 'uakino';

export const AppContext = createContext<AppContextType>({
  ...SERVICES[DEFAULT_SERVICE_ID],
  setService: () => {}
});
