import { MovieCard } from '@/components/MovieCard';
import { NotFoundView } from '@/components/NotFoundView';
import { SkeletonView } from '@/components/SkeletonView';
import { useAppContext } from '@/hooks/useAppContext';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, useWindowDimensions } from 'react-native';

interface MoviesFlatListProps {
  source: string;
  title?: string;
}

const ITEM_SPACING = 14;
const POSTER_RATIO = 3 / 2;

export const MoviesFlatList = ({ source }: MoviesFlatListProps) => {
  const { width, height } = useWindowDimensions();
  const { baseUrl, getMovieCards } = useAppContext();
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadedPages, setLoadedPages] = useState(new Set<number>());

  const NUM_COLUMNS = useMemo(() => (Platform.isTV ? 5 : width > height ? 4 : 2), [width, height]);

  const ITEM_WIDTH = useMemo(
    () => (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS,
    [width, NUM_COLUMNS]
  );

  const ITEM_HEIGHT = useMemo(() => ITEM_WIDTH * POSTER_RATIO, [ITEM_WIDTH]);

  const skeletonData = useMemo(
    () =>
      Array.from({ length: NUM_COLUMNS * 2 }).map(
        (_, i) => ({ source: `skeleton-${i}` }) as MovieProps
      ),
    []
  );

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || loadedPages.has(page)) return;

    try {
      setLoading(true);
      const response = await getMovieCards(baseUrl, source, page);

      if (response.length === 0) {
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

  const handlePressSelectItem = useCallback((source: string) => {
    router.push({
      pathname: '/details',
      params: { source }
    });
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <NotFoundView
        icon="folder-open"
        text="Не вдалося знайти відео"
        size={64}
        style={{ height: scaledPixels(259) }}
      />
    );
  }, []);

  const keyExtractor = useCallback(
    (item: MovieProps, index: number) => String(item.source || index),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard
        {...item}
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginBottom: ITEM_SPACING
        }}
        onPress={handlePressSelectItem}
      />
    ),
    [handlePressSelectItem]
  );

  const renderSceleton = useCallback(
    () => (
      <SkeletonView
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginBottom: ITEM_SPACING
        }}
      />
    ),
    []
  );

  return (
    <FlatList
      key={NUM_COLUMNS}
      data={loading && data.length === 0 ? skeletonData : data}
      keyExtractor={keyExtractor}
      renderItem={loading && data.length === 0 ? renderSceleton : renderItem}
      numColumns={NUM_COLUMNS}
      onEndReached={fetchData}
      onEndReachedThreshold={0.8}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{
        flexGrow: 1
      }}
      columnWrapperStyle={{
        justifyContent: 'space-between'
      }}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={8}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_SPACING,
    paddingHorizontal: ITEM_SPACING
  }
});
