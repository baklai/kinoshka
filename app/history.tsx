import MovieItem from '@/components/MovieCard';
import AnyNotFound from '@/components/NotFoundView';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { useSecureStore } from '@/hooks/useSecureStore';
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
        <AnyNotFound icon="folder-open" text="Історія перегляду порожня" />
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
