import HeaderContent from '@/components/HeaderContent';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ApplicationProvider, useApplication } from '@/providers/ApplicationProvider';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

export default function RootLayoutProvider() {
  return (
    <ApplicationProvider>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <ThemeProvider value={AppTheme}>
            <RootLayout />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ApplicationProvider>
  );
}

function RootLayout() {
  const { orientation } = useApplication();

  return (
    <SafeAreaView
      style={[
        styles.container,
        orientation === 'landscape' && { paddingHorizontal: scaledPixels(40) }
      ]}
      edges={orientation === 'portrait' ? ['top', 'bottom'] : []}
    >
      <HeaderContent style={styles.header} />

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
        <Stack.Screen
          name="details"
          options={{
            gestureEnabled: true
          }}
        />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="history" />
        <Stack.Screen name="options" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar hidden />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background
  },
  header: {
    marginVertical: scaledPixels(20)
  }
});
