import MovieCard from '@/components/MovieCard';
import NotFoundView from '@/components/NotFoundView';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const movies: MovieProps[] = [];

  return (
    <View style={styles.container}>
      {movies.length > 0 ? (
        movies.map((movie: MovieProps) => <MovieCard {...movie} key={movie.id} />)
      ) : (
        <NotFoundView icon="folder-open" text="Список закладок порожній" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10)
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    overflowX: 'auto',
    padding: scaledPixels(6),
    gap: scaledPixels(6)
  }
});
