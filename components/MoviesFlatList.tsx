import MovieCard from '@/components/MovieCard';
import MoviesNotFound from '@/components/MoviesNotFound';
import { AppTheme } from '@/constants/theme.constant';
import { PAGE_LIMIT } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { useNamedRouter } from '@/hooks/useNamedRouter';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieFilterProps, MovieProps, MovieSortProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, ToastAndroid, View } from 'react-native';

interface MoviesFlatListProps {
  header?: string;
  limit?: number;
  sort?: MovieSortProps;
  filters?: MovieFilterProps;
}

const ITEM_WIDTH = scaledPixels(181);
const ITEM_SPACING = scaledPixels(24);

const MoviesFlatList = ({ header, limit = PAGE_LIMIT, sort, filters }: MoviesFlatListProps) => {
  const { navigate } = useNamedRouter();

  const { loading, findAll } = useAsyncFetch('movies');

  const [records, setRecords] = useState<MovieProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    try {
      const response = await findAll({ params: { page, limit, sort, filters } });

      const newItems = response?.docs || [];

      if (newItems.length > 0) {
        setRecords(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const filteredNewItems = newItems.filter((item: any) => !existingIds.has(item.id));
          return [...prev, ...filteredNewItems];
        });

        setHasNextPage(response.hasNextPage);
      }
    } catch (error) {
      ToastAndroid.show('Помилка завантаження!', ToastAndroid.SHORT);
      console.error('Помилка завантаження:', error);
    }
  }, [loading, page, hasNextPage, sort, filters, findAll]);

  const handleSelectItem = useCallback(
    (item: MovieProps) => {
      navigate('DETAILS', { id: item.id });
    },
    [navigate]
  );

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard {...item} handlePress={() => handleSelectItem(item)} />
    ),
    [handleSelectItem]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH + ITEM_SPACING,
      offset: (ITEM_WIDTH + ITEM_SPACING) * index,
      index
    }),
    []
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const loadFirstPage = async () => {
      setPage(1);
      setRecords([]);
      const response = await findAll({ params: { page: 1, limit, sort, filters } });
      const newItems = response?.docs || [];
      setRecords(newItems);
      setHasNextPage(response.hasNextPage);
    };
    loadFirstPage();
  }, [sort, filters]);

  return (
    <View style={styles.container}>
      {header && header.length > 0 && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      )}

      <FlatList
        horizontal
        data={records}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: scaledPixels(10)
            }}
          >
            {loading && records.length === 0 ? (
              <ActivityIndicator size="large" color={AppTheme.colors.primary} />
            ) : (
              <MoviesNotFound text="Не вдалося знайти відео" size={64} />
            )}
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
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
