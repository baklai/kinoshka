import MoviesFlatList from '@/components/MoviesFlatList';
import { StyledIcon } from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

export default function IndexScreen() {
  return (
    <TVFocusGuideView style={{ flex: 1 }} trapFocusUp trapFocusDown trapFocusRight trapFocusLeft>
      <Drawer.Screen
        options={{
          headerTitle: () => (
            <View style={styles.header}>
              <StyledIcon name="card-multiple" />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                Поточна категорія
              </Text>
            </View>
          )
        }}
      />

      <MoviesFlatList filters={{ categories: ['filmy'] }} />
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
