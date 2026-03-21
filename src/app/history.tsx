import { MoviesFlatList } from '@/components/MoviesFlatList';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HistoryScreen() {
  const loadData = useCallback(async (_page: number): Promise<MovieProps[]> => {
    try {
      const data = await AsyncStorage.getItem('history');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('History error:', error);
      return [];
    }
  }, []);

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
