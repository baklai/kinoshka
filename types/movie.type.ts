export type SortDirection = 'asc' | 'desc';

export interface MovieProps {
  id: string;
  title: string;
  originalTitle?: string;
  description?: string;
  poster?: string;
  quality?: string;
  duration?: string;
  age?: string;
  year?: string;
  imdb?: string;
  likes?: string;
  dislikes?: string;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  countries?: string[];
  episodes?: Record<string, any>[];
}

export interface MovieFilterProps {
  title?: { $regex: string; $options: 'i' };
  originalTitle?: { $regex: string; $options: 'i' };
  year?: { $regex: string; $options: 'i' };
  genres?: { $in: string[] };
  countries?: { $in: string[] };
}

export interface MovieSortProps {
  year?: SortDirection;
  imdb?: SortDirection;
  likes?: SortDirection;
  dislikes?: SortDirection;
}
