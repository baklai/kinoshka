import AnimatedLoader from '@/components/AnimatedLoader';
import HeaderContent from '@/components/HeaderContent';
import NotFoundView from '@/components/NotFoundView';
import { AppTheme } from '@/constants/theme.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

export default function RootLayoutProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
      <SafeAreaProvider>
        <ThemeProvider value={AppTheme}>
          <RootLayout />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  const { loading, error, fetch } = useAsyncFetch();
  const { width, height } = useWindowDimensions();

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiInfo = await fetch();
        console.info('API Info:', apiInfo);
      } catch (err) {
        console.error('API connection error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        orientation === 'landscape' && { paddingHorizontal: scaledPixels(40) }
      ]}
      edges={orientation === 'portrait' ? ['top', 'bottom'] : []}
    >
      <HeaderContent style={styles.header} />

      {loading ? (
        <AnimatedLoader />
      ) : error ? (
        <NotFoundView icon="web-off" text="Не вдалося підключитися" />
      ) : (
        <>
          <Stack
            initialRouteName="home"
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              headerBackVisible: false,
              animation: 'fade_from_bottom',
              contentStyle: {
                backgroundColor: AppTheme.colors.background
              }
            }}
          >
            <Stack.Screen name="home" />
            <Stack.Screen name="about" />
            <Stack.Screen name="search" />
            <Stack.Screen name="details" />
            <Stack.Screen name="bookmarks" />
            <Stack.Screen name="history" />
            <Stack.Screen name="options" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </>
      )}
      <StatusBar hidden />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaledPixels(20),
    backgroundColor: AppTheme.colors.background
  },
  header: {
    marginVertical: scaledPixels(20)
  }
});
