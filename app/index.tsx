import AnimatedLoader from '@/components/AnimatedLoader';
import MoviesFlatList from '@/components/MoviesFlatList';
import NotFoundView from '@/components/NotFoundView';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import * as Application from 'expo-application';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const [genres, setGenres] = useState<Record<string, any>[]>([]);
  const { loading, error, fetch } = useAsyncFetch('genres');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(null, {
          params: { device: `android-${Application.getAndroidId()}` }
        });

        setGenres(response);
      } catch (err) {
        console.error('API connection error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {loading ? (
          <AnimatedLoader />
        ) : error ? (
          <NotFoundView icon="web-off" text="Не вдалося підключитися" />
        ) : (
          <>
            {genres.map(item => {
              return (
                <MoviesFlatList
                  key={`movie-flat-list-${item.id}`}
                  title={item.genres.join(', ')}
                  sort={{ imdb: 'desc' }}
                  filters={{ genres: item.genres }}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
