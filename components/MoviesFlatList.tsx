import MovieCard from '@/components/MovieCard';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const LIMIT = 10;

const MoviesFlatList = () => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://192.19.2.21:3000/api/movies?limit=${LIMIT}&offset=${offset}`
      );
      const result = await response.json();

      const newItems = result.docs || [];

      setData(prev => [...prev, ...newItems]);
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

  const renderItem = ({ item, index }: { item: MovieProps; index: number }) => (
    <View style={{ margin: 6 }}>
      <MovieCard {...item} />
    </View>
  );

  if (!data.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фільми</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        ListEmptyComponent={<Text>Нет данных</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    margin: scaledPixels(10)
  }
});

export default MoviesFlatList;
