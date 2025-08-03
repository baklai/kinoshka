import MoviesFlatList from '@/components/MoviesFlatList';
import MoviesNotFound from '@/components/MoviesNotFound';
import { useApplication } from '@/providers/ApplicationProvider';
import { MovieProps } from '@/types/movie.type';
import { Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { selectedCategory } = useApplication();
  const database = useSQLiteContext();
  const [movies, setMovies] = useState<MovieProps[]>([]);

  useEffect(() => {
    async function setup() {
      const records = await database.getAllAsync<Record<string, any>>(
        'SELECT * FROM movies WHERE category = ?',
        [selectedCategory]
      );

      const parsedRecords = records.map(
        row =>
          ({
            ...row,
            genres: row.genres ? JSON.parse(row.genres) : [],
            actors: row.actors ? JSON.parse(row.actors) : [],
            directors: row.directors ? JSON.parse(row.directors) : [],
            episode: row.episode ? JSON.parse(row.episode) : []
          }) as MovieProps
      );

      setMovies(parsedRecords);
    }

    setup();
  }, [selectedCategory]);

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                {selectedCategory || 'Kinoshka'}
              </Text>
              <Text style={{ fontSize: 12, color: '#888' }}>Кінозал</Text>
            </View>
          )
        }}
      />
      <View style={styles.container}>
        {movies.length > 0 ? (
          <MoviesFlatList database={movies} />
        ) : (
          <MoviesNotFound text="Список перегляду порожній" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex'
  }
});
