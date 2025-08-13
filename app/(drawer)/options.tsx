import { OptionsSvgIcon } from '@/components/StyledIcons';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OptionsScreen() {
  return (
    <>
      <Drawer.Screen
        options={{
          headerRight: () => null,
          headerTitle: () => (
            <View style={styles.header}>
              <OptionsSvgIcon />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Налаштування</Text>
            </View>
          )
        }}
      />

      <View style={styles.container}></View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(6)
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    overflowX: 'auto',
    padding: 6,
    gap: 6
  }
});
