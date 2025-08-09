import MovieCard from '@/components/MovieCard';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const LIMIT = 10;

const MoviesFlatList = () => {
  const [data, setData] = useState<MovieProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/movies?limit=${LIMIT}&offset=${offset}`);
      const result = await response.json();

      const newItems = result.docs || [];

      setData((prev: MovieProps[]) => {
        const existingIds = new Set(prev.map((item: MovieProps) => item.id));
        const filteredNewItems = newItems.filter((item: MovieProps) => !existingIds.has(item.id));
        return [...prev, ...filteredNewItems];
      });
      setOffset(prev => prev + LIMIT);
      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, offset, hasNextPage]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <View style={{ margin: scaledPixels(6) }}>
        <MovieCard {...item} />
      </View>
    ),
    []
  );

  if (!data.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фільми</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Нет данных</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: '#fff',
    fontWeight: 'bold',
    padding: scaledPixels(10)
  }
});

export default MoviesFlatList;
