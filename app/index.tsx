import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useAppContext } from '@/hooks/useAppContext';
import { MovieProps } from '@/types/movie.type';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const { source } = useLocalSearchParams<{ source: string }>();

  const { baseUrl, categories, getMovieCards } = useAppContext();

  const fetchData = async (page: number): Promise<MovieProps[]> => {
    const fetchSource = source || categories[Math.floor(Math.random() * categories.length)].source;

    if (!fetchSource) return [];

    return await getMovieCards(baseUrl, fetchSource, page);
  };

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <MoviesFlatList onFetch={fetchData} />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
