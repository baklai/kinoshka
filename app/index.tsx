import MoviesFlatList from '@/components/MoviesFlatList';
import MoviesNotFound from '@/components/MoviesNotFound';
import { useApplication } from '@/providers/ApplicationProvider';
import { MovieProps } from '@/types/movie.type';
import axios from 'axios';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { selectedCategory } = useApplication();
  const [movies, setMovies] = useState<MovieProps[]>([]);

  useEffect(() => {
    async function setup() {
      try {
        const response = await axios.get<Record<string, any>>('/api/movies', {
          params: {
            category: selectedCategory,
            limit: 40,
            offset: 0
          }
        });

        const records = response.data.docs;

        setMovies(records);
      } catch (error) {
        console.error('Ошибка при получении фильмов:', error);
      }
    }

    setup();
  }, []);

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
