import { StackHeader } from '@/components/StackHeader';
import { StyledLoader } from '@/components/StyledLoader';
import { AppTheme } from '@/constants/theme.constant';
import { AppContext, AppContextValue } from '@/context';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
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
  const { width, height } = useWindowDimensions();
  const { startUpdateCheck } = useAutoUpdate();
  const [loading, setLoading] = useState<boolean>(false);

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        startUpdateCheck();
      } catch (err) {
        console.error('Application error:', err);
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
      {loading ? (
        <StyledLoader />
      ) : (
        <>
          <AppContext.Provider value={AppContextValue}>
            <Stack
              screenOptions={{
                header: () => <StackHeader style={styles.header} />,
                headerStyle: { backgroundColor: AppTheme.colors.background },
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
      <StatusBar hidden style="dark" />
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
