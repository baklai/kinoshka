import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { StackHeader } from '@/components/StackHeader';
import { StackTabs } from '@/components/StackTabs';
import { StyledLoader } from '@/components/StyledLoader';
import { AppTheme } from '@/constants/theme.constant';
import { AppContext, AppContextType, DEFAULT_SERVICE_ID, SERVICES } from '@/context';
import { StorageProvider } from '@/context/storage';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import { useDeviceSetup } from '@/hooks/useDeviceSetup';
import { useOrientation } from '@/hooks/useOrientation';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

const SERVICE_STORAGE_KEY = 'selected_service_id';

export default function RootLayoutProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: AppTheme.colors.background }}>
      <SafeAreaProvider>
        <ThemeProvider value={AppTheme}>
          <StorageProvider>
            <RootLayout />
          </StorageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  const orientation = useOrientation();
  const { startUpdateCheck } = useAutoUpdate();
  const deviceKind = useDeviceSetup();
  const [loading, setLoading] = useState<boolean>(false);

  const [activeServiceId, setActiveServiceId] = useState<string>(DEFAULT_SERVICE_ID);

  const handleSetService = useCallback(async (id: string) => {
    if (SERVICES[id]) {
      setActiveServiceId(id);
      await AsyncStorage.setItem(SERVICE_STORAGE_KEY, id);
    }
  }, []);

  const contextValue = useMemo<AppContextType>(
    () => ({ ...SERVICES[activeServiceId], setService: handleSetService }),
    [activeServiceId, handleSetService]
  );

  const startUpdateCheckRef = useRef(startUpdateCheck);
  useEffect(() => {
    startUpdateCheckRef.current = startUpdateCheck;
  }, [startUpdateCheck]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
        startUpdateCheckRef.current();

        const savedId = await AsyncStorage.getItem(SERVICE_STORAGE_KEY);
        if (!cancelled && savedId && SERVICES[savedId]) {
          setActiveServiceId(savedId);
        }
      } catch (err) {
        console.error('Application error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, orientation === 'landscape' && styles.containerLandscape]}
      edges={orientation === 'portrait' ? ['top', 'bottom'] : []}
    >
      {loading ? (
        <StyledLoader />
      ) : (
        <AppContext.Provider value={contextValue}>
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

          <StatusBar hidden={deviceKind === 'tv' || deviceKind === 'tablet'} style="auto" />
        </AppContext.Provider>
      )}
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
