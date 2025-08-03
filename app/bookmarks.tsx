import MovieItem from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { useSecureStore } from '@/hooks/useAsyncStorage';
import { MovieProps } from '@/types/movie.type';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function BookmarksScreen() {
  const [storedValue, refreshValue, removeValue] = useSecureStore<string[]>('bookmarks', []);

  const movies: MovieProps[] = [];

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerTitle: () => (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Закладки</Text>
            </View>
          )
        }}
      />
      <View style={styles.container}>
        {movies.length > 0 ? (
          movies.map((movie: MovieProps) => <MovieItem {...movie} key={movie.id} />)
        ) : (
          <MoviesNotFound text="Список закладок порожній" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    overflowX: 'auto',
    padding: 6,
    gap: 6
  }
});
