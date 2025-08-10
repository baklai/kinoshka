import { ApplicationProvider } from '@/providers/ApplicationProvider';
import { DrawerProvider } from '@/providers/DrawerProvider';
import { DarkTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayoutProvider() {
  return (
    <ApplicationProvider>
      <DrawerProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#0E0E0F' }}>
            <RootLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </DrawerProvider>
    </ApplicationProvider>
  );
}

function RootLayout() {
  const DefaultTheme: Theme = {
    dark: true,
    colors: {
      primary: '#ca563f',
      background: '#0E0E0F',
      card: '#19191A',
      text: 'rgb(229, 229, 231)',
      border: 'rgb(39, 39, 41)',
      notification: 'rgb(255, 69, 58)'
    },
    fonts: DarkTheme.fonts
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    fontFamily: 'SpaceMono',
    flexDirection: 'row',
    overflow: 'hidden'
  }
});
