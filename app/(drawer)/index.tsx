import MoviesFlatList from '@/components/MoviesFlatList';
import { MultimediaSvgIcon } from '@/components/StyledIcons';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

export default function IndexScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return (
    <TVFocusGuideView style={{ flex: 1 }} trapFocusRight trapFocusDown trapFocusUp trapFocusLeft>
      <Drawer.Screen
        options={{
          headerTitle: () => (
            <View style={styles.header}>
              <MultimediaSvgIcon />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                Поточна категорія
              </Text>
            </View>
          )
        }}
      />

      <MoviesFlatList api={apiUrl} category={'filmy'} filters={{ categories: ['filmy'] }} />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10)
  }
});
