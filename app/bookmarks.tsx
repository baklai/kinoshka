import NotFoundView from '@/components/NotFoundView';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<MovieProps[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('bookmarks');
        if (data) {
          setBookmarks([...JSON.parse(data)]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <View style={styles.container}>
        {bookmarks?.length > 0 ? (
          // <MoviesFlatList title="Перелік закладок" filters={{ ids: bookmarks }} />
          <></>
        ) : (
          <NotFoundView icon="folder-open" text="Перелік закладок порожній" />
        )}
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
