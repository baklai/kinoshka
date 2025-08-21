import HeaderContent from '@/components/HeaderContent';
import { AppTheme } from '@/constants/ui.constant';
import { ApplicationProvider } from '@/providers/ApplicationProvider';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

export default function RootLayoutProvider() {
  return (
    <ApplicationProvider>
      <ThemeProvider value={AppTheme}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
              <RootLayout />
            </SafeAreaView>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </ApplicationProvider>
  );
}

function RootLayout() {
  return (
    <>
      <HeaderContent />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
        <Stack.Screen name="search" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="history" />
        <Stack.Screen name="options" />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar hidden />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
