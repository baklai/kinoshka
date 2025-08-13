import MovieItem from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { HistorySvgIcon } from '@/components/StyledIcons';
import { useSecureStore } from '@/hooks/useAsyncStorage';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const [storedValue, refreshValue, removeValue] = useSecureStore<string[]>('history', []);

  const movies: MovieProps[] = [];

  return (
    <>
      <Drawer.Screen
        options={{
          headerRight: () => null,
          headerTitle: () => (
            <View style={styles.header}>
              <HistorySvgIcon />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                Історія перегляду
              </Text>
            </View>
          )
        }}
      />

      <View style={styles.container}>
        {movies.length > 0 ? (
          movies.map((movie: MovieProps) => <MovieItem {...movie} key={movie.id} />)
        ) : (
          <MoviesNotFound text="Історія перегляду порожня" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(6)
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
