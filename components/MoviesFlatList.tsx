import MovieCard from '@/components/MovieCard';
import { MovieProps } from '@/types/movie.type';
import { useEffect, useState } from 'react';
import { FlatList, LayoutChangeEvent, View } from 'react-native';

const PAGE_SIZE = 10;
const GAP = 8;
const PADDING = 8;
const BASE_CARD_WIDTH = 152;

export default function MoviesFlatList({ database }: { database: MovieProps[] }) {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const initialMovies = database.slice(0, PAGE_SIZE);
    setMovies(initialMovies);
  }, []);

  const loadMoreMovies = () => {
    const start = page * PAGE_SIZE;
    const next = database.slice(start, start + PAGE_SIZE);

    if (next.length > 0) {
      setMovies(prev => [...prev, ...next]);
      setPage(prev => prev + 1);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const numColumns = containerWidth
    ? Math.max(1, Math.floor((containerWidth + GAP) / (BASE_CARD_WIDTH + GAP)))
    : 1;

  const cardWidth = containerWidth
    ? (containerWidth - GAP * (numColumns - 1)) / numColumns
    : BASE_CARD_WIDTH;

  return (
    <View style={{ flex: 1, padding: 4 }} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <FlatList
          key={numColumns}
          data={movies}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MovieCard {...item} width={cardWidth - 4} />}
          numColumns={numColumns}
          contentContainerStyle={{ paddingBottom: GAP }}
          {...(numColumns > 1 && {
            columnWrapperStyle: { gap: GAP, marginBottom: GAP }
          })}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreMovies}
        />
      )}
    </View>
  );
}
