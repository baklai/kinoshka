import { MoviesFlatList } from '@/components/MoviesFlatList';
import { AppContext } from '@/context';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function IndexScreen() {
  const { source, title } = useLocalSearchParams<{ source: string; title: string }>();
  const appContext = useContext(AppContext);

  const [category] = appContext.categories;

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <View style={{ flex: 1 }}>
        <MoviesFlatList source={source || category.source} title={title || category.title} />
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
