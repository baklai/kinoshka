import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform, StyleSheet, TVFocusGuideView, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useAppContext } from '@/hooks/useAppContext';

const FocusContainer = Platform.isTV ? TVFocusGuideView : View;

export default function IndexScreen() {
  const { source } = useLocalSearchParams<{ source: string }>();
  const { baseUrl, categories, getMovieCards } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const fetchSourceRef = useRef<string>(
    source || categories[Math.floor(Math.random() * categories.length)].source
  );

  if (source && source !== fetchSourceRef.current) {
    fetchSourceRef.current = source;
  }

  const fetchSource = fetchSourceRef.current;

  const fetchData = useCallback(
    async (page: number) => {
      if (!fetchSource) return [];
      try {
        return await getMovieCards(baseUrl, fetchSource, page);
      } catch (error) {
        console.error('Помилка завантаження фільмів:', error);
        return [];
      }
    },
    [fetchSource, baseUrl, getMovieCards]
  );

  useEffect(() => {
    if (!Platform.isTV) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pathname === '/menu') {
        router.back();
      } else {
        router.push('/menu');
      }
      return true;
    });

    return () => subscription.remove();
  }, [router, pathname]);

  const focusProps = Platform.isTV
    ? { trapFocusLeft: true, trapFocusRight: true, trapFocusDown: true }
    : {};

  return (
    <FocusContainer style={styles.container} {...focusProps}>
      <MoviesFlatList onFetch={fetchData} key={fetchSource} />
    </FocusContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
