import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useHistory } from '@/hooks/useHistory';
import { MovieProps } from '@/types/movie.type';

export default function HistoryScreen() {
  const { loadHistory } = useHistory();

  const loadData = useCallback(
    async (_page: number): Promise<MovieProps[]> => {
      return loadHistory();
    },
    [loadHistory]
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
