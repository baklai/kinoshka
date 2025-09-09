import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useAppContext } from '@/hooks/useAppContext';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const { source } = useLocalSearchParams<{ source: string }>();
  const { baseUrl, categories, getMovieCards } = useAppContext();

  const fetchSource = useMemo(
    () => source || categories[Math.floor(Math.random() * categories.length)].source,
    [source, categories]
  );

  const fetchData = useCallback(
    async (page: number) => {
      if (!fetchSource) return [];
      try {
        return await getMovieCards(baseUrl, fetchSource, page);
      } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
        return [];
      }
    },
    [source, baseUrl, getMovieCards]
  );

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <MoviesFlatList onFetch={fetchData} key={fetchSource} />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
