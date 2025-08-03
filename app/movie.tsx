import MovieView from '@/components/MovieView';
import { useApplication } from '@/providers/ApplicationProvider';
import { MovieProps } from '@/types/movie.type';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MovieScreen() {
  const { id = null } = useLocalSearchParams();
  const { selectedCategory } = useApplication();

  if (!id) {
    router.push('/');
    return null;
  }

  const movie: MovieProps | undefined = undefined;

  if (!movie) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerSearchBarOptions: undefined,
          headerTitle: () => (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>{movie.title}</Text>
              <Text style={{ fontSize: 12, color: '#888' }}>Категорія: {selectedCategory}</Text>
            </View>
          )
        }}
      />
      <View style={styles.container}>{movie && <MovieView {...movie} />}</View>
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
