import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { MovieProps } from '@/types/movie.type';

export default function BookmarksScreen() {
  const db = useSQLiteContext();

  const loadData = useCallback(
    async (_page: number): Promise<MovieProps[]> => {
      try {
        return await db.getAllAsync<MovieProps>('SELECT source, poster, title FROM bookmarks');
      } catch (error) {
        console.error('[BookmarksScreen] loadData error:', error);
        return [];
      }
    },
    [db]
  );

  return (
    <View style={styles.container} hasTVPreferredFocus>
      <MoviesFlatList onFetch={loadData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
