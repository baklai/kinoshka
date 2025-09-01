import { NotFoundView } from '@/components/NotFoundView';
import { MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<MovieProps[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('history');
        if (data) {
          setHistory([...JSON.parse(data)]);
        }
      } catch (error) {
        console.error('History error:', error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={{ flex: 1 }} hasTVPreferredFocus>
      <View style={styles.container}>
        {history?.length > 0 ? (
          <NotFoundView icon="folder-open" text="Історія перегляду порожня" />
        ) : (
          <NotFoundView icon="folder-open" text="Історія перегляду порожня" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
