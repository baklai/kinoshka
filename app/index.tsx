import MoviesFlatList from '@/components/MoviesFlatList';
import React from 'react';
import { ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const genres = [['Екшн'], ['Трилери'], ['Пригоди'], ['Серіали'], ['Мультфільми']];

  return (
    <TVFocusGuideView style={{ flex: 1 }} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {genres.map((item, idx) => {
          return <MoviesFlatList key={idx} genres={item} />;
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
