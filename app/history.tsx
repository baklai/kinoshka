import MovieItem from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { useSecureStore } from '@/hooks/useAsyncStorage';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HistoryScreen() {
  const [storedValue, refreshValue, removeValue] = useSecureStore<string[]>('history', []);

  const movies: MovieProps[] = [];

  return (
    <View style={styles.container}>
      {movies.length > 0 ? (
        movies.map((movie: MovieProps) => <MovieItem {...movie} key={movie.id} />)
      ) : (
        <MoviesNotFound text="Історія перегляду порожня" />
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
