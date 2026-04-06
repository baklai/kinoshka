import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { BackHandler, Platform, StyleSheet, TVFocusGuideView, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { useAppContext } from '@/hooks/useAppContext';
import { SERVICES } from '@/services';

const FocusContainer = Platform.isTV ? TVFocusGuideView : View;

export default function IndexScreen() {
  const { service, category } = useAppContext();
  const { source } = useLocalSearchParams<{ source: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const fetchSourceRef = useMemo(() => {
    return (
      source ||
      SERVICES[service]?.categories?.find(item => item.key === category)?.source ||
      SERVICES[service]?.categories[
        Math.floor(Math.random() * SERVICES[service]?.categories.length)
      ].source
    );
  }, [source, service, category]);

  const fetchSource = source && source !== fetchSourceRef ? source : fetchSourceRef;

  const fetchData = useCallback(
    async (page: number) => {
      if (!fetchSource) return [];
      try {
        return await SERVICES[service]?.getMovieCards(fetchSource, page);
      } catch (error) {
        console.error('Помилка завантаження фільмів:', error);
        return [];
      }
    },
    [fetchSource, service]
  );

  useEffect(() => {
    if (!Platform.isTV) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pathname === '/') {
        router.push('/menu');
      } else {
        router.back();
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
