import AnimatedLoader from '@/components/AnimatedLoader';
import MoviesFlatList from '@/components/MoviesFlatList';
import NotFoundView from '@/components/NotFoundView';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const [genres, setGenres] = useState<string[]>([]);
  const { loading, error, fetch } = useAsyncFetch('genres');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch();
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
            {genres.map((genre, idx) => {
              return (
                <MoviesFlatList
                  key={`movie-flat-list-${idx}`}
                  header={genre}
                  loader={false}
                  sort={{ year: 'desc' }}
                  filters={{ genres: [genre] }}
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
