import { EpisodeProps, MovieProps } from '@/types/movie.type';

export type CategoryType = {
  title: string;
  source: string;
};

export type ServiceType = {
  key: string;
  name: string;
  baseUrl: string;
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards: (baseUrl: string, source: string, page?: number) => Promise<MovieProps[]>;
  searchMovieCards: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails: (baseUrl: string, source: string) => Promise<MovieProps | null>;
  getMovieEpisodes: (baseUrl: string, source: string) => Promise<EpisodeProps[]>;
};
