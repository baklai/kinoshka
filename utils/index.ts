import { MovieFilterProps, MovieProps, MovieSortProps } from '@/types/movie.type';

type Matrix<T> = T[][];

export function transpose<T>(matrix: Matrix<T>): Matrix<T> {
  const maxLength = Math.max(...matrix.map(row => row.length));
  const result: Matrix<T> = Array.from({ length: maxLength }, () => []);

  matrix.forEach(row => {
    row.forEach((item, colIndex) => {
      result[colIndex].push(item);
    });
  });

  return result;
}

export function createMovieSorts(params: Partial<MovieSortProps>): MovieSortProps {
  const sort: MovieSortProps = {};

  for (const key in params) {
    const value = params[key as keyof MovieSortProps];
    if (value) {
      sort[key as keyof MovieSortProps] = value;
    }
  }

  return sort;
}

export function createMovieFilters(params: Partial<MovieProps>): MovieFilterProps {
  const filters: MovieFilterProps = {};

  if (params.title) {
    filters.title = { $regex: params.title, $options: 'i' };
  }

  if (params.originalTitle) {
    filters.originalTitle = { $regex: params.originalTitle, $options: 'i' };
  }

  if (params.year) {
    filters.year = { $regex: params.year, $options: 'i' };
  }

  if (params.genres?.length) {
    filters.genres = { $in: params.genres };
  }

  if (params.countries?.length) {
    filters.countries = { $in: params.countries };
  }

  return filters;
}
