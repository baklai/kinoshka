import AnimatedLoader from '@/components/AnimatedLoader';
import HeaderContent from '@/components/HeaderContent';
import NotFoundView from '@/components/NotFoundView';
import { database } from '@/constants/database.constant';
import { AppTheme } from '@/constants/theme.constant';
import { AppContext, AppContextType } from '@/context';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [datasource, setDatasource] = useState<AppContextType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { width, height } = useWindowDimensions();

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const source = await SecureStore.getItemAsync('source');
        const currentSource = source
          ? database.sources.find(({ name }) => name === source)
          : database.sources[database.sources.length - 1];

        if (currentSource) {
          setDatasource(currentSource);
        }
      } catch (err) {
        console.error('Context error:', err);
      } finally {
        setLoading(false);
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
      ) : !datasource ? (
        <NotFoundView icon="web-off" text="Не вдалося підключитися" />
      ) : (
        <>
          <AppContext.Provider value={datasource}>
            <Stack
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
              <Stack.Screen name="index" />
              <Stack.Screen name="about" />
              <Stack.Screen name="search" />
              <Stack.Screen name="details" />
              <Stack.Screen name="bookmarks" />
              <Stack.Screen name="history" />
              <Stack.Screen name="options" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AppContext.Provider>
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
