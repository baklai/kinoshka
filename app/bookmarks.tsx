import { MoviesFlatList } from '@/components/MoviesFlatList';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BookmarksScreen() {
  const loadData = async (page: number): Promise<MovieProps[]> => {
    try {
      const data = await AsyncStorage.getItem('bookmarks');
      if (data) {
        return [...JSON.parse(data)];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Bookmarks error:', error);
      return [];
    }
  };

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
