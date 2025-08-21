import MovieItem from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { useSecureStore } from '@/hooks/useAsyncStorage';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BookmarksScreen() {
  const [storedValue, refreshValue, removeValue] = useSecureStore<string[]>('bookmarks', []);

  const movies: MovieProps[] = [];

  return (
    <View style={styles.container}>
      {movies.length > 0 ? (
        movies.map((movie: MovieProps) => <MovieItem {...movie} key={movie.id} />)
      ) : (
        <MoviesNotFound text="Список закладок порожній" />
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
    padding: 6,
    gap: 6
  }
});
