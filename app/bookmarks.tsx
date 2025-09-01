import { NotFoundView } from '@/components/NotFoundView';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<MovieProps[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('bookmarks');
        if (data) {
          setBookmarks([...JSON.parse(data)]);
        }
      } catch (error) {
        console.error('Bookmarks error:', error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container} hasTVPreferredFocus>
      {bookmarks?.length > 0 ? (
        <NotFoundView icon="folder-open" text="Перелік закладок порожній" />
      ) : (
        <NotFoundView icon="folder-open" text="Перелік закладок порожній" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
