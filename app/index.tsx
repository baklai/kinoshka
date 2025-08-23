import MoviesFlatList from '@/components/MoviesFlatList';
import { AppTheme } from '@/constants/theme.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
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
        {genres.map((item, idx) => {
          return (
            <MoviesFlatList key={`movie-flat-list-${idx}`} header={item.join(', ')} genres={item} />
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
