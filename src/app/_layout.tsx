import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { StackHeader } from '@/components/StackHeader';
import { StackTabs } from '@/components/StackTabs';
import { AppTheme } from '@/constants/ui.constant';
import { AppProvider } from '@/context/app.context';
import { useAppContext } from '@/hooks/useAppContext';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { useDeviceSetup } from '@/hooks/useDeviceSetup';
import { useOrientation } from '@/hooks/useOrientation';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

export default function RootLayoutProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
      <SafeAreaProvider>
        <ThemeProvider value={AppTheme}>
          <AppProvider>
            <RootLayout />
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  const { release } = useAppContext();
  const orientation = useOrientation();
  const deviceKind = useDeviceSetup();
  const { checkForUpdate } = useAppUpdate(release);

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, orientation === 'landscape' && styles.containerLandscape]}
      edges={orientation === 'portrait' ? ['top', 'bottom'] : []}
    >
      <>
        <Stack
          screenOptions={{
            header: () =>
              deviceKind === 'tv' || deviceKind === 'tablet' ? (
                <StackHeader style={styles.header} />
              ) : null,
            headerStyle: { backgroundColor: AppTheme.colors.background },
            gestureEnabled: false,
            headerBackVisible: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: AppTheme.colors.background }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="menu"
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'fade',
              contentStyle: { backgroundColor: 'rgba(15, 15, 15, 0.9)' }
            }}
          />
          <Stack.Screen name="about" />
          <Stack.Screen name="search" />
          <Stack.Screen name="details" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="history" />
          <Stack.Screen name="options" />
          <Stack.Screen name="+not-found" />
        </Stack>

        {deviceKind === 'phone' && <StackTabs />}

        {(deviceKind === 'tv' || deviceKind === 'tablet') && <StatusBar style="auto" />}
      </>
    </SafeAreaView>
  );
}

const { spacing } = AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing(2.5),
    backgroundColor: AppTheme.colors.background
  },
  containerLandscape: {
    paddingHorizontal: spacing(5)
  },
  header: {
    marginVertical: spacing(2.5)
  }
});
