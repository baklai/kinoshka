import MoviesFlatList from '@/components/MoviesFlatList';
import { AppTheme } from '@/constants/theme.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const { loading, findAll } = useAsyncFetch('');

  const genres = [['Фільми'], ['Серіали'], ['Мультфільми']];

  useEffect(() => {
    findAll();
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
          return <MoviesFlatList key={idx} genres={item} />;
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
