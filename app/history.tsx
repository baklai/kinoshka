import NotFoundView from '@/components/NotFoundView';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<MovieProps[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('history');
        if (data) {
          setHistory([...JSON.parse(data)]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <View style={styles.container}>
        {history?.length > 0 ? (
          // <MoviesFlatList title="Історія перегляду" filters={{ ids: history }} />
          <></>
        ) : (
          <NotFoundView icon="folder-open" text="Історія перегляду порожня" />
        )}
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
