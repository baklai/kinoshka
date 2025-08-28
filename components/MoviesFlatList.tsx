import MovieCard from '@/components/MovieCard';
import NotFoundView from '@/components/NotFoundView';
import SkeletonView from '@/components/SkeletonView';
import { AppTheme } from '@/constants/theme.constant';
import { PAGE_LIMIT } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieFilterProps } from '@/types/filters.type';
import { MovieProps } from '@/types/movie.type';
import { MovieSortProps } from '@/types/sorts.type';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

interface MoviesFlatListProps {
  title?: string;
  limit?: number;
  sort?: MovieSortProps;
  filters?: MovieFilterProps;
}

const ITEM_WIDTH = scaledPixels(181);
const ITEM_SPACING = scaledPixels(24);

const MoviesFlatList = ({ title, limit = PAGE_LIMIT, sort, filters }: MoviesFlatListProps) => {
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadedPages, setLoadedPages] = useState(new Set<number>());
  const { loading, error, fetch } = useAsyncFetch('movies');

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || loadedPages.has(page) || error) return;

    try {
      const response = await fetch('', {
        params: { page, limit, sort, filters }
      });

      const newData: MovieProps[] = response.docs;

      setData((prev: MovieProps[]) => {
        const existingIds = new Set(prev.map(item => item.id));
        const filtered = newData.filter(item => !existingIds.has(item.id));
        return [...prev, ...filtered];
      });

      setHasMore(response.hasNextPage);

      if (response.nextPage) {
        setPage(response.nextPage);
      }

      setLoadedPages(prev => new Set(prev).add(response.page));
    } catch (error) {
      console.error(error);
    }
  }, [page, loading, hasMore, loadedPages, limit, sort, filters]);

  useEffect(() => {
    fetchData();
  }, [sort, filters, limit]);

  const handlePressSelectItem = useCallback((item: MovieProps) => {
    router.push({
      pathname: '/details',
      params: { id: item.id }
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
    (item: MovieProps, index: number) => String(item.id || index),
    []
  );

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{title}</Text>
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
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
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
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    letterSpacing: scaledPixels(1),
    fontSize: scaledPixels(22)
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: ITEM_SPACING,
    paddingHorizontal: ITEM_SPACING
  }
});

export default MoviesFlatList;

// import MovieCard from '@/components/MovieCard';
// import NotFoundView from '@/components/NotFoundView';
// import SkeletonView from '@/components/SkeletonView';
// import { AppTheme } from '@/constants/theme.constant';
// import { PAGE_LIMIT } from '@/constants/ui.constant';
// import { useAsyncFetch } from '@/hooks/useAsyncFetch';
// import { scaledPixels } from '@/hooks/useScaledPixels';
// import { MovieFilterProps } from '@/types/filters.type';
// import { MovieProps } from '@/types/movie.type';
// import { MovieSortProps } from '@/types/sorts.type';
// import { router } from 'expo-router';
// import React, { useCallback, useEffect, useState } from 'react';
// import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

// interface MoviesFlatListProps {
//   title?: string;
//   limit?: number;
//   sort?: MovieSortProps;
//   filters?: MovieFilterProps;
// }

// const ITEM_WIDTH = scaledPixels(181);
// const ITEM_SPACING = scaledPixels(24);

// const MoviesFlatList = ({ title, limit = PAGE_LIMIT, sort, filters }: MoviesFlatListProps) => {
//   const [data, setData] = useState<MovieProps[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loadedPages, setLoadedPages] = useState(new Set());
//   const { loading, error, fetch } = useAsyncFetch('movies');

//   const fetchData = useCallback(async () => {
//     if (loading || !hasMore || loadedPages.has(page)) return;

//     try {
//       const response = await fetch('', { params: { page, limit, sort, filters } });

//       const newData = response.docs;

//       if (newData.length < limit) {
//         setHasMore(false);
//       }

//       setData((prev: MovieProps[]) => {
//         const existingIds = new Set(prev.map((item: MovieProps) => item.id));
//         const filtered = newData.filter((item: MovieProps) => !existingIds.has(item.id));
//         return [...prev, ...filtered];
//       });

//       setLoadedPages(prev => new Set(prev).add(page));
//       setPage(prev => prev + 1);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [page, loading, hasMore, loadedPages]);

//   const handlePressSelectItem = useCallback((item: MovieProps) => {
//     router.push({
//       pathname: '/details',
//       params: { id: item.id }
//     });
//   }, []);

//   const renderItem = useCallback(
//     ({ item }: { item: MovieProps }) => (
//       <MovieCard {...item} handlePress={() => handlePressSelectItem(item)} />
//     ),
//     []
//   );

//   const getItemLayout = useCallback(
//     (_: any, index: number) => ({
//       length: ITEM_WIDTH + ITEM_SPACING,
//       offset: (ITEM_WIDTH + ITEM_SPACING) * index,
//       index
//     }),
//     []
//   );

//   const renderSkeletonItem = useCallback(() => <SkeletonView />, []);

//   const renderEmpty = useCallback(
//     () => (
//       <NotFoundView
//         icon="folder-open"
//         text="Не вдалося знайти відео"
//         size={64}
//         style={{ height: scaledPixels(259) }}
//       />
//     ),
//     []
//   );

//   const Separator = useCallback(() => <View style={{ width: ITEM_SPACING }} />, []);

//   const keyExtractor = useCallback((item: MovieProps) => item.id.toString(), []);

//   useEffect(() => {
//     setData([]);
//     setPage(1);
//     setHasMore(true);
//     setLoadedPages(new Set());
//     fetchData();
//   }, [sort, filters, limit]);

//   return (
//     <View style={styles.container}>
//       {title && (
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerText}>{title}</Text>
//         </View>
//       )}

//       <FlatList
//         horizontal
//         data={data}
//         keyExtractor={keyExtractor}
//         renderItem={renderItem}
//         getItemLayout={getItemLayout}
//         onEndReached={fetchData}
//         onEndReachedThreshold={0.8}
//         showsHorizontalScrollIndicator={Platform.OS === 'web'}
//         showsVerticalScrollIndicator={Platform.OS === 'web'}
//         ItemSeparatorComponent={Separator}
//         ListEmptyComponent={renderEmpty}
//         contentContainerStyle={{ flexGrow: 1 }}
//         initialNumToRender={5}
//         maxToRenderPerBatch={5}
//         windowSize={5}
//         removeClippedSubviews
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   headerContainer: {
//     paddingVertical: scaledPixels(8)
//   },
//   headerText: {
//     color: AppTheme.colors.text,
//     fontWeight: 'bold',
//     letterSpacing: scaledPixels(1),
//     fontSize: scaledPixels(22)
//   },
//   skeletonCard: {
//     height: 100,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 12
//   }
// });

// export default MoviesFlatList;
