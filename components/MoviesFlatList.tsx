import MovieCard from '@/components/MovieCard';
import AnyNotFound from '@/components/NotFoundView';
import { AppTheme } from '@/constants/theme.constant';
import { PAGE_LIMIT } from '@/constants/ui.constant';
import { usePaginatedMovie } from '@/hooks/usePaginatedMovie';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieFilterProps } from '@/types/filters.type';
import { MovieProps } from '@/types/movie.type';
import { MovieSortProps } from '@/types/sorts.type';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface MoviesFlatListProps {
  header?: string;
  loader?: boolean;
  empty?: boolean;
  limit?: number;
  sort?: MovieSortProps;
  filters?: MovieFilterProps;
}

const ITEM_WIDTH = scaledPixels(181);
const ITEM_SPACING = scaledPixels(24);

const MoviesFlatList = ({
  header,
  loader = true,
  empty = false,
  limit = PAGE_LIMIT,
  sort,
  filters
}: MoviesFlatListProps) => {
  const {
    data: records,
    isLoading,
    hasMoreData,
    loadMore
  } = usePaginatedMovie({
    path: 'movies',
    filters,
    limit,
    sort
  });

  const handleSelectItem = useCallback((item: MovieProps) => {
    router.push({
      pathname: '/details',
      params: { id: item.id }
    });
  }, []);

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

  const renderEmpty = useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: scaledPixels(10)
        }}
      >
        {isLoading && records.length === 0 && loader ? (
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        ) : empty ? (
          <AnyNotFound icon="folder-open" text="Не вдалося знайти відео" size={64} />
        ) : null}
      </View>
    );
  }, [isLoading, records.length, loader, empty]);

  return (
    <View style={styles.container}>
      {header && header.length > 0 && records.length > 0 && (
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
  }
});

export default MoviesFlatList;
