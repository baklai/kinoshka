import MoviesFlatList from '@/components/MoviesFlatList';
import { AppContext } from '@/context';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const appContext = useContext(AppContext);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {appContext?.baseUrl &&
          appContext.categories.map(({ source, title, limit }, idx) => {
            return (
              <MoviesFlatList
                key={`movie-flat-list-${idx}`}
                title={title}
                source={source}
                limit={limit}
              />
            );
          })}
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
