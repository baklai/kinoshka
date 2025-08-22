import MovieCard from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { AppTheme } from '@/constants/theme.constant';
import { LIMIT } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { useNamedRouter } from '@/hooks/useNamedRouter';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface MoviesFlatListProps {
  genres?: string[];
}

const MoviesFlatList = ({ genres }: MoviesFlatListProps) => {
  const { navigate } = useNamedRouter();

  const { loading, findAll } = useAsyncFetch('movies');

  const [records, setRecords] = useState<MovieProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    try {
      const response = await findAll({
        params: {
          limit: LIMIT,
          page,
          filters: genres?.filter(Boolean).length ? { genres: { $in: genres } } : {}
        }
      });

      const newItems = response.docs || [];

      setRecords(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const filteredNewItems = newItems.filter((item: any) => !existingIds.has(item.id));
        return [...prev, ...filteredNewItems];
      });

      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error('Помилка завантаження:', error);
    }
  }, [loading, page, hasNextPage, genres, findAll]);

  const handleSelectItem = async (item: MovieProps) => {
    navigate('DETAILS', { id: item.id });
  };

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard {...item} handlePress={() => handleSelectItem(item)} />
    ),
    []
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  if (!records.length && !loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{genres?.join(', ')}</Text>
      </View>
      <FlatList
        horizontal
        data={records}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: scaledPixels(24) }} />}
        ListEmptyComponent={() => <MoviesNotFound text="Не удалось найти видео" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    paddingVertical: scaledPixels(8)
  },
  headerText: {
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    letterSpacing: scaledPixels(1),
    fontSize: scaledPixels(22)
  }
});

export default MoviesFlatList;
