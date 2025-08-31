import MoviesFlatList from '@/components/MoviesFlatList';
import { AppContext } from '@/context';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function IndexScreen() {
  const appContext = useContext(AppContext);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {appContext?.baseUrl &&
          appContext.categories.map(({ source, title, limit }, idx) => {
            const isFocused = focusedIndex === idx;
            return (
              <View
                key={`movie-flat-list-${idx}`}
                hasTVPreferredFocus={idx === 0}
                onFocus={() => setFocusedIndex(idx)}
                onBlur={() => setFocusedIndex(null)}
              >
                <MoviesFlatList title={title} source={source} limit={limit} focused={isFocused} />
              </View>
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
