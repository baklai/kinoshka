export type SortDirection = 'asc' | 'desc';

export interface MovieSortProps {
  year?: SortDirection;
  imdb?: SortDirection;
  likes?: SortDirection;
  dislikes?: SortDirection;
}
