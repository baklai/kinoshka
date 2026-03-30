import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useAppContext } from '@/hooks/useAppContext';

const FocusContainer = Platform.isTV ? require('react-native').TVFocusGuideView : View;

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
        console.error('Помилка завантаження фільмів:', error);
        return [];
      }
    },
    [fetchSource, baseUrl, getMovieCards]
  );

  const focusProps = Platform.isTV
    ? { trapFocusLeft: true, trapFocusRight: true, trapFocusDown: true }
    : {};

  return (
    <FocusContainer style={styles.container} {...focusProps}>
      <MoviesFlatList onFetch={fetchData} key={fetchSource} />
    </FocusContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
