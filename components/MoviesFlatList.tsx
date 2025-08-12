import MovieCard from '@/components/MovieCard';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text } from 'react-native';

const LIMIT = 20;
const IMAGE_SIZE = 100;
const IMAGE_MARGIN = 5;

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
  const numColumns = Math.floor(screenWidth / (IMAGE_SIZE + IMAGE_MARGIN * 2));

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
      numColumns={5}
      renderItem={renderItem}
      onEndReached={() => setPage(prev => prev + 1)}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<Text>Немає даних</Text>}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ca563f',
    fontWeight: 'bold',
    fontSize: scaledPixels(24),
    padding: scaledPixels(10)
  }
});

export default MoviesFlatList;
