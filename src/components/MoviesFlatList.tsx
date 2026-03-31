import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, LayoutChangeEvent, Platform, View, ViewStyle } from 'react-native';

import { MovieCard } from '@/components/MovieCard';
import { NotFoundView } from '@/components/NotFoundView';
import { SkeletonView } from '@/components/SkeletonView';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';

interface MoviesFlatListProps {
  onFetch: (page: number) => Promise<MovieProps[]>;
}

const ITEM_SPACING = 14;
const POSTER_RATIO = 3 / 2;

export const MoviesFlatList = React.memo(({ onFetch }: MoviesFlatListProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadedPagesRef = useRef(new Set<number>());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setContainerWidth(w);
  }, []);

  const NUM_COLUMNS = useMemo(() => (Platform.isTV ? 6 : 2), []);

  const ITEM_WIDTH = useMemo(() => {
    if (containerWidth === 0) return 0;
    return (containerWidth - ITEM_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  }, [containerWidth, NUM_COLUMNS]);

  const ITEM_HEIGHT = useMemo(() => ITEM_WIDTH * POSTER_RATIO, [ITEM_WIDTH]);

  const itemStyles = useMemo<ViewStyle[]>(() => {
    if (ITEM_WIDTH === 0) return [];
    return Array.from({ length: NUM_COLUMNS }, (_, colIndex) => ({
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      marginBottom: ITEM_SPACING,
      marginRight: colIndex < NUM_COLUMNS - 1 ? ITEM_SPACING : 0
    }));
  }, [ITEM_WIDTH, ITEM_HEIGHT, NUM_COLUMNS]);

  const skeletonData = useMemo(
    () =>
      Array.from({ length: NUM_COLUMNS * 2 }).map(
        (_, i) => ({ source: `skeleton-${i}` }) as MovieProps
      ),
    [NUM_COLUMNS]
  );

  const fetchData = useCallback(
    async (currentPage: number) => {
      if (loading || !hasMore || loadedPagesRef.current.has(currentPage)) return;
      try {
        setLoading(true);
        const response = await onFetch(currentPage);
        if (!isMountedRef.current) return;
        if (!response || response.length === 0) {
          setHasMore(false);
          return;
        }
        setData(prev => {
          const existingIds = new Set(prev.map(item => item.source));
          const filtered = response.filter(item => !existingIds.has(item.source));
          return [...prev, ...filtered];
        });
        loadedPagesRef.current.add(currentPage);
        setPage(prev => prev + 1);
      } catch (error) {
        if (isMountedRef.current) setHasMore(false);
        console.error('Fetch error:', error);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [onFetch, loading, hasMore]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleEndReached = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handlePressSelectItem = useCallback((source: string) => {
    router.push({ pathname: '/details', params: { source } });
  }, []);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <NotFoundView
        icon="folder-open"
        text="Не вдалося знайти відео"
        size={64}
        style={{ height: scaledPixels(259) }}
      />
    );
  }, [loading]);

  const keyExtractor = useCallback(
    (item: MovieProps, index: number) => String(item.source || index),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MovieProps; index: number }) => (
      <MovieCard
        {...item}
        style={itemStyles[index % NUM_COLUMNS]}
        onPress={handlePressSelectItem}
      />
    ),
    [itemStyles, NUM_COLUMNS, handlePressSelectItem]
  );

  const renderSkeleton = useCallback(
    ({ index }: { index: number }) => <SkeletonView style={itemStyles[index % NUM_COLUMNS]} />,
    [itemStyles, NUM_COLUMNS]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<MovieProps> | null | undefined, index: number) => {
      const rowIndex = Math.floor(index / NUM_COLUMNS);
      return {
        length: ITEM_HEIGHT + ITEM_SPACING,
        offset: (ITEM_HEIGHT + ITEM_SPACING) * rowIndex,
        index
      };
    },
    [ITEM_HEIGHT, NUM_COLUMNS]
  );

  const isInitialLoading = loading && data.length === 0;

  return (
    <View style={{ flex: 1 }} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <FlatList
          key={NUM_COLUMNS}
          data={isInitialLoading ? skeletonData : data}
          keyExtractor={keyExtractor}
          renderItem={isInitialLoading ? renderSkeleton : renderItem}
          numColumns={NUM_COLUMNS}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.8}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          getItemLayout={isInitialLoading ? undefined : getItemLayout}
          contentContainerStyle={[
            { flexGrow: 1 },
            !isInitialLoading && data.length === 0 && { height: '100%' }
          ]}
          initialNumToRender={NUM_COLUMNS * 2}
          maxToRenderPerBatch={NUM_COLUMNS * 2}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
});

MoviesFlatList.displayName = 'MoviesFlatList';
