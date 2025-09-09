import { StackHeader } from '@/components/StackHeader';
import { StyledIcon } from '@/components/StyledIcon';
import { StyledLoader } from '@/components/StyledLoader';
import { AppTheme } from '@/constants/theme.constant';
import { AppContext, AppContextValue } from '@/context';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import { useDeviceSetup } from '@/hooks/useDeviceSetup';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ThemeProvider } from '@react-navigation/native';
import { Stack, Tabs } from 'expo-router';
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

function MobileTabs() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppTheme.colors.text,
        tabBarStyle: { backgroundColor: AppTheme.colors.background }
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Пошук',
          tabBarIcon: ({ color }) => <StyledIcon size="large" color={color} icon="magnify" />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Історія',
          tabBarIcon: ({ color }) => <StyledIcon size="large" color={color} icon="history" />
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Меню',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color }) => <StyledIcon size="xlarge" color={color} icon="menu" />
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Закладки',
          tabBarIcon: ({ color }) => <StyledIcon size="large" color={color} icon="bookmark" />
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: 'Налаштування',
          tabBarIcon: ({ color }) => <StyledIcon size="large" color={color} icon="cog-outline" />
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="details" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
    </Tabs>
  );
}

function TvStack() {
  return (
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
  );
}

function RootLayout() {
  const { width, height } = useWindowDimensions();
  const { startUpdateCheck } = useAutoUpdate();
  const deviceKind = useDeviceSetup();
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
            {deviceKind === 'phone' && <MobileTabs />}
            {(deviceKind === 'tv' || deviceKind === 'tablet') && <TvStack />}

            <StatusBar hidden={deviceKind === 'tv' || deviceKind === 'tablet'} style="auto" />
          </AppContext.Provider>
        </>
      )}
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
