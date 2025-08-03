import Sidebar from '@/components/Sidebar';
import categories from '@/constants/Categories';
import { ApplicationProvider, useApplication } from '@/providers/ApplicationProvider';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayoutProvider() {
  return (
    <ApplicationProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
          <RootLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}

function RootLayout() {
  const { selectedCategory, setSelectedCategory } = useApplication();

  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf')
  });

  if (!loaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const CustomDarkTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: 'rgb(10, 132, 255)',
      background: '#1E1E1E',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(229, 229, 231)',
      border: 'rgb(39, 39, 41)',
      notification: 'rgb(255, 69, 58)'
    }
  };

  return (
    <ThemeProvider value={CustomDarkTheme}>
      <View style={styles.container}>
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectedCategory={name => setSelectedCategory(name)}
        />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#252526'
            },
            headerTintColor: '#c5c5c5',
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            animation: 'none',
            headerBackVisible: false,
            headerShadowVisible: true,
            headerSearchBarOptions: {
              placeholder: 'Пошук за назвою...',
              headerIconColor: '#c5c5c5',
              barTintColor: '#333333',
              tintColor: '#ffffff',
              textColor: '#ffffff',
              autoFocus: true,
              hideWhenScrolling: false,
              autoCapitalize: 'none',
              inputType: 'text'
            }
          }}
        >
          <Stack.Screen name="index" />

          <Stack.Screen name="about" />

          <Stack.Screen name="movie" />

          <Stack.Screen name="history" />

          <Stack.Screen name="options" />

          <Stack.Screen name="bookmarks" />

          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar hidden={true} />
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
