import MovieCard from '@/components/MovieCard';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import MoviesNotFound from './MoviesNotFound';

const LIMIT = 20;
const CARD_SIZE = 196;
const CARD_MARGIN = 3;

const MoviesFlatList = ({
  api,
  category,
  filters,
  onPress
}: {
  api?: string;
  category: string;
  filters: Record<string, any>;
  onPress: (id: MovieProps) => void;
}) => {
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = Math.floor(
    screenWidth / (scaledPixels(CARD_SIZE) + scaledPixels(CARD_MARGIN * 2))
  );

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${api}/movies?limit=${LIMIT}&page=${page}&filters={"category": "${filters.category}"}`
      );

      const result = await response.json();

      const newItems = result.docs || [];

      setData((prev: MovieProps[]) => {
        const existingIds = new Set(prev.map((item: MovieProps) => item.id));
        const filteredNewItems = newItems.filter((item: MovieProps) => !existingIds.has(item.id));
        return [...prev, ...filteredNewItems];
      });

      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, page, hasNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => <MovieCard {...item} handlePress={item => onPress(item)} />,
    [onPress]
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  if (!data.length) {
    return null;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item?.id}
      numColumns={numColumns}
      renderItem={renderItem}
      onEndReached={() => setPage(prev => prev + 1)}
      onEndReachedThreshold={0.5}
      columnWrapperStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
      ListEmptyComponent={<MoviesNotFound text="Не вдалось знайти відео" />}
    />
  );
};

const styles = StyleSheet.create({});

export default MoviesFlatList;
