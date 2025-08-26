import MovieCard from '@/components/MovieCard';
import { AppTheme } from '@/constants/theme.constant';
import { PAGE_LIMIT } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieFilterProps } from '@/types/filters.type';
import { MovieProps } from '@/types/movie.type';
import { MovieSortProps } from '@/types/sorts.type';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import NotFoundView from './NotFoundView';
import SkeletonView from './SkeletonView';

interface MoviesFlatListProps {
  title?: string;
  limit?: number;
  sort?: MovieSortProps;
  filters?: MovieFilterProps;
}

const ITEM_WIDTH = scaledPixels(181);
const ITEM_SPACING = scaledPixels(24);

const MoviesFlatList = ({ title, limit = PAGE_LIMIT, sort, filters }: MoviesFlatListProps) => {
  const [records, setRecords] = useState<MovieProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, fetch } = useAsyncFetch('movies');

  const handleSelectItem = useCallback((item: MovieProps) => {
    router.push({
      pathname: '/details',
      params: { id: item.id }
    });
  }, []);

  const loadMore = () => {
    if (!loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

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

  const renderSkeletonItem = useCallback(() => <SkeletonView />, []);

  const renderEmpty = useCallback(
    () => (
      <NotFoundView
        icon="folder-open"
        text="Не вдалося знайти відео"
        size={64}
        style={{ height: scaledPixels(259) }}
      />
    ),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('', {
          params: {
            page: currentPage,
            limit,
            sort,
            filters
          }
        });

        if (response?.docs?.length > 0) {
          setRecords(prev => (currentPage === 1 ? response.docs : [...prev, ...response.docs]));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      )}

      <FlatList
        horizontal
        data={loading ? Array(PAGE_LIMIT).fill({}) : records}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={loading ? renderSkeletonItem : renderItem}
        getItemLayout={getItemLayout}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        ListEmptyComponent={renderEmpty}
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
  },
  skeletonCard: {
    height: 100,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12
  }
});

export default MoviesFlatList;
