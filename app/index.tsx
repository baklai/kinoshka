import MoviesFlatList from '@/components/MoviesFlatList';
import { AppTheme } from '@/constants/theme.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { createMovieFilters, createMovieSorts } from '@/utils';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const { loading, findAll } = useAsyncFetch('/');

  const genres = [['Фільми'], ['Серіали'], ['Мультфільми']];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await findAll();
        console.info(response);
      } catch (error) {
        console.error('Помилка під час завантаження даних:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color={AppTheme.colors.primary} style={styles.container} />
    );
  }

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {genres.map((genre, idx) => {
          return (
            <MoviesFlatList
              key={`movie-flat-list-${idx}`}
              header={genre.join(', ')}
              sort={createMovieSorts({ imdb: 'desc', year: 'desc' })}
              filters={createMovieFilters({ genres: genre })}
            />
          );
        })}
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
