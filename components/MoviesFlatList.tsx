import MovieCard from '@/components/MovieCard';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  StyleSheet,
  useAnimatedValue,
  View
} from 'react-native';
import MovieDetails from './MovieDetails';
import MoviesNotFound from './MoviesNotFound';

const LIMIT = 20;
const CARD_SIZE = 196;
const CARD_MARGIN = 3;

const MoviesFlatList = ({
  api,
  category,
  filters
}: {
  api?: string;
  category: string;
  filters: Record<string, any>;
}) => {
  const [data, setData] = useState<MovieProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [focusedItem, setFocusedItem] = useState<MovieProps | null>(null);
  const fadeAnimated = useAnimatedValue(0);

  const screenWidth = Dimensions.get('window').width;

  const numColumns = Math.floor(
    screenWidth / (scaledPixels(CARD_SIZE) + scaledPixels(CARD_MARGIN * 2))
  );

  const fetchData = useCallback(async () => {
    if (loading || !hasNextPage) return;

    console.log(filters);

    setLoading(true);
    try {
      const response = await fetch(
        `${api}/movies?limit=${LIMIT}&page=${page}&filters={"categories": { "$in": "${filters.categories}" }}`
      );

      const result = await response.json();

      const newItems = result.docs || [];

      setData((prev: MovieProps[]) => {
        const existingIds = new Set(prev.map((item: MovieProps) => item.id));
        const filteredNewItems = newItems.filter((item: MovieProps) => !existingIds.has(item.id));
        return [...prev, ...filteredNewItems];
      });

      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, page, hasNextPage]);

  const handleSelectItem = async (value: MovieProps) => {
    const response = await fetch(`${api}/movies/${value.id}`);

    const result = await response.json();

    setFocusedItem(result);
    Animated.timing(fadeAnimated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    const onBackPress = () => {
      if (focusedItem) {
        Animated.timing(fadeAnimated, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }).start(() => setFocusedItem(null));
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [focusedItem]);

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard
        {...item}
        handlePress={item => {
          handleSelectItem(item);
        }}
      />
    ),
    []
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  if (!data.length) {
    return null;
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={item => item?.id}
        numColumns={numColumns}
        renderItem={renderItem}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
        columnWrapperStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
        scrollEnabled={!focusedItem}
        ListEmptyComponent={<MoviesNotFound text="Не вдалось знайти відео" />}
      />

      {focusedItem && (
        <View style={styles.overlay}>
          <MovieDetails {...focusedItem} animated={1} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)', // затемнение подложки
    zIndex: 999
  }
});

export default MoviesFlatList;
