import MovieCard from '@/components/MovieCard';
import SkeletonView from '@/components/SkeletonView';
import { AppTheme } from '@/constants/theme.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import NotFoundView from './NotFoundView';

interface MoviesFlatListProps {
  source: string;
  title?: string;
  limit?: number;
  focused?: boolean;
}
const ITEM_WIDTH = scaledPixels(181);
const ITEM_SPACING = scaledPixels(24);

const MoviesFlatList = ({ source, title, limit = 10, focused = false }: MoviesFlatListProps) => {
  const { baseUrl, getMovieCards } = useAppContext();
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadedPages, setLoadedPages] = useState(new Set<number>());

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || loadedPages.has(page)) return;

    try {
      setLoading(true);
      const response = await getMovieCards(baseUrl, source, page);

      if (response.length < limit) {
        setHasMore(false);
      }

      setData((prev: MovieProps[]) => {
        const existingIds = new Set(prev.map((item: MovieProps) => item.source));
        const filtered = response.filter((item: MovieProps) => !existingIds.has(item.source));
        return [...prev, ...filtered];
      });

      setLoadedPages(prev => new Set(prev).add(page));
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, loadedPages]);

  const handlePressSelectItem = useCallback((item: MovieProps) => {
    router.push({
      pathname: '/details',
      params: { source: item.source }
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard {...item} handlePress={() => handlePressSelectItem(item)} />
    ),
    [handlePressSelectItem]
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
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonView key={idx} />
          ))}
        </View>
      );
    }

    return (
      <NotFoundView
        icon="folder-open"
        text="Не вдалося знайти відео"
        size={64}
        style={{ height: scaledPixels(259) }}
      />
    );
  }, [loading]);

  const Separator = useCallback(() => <View style={{ width: ITEM_SPACING }} />, []);

  const renderSkeletonItem = useCallback(() => <SkeletonView />, []);

  const keyExtractor = useCallback(
    (item: MovieProps, index: number) => String(item.source || index),
    []
  );

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, focused && { color: AppTheme.colors.text }]}>
            {title}
          </Text>
        </View>
      )}

      <FlatList
        horizontal
        data={loading && data.length === 0 ? Array(limit).fill({}) : data}
        keyExtractor={keyExtractor}
        renderItem={loading && data.length === 0 ? renderSkeletonItem : renderItem}
        getItemLayout={getItemLayout}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
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
    color: AppTheme.colors.subtext,
    fontWeight: 'bold',
    letterSpacing: scaledPixels(1),
    fontSize: scaledPixels(20)
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: ITEM_SPACING,
    paddingHorizontal: ITEM_SPACING
  }
});

export default MoviesFlatList;
