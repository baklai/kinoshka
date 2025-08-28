import MoviesFlatList from '@/components/MoviesFlatList';
import NotFoundView from '@/components/NotFoundView';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await SecureStore.getItemAsync('bookmarks');
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
          <MoviesFlatList title="Перелік закладок" filters={{ ids: bookmarks }} />
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
