import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useBookmarks } from '@/hooks/useBookmarks';
import { MovieProps } from '@/types/movie.type';

export default function BookmarksScreen() {
  const { bookmarks } = useBookmarks();

  const loadData = useCallback(
    async (_page: number): Promise<MovieProps[]> => bookmarks,
    [bookmarks]
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
