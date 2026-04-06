import { EpisodeProps, MovieProps } from '@/types/movie.type';

export type CategoryType = {
  key: string;
  title: string;
  source: string;
};

export type ServiceType = {
  key: string;
  name: string;
  categories: CategoryType[];
  getMovieCards: (source: string, page?: number) => Promise<MovieProps[]>;
  searchMovieCards: (search: string) => Promise<MovieProps[]>;
  getMovieDetails: (source: string) => Promise<MovieProps | null>;
  getMovieEpisodes: (source: string) => Promise<EpisodeProps[]>;
};
