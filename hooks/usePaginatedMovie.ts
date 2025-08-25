import { PAGE_LIMIT } from '@/constants/ui.constant';
import { MovieFilterProps } from '@/types/filters.type';
import { MovieSortProps } from '@/types/sorts.type';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAsyncFetch } from './useAsyncFetch';

interface PaginatedMovieProps {
  path?: string;
  limit: number;
  filters?: MovieFilterProps;
  sort?: MovieSortProps;
}

export const usePaginatedMovie = ({
  path = 'movies',
  limit = PAGE_LIMIT,
  filters,
  sort
}: PaginatedMovieProps) => {
  const [data, setData] = useState([]);
  const { loading, fetch } = useAsyncFetch(path);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useLayoutEffect(() => {
    setData([]);
    setCurrentPage(1);
    setHasMoreData(true);
  }, [filters, sort]);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('', {
          params: {
            page: currentPage,
            limit,
            sort,
            filters
          }
        });

        if (!isCancelled && response?.docs?.length > 0) {
          setData(prev => (currentPage === 1 ? response?.docs : [...prev, ...response.docs]));
          setHasMoreData(response.docs.length === limit);
        }
      } catch (error) {
        if (!isCancelled) console.error('Error fetching data:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, filters, sort]);

  const loadMore = () => {
    if (!isLoading && hasMoreData) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return { data, isLoading, hasMoreData, loadMore };
};
